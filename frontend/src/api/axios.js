import axios from 'axios';
import {baseUrl} from '../consts';

const instance = axios.create({
  baseURL: baseUrl,
});

instance.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('token');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;