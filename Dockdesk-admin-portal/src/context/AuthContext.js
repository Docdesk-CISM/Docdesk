import { createContext, useReducer, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      const JWTData = jwtDecode(user.token);
      JWTData.token = user.token;

      if (user.refreshToken) {
        JWTData.refreshToken = user.refreshToken;
      }

      console.log("JWT:", JWTData);
      dispatch({ type: "LOGIN", payload: JWTData });
    } else {
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  console.log("AuthContext state:", state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
