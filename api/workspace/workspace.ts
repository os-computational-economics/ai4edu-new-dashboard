import request from "@/utils/request";

export interface User {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  student_id: string; // TODO: It looks like this is only used in tables now? Could probably be removed in the future
  role: Array<{
    student: boolean;
    teacher: boolean;
    admin: boolean;
  }>;
}

export interface UserList {
  user_list: Array<User>;
  total: number;
}

export interface setUserRoleUserIDRequest {
  user_id: number;
  workspace_id: string;
  role: string;
}

export interface WorkspaceListRequest {
  page: number;
  page_size: number;
}

export interface Workspace {
  workspace_id: string;
  workspace_name: string;
  status: number;
  school_id: number;
}

export interface WorkspaceListResponse {
  items: Array<Workspace>;
  page: number;
  page_size: number;
  total: number;
}

// API paths
const path = "workspace";
const role = "admin";

const api = {
  addUsersViaCsv: role + `/${path}` + "/add_users_via_csv",
  getWorkspaceList: role + `/${path}` + "/get_workspace_list",
  studentJoinWorkspace: role + `/${path}` + "/student_join_workspace",
  createWorkspace: role + `/${path}` + "/create_workspace",
  setUserRoleUserID: role + `/${path}` + "/set_user_role_with_user_id",
  setWorkspaceStatus: role + `/${path}` + "/set_workspace_status",
};

// add users via CSV
export function addUsersViaCsv(data, url): Promise<any> {
  return request({
    url: url,
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// get workspace list
export function getWorkspaceList(params: WorkspaceListRequest): Promise<WorkspaceListResponse> {
  return request({
    url: api.getWorkspaceList,
    method: "get",
    params: params,
  });
}

// student_join_workspace
export function studentJoinWorkspace(data): Promise<any> {
  return request({
    url: api.studentJoinWorkspace,
    method: "post",
    data,
  });
}

// create_workspace
export function createWorkspace(data): Promise<any> {
  return request({
    url: api.createWorkspace,
    method: "post",
    data,
  });
}

// set_user_role_with_user_id
export function setUserRoleUserID(
  data: setUserRoleUserIDRequest
): Promise<any> {
  return request({
    url: api.setUserRoleUserID,
    method: "post",
    data,
  });
}

// set_workspace_status
export function setWorkspaceStatus(data): Promise<any> {
  return request({
    url: api.setWorkspaceStatus,
    method: "post",
    data,
  });
}
