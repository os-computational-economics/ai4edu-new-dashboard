"use client";
import React, { useContext, useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Image, Button, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { formatedCourses, checkExpired } from "@/utils/CookiesUtil";
import { WorkspaceContext } from "@/components/layout/layout";
import AgentJoinModal from "@/components/home/agent-join-modal";
import WorkspaceDetailsModal from "./workspace-details-modal";
import { DotsIcon } from "@/components/icons/roster/dots-icon";

interface Course {
  id: string;
  role: string;
  name: string;
}

const CourseCard = ({ course, onDetailsClick }) => {
  const { currentWorkspace, setCurrentWorkspace } =
    useContext(WorkspaceContext);
  const router = useRouter();

  const handleCourseClick = () => {
    localStorage.setItem("workspace", JSON.stringify(course));
    console.log("course", course);
    setCurrentWorkspace(course);
    const event = new CustomEvent("courseSelected", { detail: course });

    window.dispatchEvent(event);
    const storedSelectedCourse = JSON.parse(
      localStorage.getItem("selectedCourse") || "{}"
    );
    if (storedSelectedCourse.role === "admin") {
      router.push("/access-control");
    } else {
      const courseId = course.id;
      router.push(`/agents?courseId=${courseId}`);
    }
  };

  return (
    <Card
      className="py-3 w-full max-w-80"
      isPressable
      onClick={handleCourseClick}
    >
      <CardHeader className="pb-2 pt-0 px-4 flex items-center justify-between">
        <div className="flex flex-col min-w-0 items-start">
          <p className="text-medium font-bold text-left">{course.name}</p>
          <small className="text-default-500 text-left">
            {course.comment || ""}
          </small>
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onDetailsClick(course);
          }}
          size="sm"
          isIconOnly
          className="ml-auto"
        >
          <DotsIcon />
        </Button>
      </CardHeader>
      <CardBody className="overflow-visible py-0 px-3">
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src="/cwru_logo_blue.png"
          width={300}
        />
      </CardBody>
    </Card>
  );
};

export const Content = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    checkExpired();
    const fetchCourses = async () => {
      setIsLoading(true);
      const courseList = await formatedCourses();
      setCourses(courseList);
      setIsLoading(false);
    };
    fetchCourses();
  }, []);

  const closeJoinModal = () => {
    // todo: reload workspace list
    setIsJoinModalOpen(false);
  };

  const handleDetailsClick = (course) => {
    setSelectedCourse(course);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
  };

  return (
    <div className="h-full lg:px-6 pb-6 v">
      <AgentJoinModal isOpen={isJoinModalOpen} onClose={closeJoinModal} />
      {selectedCourse && (
        <WorkspaceDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={closeDetailsModal}
          course={selectedCourse}
        />
      )}
      <div className="flex justify-center gap-4 xl:gap-6 pt-1 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-5 max-w-[90rem] mx-auto w-full">
        <div className="mt-1 gap-6 flex flex-col w-full">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">My Workspaces</h1>
              <div className="flex gap-2 items-center">
                <Button
                  color="primary"
                  onClick={() => setIsJoinModalOpen(true)}
                >
                  Join a Workspace
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-center w-full">
              {isLoading ? (
                <div className="col-span-full flex justify-center">
                  <Spinner />
                </div>
              ) : courses.length > 0 ? (
                courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onDetailsClick={handleDetailsClick}
                  />
                ))
              ) : (
                <p>
                  No workspaces available at the moment. Please click &apos;Join
                  a Workspace&apos; to join one.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
