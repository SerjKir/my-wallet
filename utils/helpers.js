const balanceFunc = (user, type, currency, amount) => {
  let foundCurrency = false;
  const newBalance = user[type].map(elem => {
    if (elem.currency === currency) {
      foundCurrency = true;
      elem.amount = +elem.amount + +amount;
    }
    return elem;
  });
  if (!foundCurrency) {
    user[type].push({amount, currency});
  } else {
    user[type] = [];
    user[type] = newBalance;
  }
};

const availableCurrency = ['UAH', 'USD', 'EUR'];

const maxMoney = 1000000;
const maxLength = 16;
const minLength = 3;

module.exports = {
  balanceFunc,
  availableCurrency,
  maxMoney,
  maxLength,
  minLength
};
