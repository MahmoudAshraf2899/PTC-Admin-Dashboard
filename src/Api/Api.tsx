import axios from 'axios';
import { toast } from 'react-toastify';

const token = localStorage.getItem('token');

export const URL = 'https://localhost:7040/';

const API = axios.create({
  baseURL: URL,
  timeout: 500000,
  headers: {
    Authorization: token,
    'Content-type': 'application/json',
    Accept: '*/*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': URL,
  },
});
export const APISUBMIT = axios.create({
  baseURL: URL,
  timeout: 500000,
  headers: {
    // 'Content-Type': '*/*',
    Authorization: token,
    'Content-Type': 'application/json-patch+json',
    Accept: '*/*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': URL,
  },
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response !== undefined) {
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
    } else {
      return;
    }
  },
);

export default API;
