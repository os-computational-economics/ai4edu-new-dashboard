'use client'
import React, { useState, useEffect, useContext } from 'react'
import CardList from './components/CardList'
import HistoryPanel from './components/HistoryPanel'
import { Pagination } from '@nextui-org/react'
import { ToastContainer, toast } from 'react-toastify'
import { WorkspaceContext } from '@/components/layout/layout'

import { getThreadsList, getThreadbyID, Thread, SingleThreadResponse } from '@/api/thread/thread'
import useMount from '@/components/hooks/useMount'

export default function App() {
  const [selectedThreadId, setSelectedThreadId] = useState(null)
  const [threads, setThreads] = useState<Thread[]>([])
  const [threadDetails, setThreadDetails] = useState<SingleThreadResponse | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0) // Total number of threads
  const [creatorId, setCreatorId] = useState('')
  const { currentWorkspace, setCurrentWorkspace } = useContext(WorkspaceContext)

  useMount(() => {
    fetchLists(currentPage, pageSize)
  })

  const fetchLists = (page, pageSize) => {
    const params = {
      page,
      page_size: pageSize,
      student_id: creatorId || localStorage.getItem('user_id') || 'rxy216',
      workspace_id: currentWorkspace?.id || JSON.parse(localStorage.getItem('workplace')!)?.id
    }

    getThreadsList(params)
      .then((res) => {
        setThreads(res.threads)
        setTotal(res.total) // Set the total count for pagination
      })
      .catch((error) => {
        console.error('Error fetching threads:', error)
      })
  }

  const fetchThreadDetails = (threadId) => {
    getThreadbyID({ thread_id: threadId })
      .then((response) => {
        setThreadDetails(response) // Set new thread details
      })
      .catch((error) => {
        console.log(error.response.data.detail)
        toast.error(error.response.data.detail, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          progress: undefined
        })
        // console.error('Error fetching thread details:', error);
      })
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchLists(page, pageSize)
  }

  const handleSelectThread = (threadId) => {
    setThreadDetails(null)
    fetchThreadDetails(threadId)
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="flex h-[calc(100vh-80px)] w-98% gap-4 m-2">
      <ToastContainer />
      <div className="flex w-2/5 flex-col bg-white">
        <div className="flex-grow overflow-auto">
          <CardList threads={threads} onSelect={handleSelectThread} />
        </div>
        <div className="flex flex-shrink-0 flex-col items-center justify-center p-4">
          {total > 0 && (
            <>
              <Pagination total={totalPages} initialPage={currentPage} onChange={handlePageChange} />
              <div className="mt-2 text-small text-default-600">Total {total} threads</div>
            </>
          )}
        </div>
      </div>
      <div className="flex w-3/5 flex-col items-center justify-center rounded-md border border-gray-300 p-4 shadow-sm">
        {threadDetails ? (
          <HistoryPanel threadDetails={threadDetails} />
        ) : (
          <div className="text-black-500 text-lg font-semibold">Please select a thread to view its details.</div>
        )}
      </div>
    </div>
  )
}
