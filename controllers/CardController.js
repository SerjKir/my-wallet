const Card = require("../models/Card");
const User = require("../models/User");
const {balanceFunc} = require("../utils/helpers");

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
    const card = new Card({
      owner: userId,
      amount,
      currency,
      number: formattedNumber,
      expDate: formatDate(expDate),
      cvv,
      name: cardData.bank?.name?.slice(0, 16) || 'Картка',
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
};

const updateCard = async (req, res) => {
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
};

const removeCard = async (req, res) => {
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
};

module.exports = {
  addCard,
  updateCard,
  removeCard
}