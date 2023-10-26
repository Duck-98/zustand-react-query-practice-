import axios from 'axios';
import { handleRefreshTokenError } from './auth';

export const api = axios.create({
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const storedAccessToken = localStorage.getItem('accessToken');

    if (storedAccessToken) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + storedAccessToken;
      config.headers['Authorization'] = 'Bearer ' + storedAccessToken;
    }
    return config;
  },
  (err) => {
    return handleRefreshTokenError(err);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    return handleRefreshTokenError(err);
  },
);

/* fetch */

export const fetchRestore = async () => {
  const { data } = await axios.get('http://localhost:7777/restore');
  return data;
};

export const fetchBlock = async () => {
  const { data } = await axios.get('http://localhost:7777/block');
  return data;
};


