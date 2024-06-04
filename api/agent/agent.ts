import request from "@/utils/request";

export interface Agent {
  agent_id: string;
  creator: string;
  allow_model_choice: boolean;
  model: string;
  created_at: string;
  course_id: string;
  agent_name: string;
  updated_at: string;
  voice: boolean;
  status: number;
}

export interface AgentsResponse {
  agents: Array<Agent>;
  total: number;
}

export interface NewAgent {
  agent_name: string;
  course_id: string;
  creator: string;
  voice: boolean;
  status: number;
  allow_model_choice: boolean;
  model: string;
}

export interface UpdateAgent {
  agent_id: string;
  agent_name: string;
  course_id: string;
  creator: string;
  voice: boolean;
  status: number;
  allow_model_choice: boolean;
  model: string;
}

export interface DeleteAgent {
  agent_id: string;
  agent_name: string;
  course_id: string;
  creator: string;
  status: number;
}

// API paths
const path = "agents";

const api = {
  addAgent: path + "/add_agent",
  deleteAgent: path + "/delete_agent",
  updateAgent: path + "/update_agent",
  getAgentbyID: path + "",
  getAgents: path + "/agents",
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
