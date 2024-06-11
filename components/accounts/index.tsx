'use client'
import { Button, Input } from '@nextui-org/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { DotsIcon } from '@/components/icons/roster/dots-icon'
import { ExportIcon } from '@/components/icons/roster/export-icon'

import { TableWrapper } from '@/components/table/table'
import { AddUser } from './add-user'

interface CurrentCourse {
  id: string
  name: string
  role: string
  semester: string
}

export const roster = () => {
  const [currentCourse, setCurrentCourse] = useState<CurrentCourse>({
    id: '',
    name: '',
    role: '',
    semester: ''
  })
  useEffect(() => {
    const storedSelectedCourse = JSON.parse(localStorage.getItem('selectedCourse') || '{}')
    if (storedSelectedCourse) {
      setCurrentCourse(storedSelectedCourse)
    }

    const handleCourseSelected = (event) => {
      const selectedCourse = event.detail
      setCurrentCourse(selectedCourse)
    }

    window.addEventListener('courseSelected', handleCourseSelected)

    return () => {
      window.removeEventListener('courseSelected', handleCourseSelected)
    }
  }, [])

  return (
    <div className="my-12 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <h3 className="text-xl font-semibold">
        Agents for {currentCourse?.id} - {currentCourse?.name}
      </h3>
      <div className="flex justify-between flex-wrap gap-2 items-center">
        <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
          <Input
            classNames={{
              input: 'w-full',
              mainWrapper: 'w-full'
            }}
            placeholder="Search agents"
          />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <AddUser />
          <Button color="primary" startContent={<ExportIcon />}>
            Export to CSV
          </Button>
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <TableWrapper />
      </div>
    </div>
  )
}
