import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://127.0.0.1:8000',  // Ensure this is your Django server URL
  withCredentials: true,
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default instance;
