import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Button,
  Input,
  addToast,
} from "@heroui/react";
import { useState } from "react";
import { setWorkspaceStatus } from "@/api/workspace/workspace";
import { forceRefreshWorkspaceAndToken } from "@/utils/CookiesUtil";

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
          addToast({
            title: "Workspace archived successfully",
            color: "success",
          });
          handleCloseModal();
          setTimeout(() => {
            forceRefreshWorkspaceAndToken();
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
      <Modal
        isOpen={isOpen}
        onClose={() => handleCloseModal()}
        isDismissable={false}
      >
        <ModalContent>
          <ModalHeader>Archive Workspace</ModalHeader>
          <ModalBody>
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg">
              <span className="text-black-100 font-bold">
                To confirm the action, enter the name of the workspace you would
                like to archive:
              </span>
              <span className="text-red-700 font-bold">{course.name}</span>
              <span className="text-black-100">
                Note that the archive action might take up to 30 minutes to take
                effect for all users.
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
