import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Button,
  InputOtp,
  addToast,
} from "@heroui/react";
import { useContext, useState } from "react";
import { WorkspaceContext } from "@/components/layout/layout";
import { studentJoinWorkspace } from "@/api/workspace/workspace";
import { MdInfoOutline } from "react-icons/md";
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
        addToast({
          title: "Join successful",
          color: "success",
        });
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
      <Modal
        className="mb-[25vh] md:mb-0"
        isOpen={isOpen}
        onClose={() => handleCloseModal()}
      >
        <ModalContent>
          <ModalHeader>Join Workspace</ModalHeader>
          <ModalBody>
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg">
              <div className="flex gap-1">
                <MdInfoOutline size={24} />
                <span className="text-black-100 text-sm">
                  To join a new workspace, enter the{" "}
                  <span className="font-semibold">8-digit Join Code</span>{" "}
                  provided by your instructor.
                </span>
              </div>

              <InputOtp
                length={8}
                label="Join Code"
                variant="bordered"
                isRequired
                value={workspaceJoinCode}
                onValueChange={(value) => setWorkspaceJoinCode(value)}
              />
            </div>
            {joinError && (
              <span className="text-red-700 text-sm">Incorrect joincode</span>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="faded" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={onSubmit}
              isDisabled={!workspaceJoinCode || workspaceJoinCode.length < 8}
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
