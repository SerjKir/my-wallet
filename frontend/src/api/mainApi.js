import axios from './axios';

export const getMe = async () => {
  return await axios.get('/api/me');
};

export const loginApi = async (params) => {
  return await axios.post('/api/login', params);
}

export const registerApi = async (params) => {
  return await axios.post('/api/register', params);
}

export const addCard = async (params) => {
  return await axios.post('/api/card', params);
};

export const addCash = async (params) => {
  return await axios.post('/api/cash', params);
};

export const removeCard = async (id) => {
  return await axios.delete(`/api/card/${id}`);
};

export const updateCard = async (id, newAmount, name) => {
  return await axios.patch(`/api/card/${id}`, {newAmount, name});
};

export const updateCash = async (newAmount, currency) => {
  return await axios.patch(`/api/cash`, {newAmount, currency});
};