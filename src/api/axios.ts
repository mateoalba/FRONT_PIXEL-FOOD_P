import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000", // 👈 BACKEND REAL
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


export default instance;
