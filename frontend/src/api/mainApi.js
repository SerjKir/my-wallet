import axios from './axios';

export const getUser = async () => {
  return await axios.get('/api/user');
};

export const getWallet = async () => {
  return await axios.get('/api/wallet');
};

export const loginApi = async params => {
  return await axios.post('/api/login', params);
}

export const registerApi = async params => {
  return await axios.post('/api/register', params);
}

export const addCard = async params => {
  return await axios.post('/api/card', params);
};

export const setIsSkin = async params => {
  return await axios.patch('/api/user', params);
};

export const addCash = async params => {
  return await axios.post('/api/cash', params);
};

export const removeCard = async id => {
  return await axios.delete(`/api/card/${id}`);
};

export const updateCard = async (id, newAmount, name) => {
  return await axios.patch(`/api/card/${id}`, {newAmount, name});
};

export const updateCash = async (newAmount, currency) => {
  return await axios.patch(`/api/cash`, {newAmount, currency});
};