"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, Plus, ChevronDown, Send, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { addAgent, updateAgent } from "@/api/agent/agent";
import {
  KnowledgebasePopup,
  WorkflowPopup,
} from "@/app/(dashboard)/agent-dev/dev-popups";
import { AgentResourcesPopup } from "@/app/(dashboard)/agent-dev/dev-popups";

const AgentDevelopment = ({ agent, onUpdate, status, onClose }) => {
  const [message, setMessage] = useState("");
  const [isWorkflowPopupOpen, setIsWorkflowPopupOpen] = useState(false);
  const [isKnowledgeBasePopupOpen, setIsKnowledgeBasePopupOpen] =
    useState(false);
  const [isAgentResourcesPopupOpen, setIsAgentResourcesPopupOpen] =
    useState(false);
  const [isMemoryDropdownOpen, setIsMemoryDropdownOpen] = useState(false);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const [agentName, setAgentName] = useState(agent?.agent_name || "");
  const [courseId, setCourseId] = useState(agent?.course_id || "");
  const [persona, setPersona] = useState(agent?.system_prompt || "");
  const [voiceInput, setVoiceInput] = useState(agent?.voice || false);
  const [modelSelection, setModelSelection] = useState(
    agent?.allow_model_choice || false
  );
  const [agentModel, setAgentModel] = useState(agent?.model === "openai");
  const [agentStatus, setAgentStatus] = useState(agent?.status === 1);

  useEffect(() => {
    if (agent) {
      setAgentName(agent.agent_name || "");
      setCourseId(agent.course_id || "");
      setPersona(agent.system_prompt || "");
      setAgentStatus(agent.status === 1);
      setVoiceInput(agent.voice || false);
      setModelSelection(agent.allow_model_choice || false);
      setAgentModel(agent.model === "openai");
    }
  }, [agent]);

  const handleChange = (field, value) => {
    const updatedAgent = {
      ...agent,
      [field]: value,
    };
    onUpdate(updatedAgent);
  };

  const handleStatusChange = (checked) => {
    setAgentStatus(checked);
    handleChange("status", checked ? 1 : 0);
  };

  const handleUpdate = () => {
    // Create an updated agent object with the current state values
    const updatedAgent = {
      agent_id: agent?.agent_id,
      agent_name: agentName,
      course_id: courseId,
      system_prompt: persona,
      status: agentStatus ? 1 : 0,
      voice: voiceInput,
      allow_model_choice: modelSelection,
      model: agentModel ? "openai" : "anthropic", // Adjust this based on your model selection logic
      creator: localStorage.getItem("user_id") || "",
    };

    onUpdate(updatedAgent);

    if (status === 1) {
      addAgent(updatedAgent)
        .then((res) => {
          console.log("Agent added successfully:", res);
          onClose(true);
        })
        .catch((err) => {
          console.error("Error adding agent:", err);
        });
    } else {
      updateAgent(updatedAgent)
        .then((res) => {
          console.log("Agent updated successfully:", res);
          onClose(true);
        })
        .catch((err) => {
          console.error("Error updating agent:", err);
        });
    }
  };

  const renderSettingsPanel = () => (
    <div className="h-full p-4 overflow-y-auto border-none">
      <Card className="mb-4">
        <CardHeader>Agent Name</CardHeader>
        <CardContent>
          <Input
            placeholder="Model Market Simulation Chatbot"
            value={agentName}
            onChange={(e) => {
              setAgentName(e.target.value);
              handleChange("agent_name", e.target.value);
            }}
          />
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>Course ID</CardHeader>
        <CardContent>
          <Input
            placeholder="Course ID"
            value={courseId}
            onChange={(e) => {
              setCourseId(e.target.value);
              handleChange("course_id", e.target.value);
            }}
          />
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>Persona & Prompt</CardHeader>
        <CardContent>
          <textarea
            className="w-full h-24 p-2 border rounded"
            placeholder="Design the bot's persona, features and workflows using natural language."
            value={persona}
            onChange={(e) => {
              setPersona(e.target.value);
              handleChange("system_prompt", e.target.value);
            }}
          />
        </CardContent>
      </Card>

      <div className="mb-4">
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => setIsWorkflowPopupOpen(true)}
        >
          Workflow <Plus size={16} />
        </Button>
      </div>

      <div className="mb-4">
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => setIsKnowledgeBasePopupOpen(true)}
        >
          Knowledge Base <Plus size={16} />
        </Button>
      </div>

      <div className="mb-4">
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => setIsAgentResourcesPopupOpen(true)}
        >
          Agent Resources <Plus size={16} />
        </Button>
      </div>

      <div className="mb-4">
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => setIsMemoryDropdownOpen(!isMemoryDropdownOpen)}
        >
          Memory <ChevronDown size={16} />
        </Button>
        {isMemoryDropdownOpen && (
          <div className="mt-2">
            <div className="flex justify-between items-center">
              <span>Long-term Memory</span>
              <Switch checked={agentStatus} onCheckedChange={setAgentStatus} />
            </div>
          </div>
        )}
      </div>

      <div className="mb-4">
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => setIsSettingsDropdownOpen(!isSettingsDropdownOpen)}
        >
          Settings <ChevronDown size={16} />
        </Button>
        {isSettingsDropdownOpen && (
          <div className="mt-2 space-y-2">
            <div className="flex justify-between items-center">
              <span>Agent Status</span>
              <Switch
                checked={agentStatus}
                onCheckedChange={handleStatusChange}
              />
            </div>
            <div className="flex justify-between items-center">
              <span>Agent Model</span>
              <Switch
                checked={modelSelection}
                onCheckedChange={(checked) => {
                  setModelSelection(checked);
                  handleChange("allow_model_choice", checked);
                }}
              />
            </div>
            <div className="flex justify-between items-center">
              <span>Enable Voice Input</span>
              <Switch
                checked={voiceInput}
                onCheckedChange={(checked) => {
                  setVoiceInput(checked);
                  handleChange("voice", checked);
                }}
              />
            </div>
            <div className="flex justify-between items-center">
              <span>Enable Model Selection</span>
              <Switch
                checked={modelSelection}
                onCheckedChange={setModelSelection}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderChatPanel = () => (
    <div className="h-full p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{agentName}</h2>
        <span className="text-sm text-gray-500">Preview Mode</span>
      </div>

      <div className="bg-gray-100 flex-grow mb-4 p-4 rounded overflow-y-auto">
        <div className="mb-4">
          <strong>You:</strong>
          <p>
            Lorem ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>
        </div>
        <div className="mb-4">
          <strong>{agentName}:</strong>
          <p>
            Lorem ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>
        </div>
      </div>

      <div className="flex">
        <Input
          className="flex-grow mr-2"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button>
          <Send size={16} />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full">
      <PanelGroup direction="horizontal" className="flex-grow">
        <Panel minSize={30} defaultSize={41}>
          {renderSettingsPanel()}
        </Panel>

        <PanelResizeHandle className="w-2 bg-gray-200 hover:bg-gray-300 transition-colors" />

        <Panel minSize={30}>{renderChatPanel()}</Panel>
      </PanelGroup>

      {/* Popups */}
      {isWorkflowPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <WorkflowPopup
            isOpen={isWorkflowPopupOpen}
            onClose={() => setIsWorkflowPopupOpen(false)}
          />
        </div>
      )}

      {isKnowledgeBasePopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <KnowledgebasePopup
              isOpen={isKnowledgeBasePopupOpen}
              onClose={() => setIsKnowledgeBasePopupOpen(false)}
            />
          </div>
        </div>
      )}

      {isAgentResourcesPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <AgentResourcesPopup
            isOpen={isAgentResourcesPopupOpen}
            onClose={() => setIsAgentResourcesPopupOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default AgentDevelopment;
