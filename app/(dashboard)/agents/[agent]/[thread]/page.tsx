'use client'
import React, { useState, useEffect, useContext, Suspense } from 'react'
import { getAgentByID, Agent } from '@/api/agent/agent'
import useMount from '@/components/hooks/useMount'
import ChatPage from '../../../chat/ChatPage'
import { useSearchParams } from 'next/navigation'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/navigation'

const modelList = [
  { value: 'openai', label: 'OpenAI - ChatGPT' },
  { value: 'anthropic', label: 'Anthropic - Claude AI' }
]

const Tables = ({ params }: { params: { agent: string; thread: string } }) => {
  const [agent, setAgent] = useState<Agent>()
  const [creatorId, setCreatorId] = useState('')
  const [isLoading, setisLoading] = useState(false)

  const [status, setStatus] = useState(1) // 1 - new Agent, 2 - Edit Agent
  const router = useRouter()
  const searchParams = useSearchParams()
  const newThread = searchParams.get('new_thread')

  useMount(() => {
    fetchAgent()
  })

  useEffect(() => {
    console.log('params', searchParams, newThread)
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

  const fetchAgent = () => {
    getAgentByID({ agent_id: params.agent })
      .then((res) => {
        setisLoading(false)
        setAgent(res)
        console.log(res)
      })
      .catch((error) => {
        setisLoading(false)
        console.error('Error fetching agents:', error)
      })
  }
  const closeChatModal = () => {
    // go back to previous page
    router.back()
  }

  return (
    <Suspense>
      <div className="mx-6 ">
        <ToastContainer />
        <ChatPage
          isOpen={true}
          onClose={closeChatModal}
          status={status}
          agent={agent}
          thread={params.thread}
          newThread={newThread}
        ></ChatPage>
      </div>
    </Suspense>
  )
}

export default Tables
