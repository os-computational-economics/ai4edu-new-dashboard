import { useEffect, useRef } from "react";
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
} from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form";
import { addAgent, updateAgent } from "@/api/agent/agent";

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
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({});
  const allowModelChoiceValue = watch("allow_model_choice");

  useEffect(() => {
    if (allowModelChoiceValue === "true") {
      setValue("model", "");
    }
  }, [allowModelChoiceValue, setValue]);

  useEffect(() => {
    if (status === 2 && agent) {
      console.log(
        "received agent:",
        agent,
        agent.voice,
        agent.voice === true ? "true" : "false"
      );
      // Populate form fields for editing
      setValue("agent_name", agent.agent_name);
      setValue("course_id", agent.course_id);
      setValue("system_prompt", agent.system_prompt || "");
      setValue("voice", agent.voice === true ? "true" : "false");
      setValue(
        "allow_model_choice",
        agent.allow_model_choice === true ? "true" : "false"
      );
      setValue("model", agent.model);
      setValue("status", agent.status === 1 ? "true" : "false");
    }
  }, [agent, status, setValue]);

  const handleCloseModal = (reload) => {
    reset();
    onClose(reload);
  };

  const onSubmit = (data) => {
    console.log(data, agent?.agent_id);
    const adjustedData = {
      ...data,
      agent_id: agent?.agent_id,
      voice: data.voice === "true",
      allow_model_choice: data.allow_model_choice === "true",
      status: status === 1 ? 1 : data.status === "true" ? 1 : 0,
      creator: localStorage.getItem("user_id") || "test001",
    };

    console.log(adjustedData);

    if (status === 1) {
      addAgent(adjustedData)
        .then((res) => {
          console.log("Agent added successfully:", res);
          handleCloseModal(true);
        })
        .catch((err) => {
          console.error("Error adding agent:", err);
        });
    } else {
      updateAgent(adjustedData)
        .then((res) => {
          console.log("Agent updated successfully:", res);
          handleCloseModal(true);
        })
        .catch((err) => {
          console.error("Error updating agent:", err);
        });
      console.log("Update agent....");
    }
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={() => handleCloseModal(true)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        size="xl"
      >
        {/* (return event.key != enter) */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
          }}
        >
          <ModalContent>
            <ModalHeader>
              {status === 1 ? "Add New Assistant" : "Edit Assistant"}
            </ModalHeader>
            <ModalBody>
              <Controller
                name="agent_name"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input
                    {...field}
                    isRequired
                    label="Assistant Name"
                    variant="bordered"
                    fullWidth
                    errorMessage={
                      errors.agent_name && "Assistant Name is required"
                    }
                  />
                )}
              />
              <Controller
                name="course_id"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input
                    {...field}
                    isRequired
                    label="Course ID"
                    variant="bordered"
                    fullWidth
                    errorMessage={errors.course_id && "Course ID is required"}
                  />
                )}
              />
              <Controller
                name="system_prompt"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <div>
                    <Textarea
                      {...field}
                      isRequired
                      variant="bordered"
                      placeholder="Enter system prompt"
                      label="System Prompt"
                      fullWidth
                    />
                  </div>
                )}
              />
              <Controller
                name="voice"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    {...field}
                    isRequired
                    label="Enable Voice Input?"
                    fullWidth
                    errorMessage={errors.voice && "Voice Input is required"}
                    defaultSelectedKeys={[
                      status === 1
                        ? ""
                        : agent?.voice === true
                        ? "true"
                        : "false",
                    ]}
                  >
                    {selectEnableVoice.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
              <Controller
                name="allow_model_choice"
                control={control}
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    isRequired
                    label="Enable Model Selection?"
                    fullWidth
                    errorMessage={
                      errors.allow_model_choice && "Model Selection is required"
                    }
                    defaultSelectedKeys={[
                      status === 1
                        ? ""
                        : agent?.allow_model_choice === true
                        ? "true"
                        : "false",
                    ]}
                  >
                    {selectModelChoice.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
              {allowModelChoiceValue === "false" && (
                <Controller
                  name="model"
                  control={control}
                  // rules={{ required: 'This field is required' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isRequired
                      label="Which Model?"
                      fullWidth
                      errorMessage={errors.model && "Model is required"}
                      defaultSelectedKeys={[agent?.model || ""]}
                    >
                      {selectModelList.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />
              )}
              {status === 2 && (
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Assistant Status"
                      fullWidth
                      defaultSelectedKeys={[
                        agent?.status === 1 ? "true" : "false",
                      ]}
                    >
                      {selectAgentStatus.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="faded" onClick={() => handleCloseModal(false)}>
                Close
              </Button>
              <Button color="primary" type="submit">
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </div>
  );
};

export default AgentModal;
