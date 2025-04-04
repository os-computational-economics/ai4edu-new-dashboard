import Cookies from "js-cookie";
import { AUTH_PATH } from "./constants";

const logout = () => {
  Cookies.remove("refresh_token");
  Cookies.remove("access_token");
  Cookies.remove("full_name");
  Cookies.remove("email");
  Cookies.remove("name_initials");
  Cookies.remove("user_id");
  Cookies.remove("user_workspace_details");
  localStorage.clear();
  setTimeout(() => {
    window.location.href = AUTH_PATH;
  }, 500);
};

export default logout;
