import { useState } from "react";
import api from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseUrl } from "../constants/constants";

export const useSignup = () => {
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const signup = async (fname, lname, email, password) => {
    setIsLoading(true);
    setError(null);
    console.log(fname, lname, email, password);
    api
      .post(`${baseUrl}/portal/auth/signup`, {
        firstName: fname,
        lastName: lname,
        email: email,
        password: password,
      })
      .then((res) => {
        if (res) {
          if (!res.status == 200) {
            setIsLoading(false);
            setError(res.error);
          }
          if (res.status == 200) {
            alert("Admin Account Creation Complete!");

            navigate("/");

            // update loading state
            setIsLoading(false);
          }
        }
        return res;
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
        setError(error.response?.data?.error);
        console.log(error.response?.data?.error);
        return error.response.error;
      });
  };

  return { signup, isLoading, error };
};
