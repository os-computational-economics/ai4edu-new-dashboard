'use client'
import React, { useState, useMemo, useEffect, useRef } from 'react'
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
  Select,
  SelectItem,
  Input
} from '@nextui-org/react'
import { getUserList, grantAccess, User } from '@/api/auth/auth'
import { getWorkspaceList, setUserRole, setUserRoleUserID } from '@/api/workspace/workspace'
import { MdCached } from 'react-icons/md'
import useMount from '@/components/hooks/useMount'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import throttle from 'lodash/throttle'
import { set } from 'lodash'

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
  const [workspaceID, setWorkspaceID] = useState('all')
  const [values, setValues] = useState<string[]>([])
  const [roleValue, setroleValue] = useState<string[]>([])
  const [userValue, setUserValue] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [userID, setUserID] = useState('')
  const [studentID, setStudentID] = useState('')

  const totalPage = Math.ceil(total / pageSize)

  const roleDict = [
    { key: 'student', label: 'student' },
    { key: 'teacher', label: 'teacher' }
  ]

  useMount(() => {
    fetchWorkspaceList(currentPage, pageSize)
    fetchUserList(currentPage, pageSize, 'all')
  })

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

  const fetchUserList = (page: number, pageSize: number, workspace_id: string) => {
    const params = {
      page,
      page_size: pageSize,
      workspace_id: workspace_id || 'all',
      user_name: searchValue || '',
      user_id: userID || ''
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
    fetchUserList(page, pageSize, workspaceID)
  }

  const handleSearch = (reload) => {
    if (reload) {
      setisLoading(true)
      setCurrentPage(1) // Reset to first page for new search

      fetchUserList(1, pageSize, workspaceID)
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
      user_id: user.user_id,
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

  const setUsersRole = () => {
    const requestData = {
      user_id: Number(userID),
      student_id: "N/A", // setting to "N/A" as we are not using student_id
      workspace_id: workspaceID,
      role: roleValue[0]
    }
    setUserRoleUserID(requestData).then(() => {
      toast.success(`User ${userID} updated with role ${roleValue}`)
      fetchUserList(1, pageSize, workspaceID)
    })
  }

  const onSelectionchange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue: string = e.target.value
    console.log('selectedValue', selectedValue)
    setValues([selectedValue])
    setWorkspaceID(selectedValue)
    fetchUserList(1, pageSize, selectedValue)
  }

  const topContent = (
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
      <div className="flex justify-between items-center gap-4">
        <Select
          size="sm"
          label="Select Workspace"
          onChange={(e) => {
            onSelectionchange(e)
          }}
          selectedKeys={values}
          // disabled={isLoading}
        >
          {workspaceList.map((workspace) => (
            <SelectItem key={workspace.workspace_id}>{workspace.workspace_name}</SelectItem>
          ))}
        </Select>
        <Input
          size="sm"
          isDisabled={!values.length || isLoading}
          type="email"
          label="User ID"
          className="max-w-xs"
          onValueChange={setUserID}
        />
        <Select
          label="Select a role"
          className="max-w-xs"
          size="sm"
          selectedKeys={roleValue}
          isDisabled={!values.length || isLoading}
          onChange={(e) => {
            setroleValue([e.target.value])
          }}
        >
          {roleDict.map((role) => (
            <SelectItem key={role.key}>{role.label}</SelectItem>
          ))}
        </Select>
        <Button
          color="primary"
          isDisabled={!values.length || !userID || !roleValue.length || isLoading}
          onClick={() => setUsersRole()}
          isLoading={isLoading}
          endContent={<MdCached />}
        >
          Add User
        </Button>
      </div>
    </div>
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
                <div className="ml-8 text-small text-default-600">{`Total ${total} user${total === 1 ? `` : `s`}`}</div>
              </div>
            </div>
          )
        }
      >
        <TableHeader>
          <TableColumn key="user_id">User ID</TableColumn>
          <TableColumn key="student_id">Student ID</TableColumn>
          <TableColumn key="name">User Name</TableColumn>
          <TableColumn key="role">Role</TableColumn>
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
              <TableCell>{user?.workspace_role[workspaceID]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default Tables
