'use client'
import { useEffect, useState, useContext } from 'react'

import { Modal, ModalContent, Button } from "@heroui/react"
import { addAgent, updateAgent, UpdateAgentRequest } from '@/api/agent/agent'
import { MdArrowBackIosNew } from 'react-icons/md'
import { WorkspaceContext } from '@/components/layout/layout'

import AgentDevelopment from '../../agent-dev/agent-development'

const AgentModal = ({ isOpen, onClose, status, agent }) => {
  const [currentAgent, setCurrentAgent] = useState(agent)
  const [isLoading, setIsLoading] = useState(false)
  const { currentWorkspace, setCurrentWorkspace } = useContext(WorkspaceContext)

  useEffect(() => {
    setCurrentAgent(agent)
  }, [agent])

  const handleUpdate = () => {
    const adjustedData: UpdateAgentRequest = {
      ...currentAgent,
      agent_id: agent?.agent_id,
      voice: currentAgent.voice === true,
      allow_model_choice: currentAgent.allow_model_choice === true,
      status: currentAgent.status === 1 ? 1 : 0,
      student_id: localStorage.getItem('user_id') || 'test001',
      workspace_id: currentWorkspace?.id || JSON.parse(localStorage.getItem('workspace')!)?.id
    }

    setIsLoading(true)

    if (status === 1) {
      addAgent(adjustedData)
        .then((res) => {
          console.log('Agent added successfully:', res)
          setIsLoading(false)
          onClose(true)
        })
        .catch((err) => {
          console.error('Error adding agent:', err)
          setIsLoading(false)
        })
    } else {
      updateAgent(adjustedData)
        .then((res) => {
          console.log('Agent updated successfully:', res)
          setIsLoading(false)
          onClose(true)
        })
        .catch((err) => {
          console.error('Error updating agent:', err)
          setIsLoading(false)
        })
    }
  }

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        size="full"
        hideCloseButton
        className="m-0 p-0"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <header className="w-full border-b-1 p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Button variant="light" className="border-none" onClick={onClose}>
                    <MdArrowBackIosNew className="mr-2" size={24} />
                  </Button>
                  <div className="flex flex-col ml-3 max-w-xs">
                    <h1
                      className="text-2xl font-bold truncate"
                      style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      {currentAgent?.agent_name || 'Agent Name'}
                    </h1>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <span className="text-sm mr-2">
                        {JSON.parse(localStorage.getItem('workspace')!)?.id || 'Course ID'}{' '}
                      </span>
                      <span className="mr-2">{currentAgent?.status === 1 ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <h2 className="text-2xl font-bold">Agent Development Mode</h2>
                </div>
                <div>
                  <Button className="bg-blue-500 text-white " disabled={!currentAgent?.agent_name || !currentAgent?.system_prompt} isLoading={isLoading} onClick={handleUpdate}>
                    {isLoading ? 'Publishing...' : 'Publish Agent'}
                  </Button>
                </div>
              </header>
              <div className="flex h-[calc(100vh-62px)]">
                <AgentDevelopment agent={currentAgent} onUpdate={setCurrentAgent} />
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
export default AgentModal
