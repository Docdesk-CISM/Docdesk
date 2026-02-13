import axios from "axios";
import { baseUrl } from "../constants/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
const api = axios.create({});

api.defaults.baseURL = baseUrl;

// Add a request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("access-token");
    if (!token) {
      console.log("Token not found");
      //TODO: Redirect to login
      return config;
    }
    // console.log("Token found", token);
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Intercepted");
    return config;
  },
  (error) => {
    Promise.reject(error);
    console.log(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem("refresh-token");
        console.log("Refresh Token", refreshToken);
        const response = await axios.post(`${baseUrl}/refreshAT`, {
          refreshToken,
        });
        const { token } = response.data;
        console.log("New Token", token);
        await AsyncStorage.setItem("access-token", token);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axios(originalRequest);
      } catch (error) {
        console.log("Error refreshing token:", error);
        //TODO: Redirect to login
        // Handle refresh token error or redirect to login
      }
    }
    return Promise.reject(error);
  }
);

export default api;
