import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Button,
} from "@nextui-org/react";
import { deleteAgent } from "@/api/agent/agent";

const AgentModal = ({ isOpen, onClose, agent }) => {
  const handleCloseModal = (reload) => {
    onClose(reload);
  };

  const onSubmit = () => {
    const data = { agent_id: agent?.agent_id };
    deleteAgent(data)
      .then((res) => {
        console.log("Assistant deleted successfully:", res);
        handleCloseModal(true);
      })
      .catch((err) => {
        console.error("Error deleting assistant:", err);
      });
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={() => handleCloseModal(true)}>
        <ModalContent>
          <ModalHeader>Delete Assistant</ModalHeader>
          <ModalBody>
            <p>
              Your action will delete{" "}
              <span className="text-black-600 text-lg font-semibold">
                {agent?.agent_name}
              </span>{" "}
              immediately.
            </p>
            <p>Are you sure you want to proceed with deletion?</p>
            <p>
              This action is irreversible and will permanently remove the
              assistant. All users will lose access immediately.
            </p>
          </ModalBody>

          <ModalFooter>
            <Button variant="faded" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button color="danger" onClick={onSubmit}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AgentModal;
