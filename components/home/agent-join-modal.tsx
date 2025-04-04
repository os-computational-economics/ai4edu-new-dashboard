import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Button,
  Input,
} from "@heroui/react";
import { useContext, useState } from "react";
import { WorkspaceContext } from "@/components/layout/layout";
import { studentJoinWorkspace } from "@/api/workspace/workspace";
import { MdInfoOutline } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { forceRefreshWorkspaceAndToken } from "@/utils/CookiesUtil";

const AgentJoinModal = ({ isOpen, onClose }) => {
  const { currentWorkspace, setCurrentWorkspace } =
    useContext(WorkspaceContext);
  const [workspaceJoinCode, setWorkspaceJoinCode] = useState("");
  const [workspacePassword, setWorkspacePassword] = useState("");
  const [joinError, setJoinError] = useState(false);

  const handleCloseModal = () => {
    setWorkspaceJoinCode("");
    setWorkspacePassword("");
    setJoinError(false);
    onClose();
  };

  const onSubmit = () => {
    const param = { workspace_join_code: workspaceJoinCode };
    studentJoinWorkspace(param)
      .then((response) => {
        toast.success(
          "Join successful"
        );
        handleCloseModal();
        setTimeout(() => {
          forceRefreshWorkspaceAndToken();
        }, 100);
        console.log("response", response);
      })
      .catch((error) => {
        console.error("Error joining workspace:", error);
        setJoinError(true);
      });
  };

  return (
    <div>
      <ToastContainer />
      <Modal
        className="mb-[25vh] md:mb-0"
        isOpen={isOpen}
        onClose={() => handleCloseModal()}
      >
        <ModalContent>
          <ModalHeader>Join Workspace</ModalHeader>
          <ModalBody>
            <div className="flex items-center gap-2 p-3 rounded-lg">
              <MdInfoOutline size={24} />
              <span className="text-black-100 text-xs">
                To join a new workspace, enter the{" "}
                <span className="font-semibold">Join Code</span> provided by
                your instructor.
              </span>
            </div>

            <Input
              size="sm"
              variant="bordered"
              label="Join Code"
              isRequired
              value={workspaceJoinCode}
              onValueChange={(value) => setWorkspaceJoinCode(value)}
              isClearable
            />
            {joinError && (
              <span className="text-red-700 text-sm">
                Incorrect joincode
              </span>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="faded" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={onSubmit}
              isDisabled={!workspaceJoinCode}
            >
              Join
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AgentJoinModal;
