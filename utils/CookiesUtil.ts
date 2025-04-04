import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import logout from "./logout";
import "react-toastify/dist/ReactToastify.css";
import { ping } from "@/api/auth/auth";
import { getUserWorkspaceDetails } from "@/api/workspace/workspace";
import { LOGIN_PERSISTENCE_IN_DAYS } from "./constants";

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

const forceRefreshWorkspaceAndToken = () => {
  // delete the two related tokens: access_token and user_workspace_details
  Cookies.remove("access_token");
  Cookies.remove("user_workspace_details");
  ping()
    .then(obtainWorkspaceDetails)
    .then(
      // refresh the page
      () => {
        window.location.reload();
      }
    )
    .catch((err) => {
      console.error("Error refreshing workspace details", err);
      // if the refresh token is invalid, logout
      logout();
    });
};

const obtainWorkspaceDetails = () => {
  const user_workspace_details = Cookies.get("user_workspace_details");
  if (user_workspace_details) {
    return JSON.parse(user_workspace_details);
  } else {
    // get user workspace details from backend and set it to cookie
    getUserWorkspaceDetails()
      .then((res) => {
        Cookies.set("user_workspace_details", JSON.stringify(res.items), {
          expires: LOGIN_PERSISTENCE_IN_DAYS,
        });
        return res.items;
      })
      .catch((error) => {
        console.error("Error fetching workspace list", error);
      });
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
  // fetch workspace details and roles
  const workspace_details = obtainWorkspaceDetails() || {};
  const roles = decodeToken()?.workspace_role || {};

  // merge workspace_details and workspace_roles together by workspace_id to centralize data
  const mergedWorkspaces = workspace_details.map((workspace) => {
    const mergedWorkspaces = { ...workspace };
    const role = roles[workspace.workspace_id];
    if (role) {
      mergedWorkspaces.workspace_role = role;
    }
    return mergedWorkspaces;
  });

  // format courses for course cards
  const formattedWorkspaces = mergedWorkspaces.map((workspace) => ({
    id: workspace.workspace_id,
    role: workspace.workspace_role,
    name: workspace.workspace_name,
    comment: workspace.workspace_comment,
  }));

  return formattedWorkspaces;
};

const isSystemAdmin = () => {
  return decodeToken()?.system_admin;
};

const isWorkspaceAdmin = () => {
  return decodeToken()?.workspace_admin;
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
  isSystemAdmin,
  isWorkspaceAdmin,
  checkExpired,
  getCurrentUserStudentID,
  getWorkspaceRole,
  getCurrentUserID,
  checkToken,
  forceRefreshWorkspaceAndToken,
};
