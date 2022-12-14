const User = require("../models/User");
const Wallet = require("../models/Wallet");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const resister = async (req, res) => {
  try {
    const {username, password} = req.body;
    const candidate = await User.findOne({username});
    if (candidate) return res.status(400).json({message: 'Такий користувач вже існує!'});
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = new User({username, passwordHash: hash});
    const wallet = new Wallet({owner: user._id});
    user.wallet = wallet;
    await user.save();
    await wallet.save();
    const token = jwt.sign({
      _id: user._id,
    }, 'secretWord', {
      expiresIn: '24h'
    });
    res.json(token);
  } catch (error) {
    res.status(500).json({message: 'Не вдалося зареєструватися!'});
  }
};

const login = async (req, res) => {
  try {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    if (!user) return res.status(404).json({message: 'Такого користувача не існує!'});
    const isValidPass = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPass) return res.status(400).json({message: `Им'я та пароль не співпадають!`});
    const token = jwt.sign({
      _id: user._id,
    }, 'secretWord', {
      expiresIn: '24h'
    })
    res.json(token);
  } catch (error) {
    res.status(500).json({message: 'Не вдалося увійти в акаунт!', error});
  }
};

module.exports = {
  resister,
  login
}