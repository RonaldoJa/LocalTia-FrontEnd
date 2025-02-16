import axios, { AxiosResponse } from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../core/auth/AuthContext'; 
import { toast } from 'react-toastify';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.response.use(
  (response) => {
    if (response.data.error) {
      return Promise.reject(new Error(response.data.message));
    }
    return response.data;
  },
  (error) => {
    const errorMessage = error.response?.data?.message || error.message;
    if (error.response?.status === 401) {
      const { logout } = useContext(AuthContext); 
      toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      logout();
    }

    return Promise.reject(new Error(errorMessage));
  }
);

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; 
  }
  return config;
});

export default httpClient;