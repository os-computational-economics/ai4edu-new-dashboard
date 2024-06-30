import { useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  Link,
} from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form";
import { addAgent, updateAgent } from "@/api/agent/agent";
import { useRouter } from "next/navigation";
import AgentDevelopment from "../../agent-dev/agent-development";
import { ChevronLeft, Plus, ChevronDown, Send } from "lucide-react";

const selectEnableVoice = [
  { value: "true", label: "Enable" },
  { value: "false", label: "Disable" },
];

const selectModelChoice = [
  { value: "true", label: "Enable" },
  { value: "false", label: "Disable" },
];

const selectAgentStatus = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const selectModelList = [
  { value: "openai", label: "OpenAI - ChatGPT" },
  { value: "anthropic", label: "Anthropic - Claude AI" },
];

const AgentModal = ({ isOpen, onClose, status, agent }) => {
  const [currentAgent, setCurrentAgent] = useState(agent);

  useEffect(() => {
    setCurrentAgent(agent);
  }, [agent]);

  const handleUpdate = () => {
    const adjustedData = {
      ...currentAgent,
      agent_id: agent?.agent_id,
      voice: currentAgent.voice === true,
      allow_model_choice: currentAgent.allow_model_choice === true,
      status: currentAgent.status === 1 ? 1 : 0,
      creator: localStorage.getItem("user_id") || "test001",
    };

    if (status === 1) {
      addAgent(adjustedData)
        .then((res) => {
          console.log("Agent added successfully:", res);
          onClose(true);
        })
        .catch((err) => {
          console.error("Error adding agent:", err);
        });
    } else {
      updateAgent(adjustedData)
        .then((res) => {
          console.log("Agent updated successfully:", res);
          onClose(true);
        })
        .catch((err) => {
          console.error("Error updating agent:", err);
        });
    }
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        size="full"
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <>
              <header className="bg-gray-100 p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Button variant="ghost" className="border-none">
                    <ChevronLeft onClick={onClose} size={24} />
                  </Button>
                  <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">{currentAgent?.agent_name || "Agent Name"}</h1>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <span className="text-sm mr-2">{currentAgent?.course_id || "Course ID"} </span>
                      <span className="mr-2">
                        {currentAgent?.status === 1 ? "Active" : "Inactive"}
                      </span>
                      <span>{new Date().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <h2 className="text-2xl font-bold">Agent Development Mode</h2>
                </div>
                <div>
                  <Button onClick={handleUpdate}>Publish Agent</Button>
                </div>
              </header>
              <div className="flex h-[calc(100vh-62px)]">
                <AgentDevelopment agent={currentAgent} onUpdate={setCurrentAgent} status={status} onClose={onClose}/>
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AgentModal;