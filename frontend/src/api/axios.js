import axios from 'axios';
import {baseUrl} from '../consts';
import {getToken} from '../helpers';

const instance = axios.create({
  baseURL: baseUrl,
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getToken()}`;
  return config;
});

export default instance;