import axios from "axios";
const baseUrl = import.meta.env.VITE_BACKEND_URL;

const instance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

// Add a request interceptor
instance.interceptors.request.use(
  function (response) {
    return response;
  },
  function (config) {
    if (token) {
      // config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    if(error.response){
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }

);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // console.log(response);
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response && response.data ? response.data : response;
  },
  function (error) {
    // confirm(error.message);
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return error?.response?.data ?? Promise.reject(error);
  }
);
export default instance;
