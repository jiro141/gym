import axios from "axios";


const Axios = axios.create({
  baseURL: `http://localhost:5000/api`,
  headers: { "content-type": "application/json"},
});

Axios.interceptors.request.use(async (config) => {
  const token = window.localStorage.getItem("token");
 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default Axios;