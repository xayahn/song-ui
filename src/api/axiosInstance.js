import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://song-api-rvfw.onrender.com';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export default axiosInstance;