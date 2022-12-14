const User = require("../models/User");
const {availableCurrency} = require("../utils/helpers");
const Wallet = require("../models/Wallet");

const getAllData = async (req, res) => {
  try {
    const userId = req.decodedId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({message: 'Користувач не знайден!'});
    const wallet = await Wallet.findOne({owner: userId}, '-createdAt -updatedAt -__v -_id').populate('cards', '-__v -createdAt -updatedAt');
    if (!wallet) return res.status(404).json({message: 'Гаманець не знайден!'});
    res.json({user: {username: user.username,avatarUrl: user.avatarUrl, isSkin: user.isSkin, lang: user.lang}, availableCurrency, wallet});
  } catch (error) {
    res.status(500).json({message: 'Не вдалося отримати дані!'});
  }
};

const setCardSkin = async (req, res) => {
  try {
    const {isSkin} = req.body;
    const userId = req.decodedId;
    User.findByIdAndUpdate(userId, {isSkin: !!isSkin}, { returnDocument: 'after' }, (err, doc) => {
      if (!err) res.json(doc.isSkin);
    });
  } catch (error) {
    res.status(500).json({message: 'Не вдалося оновити дані!'});
  }
};

const setUserLang = async (req, res) => {
  try {
    const {lang} = req.body;
    const userId = req.decodedId;
    User.findByIdAndUpdate(userId, {lang}, { returnDocument: 'after' }, (err, doc) => {
      if (!err) res.json(doc.lang);
    });
  } catch (error) {
    res.status(500).json({message: 'Не вдалося оновити мову!'});
  }
};

module.exports = {
  setCardSkin,
  getAllData,
  setUserLang
};