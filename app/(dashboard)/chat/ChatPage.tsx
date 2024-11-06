"use client";
import React, { useState, useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import DocumentPanel from "./components/DocumentPanel";
import ChatPanel from "./components/ChatPanel";
import { Modal, ModalContent, ModalHeader, Button } from "@nextui-org/react";
import { GripVertical } from "lucide-react";
import { submitRating } from "@/api/feedback/feedback";
import { THREAD_RATING_TRIGGER_PROBABILITY } from "@/utils/constants";

type Document = {
  id: number;
  title: string;
};

const ChatPage = ({ isOpen, onClose, status, agent, thread }) => {
  const [selectedDocumentFileID, setSelectedDocumentFileID] = useState<
    Document | string | null
  >(null);
  const [selectedDocumentPage, setSelectedDocumentPage] = useState<number>(1);
  const [isChatModalOpen, setIsChatModalOpen] = useState(true);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [rating, setRating] = useState(null);

  const handleDocumentClick = (document: Document) => {
    setSelectedDocumentFileID(document);
  };

  useEffect(() => {
    console.log("$$$", agent);
  }, [agent]);

  const handleModalClose = () => {
    setSelectedDocumentFileID(null);
    // get the current path in the address bar
    const currentPath = window.location.pathname;
    if (currentPath.includes("/new")) {
      // do not trigger rating modal for new threads with no messages
      onClose();
      return;
    }
    // trigger rating modal according to the probability
    if (Math.random() < THREAD_RATING_TRIGGER_PROBABILITY) {
      setIsRatingModalOpen(true);
    } else {
      onClose();
    }
  };

  const handleRating = (rating) => {
    if (thread === "new") {
      // update the thread id to the current thread id
      // get the current path in the address bar
      const currentPath = window.location.pathname;
      // the thread id is the last part of the path
      thread = currentPath.split("/").pop();
    }
    if (thread && rating) {
      submitRating({ thread_id: thread, rating: rating })
        .then(() => {
          setIsRatingModalOpen(false);
          onClose();
        })
        .catch(() => {
          onClose();
        });
    }
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        size="full"
        className="dark:bg-black"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {agent?.workspace_id} - {agent?.agent_name}
              </ModalHeader>
              <div className="flex h-[calc(100vh-62px)]">
                {/*<aside className="z-30 overflow-auto">
                  <div className="flex flex-col grow pb-20 w-full bg-white">
                    <Objectives documents={documents} onDocumentClick={handleDocumentClick} />
                  </div>
                </aside>*/}
                <PanelGroup
                  autoSaveId="chat-interface"
                  direction="horizontal"
                  className="w-full"
                >
                  <Panel defaultSize={25} maxSize={70} minSize={20}>
                    <DocumentPanel
                      selectedDocument={selectedDocumentFileID}
                      selectedDocumentPage={selectedDocumentPage}
                    />
                  </Panel>
                  <PanelResizeHandle>
                    <div
                      className={`flex flex-col rounded-lg h-full items-center my-2 justify-center w-2 bg-gray-200 hover:bg-gray-300 dark:bg-[#191919] dark:hover:bg-[#1d1d1d] transition-colors cursor-col-resize`}
                      style={{ height: "calc(100% - 1rem)" }}
                    >
                      <GripVertical className="w-4 h-4 text-gray-400" />
                    </div>
                  </PanelResizeHandle>
                  <Panel defaultSize={65} maxSize={80} minSize={30}>
                    <ChatPanel
                      agent={agent}
                      thread={thread}
                      setSelectedDocument={setSelectedDocumentFileID}
                      setSelectedDocumentPage={setSelectedDocumentPage}
                    />
                  </Panel>
                </PanelGroup>
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isRatingModalOpen} onClose={() => onClose()} size="md">
        <ModalContent>
          <ModalHeader>How do you feel about this conversation?</ModalHeader>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span>Not helpful</span>
              <span>Very helpful</span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <Button
                  key={value}
                  variant="light"
                  onClick={() => handleRating(value)}
                >
                  {value}
                </Button>
              ))}
            </div>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ChatPage;
