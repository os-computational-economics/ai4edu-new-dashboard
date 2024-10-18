'use client'
import React, { useContext, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { formatedCourses, checkExpired } from '@/utils/CookiesUtil'
import { WorkspaceContext } from '@/components/layout/layout'
import AgentJoinModal from '@/components/home/agent-join-modal'

interface Course {
  id: string
  role: string
  name: string
}

const CourseCard = ({ course }) => {
  const { currentWorkspace, setCurrentWorkspace } = useContext(WorkspaceContext)

  const router = useRouter()

  const handleCourseClick = () => {
    localStorage.setItem('workspace', JSON.stringify(course))
    console.log('course', course)
    setCurrentWorkspace(course)
    const event = new CustomEvent('courseSelected', { detail: course })

    window.dispatchEvent(event)
    const storedSelectedCourse = JSON.parse(localStorage.getItem('selectedCourse') || '{}')
    if (storedSelectedCourse.role === 'admin') {
      router.push('/access-control')
    } else {
      const courseId = course.id
      router.push(`/agents?courseId=${courseId}`)
    }
  }

  return (
    <Card className="py-3 w-full max-w-80" isPressable onPress={handleCourseClick}>
      <CardHeader className="pb-2 pt-0 px-4 flex-col items-start">
        <p className="text-medium font-bold truncate w-full">{course.name}</p>
        <small className="text-default-500 truncate w-full uppercase">{course.id}</small>
      </CardHeader>
      <CardBody className="overflow-visible py-0 px-3">
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src="/cwru_logo_blue.png"
          width={300}
          height={200}
        />
      </CardBody>
    </Card>
  )
}

export const Content = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)

  useEffect(() => {
    const courseList = formatedCourses()
    console.log('courseList', courseList)
    checkExpired()
    setCourses(courseList)
  }, [])

  const closeJoinModal = () => {
    // todo: reload workspace list
    setIsJoinModalOpen(false)
  }

  return (
    <div className="h-full lg:px-6 pb-6 v">
      <AgentJoinModal isOpen={isJoinModalOpen} onClose={closeJoinModal}></AgentJoinModal>
      <div className="flex justify-center gap-4 xl:gap-6 pt-1 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-5 max-w-[90rem] mx-auto w-full">
        <div className="mt-1 gap-6 flex flex-col w-full">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">My Workspaces</h1>
              <div className="flex gap-2 items-center">
                <Button color='primary' onPress={() => setIsJoinModalOpen(true)}>Join a Workspace</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-center w-full">
              {courses.length > 0 ? (
                courses.map((course) => <CourseCard key={course.id} course={course} />)
              ) : (
                <p>No workspaces available at the moment. Please click &apos;Join a Workspace&apos; to join one.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Content
