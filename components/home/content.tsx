'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import { Card, CardHeader, CardBody, Image } from '@nextui-org/react'

const courses = [
  { id: 'ECON 380', semester: 'Spring 2023', name: 'Computational Economics' },
  { id: 'CSDS 101', semester: 'Fall 2022', name: 'Introduction to Computer Science' },
  { id: 'CSDS 101', semester: 'Fall 2022', name: 'Introduction to Computer Science' },
  { id: 'CSDS 101', semester: 'Fall 2022', name: 'Introduction to Computer Science' },
  { id: 'CSDS 101', semester: 'Fall 2022', name: 'Introduction to Computer Science' },
  { id: 'Math 202', semester: 'Spring 2023', name: 'Calculus II' }
  // Add more courses here
]

const Chart = dynamic(() => import('../charts/steam').then((mod) => mod.Steam), {
  ssr: false
})

const CourseCard = ({ course }) => {
  return (
    <Card className="py-4 w-[300px]">
      {' '}
      {/* Adjust width as needed */}
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold truncate w-full">{course.name}</p>
        <small className="text-default-500 truncate w-full">{course.id}</small>
        {/* <h4 className="font-bold text-large truncate w-full"></h4> */}
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src="https://picsum.photos/300/200"
          width={270}
        />
      </CardBody>
    </Card>
  )
}

export const Content = () => (
  <div className="h-full lg:px-6 pb-6">
    <div className="flex justify-center gap-4 xl:gap-6 pt-1 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-5 max-w-[90rem] mx-auto w-full">
      <div className="mt-1 gap-6 flex flex-col w-full">
        {/* Card Section Top */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold">Courses</h3>
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

export default Content
