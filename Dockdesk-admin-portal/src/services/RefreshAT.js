import axios from "axios";
import { baseUrl } from "../constants/constants";

export const refreshAT = async (role, RT) => {
  const refreshToken = RT;
  console.log(refreshToken, role);

  const res = await axios
    .post(`${baseUrl}/refreshAT`, {
      refreshToken: refreshToken,
      role: role,
    })
    .then((res) => {

      console.log("res", res.data.token);

      const user = JSON.parse(localStorage.getItem("user"));
      user.token = res.data.token;
      localStorage.setItem("user", JSON.stringify(user));

      console.log(user);
      return res.data.token;
    })
    .catch((error) => {
      console.log("error", error);
      return false;
    });
  return res;
};
