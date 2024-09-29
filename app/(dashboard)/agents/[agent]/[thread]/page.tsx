'use client'
import React, { useState, useEffect, useContext, Suspense } from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Chip,
  Spinner,
  Pagination,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader
} from '@nextui-org/react'
import { getAgents, Agent } from '@/api/agent/agent'
import { MdCached, MdAdd, MdModeEditOutline, MdDeleteOutline, MdMessage } from 'react-icons/md'
import useMount from '@/components/hooks/useMount'
import AgentModal from '../../agents-modal/AgentModal'
import ConfirmDeleteModal from '../../agents-modal/ConfirmDeleteModal'
import ChatPage from '../../../chat/ChatPage'
import { WorkspaceContext } from '@/components/layout/layout'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/router'

const statusColorMap = {
  true: 'success',
  false: 'danger',
  1: 'success', // Active
  2: 'danger' // Inactive
}

const modelList = [
  { value: 'openai', label: 'OpenAI - ChatGPT' },
  { value: 'anthropic', label: 'Anthropic - Claude AI' }
]

const Tables = ({params} : {params: {agent: string, thread: string}}) => {
  const [agents, setAgents] = useState<Agent[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [creatorId, setCreatorId] = useState('')
  const [isLoading, setisLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isChatModalOpen, setIsChatModalOpen] = useState(true)
  const { currentWorkspace, setCurrentWorkspace } = useContext(WorkspaceContext)

  const [status, setStatus] = useState(1) // 1 - new Agent, 2 - Edit Agent
  const [currentAgent, setCurrentAgent] = useState(null)

  const totalPage = Math.ceil(total / pageSize)
  

  useMount(() => {
    fetchAgents(currentPage, pageSize)
  })


  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCreatorId(localStorage.getItem('user_id') || 'test001')
    }
  }, [])

  const generateShareUrl = (agent) => {
    const baseUrl = 'https://chat.ai4edu.io'
    const url = `${baseUrl}/agent/${agent.agent_id}`
    return url
  }

  const CopyToClipboard = (agent) => {
    navigator.clipboard.writeText(generateShareUrl(agent))
    toast.success('Copied to clipboard!', {
      hideProgressBar: true,
      autoClose: 2000
    })
  }

  const fetchAgents = (page, pageSize) => {
    const params = {
      page,
      page_size: pageSize,
      workspace_id: currentWorkspace?.id || JSON.parse(localStorage.getItem('workspace')!)?.id
    }

    getAgents(params)
      .then((res) => {
        setisLoading(false)
        setAgents(res.agents)
        console.log("Agents")
        console.log(res.agents)
        setTotal(res.total)
      })
      .catch((error) => {
        setisLoading(false)
        console.error('Error fetching agents:', error)
      })
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    setisLoading(true)
    fetchAgents(page, pageSize)
  }

  const handleSearch = (reload) => {
    if (reload) {
      setisLoading(true)
      setCurrentPage(1) // Reset to first page for new search

      fetchAgents(1, pageSize)
    }
  }

  const openModal = () => setIsModalOpen(true)

  const openChatModal = () => {
    console.log('123')
    setIsChatModalOpen(true)
  }

  const closeChatModal = () => setIsChatModalOpen(false)

  const closeModal = (reload) => {
    console.log('close modal', reload)
    handleSearch(reload)
    setIsModalOpen(false)
  }

  const closeDeleteModal = (reload) => {
    handleSearch(reload)
    setIsDeleteModalOpen(false)
  }

  console.log("agents!!", agents)
  console.log(params.agent)
  return (
    <Suspense>
    <div className="mx-6 ">
      <ToastContainer />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        agent={currentAgent}
      ></ConfirmDeleteModal>
      <ChatPage isOpen={true} onClose={closeChatModal} status={status} agent={agents.filter(e => e.agent_id == params.agent)[0]} thread={params.thread}></ChatPage>
    </div>
    </Suspense>
  )
}

export default Tables
