import request from "@/utils/request";
import { apiUrl } from "@/utils/request";

export interface NewThreadRequest {
  workspace_id: string;
  agent_id: string;
}

export interface NewThreadResponse {
  thread_id: string;
}

// API paths
const path = "users";
const role = "user";

const api = {
  testQuery: role + "/test_query",
  fileUpload: role + "/upload_file",
  streamChat: role + "/stream_chat",
  newThread: role + "/get_new_thread",
  getAgent: role + `/${path}` + "/agent/get",
  getFilePresignedURL: role + "/get_presigned_url_for_file",
};

export const testQueryURL = apiUrl + "/" + api.testQuery;
export const fileUploadURL = apiUrl + "/" + api.fileUpload;
export const steamChatURL = apiUrl + "/" + api.streamChat;
export const newThreadURL = apiUrl + "/" + api.newThread;
export const getFilePresignedURL = apiUrl + "/" + api.getFilePresignedURL;

// stream chat
export function streamChat(data): Promise<any> {
  return request({
    url: api.streamChat,
    method: "post",
    data,
  });
}

export function getNewThread(params: NewThreadRequest): Promise<NewThreadResponse> {
  return request({
    url: api.newThread,
    method: "get",
    params: params,
  });
}

export function getPresignedURLForFile(params: {
  fileID: string;
}): Promise<any> {
  return request({
    url: api.getFilePresignedURL + "?file_id=" + params.fileID,
    method: "get",
  });
}
