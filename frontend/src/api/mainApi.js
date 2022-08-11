import axios from "./axios";

export const getMe = async () => {
  const { data } = await axios.get('/me');
  return data;
};

export const getCurrency = async () => {
  const { data } = await axios.get('/currency');
  return data;
};

export const loginApi = async (params) => {
  const {data} = await axios.post('/login', params);
  return data;
}

export const registerApi = async (params) => {
  const {data} = await axios.post('/register', params);
  return data;
}

export const addCard = async (params) => {
  const { data } = await axios.post('/card', params);
  return data;
};

export const addCash = async (params) => {
  const { data } = await axios.post('/cash', params);
  return data;
};

export const removeCard = async (id) => {
  const { data } = await axios.delete(`/card/${id}`);
  return data;
}

export const updateCard = async (id, newAmount, name) => {
  const { data } = await axios.patch(`/card/${id}`, {
    newAmount, name
  });
  return data;
}

export const updateCash = async (newAmount, currency) => {
  const { data } = await axios.patch(`/cash`, {
    newAmount, currency
  });
  return data;
}