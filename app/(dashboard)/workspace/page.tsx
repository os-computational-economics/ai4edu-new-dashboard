"use client";
import React, { useState, useCallback } from "react";
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
  Switch,
  Textarea,
  addToast,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Tooltip,
} from "@heroui/react";
import useMount from "@/components/hooks/useMount";
import {
  createWorkspace,
  editWorkspace,
  getWorkspaceList,
  setWorkspaceStatus,
  Workspace as WorkspaceType,
} from "@/api/workspace/workspace";

import { forceRefreshWorkspaceAndToken } from "@/utils/CookiesUtil";
import { Edit, Copy } from "lucide-react";

const Workspace = () => {
  const [workspacePrompt, setWorkspacePrompt] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceComment, setWorkspaceComment] = useState("");
  const [workspaceList, setWorkspaceList] = useState<WorkspaceType[]>([]);
  const [schoolID, setSchoolID] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setisLoading] = useState(false);

  // Edit workspace modal state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedWorkspace, setSelectedWorkspace] =
    useState<WorkspaceType | null>(null);
  const [editWorkspaceName, setEditWorkspaceName] = useState("");
  const [editWorkspacePrompt, setEditWorkspacePrompt] = useState("");
  const [editWorkspaceComment, setEditWorkspaceComment] = useState("");
  const [isEditLoading, setIsEditLoading] = useState(false);

  const totalPage = Math.ceil(total / pageSize);

  useMount(() => {
    fetchWorkspaceList(currentPage, pageSize);
  });

  const createNewWorkspace = () => {
    setisLoading(true);
    const params = {
      workspace_name: workspaceName,
      school_id: schoolID,
      workspace_prompt: workspacePrompt,
      workspace_comment: workspaceComment,
    };

    createWorkspace(params)
      .then((res) => {
        setisLoading(false);
        console.log("Workspace created:", res);
        addToast({
          title: "Workspace created successfully",
          color: "success",
        });
        setWorkspacePrompt("");
        setWorkspaceName("");
        setWorkspaceComment("");
        setSchoolID(1);
        fetchWorkspaceList(currentPage, pageSize);
        forceRefreshWorkspaceAndToken();
      })
      .catch((error) => {
        console.log(error);
        setisLoading(false);
        addToast({
          title: error?.response?.data?.message,
          color: "danger",
        });
        console.error("Error creating workspace:", error);
      });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setisLoading(true);
    fetchWorkspaceList(page, pageSize);
  };

  const fetchWorkspaceList = (page: number, pageSize: number) => {
    const params = {
      page,
      page_size: pageSize,
    };
    getWorkspaceList(params)
      .then((res) => {
        setWorkspaceList(res.items);
        setTotal(res.total);
        setisLoading(false);
        console.log(res);
      })
      .catch((error) => {
        setisLoading(false);
        console.error("Error fetching workspace list:", error);
      });
  };

  const handleWorkspaceStatusChange = (workspace: WorkspaceType) => {
    // 1 = active, 0 = inactive, 2 = deleted
    // Toggle workspace status: if it's 1, set it to 0; if it's 0, set it to 1.
    const toggledStatus = workspace.status === 1 ? 0 : 1;
    const data = {
      workspace_id: workspace.workspace_id,
      workspace_status: toggledStatus,
    };

    setWorkspaceStatus(data)
      .then((res) => {
        addToast({
          title: "Workspace status updated successfully",
          color: "success",
        });
        console.log("Workspace status updated successfully!");
        fetchWorkspaceList(currentPage, pageSize);
        setSelectedWorkspace((prev) =>
          prev ? { ...prev, status: toggledStatus } : null
        );
        onClose(); // Close the modal after successful status change
      })
      .catch((error) => {
        console.error("Error updating workspace status:", error);
        addToast({
          title: "Failed to update workspace status",
          color: "danger",
        });
      });
  };

  const openEditModal = (workspace: WorkspaceType) => {
    setSelectedWorkspace(workspace);
    setEditWorkspaceName(workspace.workspace_name);
    setEditWorkspacePrompt(workspace.workspace_prompt);
    setEditWorkspaceComment(workspace.workspace_comment);
    onOpen();
  };

  const handleEditWorkspace = () => {
    if (!selectedWorkspace) return;

    setIsEditLoading(true);
    const data = {
      workspace_id: selectedWorkspace.workspace_id,
      workspace_name: editWorkspaceName,
      workspace_prompt: editWorkspacePrompt,
      workspace_comment: editWorkspaceComment,
    };

    editWorkspace(data)
      .then((res) => {
        addToast({
          title: "Workspace updated successfully",
          color: "success",
        });
        console.log("Workspace updated successfully!");
        fetchWorkspaceList(currentPage, pageSize);
        onClose();
        setIsEditLoading(false);
      })
      .catch((error) => {
        console.error("Error updating workspace:", error);
        addToast({
          title: "Failed to update workspace",
          color: "danger",
        });
        setIsEditLoading(false);
      });
  };

  return (
    <div className="m-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Create Workspace</h2>
        <div className="grid grid-cols-2 gap-4">
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
            label="School ID"
            type="number"
            value={String(schoolID)}
            onChange={(e) => setSchoolID(Number(e.target.value))}
          />
          <Textarea
            label="Workspace Prompt"
            value={workspacePrompt}
            onChange={(e) => setWorkspacePrompt(e.target.value)}
          />
          <Textarea
            label="Workspace Comment"
            value={workspaceComment}
            onChange={(e) => setWorkspaceComment(e.target.value)}
          />
        </div>
        <Spacer y={1} />
        <div className="flex justify-end mt-2">
          <Button
            isLoading={isLoading}
            isDisabled={!workspaceName || !schoolID}
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
          aria-label="Workspace List"
          bottomContent={
            totalPage > 0 && (
              <div>
                <div className="flex h-full w-full items-center justify-center">
                  <Pagination
                    isDisabled={isLoading}
                    page={currentPage}
                    total={totalPage}
                    onChange={handlePageChange}
                    isCompact
                  />
                  <div className="ml-8 text-small text-default-600">{`Total ${total} workspaces${
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
            <TableColumn key="workspace_join_code">
              Workspace Join Code
            </TableColumn>
            <TableColumn key="workspace_status">Status</TableColumn>
            <TableColumn key="workspace_prompt">Workspace Prompt</TableColumn>
            <TableColumn key="workspace_comment">Workspace Comment</TableColumn>
            <TableColumn key="edit_workspace">Edit Workspace</TableColumn>
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
                <TableCell>
                  <Tooltip content={workspace.workspace_id}>
                    <span>{workspace.workspace_id.substring(0, 8)}...</span>
                  </Tooltip>
                </TableCell>
                <TableCell>{workspace.workspace_name}</TableCell>
                <TableCell>
                  <Chip
                    className="cursor-pointer select-all hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1"
                    color="primary"
                    variant="flat"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        workspace.workspace_join_code
                      );
                      addToast({
                        title: "Workspace code copied to clipboard",
                        color: "success",
                      });
                    }}
                  >
                    <div className="flex items-center gap-1 font-mono">
                      {workspace.workspace_join_code}
                      <Copy size={14} />
                    </div>
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip
                    color={workspace.status === 1 ? "success" : "default"}
                    size="sm"
                  >
                    {workspace.status === 1 ? "Active" : "Inactive"}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Tooltip
                    content={
                      <div className="px-1 py-2">
                        <div className="text-small font-bold">
                          Workspace Prompt
                        </div>
                        <div className="text-tiny max-w-[50vw]">
                          {workspace.workspace_prompt}
                        </div>
                      </div>
                    }
                  >
                    <span>
                      {workspace.workspace_prompt?.length > 100
                        ? workspace.workspace_prompt.substring(0, 100) + "..."
                        : workspace.workspace_prompt}
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip
                    content={
                      <div className="px-1 py-2">
                        <div className="text-small font-bold">
                          Workspace Comment
                        </div>
                        <div className="text-tiny max-w-[50vw]">
                          {workspace.workspace_comment}
                        </div>
                      </div>
                    }
                  >
                    <span>
                      {workspace.workspace_comment?.length > 100
                        ? workspace.workspace_comment.substring(0, 100) + "..."
                        : workspace.workspace_comment}
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => openEditModal(workspace)}
                  >
                    <Edit size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Workspace Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            {`Edit Workspace ${
              selectedWorkspace ? selectedWorkspace.workspace_name : ""
            }`}
          </ModalHeader>
          <ModalBody>
            {selectedWorkspace && (
              <>
                <div className="mb-6 border-b pb-4">
                  <h3 className="text-lg font-semibold mb-3">
                    Workspace Status
                  </h3>
                  <div className="flex items-center">
                    <Switch
                      isSelected={selectedWorkspace.status === 1}
                      onChange={() =>
                        handleWorkspaceStatusChange(selectedWorkspace)
                      }
                    />
                    <span className="ml-2">
                      {selectedWorkspace.status === 1 ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Edit Workspace Details
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <Input
                      label="Workspace Name"
                      value={editWorkspaceName}
                      disabled
                      onChange={(e) => setEditWorkspaceName(e.target.value)}
                    />
                    <Textarea
                      label="Workspace Prompt"
                      value={editWorkspacePrompt}
                      onChange={(e) => setEditWorkspacePrompt(e.target.value)}
                    />
                    <Textarea
                      label="Workspace Comment"
                      value={editWorkspaceComment}
                      onChange={(e) => setEditWorkspaceComment(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleEditWorkspace}
              isLoading={isEditLoading}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Workspace;
