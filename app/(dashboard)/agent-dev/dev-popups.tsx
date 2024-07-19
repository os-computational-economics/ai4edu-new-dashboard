"use client";
import React, { useState, useEffect, useRef } from "react";
// import { ChevronLeft, Plus, ChevronDown, Send, Search, X } from "lucide-react";
import { MdArrowBackIosNew , MdAdd } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import CreateWorkflowPopup from "./popup";


export const KnowledgebasePopup = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const tabs = ["All", "Documents", "Tables", "Photos"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-3/4 h-3/4 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">Knowledge Base</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-3 py-2 ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-8 pr-4 py-2 border rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <CiSearch
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
            <select className="border rounded-md px-3 py-2">
              <option>Create Time ↓</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
              <MdAdd size={18} className="mr-2" />
              Create Knowledge
            </button>
          </div>
        </div>

        <div className="flex-grow p-4 overflow-y-auto">
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No Knowledge Yet</p>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md">
              Create Knowledge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AgentResourcesPopup = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const tabs = ["All", "Documents", "Tables", "Photos"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-3/4 h-3/4 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">Agent Resources</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-3 py-2 ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-8 pr-4 py-2 border rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <CiSearch
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
            <select className="border rounded-md px-3 py-2">
              <option>Create Time ↓</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
              <MdAdd size={18} className="mr-2" />
              Create Resource
            </button>
          </div>
        </div>

        <div className="flex-grow p-4 overflow-y-auto">
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No Resources Yet</p>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md">
              Create Resource
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const WorkflowPopup = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen: isCreateWorkflowOpen, onOpen: onOpenCreateWorkflow, onClose: onCloseCreateWorkflow } = useDisclosure();

  if (!isOpen) return null;

  const tabs = ["All", "Documents", "Tables", "Photos"];

  const handleCreateWorkflow = (name, description) => {
    console.log("New workflow:", name, description);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-3/4 h-3/4 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">Workflow</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-3 py-2 ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-8 pr-4 py-2 border rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <CiSearch
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
            <select className="border rounded-md px-3 py-2">
              <option>Create Time ↓</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
              <MdAdd size={18} className="mr-2" />
              Create Workflow
            </button>
          </div>
        </div>

        <div className="flex-grow p-4 overflow-y-auto">
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No Workflows Yet</p>
            <button onClick={onOpenCreateWorkflow} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md">
              Create Workflow
            </button>
          </div>
        </div>
      </div>

      <CreateWorkflowPopup 
        isOpen={isCreateWorkflowOpen}
        onClose={onCloseCreateWorkflow}
        onCreateWorkflow={handleCreateWorkflow}
      />
    </div>
  );
};

export const handleWorkflow = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  <>
      <Button onPress={onOpen}>Open Modal</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <ModalBody>
                <p> 
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit
                  dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. 
                  Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. 
                  Et mollit incididunt nisi consectetur esse laborum eiusmod pariatur 
                  proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
}