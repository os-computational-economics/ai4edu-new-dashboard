'use client'
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@nextui-org/react'
import React, { useState } from 'react'
import { Image } from '@nextui-org/react'
import { BottomIcon } from '../icons/sidebar/bottom-icon'
import { useRouter } from 'next/navigation'

export const CompaniesDropdown = ({ courses, setSelectedCourse }) => {
  const [company, setCompany] = useState(null)
  const router = useRouter()

  const handleClickDropdownItem = (e) => {
    router.push('/accounts')
  }

  return (
    <Dropdown classNames={{ base: 'w-full min-w-[260px]' }}>
      <DropdownTrigger className="cursor-pointer">
        <div className="flex items-center gap-2">
          {company ? (
            <>
              <Image src="/favicon.ico" alt="logo" className="w-11 rounded-md" />
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-medium m-0 text-default-900 -mb-4 whitespace-nowrap">{company.name}</h3>
                <span className="text-xs font-medium text-default-500">{company.location}</span>
              </div>
              <BottomIcon />
            </>
          ) : (
            <>
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-medium m-0 text-default-900 -mb-4 whitespace-nowrap">Welcome</h3>
                <span className="text-xs font-medium text-default-500">Choose your course</span>
              </div>
              <BottomIcon />
            </>
          )}
        </div>
      </DropdownTrigger>
      <DropdownMenu
        onAction={(e) => {
          const selectedCompany = courses.find((_, index) => index.toString() === e)
          if (selectedCompany) {
            setCompany(selectedCompany)
            setSelectedCourse(selectedCompany)
          }
        }}
        aria-label="Avatar Actions"
      >
        <DropdownSection title="Courses">
          {courses.map((course, index) => (
            <DropdownItem
              key={index.toString()}
              startContent={course.logo}
              description={course.location}
              classNames={{ base: 'py-4', title: 'text-base font-semibold' }}
              onClick={handleClickDropdownItem}
            >
              {course.name}
            </DropdownItem>
          ))}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
