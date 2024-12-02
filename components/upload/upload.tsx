'use client'
import React, { useState } from 'react'
import { Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button } from '@nextui-org/react'

const Upload = ({ isOpen, onClose, modalTitle, customMessage, onFileUpload, acceptFileTypes, maxFileSizeMB }) => {
  const [fileName, setFileName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

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

  const handleUpload = async () => {
    if (file) {
      const fileSizeMB = file.size / 1024 / 1024
      if (fileSizeMB > maxFileSizeMB) {
        alert(`File size exceeds the maximum limit of ${maxFileSizeMB} MB`)
        return
      }
      setIsUploading(true)
      await onFileUpload(file)
      setIsUploading(false)
      handleRemoveFile()
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
      <Modal className='mb-[25vh] sm:mb-0' isOpen={isOpen} onClose={closeModal} size="lg">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">{modalTitle}</ModalHeader>
          <ModalBody>
            <div className="text-gray-600 text-sm">{customMessage}</div>
            <div
              className="flex flex-col gap-4 mt-4 border border-dashed border-gray-400 rounded-md p-4"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input id="files" type="file" accept={acceptFileTypes} onChange={handleFileChange} style={{ display: 'none' }} />
              <label
                htmlFor="files"
                className="w-full h-24 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#1e2022] cursor-pointer"
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
            <Button onClick={handleUpload} className="mt-4" color='primary' disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Confirm Upload'}
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default Upload
