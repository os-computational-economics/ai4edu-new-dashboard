'use client'
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@nextui-org/react'
import React, { useState, useEffect } from 'react'
import { Image } from '@nextui-org/react'
import { BottomIcon } from '../icons/sidebar/bottom-icon'
import { useRouter } from 'next/navigation'

const CourseDropdown = ({ courses, setSelectedCourse }) => {
  const [course, setCourse] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const storedSelectedCourse = JSON.parse(localStorage.getItem('selectedCourse'))
    if (storedSelectedCourse) {
      setCourse(storedSelectedCourse)
      setSelectedCourse(storedSelectedCourse)
    }

    const handleCourseSelected = (event) => {
      const selectedCourse = event.detail
      setCourse(selectedCourse)
      setSelectedCourse(selectedCourse)
    }

    window.addEventListener('courseSelected', handleCourseSelected)

    return () => {
      window.removeEventListener('courseSelected', handleCourseSelected)
    }
  }, [setSelectedCourse])

  const handleClickDropdownItem = (e) => {
    // enforce reload
    window.location.href = '/accounts'
    // router.push('/accounts')
    // router.refresh()
  }

  return (
    <Dropdown classNames={{ base: 'w-full min-w-[260px]' }}>
      <DropdownTrigger className="cursor-pointer">
        <div className="flex items-center gap-2">
          {course ? (
            <>
              <Image src="/favicon.ico" alt="logo" className="w-11 rounded-md" />
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-medium m-0 text-default-900 -mb-4 whitespace-nowrap">{course.id}</h3>
                <span className="text-xs font-medium text-default-500">{course.name}</span>
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
          const selectedCourse = courses.find((_, index) => index.toString() === e)
          if (selectedCourse) {
            setCourse(selectedCourse)
            setSelectedCourse(selectedCourse)
            localStorage.setItem('selectedCourse', JSON.stringify(selectedCourse))
            const event = new CustomEvent('courseSelected', { detail: selectedCourse })
            window.dispatchEvent(event)
          }
        }}
        aria-label="Avatar Actions"
      >
        <DropdownSection title="Courses">
          {courses && courses.length > 0 ? (
            courses.map((course, index) => (
              <DropdownItem
                key={index.toString()}
                startContent={course.logo}
                description={course.location}
                classNames={{ base: 'py-4', title: 'text-base font-semibold' }}
                onClick={handleClickDropdownItem}
              >
                {course.id} - {course.name}
              </DropdownItem>
            ))
          ) : (
            <DropdownItem>No courses available</DropdownItem>
          )}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}

export default CourseDropdown
