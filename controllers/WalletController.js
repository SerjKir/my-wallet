const Wallet = require("../models/Wallet");
const {balanceFunc} = require("../utils/helpers");

const addCash = async (req, res) => {
  try {
    const {amount, currency} = req.body;
    const userId = req.decodedId;
    const wallet = await Wallet.findOne({owner: userId});
    balanceFunc(wallet, 'cash', currency, amount);
    balanceFunc(wallet, 'balance', currency, amount);
    await wallet.save();
    const newWallet = await Wallet.findOne({owner: userId}, '-createdAt -updatedAt -__v -_id').populate('cards', '-__v');
    res.json(newWallet);
  } catch (error) {
    res.status(500).json({message: 'Не вдалося додати готівку!'});
  }
};

const updateCash = async (req, res) => {
  try {
    const {newAmount, currency} = req.body;
    const userId = req.decodedId;
    const wallet = await Wallet.findOne({owner: userId});
    let prevCash = 0;
    const newCash = wallet.cash.map(elem => {
      if (elem.currency === currency) {
        prevCash = elem.amount;
        elem.amount = +newAmount;
      }
      return elem;
    });
    wallet.cash = [];
    wallet.cash = newCash;
    const newBalance = wallet.balance.map(elem => {
      if (elem.currency === currency) elem.amount = +elem.amount - +prevCash + +newAmount;
      return elem;
    });
    wallet.balance = [];
    wallet.balance = newBalance;
    await wallet.save();
    const newWallet = await Wallet.findOne({owner: userId}, '-createdAt -updatedAt -__v -_id').populate('cards', '-__v');
    res.json(newWallet);
  } catch (error) {
    res.status(500).json({message: 'Не вдалося оновити готівку!'});
  }
};

module.exports = {
  addCash,
  updateCash
}