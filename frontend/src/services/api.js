import axios from "axios";
import Cookies from "js-cookie";

const Api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASEURL,
});

Api.interceptors.response.use(
  function (response) {
    return response;
  },
  (error) => {
    if (401 === error.response.status) {
      alert("Session is expired, please login again");
      Cookies.remove("token");
      window.location = "/";
    } else {
      return Promise.reject(error);
    }
  },
);

Api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default Api;
