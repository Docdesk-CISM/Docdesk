import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { refreshAT } from "./RefreshAT";
import { baseUrl } from "../constants/constants";

const api = axios.create({
  baseURL: baseUrl,
});

const checkATValidity = async (token, user) => {
  const decodedToken = jwtDecode(token);
  console.log(user);
  console.log(decodedToken);

  let currentDate = new Date();
  if (decodedToken.exp * 1000 > currentDate.getTime()) {
    console.log("Valid token");
    return token;
  } else {
    console.log("Token expired.");
    const responseToken = await refreshAT(decodedToken.roles, user.refreshToken);
    console.log(responseToken);
    return responseToken;
  }
};

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;
    console.log(user);

    console.log("Intercepted");
    // console.log(token)
    if (token) {
      checkATValidity(token, user)
        .then((resultToken) => {
          console.log(resultToken)
          config.headers.Authorization = `Bearer ${resultToken}`;
        })
        .catch((error) => {
          console.log(error);
        });
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
