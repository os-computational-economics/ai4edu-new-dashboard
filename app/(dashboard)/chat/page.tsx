'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import ChatPage from './ChatPage'

const ChatPageWrapper = () => {
  const router = useRouter()
  const { query } = router
  const { thread_id } = query

  return <ChatPage thread_id={thread_id} />
}

export default ChatPageWrapper
