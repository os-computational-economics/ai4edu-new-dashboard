import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Button,
  Input,
} from "@nextui-org/react";
import { useContext, useState } from "react";
import { WorkspaceContext } from "@/components/layout/layout";
import { studentJoinWorkspace } from "@/api/workspace/workspace";
import { MdInfoOutline } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { ping } from "@/api/auth/auth";

const AgentJoinModal = ({ isOpen, onClose }) => {
  const { currentWorkspace, setCurrentWorkspace } =
    useContext(WorkspaceContext);
  const [workspaceID, setWorkspaceID] = useState("");
  const [workspacePassword, setWorkspacePassword] = useState("");

  const handleCloseModal = () => {
    setWorkspaceID("");
    setWorkspacePassword("");
    onClose();
  };

  const onSubmit = () => {
    const param = { workspace_id: workspaceID, password: workspacePassword };
    studentJoinWorkspace(param)
      .then((response) => {
        toast.success(
          "Join successful, please logout and login again to see the changes"
        );
        handleCloseModal();
        const firstLevelDomain =
          "." + window.location.hostname.split(".").slice(-2).join(".");
        Cookies.remove("access_token", { domain: firstLevelDomain });
        setTimeout(() => {
          ping()
            .then((res) => {
              window.location.reload();
            })
            .catch((err) => {
              window.location.href = "/auth/signin";
            });
        }, 100);
        console.log("response", response);
      })
      .catch((error) => {
        console.error("Error joining workspace:", error);
      });
  };

  return (
    <div>
      <ToastContainer />
      <Modal isOpen={isOpen} onClose={() => handleCloseModal()}>
        <ModalContent>
          <ModalHeader>Join Workspace</ModalHeader>
          <ModalBody>
            <div className="flex items-center gap-2 p-3 rounded-lg">
              <MdInfoOutline size={24} />
              <span className="text-black-100 text-xs">
                To join a new workspace, enter the{" "}
                <span className="font-semibold">Workspace ID</span> and
                <span className="font-semibold"> Workspace Password</span>{" "}
                provided by your instructor.
              </span>
            </div>

            <Input
              size="sm"
              variant="bordered"
              label="Workspace ID"
              isRequired
              value={workspaceID}
              onValueChange={(value) => setWorkspaceID(value)}
              isClearable
            />
            <Input
              size="sm"
              variant="bordered"
              label="Workspace Password"
              isRequired
              value={workspacePassword}
              onValueChange={(value) => setWorkspacePassword(value)}
              isClearable
            />
          </ModalBody>

          <ModalFooter>
            <Button variant="faded" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={onSubmit}
              isDisabled={!workspaceID || !workspacePassword}
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
