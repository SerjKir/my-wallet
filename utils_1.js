module.exports = (user, type, currency, amount) => {
  let foundCurrency = false;
  const newBalance = user[type].map(elem => {
    if (elem.currency === currency) {
      foundCurrency = true;
      elem.amount = parseInt(elem.amount) + parseInt(amount);
    }
    return elem;
  });
  if (!foundCurrency) {
    user[type].push({
      amount,
      currency,
    });
  } else {
    user[type] = [];
    user[type] = newBalance;
  }
};
