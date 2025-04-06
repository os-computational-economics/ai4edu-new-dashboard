import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import logout from "./logout";
import { ping } from "@/api/auth/auth";
import { getUserWorkspaceDetails } from "@/api/workspace/workspace";

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
  localStorage.removeItem("user_workspace_details");
  localStorage.removeItem("workspace");
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

const getWorkspaceNameFromID = (workspace_id: string) => {
  const workspace_details = obtainWorkspaceDetails();
  if (workspace_details) {
    const workspace = workspace_details.find(
      (workspace) => workspace.workspace_id === workspace_id
    );
    if (workspace) {
      return workspace.workspace_name;
    } else {
      console.error("Workspace not found");
      return "";
    }
  } else {
    console.error("Workspace details not found");
    return "";
  }
};

const obtainWorkspaceDetails = () => {
  const user_workspace_details = localStorage.getItem("user_workspace_details");
  if (user_workspace_details) {
    return JSON.parse(user_workspace_details);
  } else {
    // get user workspace details from backend and set it to localStorage
    getUserWorkspaceDetails()
      .then((res) => {
        localStorage.setItem("user_workspace_details", JSON.stringify(res.items));
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

const formatedCourses = async () => {
  // fetch workspace details and roles
  const workspace_details = obtainWorkspaceDetails() || {};
  const roles = decodeToken()?.workspace_role || {};

  // Find all workspace IDs that exist in roles but not in details
  const missingWorkspaceIds = Object.keys(roles).filter(
    (workspaceId) =>
      !workspace_details.some((ws) => ws.workspace_id === workspaceId)
  );

  // If there are missing workspaces, fetch them all at once
  if (missingWorkspaceIds.length > 0) {
    try {
      const response = await getUserWorkspaceDetails();
      const newWorkspaceDetails = response.items.filter((ws) =>
        missingWorkspaceIds.includes(ws.workspace_id)
      );

      // Update localStorage with new workspace details
      if (newWorkspaceDetails.length > 0) {
        const updatedDetails = [...workspace_details, ...newWorkspaceDetails];
        localStorage.setItem("user_workspace_details", JSON.stringify(updatedDetails));
        // Update workspace_details to include the new details
        workspace_details.push(...newWorkspaceDetails);
      }
    } catch (error) {
      console.error("Error fetching workspace details:", error);
    }
  }

  // use roles as the base and merge with workspace_details
  const mergedWorkspaces = Object.entries(roles).map(([workspaceId, role]) => {
    // find matching workspace details
    const workspaceDetail =
      workspace_details.find(
        (workspace) => workspace.workspace_id === workspaceId
      ) || {};

    return {
      workspace_id: workspaceId,
      workspace_role: role as string,
      workspace_name: workspaceDetail.workspace_name || "",
      workspace_comment: workspaceDetail.workspace_comment || "",
      workspace_join_code: workspaceDetail.workspace_join_code || "",
    };
  });

  // format courses for course cards
  const formattedWorkspaces = mergedWorkspaces.map((workspace) => ({
    id: workspace.workspace_id,
    role: workspace.workspace_role,
    name: workspace.workspace_name,
    comment: workspace.workspace_comment,
    join_code: workspace.workspace_join_code,
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
  getWorkspaceNameFromID,
};
