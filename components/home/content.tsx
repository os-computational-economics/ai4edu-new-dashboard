"use client";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";

type AgentSettingProps = {
  label: string;
  isEnabled: boolean;
  onToggle: () => void;
};

const AgentSetting: React.FC<AgentSettingProps> = ({ label, isEnabled, onToggle }) => (
  <div
    className="flex gap-2 py-px pr-0.5 pl-6 rounded-lg shadow-sm bg-zinc-50 max-md:pl-5 cursor-pointer"
    onClick={onToggle}
  >
    <div>{label}</div>
    <img
      loading="lazy"
      src={isEnabled ? "http://b.io/ext_13-" : "http://b.io/ext_14-"}
      alt={isEnabled ? "Enabled" : "Disabled"}
      className="shrink-0 my-auto aspect-[0.95] w-[19px]"
    />
  </div>
);

type MessageProps = {
  sender: string;
  content: string;
  isAgent: boolean;
};

const Message: React.FC<MessageProps> = ({ sender, content, isAgent }) => (
  <section className="mt-9">
    <div className="flex gap-3.5 self-start ml-9 text-xl font-bold leading-6 text-black max-md:ml-2.5">
      <img
        loading="lazy"
        src="http://b.io/ext_15-"
        alt={`${sender} avatar`}
        className="shrink-0 aspect-[1.05] w-[38px]"
      />
      <div className={`my-auto ${isAgent ? 'flex-auto' : ''}`}>{sender}</div>
    </div>
    <p className="mt-5 mr-11 ml-9 text-xl leading-6 text-black max-md:mr-2.5 max-md:max-w-full">
      {content}
    </p>
  </section>
);

type PopupProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg">
        {children}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

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


  const [agentName, setAgentName] = useState('Agent Name');
  const [courseId, setCourseId] = useState('Course ID');
  const [persona, setPersona] = useState('Design the bot\'s persona, features and workflows using natural language.');
  const [message, setMessage] = useState('');
  const [isWorkflowPopupOpen, setIsWorkflowPopupOpen] = useState(false);
  const [isKnowledgeBasePopupOpen, setIsKnowledgeBasePopupOpen] = useState(false);
  const [isAgentResourcesPopupOpen, setIsAgentResourcesPopupOpen] = useState(false);
  const [isMemoryDropdownOpen, setIsMemoryDropdownOpen] = useState(false);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const [agentStatus, setAgentStatus] = useState(true);
  const [agentModel, setAgentModel] = useState(true);
  const [voiceInput, setVoiceInput] = useState(true);
  const [modelSelection, setModelSelection] = useState(true);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizer = resizerRef.current;
    const leftPanel = leftPanelRef.current;
    const rightPanel = rightPanelRef.current;

    if (!resizer || !leftPanel || !rightPanel) return;

    let x = 0;
    let leftWidth = 0; 

    const mouseDownHandler = (e: MouseEvent) => {
      x = e.clientX;
      leftWidth = leftPanel.getBoundingClientRect().width;

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      const dx = e.clientX - x;
      const newLeftWidth = ((leftWidth + dx) / window.innerWidth) * 100;
      leftPanel.style.width = `${newLeftWidth}%`;
      rightPanel.style.width = `${100 - newLeftWidth}%`;
    };

    const mouseUpHandler = () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    resizer.addEventListener('mousedown', mouseDownHandler);

    return () => {
      resizer.removeEventListener('mousedown', mouseDownHandler);
    };
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
