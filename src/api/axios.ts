import axios from 'axios';

const instance = axios.create({
  // Usamos la variable de entorno de Vite
  baseURL: import.meta.env.VITE_API_URL,
});

// Este interceptor es el que "pega" el token a cada mensaje que envías al server
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;