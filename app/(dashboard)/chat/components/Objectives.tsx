'use client'
import React from 'react'
import { Checkbox, Switch, Button, ScrollShadow } from '@nextui-org/react'

type Document = {
  id: number
  title: string
}

interface ObjectivesProps {
  documents: Document[]
  onDocumentClick: (document: Document) => void
}

export default function Objectives({ documents, onDocumentClick }: ObjectivesProps) {
  return (
    <ScrollShadow>
      <header className="flex flex-col justify-center text-center mx-4 max-md:mx-2.5">
        <section className="flex flex-col justify-center">
          <h2 className="justify-center px-4 py-2 mt-6 text-base font-medium text-white bg-black rounded-lg max-md:px-5">
            Objectives
          </h2>
          <div className="flex space-x-2 mt-5 ml-1 text-gray-500 text-md">Upcoming feature</div>
        </section>
        <section className="flex flex-col justify-center mt-3">
          <div>
            <h2 className="justify-center px-4 py-2 mt-3 text-base font-medium text-white bg-black rounded-lg max-md:px-5">
              Task Guide
            </h2>
            <div className="flex space-x-2 mt-5 ml-1 text-gray-500 text-md">Upcoming feature</div>
          </div>
        </section>
        <section className="flex flex-col h-full justify-center mt-3">
          <div>
            <h2 className="justify-center px-4 py-2 mt-3 text-base font-medium text-white bg-black rounded-lg max-md:px-5">
              Documents
            </h2>
            <div className="flex space-x-2 mt-5 ml-1 text-gray-500 text-md">Upcoming feature</div>

            {/* {documents.map((document) => (
              <div
                key={document.id}
                className="flex justify-center space-x-2 mt-5 ml-1 cursor-pointer"
                onClick={() => onDocumentClick(document)}
              >
                <label
                  htmlFor={`document-${document.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {document.title}
                </label>
              </div>
            ))} */}
          </div>
        </section>
        <section className="flex flex-col justify-center items-center">
          <h2 className="justify-center py-2 mt-6 mb-6 w-full text-base font-medium text-white bg-black rounded-lg max-md:px-5">
            Settings
          </h2>
          <div className="flex space-x-2 mt-5 ml-1 text-gray-500 text-md">Upcoming feature</div>

          {/* <div className="flex items-center space-x-2">
            <Switch id="microphone">Enable Microphone</Switch>
          </div> */}
          {/* <Button className="justify-center mt-10" color="danger">
            Reset Chat
          </Button> */}
        </section>
      </header>
    </ScrollShadow>
  )
}
