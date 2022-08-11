module.exports = (user, type, currency, difference) => {
  const newBalance = user[type].map(elem => {
    if (elem.currency === currency) {
      elem.amount = parseInt(elem.amount) + difference;
    }
    return elem;
  });
  user[type] = [];
  user[type] = newBalance;
};
