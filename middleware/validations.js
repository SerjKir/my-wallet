const {check} = require("express-validator");

const authValidator = [
  check('username', "Ім`я має містити мінімум 3 символи без пробілів!").custom(value => !/\s/.test(value)).isLength({min: 3}),
  check('password', "Пароль має містити мінімум 3 символи без пробілів!").custom(value => !/\s/.test(value)).isLength({min: 3})
];

const cardValidator = [
  check('number', "Номер картки повинен містити 16 цифр!").custom(value => !/\s/.test(value)).isLength({min: 16, max: 16}),
  check('amount', 'Сума повинна бути від 0 до 1 000 000!').isInt({max: 1000000, min: 0}),
  check('cvv', 'CVV код повинен скалдатися с 3 цифр!').isInt().isLength({min: 3, max: 3}),
  check('holder', "Им'я власника максимум 16 символів!").trim().isLength({max: 16}),
];

const updateCardValidator = [
  check('newAmount', 'Сума повинна бути від 0 до 1 000 000!').isInt({max: 1000000, min: 0}),
  check('name', 'Назва має бути мінімум 3 символи!').trim().isLength({min: 3, max: 16})
];

const cashValidator = [
  check('amount', 'Сума повинна бути від 1 до 1 000 000!').isInt({max: 1000000, min: 1})
];

const updateCashValidator = [
  check('newAmount', 'Сума повинна бути від 0 до 1 000 000!').isInt({max: 1000000, min: 0})
];

module.exports = {
  authValidator,
  cardValidator,
  updateCardValidator,
  cashValidator,
  updateCashValidator
}