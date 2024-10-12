'use client'
import React, { useState, useEffect, useRef } from 'react'
// import { ChevronLeft, Plus, ChevronDown, Send, Search, X } from "lucide-react";
import { MdAdd, MdDeleteForever } from 'react-icons/md'
import { CiSearch } from 'react-icons/ci'
import { IoClose } from 'react-icons/io5'
import Cookies from 'js-cookie'
import Upload from '@/components/upload/upload'
import { agentUploadFile } from '@/api/agent/agent'

export const KnowledgebasePopup = ({ isOpen, onClose, files, setFiles }) => {
  // files is a dict {file_id: file_name}, the actual file is stored in the backend, not in the frontend
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [isFileUploadModalVisible, setIsFileUploadModalVisible] = useState(false)

  const handleFileUpload = async (file) => {
    try {
      await uploadFile(file);
      console.log('File uploaded successfully');
    } catch (error) {
      console.error('Error in file upload:', error);
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_name', file.file);
  
    try {
      const data = await agentUploadFile(formData);
      const newFiles = { ...files, [data.file_id]: file.name };
      setFiles(newFiles);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  if (!isOpen) return null

  const tabs = ['All', 'Documents']

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className=" rounded-lg w-3/4 h-3/4 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">Knowledge Base</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <IoClose size={24} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-3 py-2 ${
                  activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
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
              <CiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
              onClick={() => setIsFileUploadModalVisible(true)}
            >
              <MdAdd size={18} className="mr-2" />
              Create Knowledge
            </button>
          </div>
        </div>

        <Upload
          isOpen={isFileUploadModalVisible}
          modalTitle="Add Knowledge"
          customMessage="Upload a PDF file to create a new knowledge. Maximum file size is 10MB."
          onClose={() => setIsFileUploadModalVisible(false)}
          onFileUpload={handleFileUpload}
          acceptFileTypes={'.pdf'}
          maxFileSizeMB={10}
        />

        <div className="flex-grow p-4 overflow-y-auto">
          {Object.keys(files).length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(files).map(([fileId, fileName]) => (
                <div key={fileId} className="border p-4 rounded-lg shadow-sm flex justify-between items-center">
                  <h3 className="text-lg font-medium">{fileName as string}</h3>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => {
                      const newFiles = { ...files }
                      delete newFiles[fileId]
                      setFiles(newFiles)
                    }}
                  >
                    <MdDeleteForever size={24} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p>No Knowledge Yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const AgentResourcesPopup = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  if (!isOpen) return null

  const tabs = ['All', 'Documents', 'Tables', 'Photos']

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className=" rounded-lg w-3/4 h-3/4 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">Agent Resources</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <IoClose size={24} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-3 py-2 ${
                  activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
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
              <CiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
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
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md">Create Resource</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const WorkflowPopup = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  if (!isOpen) return null

  const tabs = ['All', 'Documents', 'Tables', 'Photos']

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className=" rounded-lg w-3/4 h-3/4 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">Workflow</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <IoClose size={24} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-3 py-2 ${
                  activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
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
              <CiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
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
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md">Create Workflow</button>
          </div>
        </div>
      </div>
    </div>
  )
}
