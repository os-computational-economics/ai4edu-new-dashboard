'use client'
import React, { useState } from 'react'
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
  Tooltip
} from '@nextui-org/react'
import { getAgents } from '@/api/agent/agent'
import { MdCached, MdAdd, MdModeEditOutline, MdDeleteOutline, MdShare } from 'react-icons/md'
import useMount from '@/components/hooks/useMount'
import AgentModal from './agents-modal/AgentModal'
import ConfirmDeleteModal from './agents-modal/ConfirmDeleteModal'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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

const Tables = () => {
  const [agents, setAgents] = useState([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [creatorId, setCreatorId] = useState('')
  const [isLoading, setisLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const [status, setStatus] = useState(1) // 1 - new Agent, 2 - Edit Agent
  const [currentAgent, setCurrentAgent] = useState(null)

  const totalPage = Math.ceil(total / pageSize)

  useMount(() => {
    fetchAgents(currentPage, pageSize)
  })

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
      creator: creatorId || localStorage.getItem('user_id') || 'test001'
    }

    getAgents(params)
      .then((res) => {
        console.log(res)
        setisLoading(false)
        setAgents(res.agents)
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

  const closeModal = (reload) => {
    console.log('close modal', reload)
    handleSearch(reload)
    setIsModalOpen(false)
  }

  const closeDeleteModal = (reload) => {
    handleSearch(reload)
    setIsDeleteModalOpen(false)
  }

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          {/* TODO: we don't need search by case id, this is just mocking the searching function */}
          <div className={'w-full  sm:max-w-[44%]'}></div>
          {/* <Input
            isClearable
            classNames={{
              base: 'w-full sm:max-w-[44%]',
              inputWrapper: 'border-1',
            }}
            placeholder="Search by CASE ID..."
            size="sm"
            startContent={<MdSearch className="text-default-300" />}
            variant="bordered"
            value={creatorId}
            onChange={handleCreatorIdChange}
            onClear={() => {
              setCreatorId('');
              fetchAgents(1, pageSize);
            }}
          /> */}
          <div className="flex gap-3">
            <Button
              variant="bordered"
              size="sm"
              color="default"
              onClick={() => handleSearch(true)}
              isLoading={isLoading}
              endContent={<MdCached />}
            >
              Reload List
            </Button>
            <Button
              onClick={() => {
                setStatus(1)
                openModal()
              }}
              className="bg-foreground text-background"
              endContent={<MdAdd />}
              size="sm"
            >
              Add New
            </Button>
          </div>
        </div>
      </div>
    )
  }, [creatorId, isLoading])

  const renderActions = (agent) => {
    return (
      <div className="relative flex items-center gap-2">
        {/* <Button isIconOnly size="md" variant="flat">
          <MdReadMore></MdReadMore>
        </Button> */}
        <Tooltip content="Share">
          <Button isIconOnly size="md" variant="flat" color="primary" onClick={() => CopyToClipboard(agent)}>
            <MdShare />
          </Button>
        </Tooltip>
        <Tooltip content="Edit">
          <Button
            isIconOnly
            size="md"
            variant="flat"
            onClick={() => {
              setStatus(2) // Set status to edit
              setCurrentAgent(agent) // Set the current agent being edited
              openModal()
            }}
          >
            <MdModeEditOutline></MdModeEditOutline>
          </Button>
        </Tooltip>
        <Tooltip content="Delete">
          <Button
            isIconOnly
            size="md"
            variant="flat"
            color="danger"
            onClick={() => {
              setCurrentAgent(agent)
              setIsDeleteModalOpen(true)
            }}
          >
            <MdDeleteOutline color="red"></MdDeleteOutline>
          </Button>
        </Tooltip>
      </div>
    )
  }

  return (
    <div className='m-6'>
      <ToastContainer />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        agent={currentAgent}
      ></ConfirmDeleteModal>
      <AgentModal isOpen={isModalOpen} onClose={closeModal} status={status} agent={currentAgent} />
      <Table
        topContent={topContent}
        topContentPlacement="outside"
        aria-label="Agents List"
        bottomContent={
          totalPage > 0 && (
            <div>
              <div className="flex h-full w-full items-center justify-center">
                <Pagination isDisabled={isLoading} page={currentPage} total={totalPage} onChange={handlePageChange} />
                <div className="ml-8 text-small text-default-600"> Total {total} agents</div>
              </div>
            </div>
          )
        }
      >
        <TableHeader>
          <TableColumn key="agent_name">Agent Name</TableColumn>
          <TableColumn key="voice" align="center">
            Voice
          </TableColumn>
          <TableColumn key="allow_model_choice" align="center">
            Allow Model Choice
          </TableColumn>
          <TableColumn key="model">Model</TableColumn>
          <TableColumn key="status">Status</TableColumn>
          <TableColumn key="updated_at">Last Updated</TableColumn>
          <TableColumn key="actions" align="center" className="px-14">
            Actions
          </TableColumn>
        </TableHeader>
        <TableBody
          items={agents}
          isLoading={isLoading}
          emptyContent="No agents found"
          loadingContent={
            <div>
              <Spinner label="Loading..." />
            </div>
          }
        >
          {agents.map((agent) => (
            <TableRow key={agent.agent_id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-bold text-sm">{agent.agent_name}</span>
                  <span className="text-bold text-sm capitalize text-default-400">{agent.course_id}</span>
                </div>
              </TableCell>
              <TableCell>
                <Chip color={statusColorMap[agent.voice.toString()]} size="sm" variant="flat">
                  {agent.voice ? 'Active' : 'Disabled'}
                </Chip>
              </TableCell>
              <TableCell>
                <Chip color={statusColorMap[agent.allow_model_choice.toString()]} size="sm" variant="flat">
                  {agent.allow_model_choice ? 'Active' : 'Disabled'}
                </Chip>
              </TableCell>
              <TableCell>
                {modelList.map((model) => {
                  if (model.value === agent.model) {
                    return model.label
                  }
                })}
              </TableCell>
              <TableCell>
                <Chip color={statusColorMap[agent.status]} size="sm" variant="flat">
                  {agent.status ? 'Active' : 'Disabled'}
                </Chip>
              </TableCell>
              <TableCell>{new Date(`${agent.updated_at}Z`).toLocaleString()}</TableCell>
              <TableCell>{renderActions(agent)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default Tables
