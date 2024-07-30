'use client'
import React, { useState } from 'react'
import { Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button } from '@nextui-org/react'
import { MdInfoOutline } from 'react-icons/md'

const Upload = ({ isOpen, onClose, modalTitle, customMessage, onFileUpload }) => {
  const [fileName, setFileName] = useState('')
  const [file, setFile] = useState(null)

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile) {
      console.log(selectedFile)
      setFile(selectedFile)
      setFileName(selectedFile.name)
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile) {
      console.log(droppedFile)
      setFile(droppedFile)
      setFileName(droppedFile.name)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleUpload = () => {
    if (file) {
      onFileUpload(file)
      onClose()
    } else {
      alert('Please select a file to upload')
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setFileName('')
  }

  const closeModal = () => {
    onClose()
    setFile(null)
    setFileName('')
  }

  return (
    <div>
      <Modal isOpen={isOpen} onClose={closeModal} size="lg">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">{modalTitle}</ModalHeader>
          <ModalBody>
            <div className="text-gray-600 text-sm">{customMessage}</div>
            <div
              className="flex flex-col gap-4 mt-4 border border-dashed border-gray-400 rounded-md p-4"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input id="files" type="file" accept=".csv" onChange={handleFileChange} style={{ display: 'none' }} />
              <label
                htmlFor="files"
                className="w-full h-24 flex items-center justify-center bg-white hover:bg-gray-100 cursor-pointer"
              >
                {fileName ? fileName : 'Click or drag a file to upload'}
              </label>
              {fileName && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-700">{fileName}</span>
                  <Button color="danger" size="sm" onClick={handleRemoveFile}>
                    Delete
                  </Button>
                </div>
              )}
            </div>
            <Button onClick={handleUpload} className="mt-4">
              Confirm Upload
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default Upload
