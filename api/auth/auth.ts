import request from "@/utils/request";

export interface User {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  student_id: string;
  workspace_role: { [key: string]: string }
}

export interface UserListRequest {
  page?: number;
  page_size?: number;
  workspace_id?: string;
}

export interface UserList {
  items: Array<User>;
  total: number;
}

// API paths
const path = "access";
const role = "admin"

const api = {
  getUserList: role + `/${path}` + "/get_user_list",
  ping: role + "/ping",
};

export function ping(): Promise<any> {
  return request({
    url: api.ping,
    method: "get",
  });
}

// get agent lists
export function getUserList(params: UserListRequest): Promise<UserList> {
  return request({
    url: api.getUserList,
    method: "get",
    params: params,
  });
}