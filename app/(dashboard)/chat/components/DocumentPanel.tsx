'use client'
import React, { useEffect, useState } from 'react'
import { Card, ScrollShadow } from '@nextui-org/react'

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
  selectedDocument: Document | null
}

export default function DocumentPanel({ selectedDocument }: DocumentPanelProps) {
  const [selectedCourse, setSelectedCourse] = useState<SelectedCourse | null>(null)

  useEffect(() => {
    const storedSelectedCourse = JSON.parse(localStorage.getItem('selectedCourse') || '{}')
    if (storedSelectedCourse) {
      setSelectedCourse(storedSelectedCourse)
    }
  }, [])

  return (
    <Card className="m-1 h-full">
      <div className="flex h-full">
        <div className="bg-white p-6">
          {/* <h1 className="text-2xl font-bold mb-4">{selectedCourse?.id}</h1> */}
          <div className="text-wrap">
            {selectedDocument ? (
              <>
                <h3 className="text-xl font-bold mb-4">{selectedDocument?.title || 'No selected document'}</h3>
                <ScrollShadow className="h-[calc(100vh-140px)] w-fit rounded-md">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod tellus vel sapien bibendum, vel
                    bibendum odio consequat. Nullam volutpat metus ac nunc dapibus, id malesuada velit aliquam.
                    Suspendisse potenti. Nulla facilisi. Duis euismod, nulla sit amet aliquam lacinia, nisl nisl aliquam
                    nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod tellus vel sapien bibendum, vel bibendum odio
                    consequat. Nullam volutpat metus ac nunc dapibus, id malesuada velit aliquam. Suspendisse potenti.
                    Nulla facilisi. Duis euismod, nulla sit amet aliquam lacinia, nisl nisl aliquam nisl, nec aliquam
                    nisl nisl sit amet nisl. Sed euismod tellus vel sapien bibendum, vel bibendum odio consequat. Nullam
                    volutpat metus ac nunc dapibus, id malesuada velit aliquam. Suspendisse potenti. Nulla facilisi.
                    Duis euismod, nulla sit amet aliquam lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet
                    nisl. Sed euismod tellus vel sapien bibendum, vel bibendum odio consequat. Nullam volutpat metus ac
                    nunc dapibus, id malesuada velit aliquam. Suspendisse potenti. Nulla facilisi. Duis euismod, nulla
                    sit amet aliquam lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod
                    tellus vel sapien bibendum, vel bibendum odio consequat. Nullam volutpat metus ac nunc dapibus, id
                    malesuada velit aliquam. Suspendisse potenti. Nulla facilisi. Duis euismod, nulla sit amet aliquam
                    lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod tellus vel sapien
                    bibendum, vel bibendum odio consequat. Nullam volutpat metus ac nunc dapibus, id malesuada velit
                    aliquam. Suspendisse potenti. Nulla facilisi. Duis euismod, nulla sit amet aliquam lacinia, nisl
                    nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod tellus vel sapien bibendum, vel
                    bibendum odio consequat. Nullam volutpat metus ac nunc dapibus, id malesuada velit aliquam.
                    Suspendisse potenti. Nulla facilisi. Duis euismod, nulla sit amet aliquam lacinia, nisl nisl aliquam
                    nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod tellus vel sapien bibendum, vel bibendum odio
                    consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod tellus vel sapien
                    bibendum, vel bibendum odio consequat. Nullam volutpat metus ac nunc dapibus, id malesuada velit
                    aliquam. Suspendisse potenti. Nulla facilisi. Duis euismod, nulla sit amet aliquam lacinia, nisl
                    nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod tellus vel sapien bibendum, vel
                    bibendum odio consequat. Nullam volutpat metus ac nunc dapibus, id malesuada velit aliquam.
                    Suspendisse potenti. Nulla facilisi. Duis euismod, nulla sit amet aliquam lacinia, nisl nisl aliquam
                    nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod tellus vel sapien bibendum, vel bibendum odio
                    consequat. Nullam volutpat metus ac nunc dapibus, id malesuada velit aliquam. Suspendisse potenti.
                    Nulla facilisi. Duis euismod, nulla sit amet aliquam lacinia, nisl nisl aliquam nisl, nec aliquam
                    nisl nisl sit amet nisl. Sed euismod tellus vel sapien bibendum, vel bibendum odio consequat. Nullam
                    volutpat metus ac nunc dapibus, id malesuada velit aliquam. Suspendisse potenti. Nulla facilisi.
                    Duis euismod, nulla sit amet aliquam lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet
                    nisl. Sed euismod tellus vel sapien bibendum, vel bibendum odio consequat. Nullam volutpat metus ac
                    nunc dapibus, id malesuada velit aliquam. Suspendisse potenti. Nulla facilisi. Duis euismod, nulla
                    sit amet aliquam lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod
                    tellus vel sapien bibendum, vel bibendum odio consequat. Nullam volutpat metus ac nunc dapibus, id
                    malesuada velit aliquam. Suspendisse potenti. Nulla facilisi. Duis euismod, nulla sit amet aliquam
                    lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod tellus vel sapien
                    bibendum, vel bibendum odio consequat. Nullam volutpat metus ac nunc dapibus, id malesuada velit
                    aliquam. Suspendisse potenti. Nulla facilisi. Duis euismod, nulla sit amet aliquam lacinia, nisl
                    nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod tellus vel sapien bibendum, vel
                    bibendum odio consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod tellus
                    vel sapien bibendum, vel bibendum odio consequat. Nullam volutpat metus ac nunc dapibus, id
                    malesuada velit aliquam. Suspendisse potenti. Nulla facilisi. Duis euismod, nulla sit amet aliquam
                    lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod tellus vel sapien
                    bibendum, vel bibendum odio consequat. Nullam volutpat metus ac nunc dapibus, id malesuada velit
                    aliquam. Suspendisse potenti. Nulla facilisi. Duis euismod, nulla sit amet aliquam lacinia, nisl
                    nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod tellus vel sapien bibendum, vel
                    bibendum odio consequat. Nullam volutpat metus ac nunc dapibus, id malesuada velit aliquam.
                    Suspendisse potenti. Nulla facilisi. Duis euismod, nulla sit amet aliquam lacinia, nisl nisl aliquam
                    nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod tellus vel sapien bibendum, vel bibendum odio
                    consequat. Nullam volutpat metus ac nunc dapibus, id malesuada velit aliquam. Suspendisse potenti.
                    Nulla facilisi. Duis euismod, nulla sit amet aliquam lacinia, nisl nisl aliquam nisl, nec aliquam
                    nisl nisl sit amet nisl. Sed euismod tellus vel sapien bibendum, vel bibendum odio consequat. Nullam
                    volutpat metus ac nunc dapibus, id malesuada velit aliquam. Suspendisse potenti. Nulla facilisi.
                    Duis euismod, nulla sit amet aliquam lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet
                    nisl. Sed euismod tellus vel sapien bibendum, vel bibendum odio consequat. Nullam volutpat metus ac
                    nunc dapibus, id malesuada velit aliquam. Suspendisse potenti. Nulla facilisi. Duis euismod, nulla
                    sit amet aliquam lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod
                    tellus vel sapien bibendum, vel bibendum odio consequat. Nullam volutpat metus ac nunc dapibus, id
                    malesuada velit aliquam. Suspendisse potenti. Nulla facilisi. Duis euismod, nulla sit amet aliquam
                    lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod tellus vel sapien
                    bibendum, vel bibendum odio consequat.
                  </p>
                </ScrollShadow>
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
