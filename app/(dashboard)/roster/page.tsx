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
  Checkbox
} from '@nextui-org/react'
import { getUserList, grantAccess, User } from '@/api/auth/auth'
import { MdCached } from 'react-icons/md'
import useMount from '@/components/hooks/useMount'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { WorkspaceContext } from '@/components/layout/layout'

const Tables = () => {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isLoading, setisLoading] = useState(false)

  const totalPage = Math.ceil(total / pageSize)

  const [currentWorkspace, setCurrentWorkspace] = useContext(WorkspaceContext)

  const fetchUserList = (page: number, pageSize: number) => {
    const params = {
      page,
      page_size: pageSize,
      workspace_id: currentWorkspace?.id
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

  return (
    <div className="m-6">
      <div>
        <h1 className="text-2xl font-bold">Course Roster</h1>
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
