import axios from 'axios';
import { toast } from 'react-toastify';
import { BaseURL } from '../constants/Bases.js';

export const URL = BaseURL.SmarterAspNetBase;

const API = axios.create({
  baseURL: URL,
  timeout: 500000,
  headers: {
    'Content-type': 'application/json',
    Accept: '*/*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': URL,
  },
});

// ✅ Interceptor to set token dynamically before each request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get the latest token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.log('Unauthorized Request!');
        localStorage.removeItem('token');
        window.location.reload();
        return Promise.reject(error.response.data || error);
      } else if (error.response.status === 400) {
        console.log(error);
        return Promise.reject(error.response.data || error);
      } else if (error.response.status === 404) {
        return Promise.reject(error.response.data || error);
      }
    }
    return Promise.reject(error);
  },
);

export default API;
