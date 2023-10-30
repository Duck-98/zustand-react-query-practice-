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
  try {
    const { data } = await axios.get('http://localhost:7777/restore', {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    return data;
  } catch (err: any) {
    if (err.response && err.response.status === 401) {
      throw new Error('401');
    }
    return err.response.data;
  }
};

export const fetchBlock = async () => {
  try {
    const { data } = await axios.get('http://localhost:7777/block', {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    return data;
  } catch (err: any) {
    if (err.response && err.response.status === 401) {
      throw new Error('401');
    }
    return err.response.data;
  }
};
