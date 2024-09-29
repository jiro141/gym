import axios from "axios";


const Axios = axios.create({
  baseURL: `http://26.166.44.17:5000/api`,
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