import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";

const CreateKnowledgebasePopup = ({ isOpen, onClose, onCreateKnowledgebase }) => {
  const [knowledgeName, setKnowledgeName] = useState("");
  const [knowledgeDescription, setKnowledgeDescription] = useState("");

  const handleCreate = () => {
    onCreateKnowledgebase(knowledgeName, knowledgeDescription);
    setKnowledgeName("");
    setKnowledgeDescription("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Create New Knowledge
            </ModalHeader>
            <ModalBody>
              <Input
                label="Workflow Name"
                placeholder="Enter knowledge name"
                value={knowledgeName}
                onChange={(e) => setKnowledgeName(e.target.value)}
              />
              <Input
                label="Workflow Description"
                placeholder="Enter knowledge description"
                value={knowledgeDescription}
                onChange={(e) => setKnowledgeDescription(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleCreate}>
                Create
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateKnowledgebasePopup;
