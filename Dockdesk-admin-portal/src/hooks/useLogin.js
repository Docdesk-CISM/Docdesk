import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import api from "../services/AuthService"; // Import the AuthService
import { baseUrl } from "../constants/constants";
import { jwtDecode } from "jwt-decode";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    console.log(email, password);
    LoginFunc(email, password);
  };

  const LoginFunc = (email, pass) => {
    console.log(email, pass);
    api
      .post(`${baseUrl}/portal/auth/signin`, {
        email: email,
        password: pass,
      })
      .then((res) => {
        // console.log(res)
        LoginResponse(res);
        return res;
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error);
        console.log("error " + error);
      });
  };

  const LoginResponse = (response) => {
    if (response) {
      if (!response.status == 200) {
        setIsLoading(false);
        setError(response.error);
        console.log(error);
      }
      if (response.status == 200) {
        // save the user to local storage
        localStorage.setItem("user", JSON.stringify(response.data));
        // console.log(JSON.parse(localStorage.getItem("user")));

        const user = JSON.parse(localStorage.getItem("user"));
        const JWTData = jwtDecode(user.token);
        JWTData.token = user.token;

        if (user.refreshToken) {
          JWTData.refreshToken = user.refreshToken;
        }

        // console.log("JWT:", JWTData);
        dispatch({ type: "LOGIN", payload: JWTData });

        // update loading state
        setIsLoading(false);
      }
    }
  };

  return { login, isLoading, error };
};
