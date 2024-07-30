"use client";
import React, { useState, useEffect, useRef } from "react";
// import { ChevronLeft, Plus, ChevronDown, Send, Search, X } from "lucide-react";
import { MdArrowBackIosNew, MdAdd } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
} from "@nextui-org/react";
import CreateWorkflowPopup from "./popups/workflow-popup";
import CreateKnowledgebasePopup from "./popups/knowledge-popup";

export const KnowledgebasePopup = ({
  isOpen,
  onClose,
  onSelectKnowledge,
  onDeleteKnowledge,
}) => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [knowledgeItems, setKnowledgeItems] = useState([]);
  const [selectedKnowledge, setSelectedKnowledge] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");

  const {
    isOpen: isCreateKnowledgeOpen,
    onOpen: onOpenCreateKnowledge,
    onClose: onCloseCreateKnowledge,
  } = useDisclosure();

  // Load knowledge items and selected state from local storage
  const loadKnowledgeItems = () => {
    const storedItems = localStorage.getItem("knowledgeItems");
    const storedSelectedItems = localStorage.getItem("selectedKnowledgeItems");
    if (storedItems) {
      setKnowledgeItems(JSON.parse(storedItems));
    }
    if (storedSelectedItems) {
      setSelectedKnowledge(JSON.parse(storedSelectedItems));
    }
  };

  // Save knowledge items and selected state to local storage
  const saveKnowledgeItems = (items, selectedItems) => {
    localStorage.setItem("knowledgeItems", JSON.stringify(items));
    localStorage.setItem(
      "selectedKnowledgeItems",
      JSON.stringify(selectedItems)
    );
  };

  // Load knowledge items when the component mounts or when isOpen changes
  useEffect(() => {
    if (isOpen) {
      loadKnowledgeItems();
    }
  }, [isOpen]);

  const handleCreateKnowledge = () => {
    if (newItemName && newItemDescription) {
      const newKnowledgeItem = {
        id: Date.now(),
        name: newItemName,
        description: newItemDescription,
      };
      const updatedItems = [...knowledgeItems, newKnowledgeItem];
      setKnowledgeItems(updatedItems);
      saveKnowledgeItems(updatedItems, selectedKnowledge);
      setNewItemName("");
      setNewItemDescription("");
      onCloseCreateKnowledge();
    }
  };

  const handleDeleteKnowledge = (id) => {
    const itemToDelete = knowledgeItems.find((item) => item.id === id);
    const updatedItems = knowledgeItems.filter((item) => item.id !== id);
    const updatedSelectedItems = selectedKnowledge.filter(
      (item) => item.id !== id
    );
    setKnowledgeItems(updatedItems);
    setSelectedKnowledge(updatedSelectedItems);
    saveKnowledgeItems(updatedItems, updatedSelectedItems);
    onSelectKnowledge(updatedSelectedItems);
    if (itemToDelete) {
      onDeleteKnowledge(itemToDelete);
    }
  };
  const handleSelectKnowledge = (item) => {
    let updatedSelectedKnowledge;
    if (selectedKnowledge.some((i) => i.id === item.id)) {
      updatedSelectedKnowledge = selectedKnowledge.filter(
        (i) => i.id !== item.id
      );
    } else {
      updatedSelectedKnowledge = [...selectedKnowledge, item];
    }
    setSelectedKnowledge(updatedSelectedKnowledge);
    saveKnowledgeItems(knowledgeItems, updatedSelectedKnowledge);
    onSelectKnowledge(updatedSelectedKnowledge);
  };

  const filteredItems = knowledgeItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = ["All", "Documents", "Tables", "Photos"];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100">
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
            <button
              onClick={onOpenCreateKnowledge}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <MdAdd size={18} className="mr-2" />
              Create Knowledge
            </button>
          </div>
        </div>

        <div className="flex-grow p-4 overflow-y-auto">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white shadow-md rounded-lg p-4 relative"
                >
                  <Checkbox
                    isSelected={selectedKnowledge.some((i) => i.id === item.id)}
                    onValueChange={() => handleSelectKnowledge(item)}
                    className="absolute top-2 left-2"
                  />
                  <h3 className="text-lg font-semibold mb-2 pl-8">
                    {item.name}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                  <button
                    onClick={() => handleDeleteKnowledge(item.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <IoClose size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p>No Knowledge Yet</p>
              <button
                onClick={onOpenCreateKnowledge}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Create Knowledge
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isCreateKnowledgeOpen} onClose={onCloseCreateKnowledge}>
        <ModalContent>
          <ModalHeader>Create New Knowledge</ModalHeader>
          <ModalBody>
            <Input
              label="Knowledge Name"
              placeholder="Enter knowledge name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
            <Input
              label="Knowledge Description"
              placeholder="Enter knowledge description"
              value={newItemDescription}
              onChange={(e) => setNewItemDescription(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={onCloseCreateKnowledge}
            >
              Cancel
            </Button>
            <Button color="primary" onPress={handleCreateKnowledge}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
  const {
    isOpen: isCreateWorkflowOpen,
    onOpen: onOpenCreateWorkflow,
    onClose: onCloseCreateWorkflow,
  } = useDisclosure();
  const [workflows, setWorkflows] = useState([]);

  if (!isOpen) return null;

  const tabs = ["All", "Documents", "Tables", "Photos"];

  const handleCreateWorkflow = (name, description) => {
    console.log("New workflow:", name, description);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100">
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
            <button
              onClick={onOpenCreateWorkflow}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
            >
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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  <>
    <Button onPress={onOpen}>Open Modal</Button>
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Modal Title
            </ModalHeader>
            <ModalBody>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                pulvinar risus non risus hendrerit venenatis. Pellentesque sit
                amet hendrerit risus, sed porttitor quam.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                pulvinar risus non risus hendrerit venenatis. Pellentesque sit
                amet hendrerit risus, sed porttitor quam.
              </p>
              <p>
                Magna exercitation reprehenderit magna aute tempor cupidatat
                consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
                incididunt cillum quis. Velit duis sit officia eiusmod Lorem
                aliqua enim laboris do dolor eiusmod. Et mollit incididunt nisi
                consectetur esse laborum eiusmod pariatur proident Lorem eiusmod
                et. Culpa deserunt nostrud ad veniam.
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
  </>;
};
