import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import logout from "./logout";
import "react-toastify/dist/ReactToastify.css";
import { ping } from "@/api/auth/auth";

const decodeToken = () => {
  const access_token = Cookies.get("access_token");
  const refresh_token = Cookies.get("refresh_token");

  if (access_token) {
    const decodedToken = jwt.decode(access_token) as JwtPayload;
    return decodedToken;
  } else if (refresh_token) {
    return null;
  }
};

const getWorkspaceRole = () => {
  return decodeToken()?.workspace_role;
};

const getCurrentUserStudentID = () => {
  return decodeToken()?.student_id;
};

const getCurrentUserID = () => {
  return decodeToken()?.user_id;
};

const formatedCourses = () => {
  const roles = decodeToken()?.workspace_role || {};
  const formattedCourses = Object.entries(roles).map(([id, role]) => ({
    id,
    role: role as string,
    name: id,
  }));
  return formattedCourses;
};

const isAdmin = () => {
  return decodeToken()?.system_admin;
};

const checkExpired = () => {
  // check if there is no access token but there is a refresh token
  if (!Cookies.get("access_token") && Cookies.get("refresh_token")) {
    ping()
      .then((res) => {
        // if the refresh token is valid, set the new access token
        window.location.reload();
      })
      .catch((err) => {
        logout();
      });
  } else if (!Cookies.get("access_token") && !Cookies.get("refresh_token")) {
    logout();
  }
};

const checkToken = () => {
  return new Promise<void>((resolve, reject) => {
    if (!Cookies.get("access_token") && Cookies.get("refresh_token")) {
      ping()
        .then((res) => {
          // window.location.reload();  // Reload to get new access token
          resolve(); // Token refreshed successfully
        })
        .catch((err) => {
          logout(); // Logout user if refresh fails
          reject("Token refresh failed.");
        });
    } else if (!Cookies.get("access_token") && !Cookies.get("refresh_token")) {
      logout();
      reject("No access token and no refresh token available.");
    } else {
      resolve(); // Token is still valid
    }
  });
};

export {
  formatedCourses,
  isAdmin,
  checkExpired,
  getCurrentUserStudentID,
  getWorkspaceRole,
  getCurrentUserID,
  checkToken,
};
