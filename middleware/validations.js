const {check} = require("express-validator");
const {maxMoney, maxLength, minLength} = require("../utils/helpers");

const authValidator = [
  check('username', `Ім'я повинно містити від ${minLength} до ${maxLength} символів без пробілів!`)
    .custom(value => !/\s/.test(value)).isLength({min: minLength, max: maxLength}),
  check('password', `Пароль повинен містити від ${minLength} до ${maxLength} символів без пробілів!`)
    .custom(value => !/\s/.test(value)).isLength({min: minLength, max: maxLength})
];

const addCardValidator = [
  check('number', `Номер картки повинен містити ${maxLength} цифр!`).custom(value => value.replace(/\s/g, '').length === maxLength),
  check('amount', `Сума повинна бути від 0 до ${maxMoney}!`).isInt({min: 0, max: maxMoney}),
  check('cvv', 'CVV код повинен скалдатися з 3 цифр!').custom(value => parseInt(value) || value === '000').isLength({min: 3, max: 3}),
  check('holder', `Ім'я власника повинно бути від ${minLength} до ${maxLength} символів!`).trim().isLength({min: minLength, max: maxLength}),
];

const updateCardValidator = [
  check('newAmount', `Сума повинна бути від 0 до ${maxMoney}!`).isInt({min: 0, max: maxMoney}),
  check('name', `Назва повинна містити від ${minLength} до ${maxLength} символів`).trim().isLength({min: minLength, max: maxLength})
];

const addCashValidator = [
  check('amount', `Сума повинна бути від 1 до ${maxMoney}!`).isInt({min: 1, max: maxMoney})
];

const updateCashValidator = [
  check('newAmount', `Сума повинна бути від 0 до ${maxMoney}!`).isInt({min: 0, max: maxMoney})
];

module.exports = {
  authValidator,
  addCardValidator,
  updateCardValidator,
  addCashValidator,
  updateCashValidator
}