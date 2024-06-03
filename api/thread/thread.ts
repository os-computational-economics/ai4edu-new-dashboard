import request from '@/utils/request';

export interface ListThreadsResponse {
  threads: Array<{
    thread_id: string;
    user_id: string;
    created_at: string;
    agent_id: string;
  }>;
  total: number;
}

export interface SingleThreadResponse {
  thread_id: string;
  messages: Array<{
    thread_id: string;
    created_at: string;
    msg_id: string;
    user_id: string;
    role: string;
    content: string;
  }>;
}

export interface ListThreads {
  creator: string;
  page: number;
  page_size: number;
}

export interface GetThread {
  thread_id: string;
}

// API paths
const path = 'threads';

const api = {
  listThreads: path + '/get_thread_list',
  getThread: path + '/get_thread',
};

// list threads (GET)
export function getThreadsList(data: ListThreads): Promise<ListThreadsResponse> {
  return request({
    url: api.listThreads,
    method: 'GET',
    params: data,
  });
}

// get thread (GET)
export function getThreadbyID(data: GetThread): Promise<SingleThreadResponse> {
  return request({
    url: api.getThread + '/' + data.thread_id,
    method: 'GET',
  });
}