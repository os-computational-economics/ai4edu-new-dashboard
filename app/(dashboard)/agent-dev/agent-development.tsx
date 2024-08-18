'use client'
import React, { useState, useEffect } from 'react'

import { MdArrowBackIosNew, MdKeyboardArrowDown, MdAdd } from 'react-icons/md'

import { Input } from '@nextui-org/input'
import { Button } from '@nextui-org/button'
import { Switch } from '@nextui-org/switch'
import { DropdownMenu, DropdownItem, Dropdown, DropdownTrigger, Chip } from '@nextui-org/react'
import { Selection } from '@nextui-org/react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

import { KnowledgebasePopup, WorkflowPopup } from '@/app/(dashboard)/agent-dev/dev-popups'
import { AgentResourcesPopup } from '@/app/(dashboard)/agent-dev/dev-popups'
import ChatPanelPH from '../chat/components/ChatPanelPH'
import { set } from 'react-hook-form'

const AgentDevelopment = ({ agent, onUpdate }) => {
  const [message, setMessage] = useState('')
  const [isWorkflowPopupOpen, setIsWorkflowPopupOpen] = useState(false)
  const [isKnowledgeBasePopupOpen, setIsKnowledgeBasePopupOpen] = useState(false)
  const [isAgentResourcesPopupOpen, setIsAgentResourcesPopupOpen] = useState(false)
  const [isMemoryDropdownOpen, setIsMemoryDropdownOpen] = useState(false)
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(true)
  const [agentName, setAgentName] = useState(agent?.agent_name || '')
  const [courseId, setCourseId] = useState(agent?.course_id || '')
  const [persona, setPersona] = useState(agent?.system_prompt || '')
  const [voiceInput, setVoiceInput] = useState(agent?.voice || false)
  const [files, setFiles] = useState(agent?.agent_files || {})
  const [modelSelection, setModelSelection] = useState(agent?.allow_model_choice || false)
  const [agentModel, setAgentModel] = useState(agent?.model === 'openai')
  const [localAgentModel, setLocalAgentModel] = useState(agent?.model || 'openai')

  const [agentStatus, setAgentStatus] = useState(agent?.status === 1)

  useEffect(() => {
    console.log('Agent:', agent)
    if (agent) {
      setAgentName(agent.agent_name || '')
      setCourseId(agent.course_id || '')
      setPersona(agent.system_prompt || '')
      setAgentStatus(agent.status === 1)
      setVoiceInput(agent.voice || false)
      setModelSelection(agent.allow_model_choice || false)
      setAgentModel(agent.model === 'openai')
      setLocalAgentModel(agent.model || 'openai')
      setFiles(agent.agent_files || {})
    } else {
      // clear all fields
      resetFields()
    }
  }, [agent])

  const resetFields = () => {
    setAgentName('')
    setCourseId('')
    setPersona('')
    setVoiceInput(false)
    setFiles({})
    setModelSelection(false)
    setAgentModel(false)
    setLocalAgentModel('openai')
  }

  const handleChange = (field, value) => {
    const updatedAgent = {
      ...agent,
      [field]: value
    }
    onUpdate(updatedAgent)
  }
  const handleStatusChange = (checked) => {
    setAgentStatus(checked)
    handleChange('status', checked ? 1 : 0)
  }

  const handleModelChange = (keys: Selection) => {
    console.log('Selected model:', keys)
    const selectedModel = Array.from(keys)[0] as string
    setLocalAgentModel(selectedModel)
    handleChange('model', selectedModel)
  }

  const handleFilesChange = (files) => {
    setFiles(files)
    handleChange('agent_files', files)
  }

  const getModelDisplayName = (model) => {
    switch (model) {
      case 'openai':
        return 'OpenAI - ChatGPT'
      case 'anthropic':
        return 'Anthropic - Claude AI'
      default:
        return 'Select a model'
    }
  }

  const renderSettingsPanel = () => (
    <div className="h-full p-2 overflow-y-auto rounded">
      <span className="font-bold flex flex-col space-y-1.5 pt-4 pl-4 pb-4 text-2xl">Agent Name</span>
      <div className="mb-4">
        <Input
          placeholder="Agent Name"
          value={agentName}
          onChange={(e) => {
            setAgentName(e.target.value)
            handleChange('agent_name', e.target.value)
          }}
          className="px-4 bg-transparent"
        />
      </div>

      {/* <span className="font-bold flex flex-col space-y-1.5 pt-2 pl-4 pb-4 text-2xl">Course ID</span>
      <div className="mb-4">
        <Input
          placeholder="Course ID"
          value={courseId}
          onChange={(e) => {
            setCourseId(e.target.value)
            handleChange('course_id', e.target.value)
          }}
          className="px-4 bg-transparent"
        />
      </div> */}

      <span className="font-bold flex flex-col space-y-1.5 pt-2 pl-4 pb-4 text-2xl">Persona & Prompt</span>
      <div className="mb-4 px-4">
        <textarea
          className="w-full h-24 p-2 rounded-xl bg-gray-100 resize-none focus:outline-none"
          placeholder="Design the bot's persona, features and workflows using natural language."
          value={persona}
          onChange={(e) => {
            setPersona(e.target.value)
            handleChange('system_prompt', e.target.value)
          }}
        />
      </div>

      <div className="pb-5 px-2 space-y-4">
        <Button
          isDisabled
          variant="light"
          className="w-full justify-between text-lg"
          onClick={() => setIsWorkflowPopupOpen(true)}
        >
          <div>
            Workflow <span className="text-gray-400 text-s">(upcoming feature)</span>
          </div>{' '}
          <MdAdd size={16} />
        </Button>

        <Button
          variant="light"
          className="w-full justify-between text-lg"
          onClick={() => setIsKnowledgeBasePopupOpen(true)}
        >
          Knowledge Base <MdAdd size={16} />
        </Button>

        <Button
          isDisabled
          variant="light"
          className="w-full justify-between text-lg"
          onClick={() => setIsAgentResourcesPopupOpen(true)}
        >
          <div>
            Agent Resources <span className="text-gray-400 text-s">(upcoming feature)</span>
          </div>{' '}
          <MdAdd size={16} />
        </Button>

        {/* <div>
          <Button
            variant="light"
            className="w-full justify-between text-lg"
            onClick={() => setIsMemoryDropdownOpen(!isMemoryDropdownOpen)}
          >
            Memory <MdArrowBackIosNew size={16} />
          </Button>
          {isMemoryDropdownOpen && (
            <div className="mt-2 px-5">
              <div className="flex justify-between items-center">
                <span>Long-term Memory</span>
                <Switch checked={agentStatus} onValueChange={setAgentStatus} />
              </div>
            </div>
          )}
        </div> */}

        <div>
          <Button
            variant="light"
            className="w-full justify-between text-lg"
            onClick={() => setIsSettingsDropdownOpen(!isSettingsDropdownOpen)}
          >
            Settings
            {isSettingsDropdownOpen ? <MdKeyboardArrowDown size={16} /> : <MdArrowBackIosNew size={16} />}
          </Button>
          {isSettingsDropdownOpen && (
            <div className="mt-2 space-y-2 px-5">
              <div className="flex justify-between items-center">
                <div>Agent Status </div>
                <div>
                  <Switch isSelected={agentStatus} onValueChange={handleStatusChange} />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span>Enable Voice Input</span>
                <Switch
                  isSelected={voiceInput}
                  onValueChange={(checked) => {
                    setVoiceInput(checked)
                    handleChange('voice', checked)
                  }}
                />
              </div>
              <div className="flex justify-between items-center">
                <span>Enable Model Selection</span>
                <Switch
                  isSelected={modelSelection}
                  onValueChange={(checked) => {
                    setModelSelection(checked)
                    handleChange('allow_model_choice', checked)
                  }}
                />
              </div>
              <div className="flex justify-between items-center">
                <span>Agent Model</span>
                <Dropdown isDisabled={!modelSelection}>
                  <DropdownTrigger>
                    <Button variant="ghost" className="capitalize">
                      {getModelDisplayName(localAgentModel)}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Agent Model Selection"
                    variant="flat"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={new Set([localAgentModel])}
                    onSelectionChange={(keys) => handleModelChange(keys)}
                  >
                    <DropdownItem key="openai">OpenAI - ChatGPT</DropdownItem>
                    <DropdownItem key="anthropic">Anthropic - Claude AI</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
  const renderChatPanel = () => (
    <div className="h-full w-full p-4 flex flex-col">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-2xl font-bold">{agentName || 'Agent'}</h2>
        <span className="text-sm text-gray-500">
          <Chip color="warning" variant="bordered">
            Preview Mode
          </Chip>
        </span>
      </div>
      <div className="flex-grow h-80">
        <ChatPanelPH agent={agent} />
      </div>
      <div className="h-2"></div>
    </div>
  )
  // if (!agent) {
  //   return (
  //     <div className="flex flex-col h-full w-full items-center justify-center text-gray-500">
  //       Loading agent data...
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col h-full w-full">
      <PanelGroup direction="horizontal" className="flex-grow">
        <Panel minSize={30} defaultSize={41}>
          {renderSettingsPanel()}
        </Panel>
        <PanelResizeHandle className="w-2 bg-gray-200 hover:bg-gray-300 transition-colors" />
        <Panel minSize={30}>{renderChatPanel()}</Panel>
      </PanelGroup>
      {isWorkflowPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <WorkflowPopup isOpen={isWorkflowPopupOpen} onClose={() => setIsWorkflowPopupOpen(false)} />
        </div>
      )}
      {isKnowledgeBasePopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <KnowledgebasePopup
              isOpen={isKnowledgeBasePopupOpen}
              onClose={() => setIsKnowledgeBasePopupOpen(false)}
              files={files}
              setFiles={handleFilesChange}
            />
          </div>
        </div>
      )}
      {isAgentResourcesPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <AgentResourcesPopup isOpen={isAgentResourcesPopupOpen} onClose={() => setIsAgentResourcesPopupOpen(false)} />
        </div>
      )}
    </div>
  )
}
export default AgentDevelopment
