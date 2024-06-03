'use client'
import React, { useState } from 'react'
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

const Tables = () => {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isLoading, setisLoading] = useState(false)

  const totalPage = Math.ceil(total / pageSize)

  useMount(() => {
    fetchUserList(currentPage, pageSize)
  })

  const fetchUserList = (page: number, pageSize: number) => {
    const params = {
      page,
      page_size: pageSize
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

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="text-sm">
            Access changes may take up to 30 minutes to take effect. To apply changes immediately, please have the user
            log out and log back in.
          </div>
          <div className="flex gap-3">
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
        </div>
      </div>
    )
  }, [isLoading])

  return (
    <div className='m-6'>
      <div>
        <h1 className='text-2xl font-bold'>Access Control</h1>
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
                {user.last_name} {user.first_name}
              </TableCell>
              <TableCell>
                <CheckboxGroup
                  orientation="horizontal"
                  defaultValue={Object.keys(user.role).filter((role) => user.role[role])}
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
