const User = require("../models/User");
const {availableCurrency, balanceFunc} = require("../utils/helpers");

const getUserData = async (req, res) => {
  try {
    const userId = req.decodedId;
    const user = await User.findById(userId, '-passwordHash -updatedAt -__v -_id').populate('cards', '-__v');
    if (!user) return res.status(404).json({message: 'Користувач не знайден!'});
    res.json({user, availableCurrency});
  } catch (error) {
    res.status(500).json({message: 'Не вдалося отримати дані!'});
  }
};

const setCardSkin = async (req, res) => {
  try {
    const {isSkin} = req.body;
    const userId = req.decodedId;
    await User.findByIdAndUpdate(userId, {isSkin: !!isSkin});
    res.json({message: 'Дані успішно оновлені!'});
  } catch (error) {
    res.status(500).json({message: 'Не вдалося оновити дані!'});
  }
};

const addCash = async (req, res) => {
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
};

const updateCash = async (req, res) => {
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
};

module.exports = {
  getUserData,
  setCardSkin,
  addCash,
  updateCash
}