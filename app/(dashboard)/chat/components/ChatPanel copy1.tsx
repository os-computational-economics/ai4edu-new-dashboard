// @ts-nocheck
"use client";
import React, { useEffect, useState, useRef } from "react";

import { Textarea } from "@nextui-org/react";
import { MdAttachFile } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { VscChromeMinimize } from "react-icons/vsc";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

import Cookies from "js-cookie";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";

import { preprocessLaTeX } from "@/utils/CustomMessageRender";
import { steamChatURL, getNewThread } from "@/api/chat/chat";
import { FileUploadForm } from "./FileUpload";
import {
  Modal,
  ModalContent,
  ModalHeader,
  Card,
  ScrollShadow,
  Button,
  Badge,
} from "@nextui-org/react";

import "katex/dist/katex.min.css";
import "highlight.js/styles/atom-one-dark.min.css";

function Message({ content, align }: { content: string; align: string }) {
  const className =
    align === "end"
      ? "bg-black text-white font-medium self-end max-w-3/4"
      : "bg-neutral-200 max-w-3/4";
  const additionalClasses = "rounded-2xl px-4 py-2";

  return (
    <div
      className={`flex flex-col items-${align} my-1 font-medium text-black max-md:pr-5 max-md:max-w-full`}
    >
      <div className={`${className} ${additionalClasses}`}>
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeHighlight]}
        >
          {preprocessLaTeX(content)}
        </ReactMarkdown>
      </div>
    </div>
  );
}

function InputMessage({
  placeholder,
  message,
  setMessage,
  sendMessage,
  FileUploadForm,
}: {
  placeholder: string;
  message: string;
  setMessage: (value: string) => void;
  sendMessage: () => void;
}) {
  return (
    <div className="flex gap-2 px-4 py-2 inset-x-0 bottom-0 bg-white rounded-xl">
      <Textarea
        placeholder={placeholder}
        className="flex-grow"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
      />
      <Button
        isIconOnly
        variant="light"
        aria-label="Attach file"
        onClick={FileUploadForm}
      >
        <MdAttachFile className="text-2xl" />
      </Button>
      <Button
        isIconOnly
        color="primary"
        aria-label="Send message"
        onClick={sendMessage}
      >
        <IoSend className="text-xl" />
      </Button>
    </div>
  );
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

  const AgentInfo = () => (
    <div className="flex flex-col ml-8 mt-4 text-3xl">
      {agent?.agent_name}
      <span className="text-sm">
        <span className="text-gray-700 mr-6">{agent?.workspace_id}</span>
        {agent?.status === 1 ? (
          <span className="text-green-700">Active</span>
        ) : (
          <span className="text-red-700">Inactive</span>
        )}
      </span>
    </div>
  );

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
      <span className="relative">
      <AgentInfo />
      <span className="text-sm right-1 top-1 absolute m-5 text-gray-500">Preview Mode</span>
    </span>
      <div className="flex flex-col grow px-6 py-4 w-full text-base leading-6 bg-white max-md:px-5 max-md:max-w-full h-full">
      <ScrollShadow
        size={20}
        className="flex flex-col overflow-auto h-full pr-4"
      >
        {messages.map((message, index) => (
          <Message
            key={index}
            content={message.content}
            align={message.align}
          />
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
