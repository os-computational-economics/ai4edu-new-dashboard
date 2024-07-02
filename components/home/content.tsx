'use client'
import React, { useContext, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardHeader, CardBody, Image } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { formatedCourses, isAdmin } from '@/utils/CookiesUtil'
import { WorkspaceContext } from '@/components/layout/layout'

interface Course {
  id: string
  role: string
  name: string
}

const CourseCard = ({ course }) => {
  const [currentWorkspace, setCurrentWorkspace] = useContext(WorkspaceContext)

  const router = useRouter()

  const handleCourseClick = () => {
    // localStorage.setItem('selectedCourse', JSON.stringify(course))
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
    <Card className="py-4 w-[300px]" isPressable onPress={handleCourseClick}>
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold truncate w-full">{course.name}</p>
        <small className="text-default-500 truncate w-full">{course.id}</small>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src="https://picsum.photos/300/200"
          width={300}
          height={200}
        />
      </CardBody>
    </Card>
  )
}

export const Content = () => {
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    const courseList = formatedCourses()
    console.log('courseList', courseList)

    setCourses(courseList)
  }, [])

  return (
    <div className="h-full lg:px-6 pb-6 v">
      <div className="flex justify-center gap-4 xl:gap-6 pt-1 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-5 max-w-[90rem] mx-auto w-full">
        <div className="mt-1 gap-6 flex flex-col w-full">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold">Workspaces</h3>
            <div className="grid md:grid-cols-3 grid-cols-1 2xl:grid-cols-4 gap-5 justify-center w-full">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Content
