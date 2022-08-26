const express = require('express');
const User = require('../models/User');
const Card = require('../models/Card');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth.middleware')
const lookup = require('binlookup')()
const balanceFuncAdd = require('../utils/balanceFuncAdd');

const router = express.Router();

const availableCurrency = ['UAH', 'USD', 'EUR'];

router.post('/register', async (req, res) => {
  try {
    const {name, password} = req.body;
    const candidate = await User.findOne({name});
    if (candidate) {
      return res.status(400).json({message: 'Такий користувач вже є!'});
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = new User({name, passwordHash: hash});
    await user.save();
    const token = jwt.sign({
      _id: user._id,
    }, 'secretWord', {
      expiresIn: '24h'
    })
    res.json(token);
  } catch (error) {
    res.status(500).json({message: 'Не вдалося зареєструватися!'})
  }
});

router.post('/login', async (req, res) => {
  try {
    const {name, password} = req.body;
    const user = await User.findOne({name})
    if (!user) {
      return res.status(404).json({message: 'Такого користувача не існує!'});
    }
    const isValidPass = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPass) {
      return res.status(400).json({message: 'Им\'я та пароль не співпадають!'})
    }
    const token = jwt.sign({
      _id: user._id,
    }, 'secretWord', {
      expiresIn: '24h'
    })
    res.json(token)
  } catch (error) {
    res.status(500).json({message: 'Не вдалося увійти в аккаунт!', error})
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const userId = req.decodedId;
    const user = await User.findById(userId).populate('cards');
    if (!user) {
      return res.status(404).json({message: 'Користувач не знайден!'})
    }
    res.json({user, availableCurrency});
  } catch (error) {
    res.status(500).json({message: 'Не вдалося отримати данні користувача!', error})
  }
});

router.post('/card', auth, async (req, res) => {
  try {
    const {number, expDate, cvv, holder, amount, currency} = req.body;

    if (amount < 0) {
      return res.status(400).json({message: 'Значення суми не може бути меньше 0!'});
    }
    const userId = req.decodedId;
    const cardData = await lookup(number.slice(0, 8), function (err, data) {
      if (!err) {
        return data
      }
    });
    if (!cardData) {
      return res.status(404).json({message: 'Номер картки не пройшов перевірку!'});
    }
    const candidate = await Card.findOne({number});
    if (candidate) {
      return res.status(400).json({message: 'Така картка вже додана!'})
    }
    const card = new Card({
      owner: userId, amount, currency, number, expDate, cvv, holder, scheme: cardData.scheme, type: cardData.type
    });
    await card.save();
    const user = await User.findById(userId);
    user.cards.push(card);
    balanceFuncAdd(user, 'balance', currency, amount);
    await user.save();
    res.json(card)
  } catch (error) {
    res.status(500).json({message: 'Не вдалося додати карту!', error})
  }
});

router.post('/cash', auth, async (req, res) => {
  try {
    const {amount, currency} = req.body;
    if (amount < 1) {
      return res.status(400).json({message: 'Значення суми не може бути меньше 1!'});
    }
    const userId = req.decodedId;
    const user = await User.findById(userId);
    balanceFuncAdd(user, 'cash', currency, amount);
    balanceFuncAdd(user, 'balance', currency, amount);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({message: 'Не вдалося додати готівку!', error})
  }
});

router.delete('/card/:id', auth, async (req, res) => {
  try {
    const cardId = req.params.id;
    const card = await Card.findById(cardId);
    const user = await User.findById(card.owner);
    const newBalance = user.balance.map(elem => {
      if (elem.currency === card.currency) {
        elem.amount = parseInt(elem.amount) - parseInt(card.amount);
      }
      return elem;
    })
    await User.updateOne({_id: card.owner}, {
      $pullAll: {
        cards: [{_id: cardId}]
      }, balance: newBalance
    })
    await card.remove();
    res.json({message: 'ok'});
  } catch (error) {
    res.status(500).json({message: 'Не вдалося выдалити картку!', error})
  }
});

router.patch('/card/:id', auth, async (req, res) => {
  try {
    const {newAmount, name} = req.body;
    if (newAmount < 0) {
      return res.status(400).json({message: 'Значення суми не може бути меньше 0!'});
    }
    let newName = name.trim();
    if (newName === '') {
      return res.status(400).json({message: 'Назва не може буты пустою'});
    }
    const cardId = req.params.id;
    const card = await Card.findById(cardId);
    const difference = parseInt(newAmount) - parseInt(card.amount);
    card.amount = newAmount;
    card.name = newName;
    await card.save();
    const user = await User.findById(card.owner);
    const newBalance = user.balance.map(elem => {
      if (elem.currency === card.currency) {
        elem.amount = parseInt(elem.amount) + difference;
      }
      return elem;
    });
    user.balance = [];
    user.balance = newBalance;
    await user.save();
    res.json({message: 'ok'});
  } catch (error) {
    res.status(500).json({message: 'Не вдалося оновити картку!', error})
  }
});


router.patch('/cash', auth, async (req, res) => {
  try {
    const {newAmount, currency} = req.body;
    if (newAmount < 0) {
      return res.status(400).json({message: 'Значення суми не може бути меньше 0!'});
    }
    const userId = req.decodedId;
    const user = await User.findById(userId);
    let prevCash = 0;
    const newCash = user.cash.map(elem => {
      if (elem.currency === currency) {
        prevCash = elem.amount;
        elem.amount = parseInt(newAmount);
      }
      return elem;
    });
    user.cash = [];
    user.cash = newCash;
    const newBalance = user.balance.map(elem => {
      if (elem.currency === currency) {
        elem.amount = parseInt(elem.amount) - parseInt(prevCash) + parseInt(newAmount);
      }
      return elem;
    });
    user.balance = [];
    user.balance = newBalance;
    await user.save();
    res.json({message: 'ok'})
  } catch (error) {
    res.status(500).json({message: 'Не вдалося оновити готівку!', error})
  }
})

module.exports = router;