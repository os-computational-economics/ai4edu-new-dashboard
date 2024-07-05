import request from "@/utils/request";

export interface User {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  student_id: string;
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

// API paths
const path = "access";
const role = "admin"
const workspace = "workspace"

const api = {
  getUserList: role + `/${path}` + "/get_user_list",
  grantAccess: role + `/${path}` + "/grant_access",
  addUsersViaCsv: role + `/${workspace}` + "/add_users_via_csv",
  getWorkspaceList: role + `/${workspace}` + "/get_workspace_list",

};

// add agent
export function grantAccess(data): Promise<any> {
  return request({
    url: api.grantAccess,
    method: "post",
    data,
  });
}

// get agent lists
export function getUserList(params): Promise<UserList> {
  return request({
    url: api.getUserList,
    method: "get",
    params: params,
  });
}

// add users via CSV
export function addUsersViaCsv(data, url): Promise<any> {
  return request({
    url: url,
    method: "post",
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

// get workspace list
export function getWorkspaceList(params): Promise<any> {
  return request({
    url: api.getWorkspaceList,
    method: "get",
    params: params,
  });
}