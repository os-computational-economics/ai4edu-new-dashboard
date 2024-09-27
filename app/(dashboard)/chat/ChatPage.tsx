'use client'
import React, { useState, useEffect } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { useRouter } from 'next/navigation'
import ChatPanel from './components/ChatPanel'
import DocumentPanel from './components/DocumentPanel'

const ChatPage = ({ thread_id }) => {
  const [selectedDocumentFileID, setSelectedDocumentFileID] = useState(null)

  useEffect(() => {
    if (!thread_id) {
      router.push('/agents')
    }
  }, [thread_id, router])

  return (
    <div className="flex h-[calc(100vh-62px)]">
      <PanelGroup autoSaveId="chat-interface" direction="horizontal" className="w-full">
        <Panel defaultSize={25} maxSize={70} minSize={20}>
          <DocumentPanel selectedDocument={selectedDocumentFileID} />
        </Panel>
        <PanelResizeHandle />
        <Panel defaultSize={65} maxSize={80} minSize={30}>
          <ChatPanel thread_id={thread_id} setSelectedDocument={setSelectedDocumentFileID} />
        </Panel>
      </PanelGroup>
    </div>
  )
}

export default ChatPage
