import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

const logout = () => {
toast.error("Your session has expired.", {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    progress: undefined,
  });
  Cookies.remove("access_token")
  Cookies.remove("refresh_token")
  localStorage.clear()
  setTimeout(() => {
    window.location.href = "/auth/signin"
  }, 3000)
}

export default logout