'use client'
import { Button, Input } from '@nextui-org/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { DotsIcon } from '@/components/icons/accounts/dots-icon'
import { ExportIcon } from '@/components/icons/accounts/export-icon'
import { InfoIcon } from '@/components/icons/accounts/info-icon'
import { TrashIcon } from '@/components/icons/accounts/trash-icon'
import { HouseIcon } from '@/components/icons/breadcrumb/house-icon'
import { UsersIcon } from '@/components/icons/breadcrumb/users-icon'
import { SettingsIcon } from '@/components/icons/sidebar/settings-icon'
import { TableWrapper } from '@/components/table/table'
import { AddUser } from './add-user'

export const Accounts = () => {
  const [currentCourse, setCurrentCourse] = useState(null)
  useEffect(() => {
    const currentCourse = JSON.parse(localStorage.getItem('selectedCourse'))
    setCurrentCourse(currentCourse)
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
