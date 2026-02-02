import request from "@/utils/request";

export interface PendingUser {
  student_id: string;
  status: string;
}

export interface PendingUsersList {
  items: Array<PendingUser>;
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
  workspace_join_code;
  status: number;
  school_id: number;
  workspace_prompt: string;
  workspace_comment: string;
  created_by?: string;
}

export interface WorkspaceListResponse {
  items: Array<Workspace>;
  total: number;
  page?: number;
  page_size?: number;
}

export interface StudentJoinWorkspaceRequest {
  workspace_join_code: string;
}

export interface CreateWorkspaceRequest {
  workspace_name: string;
  school_id: number;
  workspace_prompt: string | null;
  workspace_comment: string | null;
}

export interface EditWorkspaceRequest {
  workspace_id: string;
  workspace_name?: string;
  workspace_prompt?: string;
  workspace_comment?: string;
}

enum WorkspaceStatus {
  ACTIVE = 1,
  INACTIVE = 0,
  DELETED = 2,
}

export interface UpdateWorkspaceRequest {
  workspace_id: string;
  workspace_status: WorkspaceStatus;
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
  getUserWorkspaceDetails: role + `/${path}` + "/get_user_workspace_details",
  editWorkspace: role + `/${path}` + "/edit_workspace",
  getPendingUsers: role + `/${path}` + "/get_pending_users",
  setWorkspaceAdminRole: role + `/${path}` + "/set_workspace_admin_role",
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
export function getWorkspaceList(
  params: WorkspaceListRequest
): Promise<WorkspaceListResponse> {
  return request({
    url: api.getWorkspaceList,
    method: "get",
    params: params,
  });
}

// student_join_workspace
export function studentJoinWorkspace(
  data: StudentJoinWorkspaceRequest
): Promise<any> {
  return request({
    url: api.studentJoinWorkspace,
    method: "post",
    data,
  });
}

// create_workspace
export function createWorkspace(data: CreateWorkspaceRequest): Promise<any> {
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
export function setWorkspaceStatus(data: UpdateWorkspaceRequest): Promise<any> {
  return request({
    url: api.setWorkspaceStatus,
    method: "post",
    data,
  });
}

// get_user_workspace_details
export function getUserWorkspaceDetails(): Promise<WorkspaceListResponse> {
  return request({
    url: api.getUserWorkspaceDetails,
    method: "get",
  });
}

// edit_workspace
export function editWorkspace(data: EditWorkspaceRequest): Promise<any> {
  return request({
    url: api.editWorkspace,
    method: "post",
    data,
  });
}

// get_pending_users
export function getPendingUsers(
  workspaceId: string
): Promise<PendingUsersList> {
  return request({
    url: `${api.getPendingUsers}/${workspaceId}`,
    method: "get",
  });
}

export function setWorkspaceAdminRole(data: { user_id: number; workspace_admin: boolean }): Promise<{
  success: boolean;
  status: number;
  message: string;
}> {
  return request({
    url: api.setWorkspaceAdminRole,
    method: "post",
    data: data,
  });
}
