import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_BASE_URL}/api`,
  withCredentials: true, // to send cookies with requests
});

export default api;
