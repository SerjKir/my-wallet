const {check} = require("express-validator");

const authValidator = [
  check('username', "Ім`я повинно містити від 3 до 16 символів без пробілів!").custom(value => !/\s/.test(value)).isLength({min: 3, max: 16}),
  check('password', "Пароль повинен містити від 3 до 16 символів без пробілів!").custom(value => !/\s/.test(value)).isLength({min: 3, max: 16})
];

const addCardValidator = [
  check('number', "Номер картки повинен містити 16 цифр!").custom(value => value.replace(/\s/g, '').length === 16),
  check('amount', 'Сума повинна бути від 0 до 1 000 000!').isInt({min: 0, max: 1000000}),
  check('cvv', 'CVV код повинен скалдатися з 3 цифр!').isInt({min: 3, max: 3}),
  check('holder', "Ім'я власника повинно бути від 3 до 16 символів!").trim().isLength({min: 3, max: 16}),
];

const updateCardValidator = [
  check('newAmount', 'Сума повинна бути від 0 до 1 000 000!').isInt({min: 0, max: 1000000}),
  check('name', 'Назва повинна містити від 3 до 16 символів').trim().isLength({min: 3, max: 16})
];

const addCashValidator = [
  check('amount', 'Сума повинна бути від 1 до 1 000 000!').isInt({min: 1, max: 1000000})
];

const updateCashValidator = [
  check('newAmount', 'Сума повинна бути від 0 до 1 000 000!').isInt({min: 0, max: 1000000})
];

module.exports = {
  authValidator,
  addCardValidator,
  updateCardValidator,
  addCashValidator,
  updateCashValidator
}