const Card = require("../models/Card");
const User = require("../models/User");
const Wallet = require("../models/Wallet");
const {balanceFunc, maxLength} = require("../utils/helpers");
const lookup = require('binlookup')();

const addCard = async (req, res) => {
  try {
    const userId = req.decodedId;
    const {number, expDate, cvv, holder, amount, currency} = req.body;
    const formattedNumber = number.replace(/ /g, '');
    const formatDate = date => {
      const formattedDate = date.slice(2, 7).replace('-', '/');
      return formattedDate[3] + formattedDate[4] + '/' + formattedDate[0] + formattedDate[1];
    }
    const cardData = await lookup(formattedNumber.slice(0, 8)).then(data => data).catch(() => false);
    if (!cardData) return res.status(400).json({message: 'Картка не пройшла валідацію!'});
    const isExist = await Card.findOne({number: formattedNumber});
    if (isExist) return res.status(400).json({message: 'Така картка вже додана!'});
    const wallet = await Wallet.findOne({owner: userId});
    const card = new Card({
      wallet,
      amount,
      currency,
      number: formattedNumber,
      expDate: formatDate(expDate),
      cvv,
      name: cardData.bank?.name?.slice(0, maxLength) || 'Картка',
      holder: holder.trim().slice(0, maxLength),
      scheme: cardData.scheme,
      type: cardData.type
    });
    await card.save();
    wallet.cards.push(card);
    balanceFunc(wallet, 'balance', currency, amount);
    await wallet.save();
    const newWallet = await Wallet.findOne({owner: userId}, '-createdAt -updatedAt -__v -_id').populate('cards', '-__v');
    res.json(newWallet);
  } catch (error) {
    res.status(500).json({message: 'Не вдалося додати карту!'});
  }
};

const updateCard = async (req, res) => {
  try {
    const userId = req.decodedId;
    const {id, newAmount, name} = req.body;
    const card = await Card.findById(id);
    const difference = +newAmount - +card.amount;
    card.amount = newAmount;
    card.name = name.trim();
    await card.save();
    const wallet = await Wallet.findById(card.wallet);
    const newBalance = wallet.balance.map(elem => {
      if (elem.currency === card.currency) elem.amount = +elem.amount + difference;
      return elem;
    });
    wallet.balance = [];
    wallet.balance = newBalance;
    await wallet.save();
    const newWallet = await Wallet.findOne({owner: userId}, '-createdAt -updatedAt -__v -_id').populate('cards', '-__v');
    res.json(newWallet);
  } catch (error) {
    res.status(500).json({message: 'Не вдалося оновити картку!'});
  }
};

const removeCard = async (req, res) => {
  try {
    const userId = req.decodedId;
    const cardId = req.params.id;
    const card = await Card.findById(cardId);
    const wallet = await Wallet.findById(card.wallet);
    const newBalance = wallet.balance.map(elem => {
      if (elem.currency === card.currency) elem.amount = +elem.amount - +card.amount;
      return elem;
    })
    await Wallet.updateOne({_id: card.wallet}, {
      $pullAll: {
        cards: [{_id: cardId}]
      }, balance: newBalance
    })
    await card.remove();
    const newWallet = await Wallet.findOne({owner: userId}, '-createdAt -updatedAt -__v -_id').populate('cards', '-__v');
    res.json(newWallet);
  } catch (error) {
    res.status(500).json({message: 'Не вдалося видалити картку!'});
  }
};

module.exports = {
  addCard,
  updateCard,
  removeCard
}