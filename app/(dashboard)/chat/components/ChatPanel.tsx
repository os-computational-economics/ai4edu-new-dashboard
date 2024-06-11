'use client'
import React from 'react'
import { Card, Textarea, ScrollShadow } from '@nextui-org/react'
import { MdAttachFile } from 'react-icons/md'
import messages from './mock'

function Message({ content, align }: { content: string; align: string }) {
  const className = align === 'end' ? 'bg-black text-white font-medium self-end max-w-3/4' : 'bg-neutral-200 max-w-3/4'
  const additionalClasses = 'rounded-2xl px-4 py-2'

  return (
    <div className={`flex flex-col items-${align} my-1 font-medium text-black max-md:pr-5 max-md:max-w-full`}>
      <div className={`${className} ${additionalClasses}`}>{content}</div>
    </div>
  )
}

function ChatUser({ name, status }: { name: string; status: string }) {
  return (
    <section className="flex gap-4">
      <div className="flex flex-col">
        <h2 className="font-medium text-black">{name}</h2>
        <p className="text-ellipsis text-zinc-700">{status}</p>
      </div>
    </section>
  )
}

function InputMessage({ placeholder }: { placeholder: string }) {
  return (
    <div className="flex gap-2 px-4 py-2 inset-x-0 bottom-0 bg-white rounded-xl border border-solid border-neutral-200 text-zinc-500">
      <Textarea placeholder={placeholder} className="flex-grow" />
      <MdAttachFile />
    </div>
  )
}

export default function ChatPanel() {
  return (
    <Card className="m-1 h-full">
      <div className="flex flex-col grow px-6 py-4 w-full text-base leading-6 bg-white max-md:px-5 max-md:max-w-full h-full">
        {/* <header className="flex z-10 gap-5 justify-center px-6 w-full bg-white border-b border-solid border-neutral-200 max-md:flex-wrap max-md:px-5 max-md:max-w-full">
          <ChatUser name="Assistant Name" status="Powered by ChatGPT" />
        </header> */}
        <ScrollShadow className="flex flex-col overflow-auto h-full pr-4">
          {messages.map((message, index) => (
            <Message key={index} content={message.content} align={message.align} />
          ))}
        </ScrollShadow>
        <footer className="flex-shrink-0">
          <InputMessage placeholder="Enter your message" />
        </footer>
      </div>
    </Card>
  )
}
