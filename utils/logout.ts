import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { AUTH_PATH } from "./constants";

const logout = () => {
  /* toast.error("Your session has expired.", {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    progress: undefined,
  });
  we don't need to show users this
  */
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  localStorage.clear();
  setTimeout(() => {
    window.location.href = AUTH_PATH;
  }, 3000);
};

export default logout;
