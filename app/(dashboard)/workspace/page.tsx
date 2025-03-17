'use client'
import React, { useEffect, useState } from 'react'
import {
  Button,
  Input,
  Spacer,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Spinner,
  Pagination,
  Switch
} from '@nextui-org/react'
import useMount from '@/components/hooks/useMount'
import { createWorkspace, getWorkspaceList, setWorkspaceStatus, Workspace as WorkspaceType } from '@/api/workspace/workspace'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Workspace = () => {
  const [workspaceId, setWorkspaceId] = useState('')
  const [workspaceName, setWorkspaceName] = useState('')
  const [workspacePassword, setWorkspacePassword] = useState('')
  const [workspaceList, setWorkspaceList] = useState<WorkspaceType[]>([])
  const [schoolID, setSchoolID] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [isLoading, setisLoading] = useState(false)

  const totalPage = Math.ceil(total / pageSize)

  useMount(() => {
    fetchWorkspaceList(currentPage, pageSize)
  })

  const createNewWorkspace = () => {
    setisLoading(true)
    const params = {
      workspace_id: workspaceId,
      workspace_name: workspaceName,
      workspace_password: workspacePassword,
      school_id: schoolID
    }

    createWorkspace(params)
      .then((res) => {
        setisLoading(false)
        console.log('Workspace created:', res)
        toast.success('Workspace created successfully')
        setWorkspaceId('')
        setWorkspaceName('')
        setWorkspacePassword('')
        setSchoolID(1)
        fetchWorkspaceList(currentPage, pageSize)
      })
      .catch((error) => {
        console.log(error)
        setisLoading(false)
        toast.error(error?.response?.data?.message)
        console.error('Error creating workspace:', error)
      })
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    setisLoading(true)
    fetchWorkspaceList(page, pageSize)
  }

  const fetchWorkspaceList = (page: number, pageSize: number) => {
    const params = {
      page,
      page_size: pageSize
    }
    getWorkspaceList(params)
      .then((res) => {
        setWorkspaceList(res.items)
        setTotal(res.total)
        setisLoading(false)
        console.log(res)
      })
      .catch((error) => {
        setisLoading(false)
        console.error('Error fetching workspace list:', error)
      })
  }

  const handleWorkspaceStatusChange = (workspace: WorkspaceType) => {
    // 1 = active, 0 = inactive, 2 = deleted
    // Toggle workspace status: if it's 1, set it to 0; if it's 0, set it to 1.
    const toggledStatus = workspace.status === 1 ? 0 : 1
    const data = {
      workspace_id: workspace.workspace_id,
      workspace_status: toggledStatus
    }

    setWorkspaceStatus(data)
      .then((res) => {
        toast.success('Workspace updated successfully')
        console.log('Workspace status updated successfully!')
        fetchWorkspaceList(currentPage, pageSize)
      })
      .catch((error) => {
        console.error('Error updating workspace status:', error)
      })
  }

  return (
    <div className="m-6">
      <ToastContainer />
      <div>
        <h2 className="text-xl font-bold mb-4">Create Workspace</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input
            isClearable
            isRequired
            label="Workspace ID"
            value={workspaceId}
            onChange={(e) => setWorkspaceId(e.target.value)}
          />
          <Input
            isClearable
            isRequired
            label="Workspace Name"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
          />
          <Input
            isClearable
            isRequired
            label="Workspace Password"
            value={workspacePassword}
            onChange={(e) => setWorkspacePassword(e.target.value)}
          />
          <Input
            isClearable
            isRequired
            label="School ID"
            type="number"
            value={String(schoolID)}
            onChange={(e) => setSchoolID(Number(e.target.value))}
          />
        </div>
        <Spacer y={1} />
        <div className="flex justify-end mt-2">
          <Button
            isLoading={isLoading}
            isDisabled={!workspaceId || !workspaceName || !workspacePassword || !schoolID}
            onClick={createNewWorkspace}
            color="primary"
          >
            Create Workspace
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-4">Current Workspaces</h2>
        <Table
          topContentPlacement="outside"
          aria-label="Users List"
          bottomContent={
            totalPage > 0 && (
              <div>
                <div className="flex h-full w-full items-center justify-center">
                  <Pagination isDisabled={isLoading} page={currentPage} total={totalPage} onChange={handlePageChange} />
                  <div className="ml-8 text-small text-default-600">{`Total ${total} user${
                    total === 1 ? `` : `s`
                  }`}</div>
                </div>
              </div>
            )
          }
        >
          <TableHeader>
            <TableColumn key="school_id">School ID</TableColumn>
            <TableColumn key="workspace_id">Workspace ID</TableColumn>
            <TableColumn key="workspace_name">Workspace Name</TableColumn>
            <TableColumn key="workspace_status">Workspace Status</TableColumn>
          </TableHeader>
          <TableBody
            items={workspaceList}
            isLoading={isLoading}
            emptyContent="No users found"
            loadingContent={
              <div>
                <Spinner label="Loading..." />
              </div>
            }
          >
            {workspaceList.map((workspace) => (
              <TableRow key={workspace.workspace_id}>
                <TableCell>{workspace.school_id}</TableCell>
                <TableCell>{workspace.workspace_id}</TableCell>
                <TableCell>{workspace.workspace_name}</TableCell>
                <TableCell>
                  <Switch
                    isSelected={workspace.status === 1}
                    onChange={(e) => handleWorkspaceStatusChange(workspace)}
                  />
                  {workspace.status === 1 ? 'Active' : 'Inactive'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Workspace
