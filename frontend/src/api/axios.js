import axios from 'axios';
import {baseUrl} from '../url';
import {getToken} from '../helpers';

const instance = axios.create({
  baseURL: baseUrl,
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getToken()}`;
  return config;
});

export default instance;