import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Button,
  Divider,
} from "@heroui/react";
import { useState } from "react";
import ConfirmArchiveModal from "./confirm-archive-modal";

const WorkspaceDetailsModal = ({ isOpen, onClose, course }) => {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isDismissable={false}
        backdrop="blur"
      >
        <ModalContent>
          <ModalHeader>Workspace Details</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4 p-3 rounded-lg">
              <div>
                <h3 className="text-lg font-bold">{course.name}</h3>
                {course.comment && (
                  <p className="text-default-500 max-w-full">
                    {course.comment}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-default-500">Workspace ID</p>
                  <p className="font-medium">{course.id}</p>
                </div>
                <div>
                  <p className="text-sm text-default-500">Your Role</p>
                  <p className="font-medium capitalize">{course.role}</p>
                </div>
                {course.join_code && (
                  <div className="col-span-2">
                    <p className="text-sm text-default-500">Join Code</p>
                    <p className="font-medium">{course.join_code}</p>
                  </div>
                )}
              </div>

              {course.role === "teacher" && (
                <>
                  <Divider className="my-2" />
                  <div className="flex justify-end">
                    <Button
                      color="danger"
                      onClick={() => {
                        setConfirmModalOpen(true);
                      }}
                    >
                      Archive Workspace
                    </Button>
                  </div>
                </>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="faded" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ConfirmArchiveModal
        isOpen={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false);
        }}
        course={course}
      />
    </div>
  );
};

export default WorkspaceDetailsModal;
