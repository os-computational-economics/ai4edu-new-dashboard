'use client'
import React, { useState, useEffect, useContext } from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Spinner,
  Pagination,
  CheckboxGroup,
  Checkbox,
  Input,
  Tooltip
} from '@nextui-org/react'
import { getUserList, grantAccess, User, addUsersViaCsv } from '@/api/auth/auth'
import { MdCached } from 'react-icons/md'
import useMount from '@/components/hooks/useMount'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { MdInfoOutline } from 'react-icons/md'
import { WorkspaceContext } from '@/components/layout/layout'

const Tables = () => {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isLoading, setisLoading] = useState(false)
  const [file, setFile] = useState(null)

  const totalPage = Math.ceil(total / pageSize)

  const { currentWorkspace, setCurrentWorkspace } = useContext(WorkspaceContext)

  useEffect(() => {
    fetchUserList(currentPage, pageSize)
  }, [])

  const fetchUserList = (page: number, pageSize: number) => {
    const params = {
      page,
      page_size: pageSize,
      workspace_id: currentWorkspace?.id || JSON.parse(localStorage.getItem('workplace')!).id
    }

    getUserList(params)
      .then((res) => {
        setisLoading(false)
        setUsers(res.user_list)
        setTotal(res.total)
      })
      .catch((error) => {
        setisLoading(false)
        console.error('Error fetching users:', error)
      })
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    setisLoading(true)
    fetchUserList(page, pageSize)
  }

  const handleSearch = (reload) => {
    if (reload) {
      setisLoading(true)
      setCurrentPage(1) // Reset to first page for new search

      fetchUserList(1, pageSize)
    }
  }

  const handleFileChange = (event) => {
    console.log('file:', event)
    setFile(event.target.files[0])
    // handleFileUpload()
  }

  const handleFileUpload = () => {
    if (!file) {
      toast.error('Please select a file to upload')
      return
    }

    const formData = new FormData()

    const workspaceId = currentWorkspace?.id || JSON.parse(localStorage.getItem('workplace')!).id
    const urlWorkspace = `admin/workspace/add_users_via_csv?workspace_id=${workspaceId}`

    formData.append('file', file)

    addUsersViaCsv(formData, urlWorkspace)
      .then((response) => {
        if (response.success) {
          toast.success('Users added successfully')
          // Optionally refresh the user list
          fetchUserList(currentPage, pageSize)
        } else {
          toast.error(response.message)
        }
      })
      .catch((error) => {
        toast.error('Error uploading file')
        console.error('Error uploading file:', error)
      })
  }

  return (
    <div className="m-6">
      <div>
        <h1 className="text-2xl font-bold">Course Roster</h1>
      </div>
      <div className="flex justify-end gap-2 items-center mb-4">
        <Tooltip content="Upload student roster from SIS">
          <MdInfoOutline />
        </Tooltip>
        <input
          type="file"
          accept=".xls,.xlsx"
          onChange={handleFileChange}
          className="py-2 px-4 border border-gray-300 rounded-lg text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        {file && <Button onClick={handleFileUpload}>Add Students</Button>}
      </div>
      <ToastContainer />
      <Table
        topContentPlacement="outside"
        aria-label="Users List"
        bottomContent={
          totalPage > 0 && (
            <div>
              <div className="flex h-full w-full items-center justify-center">
                <Pagination isDisabled={isLoading} page={currentPage} total={totalPage} onChange={handlePageChange} />
                <div className="ml-8 text-small text-default-600">Total {total} users</div>
              </div>
            </div>
          )
        }
      >
        <TableHeader>
          <TableColumn key="user_id">User ID</TableColumn>
          <TableColumn key="student_id">Student ID</TableColumn>
          <TableColumn key="name">User Name</TableColumn>
        </TableHeader>
        <TableBody
          items={users}
          isLoading={isLoading}
          emptyContent="No users found"
          loadingContent={
            <div>
              <Spinner label="Loading..." />
            </div>
          }
        >
          {users.map((user) => (
            <TableRow key={user.user_id}>
              <TableCell>{user.user_id}</TableCell>
              <TableCell>{user.student_id}</TableCell>
              <TableCell>
                {user.first_name} {user.last_name}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default Tables
