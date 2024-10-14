'use client'

import React from 'react'
import { Card, CardHeader, CardFooter } from '@nextui-org/react'

const ThreadCard = ({ thread, onSelect }) => (
  <Card isPressable onPress={() => onSelect(thread.thread_id)}>
    <CardHeader className="justify-between">
      <div className="flex flex-col gap-1">
        <h2 className="text-large font-semibold text-default-600">{thread.agent_name}</h2>
        <h5 className="text-middle tracking-tight text-default-600">{thread.course_id}</h5>
      </div>
    </CardHeader>
    <CardFooter>
      <div className="flex justify-between w-full">
        <p className="text-small font-semibold text-default-600">
          {new Date(`${thread.created_at}Z`).toLocaleString()}
        </p>
        <p className="text-small font-semibold text-default-600">{thread.student_id}</p>
      </div>
    </CardFooter>
  </Card>
)

const CardList = ({ threads, onSelect }) => (
  <div className="grid grid-cols-1 gap-4 px-6">
    {threads.map((thread) => (
      <ThreadCard key={thread.thread_id} thread={thread} onSelect={onSelect} />
    ))}
  </div>
)

export default CardList
