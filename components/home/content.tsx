"use client";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const courses = [
  {
    id: "ECON 380",
    semester: "Spring 2023",
    name: "Computational Economics",
    role: "student",
  },
  {
    id: "CSDS 301",
    semester: "Fall 2022",
    name: "Software Engineering",
    role: "student",
  },
  {
    id: "CSDS 401",
    semester: "Fall 2022",
    name: "Algorithms",
    role: "teacher",
  },
  {
    id: "CSDS 402",
    semester: "Fall 2022",
    name: "Database Systems",
    role: "teacher",
  },
  {
    id: "CSDS 601",
    semester: "Fall 2022",
    name: "Advanced Topics in AI",
    role: "admin",
  },
  {
    id: "MATH 602",
    semester: "Spring 2023",
    name: "Statistical Learning",
    role: "admin",
  },
];

const Chart = dynamic(
  () => import("../charts/steam").then((mod) => mod.Steam),
  {
    ssr: false,
  }
);

const CourseCard = ({ course }) => {
  const router = useRouter();

  const handleCourseClick = () => {
    localStorage.setItem("selectedCourse", JSON.stringify(course));
    const event = new CustomEvent("courseSelected", { detail: course });
    window.dispatchEvent(event);
    const storedSelectedCourse = JSON.parse(
      localStorage.getItem("selectedCourse") || "{}"
    );
    if (storedSelectedCourse.role === "admin") {
      router.push("/access-control");
    } else {
      router.push("/agents");
    }
  };

  return (
    <Card className="py-4 w-[300px]" isPressable onPress={handleCourseClick}>
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold truncate w-full">
          {course.name}
        </p>
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
  );
};

export const Content = () => {
  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, []);

  return (
    <div className="h-full lg:px-6 pb-6 v">
      <div className="flex justify-center gap-4 xl:gap-6 pt-1 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-5 max-w-[90rem] mx-auto w-full">
        <div className="mt-1 gap-6 flex flex-col w-full">
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
  );
};

export default Content;
