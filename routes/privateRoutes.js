const {Router} = require('express');
const User = require('../models/User');
const Card = require('../models/Card');
const lookup = require('binlookup')();
const {balanceFunc, availableCurrency} = require('../utils/helpers');
const {cardValidator, updateCardValidator, cashValidator, updateCashValidator} = require("../middleware/validations");
const handleValidationErrors = require('../middleware/handleValidationErrors');

const router = Router();

router.get('/data', async (req, res) => {
  try {
    const userId = req.decodedId;
    const user = await User.findById(userId, '-passwordHash -updatedAt -__v -_id').populate('cards', '-__v');
    if (!user) return res.status(404).json({message: 'Користувач не знайден!'});
    res.json({user, availableCurrency});
  } catch (error) {
    res.status(500).json({message: 'Не вдалося отримати дані!'});
  }
});

router.post('/card', cardValidator, handleValidationErrors, async (req, res) => {
  try {
    const userId = req.decodedId;
    const {number, expDate, cvv, holder, amount, currency} = req.body;
    const formattedNumber = number.replace(/ /g, '');
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
      name: cardData.bank?.name.slice(0, 16) || 'Картка',
      holder: holder.trim().slice(0, 16),
      scheme: cardData.scheme,
      type: cardData.type
    });
    await card.save();
    const user = await User.findById(userId);
    user.cards.push(card);
    balanceFunc(user, 'balance', currency, amount);
    await user.save();
    res.json(card);
  } catch (error) {
    res.status(500).json({message: 'Не вдалося додати карту!'});
  }
});

router.patch('/user', async (req, res) => {
  try {
    const {isSkin} = req.body;
    const userId = req.decodedId;
    await User.findByIdAndUpdate(userId, {isSkin});
    res.json({message: 'Дані успішно оновлені!'});
  } catch (error) {
    res.status(500).json({message: 'Не вдалося оновити дані!'});
  }
});

router.post('/cash', cashValidator, handleValidationErrors, async (req, res) => {
  try {
    const {amount, currency} = req.body;
    const userId = req.decodedId;
    const user = await User.findById(userId);
    balanceFunc(user, 'cash', currency, amount);
    balanceFunc(user, 'balance', currency, amount);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({message: 'Не вдалося додати готівку!'});
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
    res.status(500).json({message: 'Не вдалося видалити картку!'});
  }
});

router.patch('/card/:id', updateCardValidator, handleValidationErrors, async (req, res) => {
  try {
    const {newAmount, name} = req.body;
    const card = await Card.findById(req.params.id);
    const difference = +newAmount - +card.amount;
    card.amount = newAmount;
    card.name = name.trim();
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
    res.status(500).json({message: 'Не вдалося оновити картку!'});
  }
});


router.patch('/cash', updateCashValidator, handleValidationErrors, async (req, res) => {
  try {
    const {newAmount, currency} = req.body;
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
    res.json({message: 'Готівка успішно оновлена!'});
  } catch (error) {
    res.status(500).json({message: 'Не вдалося оновити готівку!'});
  }
})

module.exports = router;