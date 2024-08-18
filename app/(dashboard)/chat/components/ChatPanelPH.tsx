// @ts-nocheck
'use client'
import React, { useEffect, useState, useRef } from 'react'

import { Card, Textarea, ScrollShadow, Button } from '@nextui-org/react'
import { MdAttachFile } from 'react-icons/md'
import { IoSend } from 'react-icons/io5'

import Cookies from 'js-cookie'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'

import { preprocessLaTeX } from '@/utils/CustomMessageRender'
import { steamChatURL, getNewThread } from '@/api/chat/chat'
import { FileUploadForm } from './FileUpload'

import 'katex/dist/katex.min.css'
import 'highlight.js/styles/atom-one-dark.min.css'

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
  FileUploadForm
}: {
  placeholder: string
  message: string
  setMessage: (value: string) => void
}) {
  return (
    <div className="flex gap-2 px-4 py-2 inset-x-0 bottom-0 bg-white rounded-xl">
      <Textarea
        placeholder={placeholder}
        className="flex-grow"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
          }
        }}
      />
      <Button isDisabled isIconOnly variant="light" aria-label="Attach file">
        <MdAttachFile className="text-2xl" />
      </Button>
      <Button isDisabled isIconOnly color="primary" aria-label="Send message">
        <IoSend className="text-xl" />
      </Button>
    </div>
  )
}

const ChatPanel = ({ agent }) => {
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const lastMessageRef = useRef(null)

  return (
    <Card className="m-1 h-full rounded-xl">
      <div className="flex flex-col grow px-6 py-4 w-full text-base leading-6 bg-white max-md:px-5 max-md:max-w-full h-full">
        <ScrollShadow size={20} className="flex flex-col overflow-auto h-full pr-4">
          {messages.map((message, index) => (
            <Message key={index} content={message.content} align={message.align} />
          ))}
          <div ref={lastMessageRef}></div>
        </ScrollShadow>
        <footer className="flex-shrink-0">
          <InputMessage placeholder="Enter your message" message={message} setMessage={setMessage} />
        </footer>
      </div>
    </Card>
  )
}

export default ChatPanel
