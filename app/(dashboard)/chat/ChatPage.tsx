'use client'
import React, { useState, useEffect } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import Objectives from './components/Objectives'
import DocumentPanel from './components/DocumentPanel'
import ChatPanel from './components/ChatPanel'
import { Modal, ModalContent, ModalHeader } from '@nextui-org/react'

type Document = {
  id: number
  title: string
}

const documents: Document[] = [
  // { id: 1, title: 'Document 1' },
  // { id: 2, title: 'Document 2' },
  // { id: 3, title: 'Document 3' },
  // { id: 4, title: 'Document 4' }
]

const ChatPage = ({ isOpen, onClose, status, agent, thread, newThread }) => {
  const [selectedDocumentFileID, setSelectedDocumentFileID] = useState<Document | string | null>(null)
  const [isChatModalOpen, setIsChatModalOpen] = useState(true)

  const handleDocumentClick = (document: Document) => {
    setSelectedDocumentFileID(document)
  }

  useEffect(() => {
    console.log('$$$', agent)
  }, [agent])

  const handleModalClose = () => {
    setSelectedDocumentFileID(null)
    onClose()
  }

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        size="full"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 bg-white">
                {agent?.workspace_id} - {agent?.agent_name}
              </ModalHeader>
              <div className="flex h-[calc(100vh-62px)]">
                {/*<aside className="z-30 overflow-auto">
                  <div className="flex flex-col grow pb-20 w-full bg-white">
                    <Objectives documents={documents} onDocumentClick={handleDocumentClick} />
                  </div>
                </aside>*/}
                <PanelGroup autoSaveId="chat-interface" direction="horizontal" className="w-full">
                  <Panel defaultSize={25} maxSize={70} minSize={20}>
                    <DocumentPanel selectedDocument={selectedDocumentFileID} />
                  </Panel>
                  <PanelResizeHandle />
                  <Panel defaultSize={65} maxSize={80} minSize={30}>
                    <ChatPanel
                      agent={agent}
                      thread={thread}
                      setSelectedDocument={setSelectedDocumentFileID}
                      newThread={newThread}
                    />
                  </Panel>
                </PanelGroup>
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ChatPage
