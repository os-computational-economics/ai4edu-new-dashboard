import request from "@/utils/request";

export interface Agent {
  agent_id: string;
  allow_model_choice: boolean;
  model: string;
  created_at: string;
  workspace_id: string;
  agent_name: string;
  updated_at: string;
  voice: boolean;
  status: number;
  agent_files?: {
    file_id: string;
  };
  system_prompt?: string;
}

export interface ListAgentsRequest {
  workspace_id: string;
  page?: number;
  page_size?: number;
}

export interface ListAgentsResponse {
  items: Array<Agent>;
  total: number;
}

export interface NewAgentRequest {
  agent_name: string;
  workspace_id: string;
  creator: string; // TODO: This should be user_id, migrate later
  voice: boolean;
  status: number;
  allow_model_choice: boolean;
  model: string;
  system_prompt: string;
  agent_files: {
    file_id: string;
  };
}

export interface NewAgentResponse {
  agent_id: string;
}

export interface UpdateAgentRequest {
  agent_id: string;
  workspace_id: string;
  agent_name: string;
  creator: string; // TODO: This should be user_id, migrate later
  voice: boolean;
  status: number;
  allow_model_choice: boolean;
  model: string;
  system_prompt: string;
  agent_files: {
    file_id: string;
  };
}

export interface UpdateAgentResponse {
  agent_id: string;
}

export interface DeleteAgentRequest {
  agent_id: string;
  workspace_id: string;
}

export interface DeleteAgentResponse {
  agent_id: string;
}

export interface GetAgentByIDRequest {
  agent_id: string;
}

export interface GetAgentByIDResponse {
  agent_id: string;
  agent_name: string;
  allow_model_choice: boolean;
  model: string;
  voice: boolean;
  workspace_id: string;
  agent_files: {
    file_id: string;
  };
  status: number;
}

export interface AgentUploadFileResponse {
  file_id: string;
  file_name: string;
}

// API paths
const path = "agents";
const role = "admin";

const api = {
  addAgent: role + `/${path}` + "/add_agent",
  deleteAgent: role + `/${path}` + "/delete_agent",
  updateAgent: role + `/${path}` + "/update_agent",
  getAgentbyID: role + `/${path}` + "/agent/",
  getAgents: role + `/${path}` + "/agents",
  agentFileUpload: role + "/upload_file",
};

// add agent
export function addAgent(data: NewAgentRequest): Promise<NewAgentResponse> {
  return request({
    url: api.addAgent,
    method: "post",
    data,
  });
}

// update agent
export function updateAgent(
  data: UpdateAgentRequest
): Promise<UpdateAgentResponse> {
  return request({
    url: api.updateAgent,
    method: "post",
    data,
  });
}

// update agent
export function deleteAgent(
  data: DeleteAgentRequest
): Promise<DeleteAgentResponse> {
  return request({
    url: api.deleteAgent,
    method: "post",
    data,
  });
}

// get agent lists
export function getAgents(
  params: ListAgentsRequest
): Promise<ListAgentsResponse> {
  return request({
    url: api.getAgents,
    method: "get",
    params: params,
  });
}

// get agent by id
export function getAgentByID(data: GetAgentByIDRequest): Promise<GetAgentByIDResponse> {
  return request({
    url: api.getAgentbyID + data.agent_id,
    method: "get",
  });
}

export function agentUploadFile(
  formData: FormData
): Promise<AgentUploadFileResponse> {
  return request({
    url: api.agentFileUpload,
    method: "post",
    data: formData,
  });
}
