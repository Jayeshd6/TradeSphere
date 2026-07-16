import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// The interceptor automatically attaches it to every request.
//config is a JavaScript object that contains all the information about the HTTP request Axios is about to send.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;