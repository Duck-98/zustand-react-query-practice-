import axios from 'axios';
import { api } from '.';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: null | string) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const handleRefreshTokenError = async (err: any) => {
  const originalRequest = err.config;

  if (err.response) {
    if (err.response.status === 401 && !originalRequest._retry) {
      const storedAccessToken = localStorage.getItem('accessToken');
      // 로컬스토리지에서 refreshToken 받아오기

      if (storedAccessToken) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + storedAccessToken;
        originalRequest.headers['Authorization'] = 'Bearer ' + storedAccessToken;
        processQueue(null, storedAccessToken);
        // 이 시점에서는 이미 헤더가 설정되었으므로 err를 리젝트하지 않고 반환
        return axios(originalRequest);
      }

      if (isRefreshing) {
        try {
          const token = await new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
            console.log(failedQueue, 'failedQueue!');
          });
          console.log(token, 'token');
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return await axios(originalRequest);
        } catch (err_1) {
          return await Promise.reject(err_1);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(function (resolve, reject) {
        api
          .post('http://localhost:7777/login')
          .then(({ data }) => {
            localStorage.setItem('accessToken', data.accessToken); // Store refreshToken in localStorage
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.accessToken;
            originalRequest.headers['Authorization'] = 'Bearer ' + data.accessToken;
            processQueue(null, data.accessToken);
            resolve(axios(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            reject(err);
          })
          .then(() => {
            isRefreshing = false;
          });
      });
    }
  } else {
    console.log(err, 'no error response!');
  }

  return Promise.reject(err);
};
