const express = require('express');
const User = require('../models/User');
const Card = require('../models/Card');
const lookup = require('binlookup')();
const balanceFuncAdd = require('../utils/balanceFuncAdd');

const router = express.Router();

const availableCurrency = ['UAH', 'USD', 'EUR'];

router.get('/data', async (req, res) => {
  try {
    const userId = req.decodedId;
    const user = await User.findById(userId, '-passwordHash -updatedAt -__v -_id').populate('cards', '-__v');
    if (!user) return res.status(404).json({message: 'Користувач не знайден!'});
    res.json({user, availableCurrency});
  } catch (error) {
    res.status(500).json({message: 'Не вдалося отримати дані!', error});
  }
});

router.post('/card', async (req, res) => {
  try {
    const userId = req.decodedId;
    const {number, expDate, cvv, holder, amount, currency} = req.body;
    const formattedNumber = number.replace(/ /g, '');
    if (amount < 0) return res.status(400).json({message: 'Значення суми не може бути меньше 0!'});
    const formatDate = date => {
      const formattedDate = date.slice(2, 7).replace('-', '/');
      return formattedDate[3] + formattedDate[4] + formattedDate[2] + formattedDate[0] + formattedDate[1];
    }
    const cardData = await lookup(formattedNumber.slice(0, 8)).then(data => data).catch(() => false);
    if (!cardData) return res.status(400).json({message: 'Картка не пройшла валідацію!'});
    const isExist = await Card.findOne({number: formattedNumber});
    if (isExist) return res.status(400).json({message: 'Така картка вже додана!'});
    const card = new Card({
      owner: userId,
      amount,
      currency,
      number: formattedNumber,
      expDate: formatDate(expDate),
      cvv,
      holder: holder.trim(),
      scheme: cardData.scheme,
      type: cardData.type
    });
    await card.save();
    const user = await User.findById(userId);
    user.cards.push(card);
    balanceFuncAdd(user, 'balance', currency, amount);
    await user.save();
    res.json(card);
  } catch (error) {
    res.status(500).json({message: 'Не вдалося додати карту!', error});
  }
});

router.patch('/user', async (req, res) => {
  try {
    const {isSkin} = req.body;
    const userId = req.decodedId;
    await User.findByIdAndUpdate(userId, {isSkin}, {new: true});
    res.json({message: 'Дані успішно оновлені'});
  } catch (error) {
    res.status(500).json({message: 'Не вдалося оновити дані!', error});
  }
});

router.post('/cash', async (req, res) => {
  try {
    const {amount, currency} = req.body;
    if (amount < 1) return res.status(400).json({message: 'Значення суми не може бути меньше 1!'});
    const userId = req.decodedId;
    const user = await User.findById(userId);
    balanceFuncAdd(user, 'cash', currency, amount);
    balanceFuncAdd(user, 'balance', currency, amount);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({message: 'Не вдалося додати готівку!', error});
  }
});

router.delete('/card/:id', async (req, res) => {
  try {
    const cardId = req.params.id;
    const card = await Card.findById(cardId);
    const user = await User.findById(card.owner);
    const newBalance = user.balance.map(elem => {
      if (elem.currency === card.currency) elem.amount = +elem.amount - +card.amount;
      return elem;
    })
    await User.updateOne({_id: card.owner}, {
      $pullAll: {
        cards: [{_id: cardId}]
      }, balance: newBalance
    })
    await card.remove();
    res.json({message: 'Картка успішно видалена'});
  } catch (error) {
    res.status(500).json({message: 'Не вдалося выдалити картку!', error});
  }
});

router.patch('/card/:id', async (req, res) => {
  try {
    const {newAmount, name} = req.body;
    if (newAmount < 0) return res.status(400).json({message: 'Значення суми не може бути меньше 0!'});
    let newName = name.trim();
    if (newName === '') return res.status(400).json({message: 'Назва не може буты пустою'});
    const cardId = req.params.id;
    const card = await Card.findById(cardId);
    const difference = +newAmount - +card.amount;
    card.amount = newAmount;
    card.name = newName;
    await card.save();
    const user = await User.findById(card.owner);
    const newBalance = user.balance.map(elem => {
      if (elem.currency === card.currency) elem.amount = +elem.amount + difference;
      return elem;
    });
    user.balance = [];
    user.balance = newBalance;
    await user.save();
    res.json({message: 'Картка успішно оновлена'});
  } catch (error) {
    res.status(500).json({message: 'Не вдалося оновити картку!', error});
  }
});


router.patch('/cash', async (req, res) => {
  try {
    const {newAmount, currency} = req.body;
    if (newAmount < 0) return res.status(400).json({message: 'Значення суми не може бути меньше 0!'});
    const userId = req.decodedId;
    const user = await User.findById(userId);
    let prevCash = 0;
    const newCash = user.cash.map(elem => {
      if (elem.currency === currency) {
        prevCash = elem.amount;
        elem.amount = +newAmount;
      }
      return elem;
    });
    user.cash = [];
    user.cash = newCash;
    const newBalance = user.balance.map(elem => {
      if (elem.currency === currency) elem.amount = +elem.amount - +prevCash + +newAmount;
      return elem;
    });
    user.balance = [];
    user.balance = newBalance;
    await user.save();
    res.json({message: 'Готівка успішно оновлена'});
  } catch (error) {
    res.status(500).json({message: 'Не вдалося оновити готівку!', error});
  }
})

module.exports = router;