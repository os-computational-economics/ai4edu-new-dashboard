"use client";
import React, { useState, useEffect } from "react";
import { MdArrowBackIosNew, MdAdd } from "react-icons/md";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Switch } from "@nextui-org/switch";
import {
  DropdownMenu,
  DropdownItem,
  Dropdown,
  DropdownTrigger,
} from "@nextui-org/react";
import { Selection } from "@nextui-org/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import {
  KnowledgebasePopup,
  WorkflowPopup,
} from "@/app/(dashboard)/agent-dev/dev-popups";
import { AgentResourcesPopup } from "@/app/(dashboard)/agent-dev/dev-popups";
import ChatPanel from "../chat/components/ChatPanel copy1";

const AgentDevelopment = ({ agent, onUpdate }) => {
  const [message, setMessage] = useState("");
  const [isWorkflowPopupOpen, setIsWorkflowPopupOpen] = useState(false);
  const [isKnowledgeBasePopupOpen, setIsKnowledgeBasePopupOpen] = useState(false);
  const [isAgentResourcesPopupOpen, setIsAgentResourcesPopupOpen] = useState(false);
  const [isMemoryDropdownOpen, setIsMemoryDropdownOpen] = useState(false);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const [agentName, setAgentName] = useState(agent?.agent_name || "");
  const [courseId, setCourseId] = useState(agent?.workspace_id || "");
  const [isVoiceInputEnabled, setIsVoiceInputEnabled] = useState(agent?.voice || false);
  const [isModelSelectionEnabled, setIsModelSelectionEnabled] = useState(agent?.allow_model_choice || false);
  const [localAgentModel, setLocalAgentModel] = useState(agent?.model || "openai");
  const [isAgentActive, setIsAgentActive] = useState(agent?.status === 1);
  const [basePrompt, setBasePrompt] = useState("");
  const [persona, setPersona] = useState("");
  const [selectedKnowledge, setSelectedKnowledge] = useState([]);

  useEffect(() => {
    if (agent) {
      const initialPrompt = agent.system_prompt || "";
      setBasePrompt(initialPrompt);
      setPersona(initialPrompt);

      const storedSelectedItems = localStorage.getItem('selectedKnowledgeItems');
      if (storedSelectedItems) {
        const parsedSelectedItems = JSON.parse(storedSelectedItems);
        setSelectedKnowledge(parsedSelectedItems);
        
        const updatedPersona = addKnowledgeToPersona(initialPrompt, parsedSelectedItems);
        setPersona(updatedPersona);
      }
    }
  }, [agent]);

  const handleChange = (field, value) => {
    const updatedAgent = {
      ...agent,
      [field]: value,
    };
    onUpdate(updatedAgent);

    console.log("Agent edited. Updated information:", {
      field,
      newValue: value,
      updatedAgent,
    });
  };

  const addKnowledgeToPersona = (currentPersona, knowledgeItems) => {
    return knowledgeItems.reduce((updatedPersona, item) => {
      if (!updatedPersona.includes(item.description)) {
        return `${updatedPersona} ${item.description}`.trim();
      }
      return updatedPersona;
    }, currentPersona);
  };

  const handleSelectKnowledge = (selectedItems) => {
    const previouslySelected = new Set(selectedKnowledge.map(item => item.id));
    const currentlySelected = new Set(selectedItems.map(item => item.id));
    
    let updatedPersona = persona;

    // Handle newly selected items
    selectedItems.forEach(item => {
      if (!previouslySelected.has(item.id) && !updatedPersona.includes(item.description)) {
        updatedPersona = `${updatedPersona} ${item.description}`.trim();
      }
    });

    // Handle deselected items
    selectedKnowledge.forEach(item => {
      if (!currentlySelected.has(item.id)) {
        updatedPersona = updatedPersona.replace(item.description, '').trim();
      }
    });

    setSelectedKnowledge(selectedItems);
    setPersona(updatedPersona);
    handleChange("system_prompt", updatedPersona);
  };

  const handleDeleteKnowledge = (deletedItem) => {
    const updatedSelectedKnowledge = selectedKnowledge.filter(item => item.id !== deletedItem.id);
    
    // Remove the deleted item's description from the persona
    const updatedPersona = persona.replace(deletedItem.description, "").trim();
    
    setSelectedKnowledge(updatedSelectedKnowledge);
    setPersona(updatedPersona);
    handleChange("system_prompt", updatedPersona);
  };

  const handleBasePromptChange = (e) => {
    const newBasePrompt = e.target.value;
    setBasePrompt(newBasePrompt);
    
    // Preserve existing knowledge when base prompt changes
    const updatedPersona = addKnowledgeToPersona(newBasePrompt, selectedKnowledge);
    
    setPersona(updatedPersona);
    handleChange("system_prompt", updatedPersona);
  };
  const handleAgentStatusChange = (isSelected) => {
    setIsAgentActive(isSelected);
    handleChange("status", isSelected ? 1 : 0);
  };

  const handleVoiceInputChange = (isSelected) => {
    setIsVoiceInputEnabled(isSelected);
    handleChange("voice", isSelected);
  };

  const handleModelSelectionChange = (isSelected) => {
    setIsModelSelectionEnabled(isSelected);
    handleChange("allow_model_choice", isSelected);
  };

  const handleModelChange = (keys: Selection) => {
    const selectedModel = Array.from(keys)[0] as string;
    setLocalAgentModel(selectedModel);
    handleChange("model", selectedModel);
  };

  const getModelDisplayName = (model) => {
    switch (model) {
      case "openai":
        return "OpenAI - ChatGPT";
      case "anthropic":
        return "Anthropic - Claude AI";
      default:
        return "Select a model";
    }
  };

  const renderSettingsPanel = () => (
    <div className="h-full p-2 overflow-y-auto rounded">
      <span className="font-bold flex flex-col space-y-1.5 pt-4 pl-4 pb-4 text-2xl">
        Agent Name
      </span>
      <div className="mb-4">
        <Input
          placeholder="Model Market Simulation Chatbot"
          value={agentName}
          onChange={(e) => {
            setAgentName(e.target.value);
            handleChange("agent_name", e.target.value);
          }}
          className="px-4 bg-transparent"
        />
      </div>

      <span className="font-bold flex flex-col space-y-1.5 pt-2 pl-4 pb-4 text-2xl">
        Course Name
      </span>
      <div className="mb-4">
        <Input
          placeholder="Course ID"
          value={courseId}
          onChange={(e) => {
            setCourseId(e.target.value);
            handleChange("workspace_id", e.target.value);
          }}
          className="px-4 bg-transparent"
        />
      </div>

      <span className="font-bold flex flex-col space-y-1.5 pt-2 pl-4 pb-4 text-2xl">
        Persona & Prompt
      </span>
      <div className="mb-4 px-4">
      <textarea
        className="w-full h-24 p-2 rounded-xl bg-gray-100 resize-none focus:outline-none"
        placeholder="Final prompt with knowledge"
        value={persona}
        onChange={(e) => {
          setPersona(e.target.value);
          handleChange("system_prompt", e.target.value);
        }}
        rows={4}
      />
      </div>

      <div className="pb-5 px-2 space-y-4">
        <Button
          variant="light"
          className="w-full justify-between text-lg"
          onClick={() => setIsWorkflowPopupOpen(true)}
        >
          Workflow <MdAdd size={16} />
        </Button>

        <Button
          variant="light"
          className="w-full justify-between text-lg"
          onClick={() => setIsKnowledgeBasePopupOpen(true)}
        >
          Knowledge Base <MdAdd size={16} />
        </Button>

        <Button
          variant="light"
          className="w-full justify-between text-lg"
          onClick={() => setIsAgentResourcesPopupOpen(true)}
        >
          Agent Resources <MdAdd size={16} />
        </Button>

        <div>
          <Button
            variant="light"
            className="w-full justify-between text-lg"
            onClick={() => setIsMemoryDropdownOpen(!isMemoryDropdownOpen)}
          >
            Memory <MdArrowBackIosNew size={16} />
          </Button>
          {isMemoryDropdownOpen && (
            <div className="mt-2 px-5">
              <div className="flex justify-between items-center">
                <span>Long-term Memory</span>
                <Switch
                  checked={isAgentActive}
                  onValueChange={setIsAgentActive}
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <Button
            variant="light"
            className="w-full justify-between text-lg"
            onClick={() => setIsSettingsDropdownOpen(!isSettingsDropdownOpen)}
          >
            Settings <MdArrowBackIosNew size={16} />
          </Button>
          {isSettingsDropdownOpen && (
            <div className="mt-2 space-y-2 px-5">
              <div className="flex justify-between items-center">
                <span>Agent Status</span>
                <Switch
                  isSelected={isAgentActive}
                  onValueChange={handleAgentStatusChange}
                ></Switch>
              </div>

              <div className="flex justify-between items-center">
                <span>Enable Voice Input</span>
                <Switch
                  isSelected={isVoiceInputEnabled}
                  onValueChange={handleVoiceInputChange}
                ></Switch>
              </div>

              <div className="flex justify-between items-center">
                <span> Enable Model Selection</span>
                <Switch
                  isSelected={isModelSelectionEnabled}
                  onValueChange={handleModelSelectionChange}
                ></Switch>
              </div>

              <div className="flex justify-between items-center">
                <span>Agent Model</span>
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="ghost" className="capitalize">
                      {getModelDisplayName(localAgentModel)}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Agent Model Selection"
                    variant="flat"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={new Set([localAgentModel])}
                    onSelectionChange={(keys) => handleModelChange(keys)}
                  >
                    <DropdownItem key="openai">OpenAI - ChatGPT</DropdownItem>
                    <DropdownItem key="anthropic">
                      Anthropic - Claude AI
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderChatPanel = () => (
    <div className="h-full w-full p-4 flex flex-col">
      <div className="flex-grow overflow-hidden">
        {agent ? (
          <ChatPanel agent={agent} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Agent data is not available. Please ensure an agent is selected or
            created.
          </div>
        )}
      </div>
    </div>
  );

  if (!agent) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center text-gray-500">
        Loading agent data...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <PanelGroup direction="horizontal" className="flex-grow">
        <Panel minSize={30} defaultSize={41}>
          {renderSettingsPanel()}
        </Panel>
        <PanelResizeHandle className="w-2 bg-gray-200 hover:bg-gray-300 transition-colors" />
        <Panel minSize={30}>{renderChatPanel()}</Panel>
      </PanelGroup>
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
          onSelectKnowledge={handleSelectKnowledge}
          onDeleteKnowledge={handleDeleteKnowledge}
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
    // <div className="flex flex-col h-full w-full">
    //   <PanelGroup direction="horizontal" className="flex-grow">
    //     <Panel minSize={30} defaultSize={41}>
    //       {renderSettingsPanel()}
    //     </Panel>
    //     <PanelResizeHandle className="w-2 bg-gray-200 hover:bg-gray-300 transition-colors" />
    //     <Panel minSize={30}>{renderChatPanel()}</Panel>
    //   </PanelGroup>
    //   {isWorkflowPopupOpen && (
    //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    //       <WorkflowPopup
    //         isOpen={isWorkflowPopupOpen}
    //         onClose={() => setIsWorkflowPopupOpen(false)}
    //       />
    //     </div>
    //   )}
    //   {isKnowledgeBasePopupOpen && (
    //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    //       <KnowledgebasePopup
    //         isOpen={isKnowledgeBasePopupOpen}
    //         onClose={() => setIsKnowledgeBasePopupOpen(false)}
    //         onSelectKnowledge={handleSelectKnowledge}
    //         onDeleteKnowledge={handleDeleteKnowledge}
    //       />
    //     </div>
    //   )}
    //   {isAgentResourcesPopupOpen && (
    //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    //       <AgentResourcesPopup
    //         isOpen={isAgentResourcesPopupOpen}
    //         onClose={() => setIsAgentResourcesPopupOpen(false)}
    //       />
    //     </div>
    //   )}
    // </div>
  );
};

export default AgentDevelopment;
