//Luhn algorithm for card number check
export const checkCard = value => {
  const check = !(value.replace(/\D/g, '').split('').reverse().reduce(function (a, d, i) {
    return a + d * (i % 2 ? 2.2 : 1) | 0;
  }, 0) % 10);
  if (!check) return 'Не валідний номер картки';
  return check;
};

//Numbers and spaces after 4 chars
export const numbersOnly = event => event.target.value = event.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();

export const toCardWithSpaces = number => number.replace(/\s/g, '').replace(/(.{4})/g, '$1 ');

export const toCardWithStars = number => number.replace(/^(\d{4})\d+(\d{4})$/, '$1 **** **** $2');

export const getToken = () => window.localStorage.getItem('token');

export const noScrollToggle = () => document.body.classList.toggle('no-scroll');

export const removeSpaces = event => event.target.value = event.target.value.replace(/\s/g, '');

export const toNumber = event => event.target.value = Number(event.target.value);