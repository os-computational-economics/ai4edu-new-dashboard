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
  agent_files?: Array<{}> | null;
  system_prompt?: string;
}

export interface AgentsResponse {
  agents: Array<Agent>;
  total: number;
}

export interface NewAgent {
  agent_name: string;
  course_id: string;
  student_id: string;
  voice: boolean;
  status: number;
  allow_model_choice: boolean;
  model: string;
}

export interface UpdateAgent {
  agent_id: string;
  agent_name: string;
  course_id: string;
  student_id: string;
  voice: boolean;
  status: number;
  allow_model_choice: boolean;
  model: string;
}

export interface DeleteAgent {
  agent_id: string;
  agent_name: string;
  course_id: string;
  student_id: string;
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
export function addAgent(data): Promise<NewAgent> {
  return request({
    url: api.addAgent,
    method: "post",
    data,
  });
}

// update agent
export function updateAgent(data): Promise<UpdateAgent> {
  return request({
    url: api.updateAgent,
    method: "post",
    data,
  });
}

// update agent
export function deleteAgent(data): Promise<DeleteAgent> {
  return request({
    url: api.deleteAgent,
    method: "post",
    data,
  });
}

// get agent lists
export function getAgents(params): Promise<AgentsResponse> {
  return request({
    url: api.getAgents,
    method: "get",
    params: params,
  });
}

// get agent by id
export function getAgentByID(data): Promise<Agent> {
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
