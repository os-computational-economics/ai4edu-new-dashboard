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
import ConfirmArchiveModal from "./confirm-archive-modal";
  
  const ArchiveModal = ({ isOpen, onClose, course }) => {
    const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  
    return (
      <div>
        <ToastContainer />
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <ModalHeader>Archive Workspace</ModalHeader>
            <ModalBody>
              <div className="flex items-center gap-2 p-3 rounded-lg">
                <span className="text-black-100">
                    Are you sure you'd like to archive the {course.name} workspace?
                </span>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="faded" onClick={onClose}>
                Cancel
              </Button>
              <Button
                color="danger"
                onClick={() => {setConfirmModalOpen(true)}}
              >
                Archive
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <ConfirmArchiveModal isOpen={confirmModalOpen} onClose={() => {setConfirmModalOpen(false)}} course={course}/>
      </div>
    );
  };
  
  export default ArchiveModal;
  