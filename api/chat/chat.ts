import request from '@/utils/request'
import { apiUrl } from '@/utils/request'

// API paths
const path = 'users'
const role = "user"

const api = {
  streamChat: role + '/stream_chat',
  newThread: role + '/get_new_thread',
  getAgent: role + `/${path}` + '/agent/get'
}

export const steamChatURL = apiUrl + '/' + api.streamChat
export const newThreadURL = apiUrl + '/' + api.newThread

// stream chat
export function streamChat(data): Promise<any> {
  return request({
    url: api.streamChat,
    method: 'post',
    data
  })
}

export function getNewThread(params): Promise<any> {
    return request({
      url: api.newThread,
      method: "get",
      params: params,
    });
  }
