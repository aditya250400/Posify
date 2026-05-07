import axios from "axios";
import Cookies from "js-cookie";

const Api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASEURL,
});

Api.interceptors.response.use(
  function (response) {
    const token = Cookies.get("token");

    if (token) {
      response.headers.Authorization = JSON.parse(token);
    }

    return response;
  },
  (error) => {
    if (401 === error.response.status) {
      Cookies.remove("token");
      window.location = "/";
    } else {
      return Promise.reject(error);
    }
  },
);

export default Api;
