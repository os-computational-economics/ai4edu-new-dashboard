import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";

const CreateWorkflowPopup = ({ isOpen, onClose, onCreateWorkflow }) => {
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');

  const handleCreate = () => {
    onCreateWorkflow(workflowName, workflowDescription);
    setWorkflowName('');
    setWorkflowDescription('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Create New Workflow</ModalHeader>
            <ModalBody>
              <Input
                label="Workflow Name"
                placeholder="Enter workflow name"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
              />
              <Input
                label="Workflow Description"
                placeholder="Enter workflow description"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
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

export default CreateWorkflowPopup;