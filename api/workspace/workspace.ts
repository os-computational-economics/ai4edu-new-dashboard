import request from "@/utils/request";

export interface User {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  student_id: string;  // TODO: It looks like this is only used in tables now? Could probably be removed in the future
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
const path = "workspace";
const role = "admin"

const api = {
  addUsersViaCsv: role + `/${path}` + "/add_users_via_csv",
  getWorkspaceList: role + `/${path}` + "/get_workspace_list",
  studentJoinWorkspace: role + `/${path}` + "/student_join_workspace",
  createWorkspace: role + `/${path}` + "/create_workspace",
  setUserRole: role + `/${path}` + "/set_user_role",
  setUserRoleStudentID: role + `/${path}` + "/set_user_role_with_student_id",
  setWorkspaceStatus: role + `/${path}` + "/set_workspace_status"
};

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

// set_user_role
export function setUserRole(data): Promise<any> {
  return request({
    url: api.setUserRole,
    method: "post",
    data,
  });
}

// set_user_role_with_student_id
export function setUserRoleStudentID(data): Promise<any> {
  return request({
    url: api.setUserRoleStudentID,
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