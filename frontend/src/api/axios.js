import axios from "axios";
import {baseEnvUrl} from '../consts';

const instance = axios.create({
  baseURL: baseEnvUrl,
});

instance.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('token');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;