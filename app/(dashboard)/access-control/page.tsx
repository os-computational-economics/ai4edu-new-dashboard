'use client'
import React, { useState, useMemo, useEffect } from 'react'
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
  Select,
  SelectSection,
  SelectItem
} from '@nextui-org/react'
import { getUserList, grantAccess, User } from '@/api/auth/auth'
import { getWorkspaceList } from '@/api/workspace/workspace'
import { MdCached } from 'react-icons/md'
import useMount from '@/components/hooks/useMount'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { set } from 'react-hook-form'

interface Workspace {
  workspace_id: string
  workspace_name: string
  workspace_password: string
  school_id: string
}

const Tables = () => {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isLoading, setisLoading] = useState(false)
  const [workspaceList, setWorkspaceList] = useState<Workspace[]>([])
  const [workspaceID, setWorkspaceID] = useState('')
  const [values, setValues] = useState([])

  const totalPage = Math.ceil(total / pageSize)

  useEffect(() => {
    fetchWorkspaceList(currentPage, pageSize)
    fetchUserList(currentPage, pageSize)
  }, [])

  const fetchWorkspaceList = (page: number, pageSize: number) => {
    const params = {
      page,
      page_size: pageSize
    }
    getWorkspaceList(params)
      .then((res) => {
        console.log(res)
        setWorkspaceList(res.workspace_list)
      })
      .catch((error) => {
        console.error('Error fetching workspace list:', error)
      })
  }

  const fetchUserList = (page: number, pageSize: number, id = 'all') => {
    const params = {
      page,
      page_size: pageSize,
      workspace_id: id || workspaceID
    }

    console.log('params', params)

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
      fetchWorkspaceList(1, pageSize)
    }
  }

  const handleRoleChange = (user, selectedRoles) => {
    const updatedRoles = {
      student: selectedRoles.includes('student'),
      teacher: selectedRoles.includes('teacher'),
      admin: selectedRoles.includes('admin')
    }

    const requestData = {
      student_id: user.student_id,
      role: updatedRoles
    }

    grantAccess(requestData)
      .then(() => {
        toast.success(`Roles updated for ${user.first_name} ${user.last_name}`)
      })
      .catch((error) => {
        toast.error(`Failed to update roles: ${error.message}`)
        console.error('Error updating roles:', error)
      })
  }

  const onSelectionchange = (e) => {
    console.log(values)
    setValues(values)
    setWorkspaceID(e.target.value)
    fetchUserList(1, pageSize, e.target.value)
  }

  const topContent = useMemo(
    () => (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="text-sm">
            Access changes may take up to 30 minutes to take effect. To apply changes immediately, please have the user
            log out and log back in.
          </div>
          <Button
            variant="bordered"
            size="sm"
            color="default"
            onClick={() => handleSearch(true)}
            isLoading={isLoading}
            endContent={<MdCached />}
          >
            Reload List
          </Button>
        </div>
        <Select
          size="sm"
          label="Select Workspace"
          onChange={(e) => {
            onSelectionchange(e)
          }}
          selectedKeys={values}
          disabled={isLoading}
        >
          {workspaceList.map((workspace) => (
            <SelectItem key={workspace.workspace_id}>{workspace.workspace_name}</SelectItem>
          ))}
        </Select>
      </div>
    ),
    [isLoading]
  )

  return (
    <div className="m-6">
      <div>
        <h1 className="text-2xl font-bold">Access Control</h1>
      </div>
      <ToastContainer />
      <Table
        topContent={topContent}
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
          <TableColumn key="roles" align="center">
            Roles
          </TableColumn>
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
              <TableCell>
                <CheckboxGroup
                  orientation="horizontal"
                  // defaultValue={Object.keys(user.role).filter((role) => user.role[role])}
                  onChange={(selectedRoles) => handleRoleChange(user, selectedRoles)}
                >
                  <Checkbox value="student">Student</Checkbox>
                  <Checkbox value="teacher">Teacher</Checkbox>
                  <Checkbox value="admin">Admin</Checkbox>
                </CheckboxGroup>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default Tables
