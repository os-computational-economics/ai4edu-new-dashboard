import React from 'react'
import { MdPerson, MdAndroid } from 'react-icons/md' // Importing icons from 'react-icons'
import { Button } from '@nextui-org/react'
import { CSVLink } from 'react-csv'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import 'katex/dist/katex.min.css' // CSS for LaTeX rendering
import 'highlight.js/styles/atom-one-dark.min.css' // CSS for code highlighting
import { preprocessLaTeX } from '@/utils/CustomMessageRender'
import Link from 'next/link'
import { Thread } from '@/api/thread/thread'

// Define a type for individual messages
type Message = {
  thread_id: string
  created_at: string
  msg_id: string
  user_id: string
  role: string
  content: string
}

// Define a type for the grouped messages
type GroupedMessages = {
  [key: string]: {
    userId: string
    messages: Message[]
  }
}

// Define props for the HistoryPanel component
type HistoryPanelProps = {
  thread: Thread
  threadDetails: {
    messages: Message[]
  }
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ thread, threadDetails }) => {
  console.log('Received thread details in HistoryPanel:', threadDetails)

  // Group messages by user_id
  const groupedMessages = threadDetails.messages.reduce<GroupedMessages>((acc, message) => {
    if (!acc[message.user_id]) {
      acc[message.user_id] = {
        userId: message.user_id,
        messages: []
      }
    }
    acc[message.user_id].messages.push(message)
    return acc
  }, {})

  return (
    <div className="h-full w-full overflow-auto">
      {Object.values(groupedMessages).map((group, index) => (
        <div key={index} className="mb-4">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white pb-2 pl-4 pt-2 text-left shadow">
            <h3 className="text-lg font-semibold">Current Student: {group.userId}</h3>
            <div className="inline-flex items-center">
              <CSVLink
                data={group.messages.map(({ thread_id, created_at, msg_id, user_id, role, content }) => ({
                  ThreadID: thread_id,
                  CreatedAt: created_at,
                  MessageID: msg_id,
                  UserID: user_id,
                  Role: role,
                  Content: content
                }))}
                filename={`${group.messages[0].thread_id.slice(0, 8)}-${group.userId}.csv`}
                target="_blank"
              >
                <Button color="primary" variant="flat">
                  Download Record
                </Button>
              </CSVLink>
              <Link href={`/agents/${thread.agent_id}/${group.messages[0].thread_id}`} >
              <Button color="primary" variant="flat" className='ml-2'>
                  Continue Chat
                </Button>
              </Link>
            </div>
          </div>
          {group.messages.map((message, idx) => (
            <div key={idx} className={`m-2 p-2 ${message.role === 'human' ? 'text-right' : 'text-left'}`}>
              <div
                className={`inline-block max-w-[90%] rounded-lg p-2 ${
                  message.role === 'human' ? 'bg-green-50' : 'bg-amber-50'
                }`}
                style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
              >
                {/* Icon rendering based on role */}
                {message.role === 'human' ? (
                  <MdPerson className="mr-2 inline-block text-lg text-green-700" />
                ) : (
                  <MdAndroid className="mr-2 inline-block text-lg text-amber-700" />
                )}

                <p className="text-sm">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex, rehypeHighlight]}>
                    {preprocessLaTeX(message.content)}
                  </ReactMarkdown>
                  {/* {message.content} */}
                </p>
                <p className="text-xs text-gray-600">{new Date(parseInt(message.created_at)).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default HistoryPanel
