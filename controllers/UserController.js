const User = require("../models/User");
const {availableCurrency} = require("../utils/helpers");

const getUserData = async (req, res) => {
  try {
    const userId = req.decodedId;
    const user = await User.findById(userId, '-passwordHash -wallet -createdAt -updatedAt -__v -_id');
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

module.exports = {
  getUserData,
  setCardSkin
}