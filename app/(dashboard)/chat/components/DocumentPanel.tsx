'use client'
import React, { useEffect, useState } from 'react'
import { Card } from '@nextui-org/react'
import { getPresignedURLForFile } from '@/api/chat/chat'

type Document = {
  id: number
  title: string
}

interface SelectedCourse {
  id: string
  name: string
  role: string
  semester: string
}

interface DocumentPanelProps {
  selectedDocument: Document | string | null
  selectedDocumentPage: number
}

export default function DocumentPanel({ selectedDocument, selectedDocumentPage }: DocumentPanelProps) {
  const [selectedCourse, setSelectedCourse] = useState<SelectedCourse | null>(null)
  const [documentUrl, setDocumentUrl] = useState<string | null>(null)
  const [documentPage, setDocumentPage] = useState<number | null>(null)

  useEffect(() => {
    const storedSelectedCourse = JSON.parse(localStorage.getItem('selectedCourse') || '{}')
    if (storedSelectedCourse) {
      setSelectedCourse(storedSelectedCourse)
    }
  }, [])

  useEffect(() => {
    if (!selectedDocument) {
      return
    }
    if (!documentUrl?.includes(selectedDocument as string) || documentPage !== selectedDocumentPage) {
      getPresignedURLForFile({ fileID: selectedDocument as string }).then((response) => {
        if (response.url) {
          setDocumentUrl(response.url+`#page=${selectedDocumentPage}`);
          setDocumentPage(selectedDocumentPage);
        }
      })
    }
  }, [selectedDocument, selectedDocumentPage])

  return (
    <Card className="m-2 mr-1" style={{ height: 'calc(100% - 1rem)' }}>
      <div className="h-full w-full">
        <div className=" p-3 h-full">
          {/* <h1 className="text-2xl font-bold mb-4">{selectedCourse?.id}</h1> */}
          <div className="text-wrap w-full h-full">
            {selectedDocument ? (
              <>
                <iframe src={documentUrl as string} title="Document" className="w-full h-full rounded-xl" />
              </>
            ) : (
              <div>
                <h3 className="text-xl font-bold mb-4">
                  {/* Your intructor uploaded some study material. */}
                  No document available.
                </h3>
                {/* <p>Select a document to view.</p> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
