import axios from "axios";
import baseurl from "./config";

const instance = axios.create({
  baseURL: `${baseurl}`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
