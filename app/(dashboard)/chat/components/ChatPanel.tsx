// @ts-nocheck
'use client'
import React, { useEffect, useState, useRef } from 'react'
import { Card, Textarea, ScrollShadow, Button } from '@nextui-org/react'
import { MdAttachFile } from 'react-icons/md'
import { testQueryURL, getNewThread } from '@/api/chat/chat'
import Cookies from 'js-cookie'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import { preprocessLaTeX } from '@/utils/CustomMessageRender'
import 'katex/dist/katex.min.css' // CSS for LaTeX rendering
import 'highlight.js/styles/atom-one-dark.min.css' // CSS for code highlighting
import { FileUploadForm } from './FileUpload'

function Message({ content, align }: { content: string; align: string }) {
  const className = align === 'end' ? 'bg-black text-white font-medium self-end max-w-3/4' : 'bg-neutral-200 max-w-3/4'
  const additionalClasses = 'rounded-2xl px-4 py-2'

  return (
    <div className={`flex flex-col items-${align} my-1 font-medium text-black max-md:pr-5 max-md:max-w-full`}>
      <div className={`${className} ${additionalClasses}`}>
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex, rehypeHighlight]}>
          {preprocessLaTeX(content)}
        </ReactMarkdown>
      </div>
    </div>
  )
}

function InputMessage({
  placeholder,
  message,
  setMessage,
  sendMessage
}: {
  placeholder: string
  message: string
  setMessage: (value: string) => void
  sendMessage: () => void
}) {
  return (
    <div className="flex gap-2 px-4 py-2 inset-x-0 bottom-0 bg-white rounded-xl border border-solid border-neutral-200 text-zinc-500">
      <Textarea
        placeholder={placeholder}
        className="flex-grow"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
          }
        }}
      />
      <FileUploadForm />
      <Button onPress={sendMessage}>Send</Button>
    </div>
  )
}

const ChatPanel = ({ agent }) => {
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [threadId, setThreadId] = useState(localStorage.getItem('threadIdLocalStorageKey') || null)
  const [studentId, setStudentId] = useState(Cookies.get('student_id') || null)
  const model = agent.model || 'openai'
  const voice = agent.voice
  const agentID = agent.agent_id
  const lastMessageRef = useRef(null)

  useEffect(() => {
    console.log('$$$', agent)
  }, [agent])

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const appendMessage = (content, align) => {
    setMessages((prevMessages) => [...prevMessages, { content, align }])
  }

  const getNewThreadID = async () => {
    console.log(threadId)
    const params = {
      agent_id: agentID,
      user_id: studentId
    }

    try {
      const res = await getNewThread(params)
      console.log('res', res)
      setThreadId(res.thread_id)
      localStorage.setItem('threadIdLocalStorageKey', res.thread_id)
      return res.thread_id
    } catch (error) {
      console.error('Error fetching id:', error)
      return null
    }
  }

  const sendMessage = async () => {
    let currentThreadId = threadId
    if (!currentThreadId) {
      currentThreadId = await getNewThreadID()
    }

    if (!currentThreadId || message.trim() === '') return

    const formattedMessages = messages.map((msg, index) => ({
      role: msg.align === 'end' ? 'user' : 'assistant',
      content: msg.content
    }))

    const chatMessage = {
      dynamic_auth_code: 'random',
      messages: {
        ...formattedMessages,
        [formattedMessages.length]: { role: 'user', content: message }
      },
      thread_id: currentThreadId,
      provider: model,
      user_id: studentId,
      agent_id: agentID,
      voice: voice
    }

    appendMessage(message, 'end')
    setMessage('')

    const access_token = Cookies.get('access_token')

    fetch(testQueryURL, {
    // fetch('http://localhost:8000/v1/dev/user/test_query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer access=${access_token}`
      },
      body: JSON.stringify({ question: message })
    })
      .then((response) => response.json())
      .then((data) => {
        appendMessage(data.answer, 'start')
      })
      .catch((err) => {
        console.error(err)
      })
  }

  return (
    <Card className="m-1 h-full">
      <div className="flex flex-col grow px-6 py-4 w-full text-base leading-6 bg-white max-md:px-5 max-md:max-w-full h-full">
        <ScrollShadow size={20} className="flex flex-col overflow-auto h-full pr-4">
          {messages.map((message, index) => (
            <Message key={index} content={message.content} align={message.align} />
          ))}
          <div ref={lastMessageRef}></div>
        </ScrollShadow>
        <footer className="flex-shrink-0">
          <InputMessage
            placeholder="Enter your message"
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />
        </footer>
      </div>
    </Card>
  )
}

export default ChatPanel
