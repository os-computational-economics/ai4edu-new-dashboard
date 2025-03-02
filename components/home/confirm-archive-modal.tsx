import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Button,
  Input,
} from "@nextui-org/react";
import { useState } from "react";
import { setWorkspaceStatus } from "@/api/workspace/workspace";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ping } from "@/api/auth/auth";

const ConfirmArchiveModal = ({ isOpen, onClose, course }) => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [archiveError, setArchiveError] = useState(false);

  const handleCloseModal = () => {
    setWorkspaceName("");
    setArchiveError(false);
    onClose();
  };

  const onSubmit = () => {
    const param = { workspace_name: workspaceName };
    if (workspaceName === course.name) {
      const data = {
        workspace_id: course.id,
        workspace_status: 0,
      };
      setWorkspaceStatus(data)
        .then((res) => {
          toast.success("Workspace archived successfully");
          handleCloseModal();
          setTimeout(() => {
            ping()
              .then((res) => {
                window.location.reload();
              })
              .catch((err) => {
                window.location.href = "/auth/signin";
              });
          }, 100);
          console.log("response", res);
        })
        .catch((error) => {
          console.error("Error archiving workspace:", error);
          setArchiveError(true);
        });
    } else {
      console.error("Error archiving workspace");
      setArchiveError(true);
    }
  };

  return (
    <div>
      <ToastContainer />
      <Modal isOpen={isOpen} onClose={() => handleCloseModal()}>
        <ModalContent>
          <ModalHeader>Join Workspace</ModalHeader>
          <ModalBody>
            <div className="flex items-center gap-2 p-3 rounded-lg">
              <span className="text-black-100">
                To confirm the action, enter the name of the workspace you would
                like to archive.
              </span>
            </div>

            <Input
              size="sm"
              variant="bordered"
              label="Workspace Name"
              isRequired
              value={workspaceName}
              onValueChange={(value) => setWorkspaceName(value)}
              isClearable
            />
            {archiveError && (
              <span className="text-red-700 text-sm">
                Incorrect workspace name
              </span>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="faded" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              color="danger"
              onClick={onSubmit}
              isDisabled={!workspaceName}
            >
              Archive
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ConfirmArchiveModal;
