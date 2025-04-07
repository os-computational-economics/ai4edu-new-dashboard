"use client";
import React, { useState } from "react";
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
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Switch,
  useDisclosure,
  addToast,
  NumberInput,
  Select,
  SelectItem,
  Card,
  CardBody,
} from "@heroui/react";
import { getPrivilegedUserList, PrivilegedUser } from "@/api/auth/auth";
import { setWorkspaceAdminRole } from "@/api/workspace/workspace";
import { RefreshCw } from "lucide-react";
import { Edit } from "lucide-react";
import useMount from "@/components/hooks/useMount";

const SystemAccessControl = () => {
  const [users, setUsers] = useState<PrivilegedUser[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<PrivilegedUser | null>(null);
  const [workspaceAdmin, setWorkspaceAdmin] = useState(false);
  const [inputUserId, setInputUserId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<string[]>([]);

  const roleOptions = [
    { key: "set_admin", label: "Set as Workspace Admin" },
    { key: "remove_admin", label: "Remove Workspace Admin" },
  ];

  const totalPage = Math.ceil(total / pageSize);

  useMount(() => {
    fetchPrivilegedUsers(currentPage, pageSize);
  });

  const fetchPrivilegedUsers = (page: number, pageSize: number) => {
    setIsLoading(true);
    getPrivilegedUserList({ page, page_size: pageSize })
      .then((res) => {
        setUsers(res.items);
        setTotal(res.total);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching privileged users:", error);
        setIsLoading(false);
      });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchPrivilegedUsers(page, pageSize);
  };

  const handleRefresh = () => {
    fetchPrivilegedUsers(currentPage, pageSize);
  };

  const openEditModal = (user: PrivilegedUser) => {
    setSelectedUser(user);
    setWorkspaceAdmin(user.workspace_admin);
    onOpen();
  };

  const handleSave = () => {
    if (!selectedUser) return;

    setIsEditLoading(true);
    setWorkspaceAdminRole({
      user_id: selectedUser.user_id,
      workspace_admin: workspaceAdmin,
    })
      .then(() => {
        addToast({
          title: "Workspace admin role updated successfully",
          color: "success",
        });
        fetchPrivilegedUsers(currentPage, pageSize);
        onClose();
      })
      .catch((error) => {
        console.error("Error updating workspace admin role:", error);
        addToast({
          title: "Failed to update workspace admin role",
          color: "danger",
        });
      })
      .finally(() => {
        setIsEditLoading(false);
      });
  };

  const handleSetWorkspaceAdmin = () => {
    if (!inputUserId || selectedRole.length === 0) {
      addToast({
        title: "Please enter a user ID and select a role",
        color: "danger",
      });
      return;
    }

    const isAdmin = selectedRole[0] === "set_admin";

    setIsLoading(true);
    setWorkspaceAdminRole({
      user_id: inputUserId,
      workspace_admin: isAdmin,
    })
      .then(() => {
        addToast({
          title: `Successfully ${isAdmin ? "set" : "removed"} workspace admin role`,
          color: "success",
        });
        fetchPrivilegedUsers(currentPage, pageSize);
        setInputUserId(null);
        setSelectedRole([]);
      })
      .catch((error) => {
        console.error("Error updating workspace admin role:", error);
        addToast({
          title: "Failed to update workspace admin role",
          color: "danger",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const renderCreatedWorkspaces = (workspaces: Record<string, string>) => {
    return Object.entries(workspaces).map(([workspaceId, name]) => (
      <Chip key={workspaceId} size="sm" className="mr-2 mb-2">
        {name}
      </Chip>
    ));
  };

  const topContent = (
    <Card className="mb-4" shadow="sm">
      <CardBody>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              Access changes may take up to 30 minutes to take effect. To apply
              changes immediately, please have the user log out and log back in.
            </div>
            <Button
              variant="bordered"
              size="sm"
              color="default"
              onClick={handleRefresh}
              isLoading={isLoading}
              endContent={<RefreshCw size={16} />}
            >
              Reload List
            </Button>
          </div>

          <div className="flex justify-between items-center gap-4">
            <NumberInput
              size="sm"
              hideStepper
              label="User ID"
              className="max-w-xs"
              onValueChange={setInputUserId}
            />
            <Select
              label="Select Action"
              className="max-w-xs"
              size="sm"
              selectedKeys={selectedRole}
              onChange={(e) => {
                setSelectedRole([e.target.value]);
              }}
            >
              {roleOptions.map((role) => (
                <SelectItem key={role.key}>{role.label}</SelectItem>
              ))}
            </Select>
            <Button
              color="primary"
              isDisabled={!inputUserId || selectedRole.length === 0 || isLoading}
              onClick={handleSetWorkspaceAdmin}
              isLoading={isLoading}
            >
              Set Role
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div>
      <Table
        topContent={topContent}
        topContentPlacement="outside"
        aria-label="Privileged Users List"
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
                <div className="ml-8 text-small text-default-600">{`Total ${total} user${
                  total === 1 ? `` : `s`
                }`}</div>
              </div>
            </div>
          )
        }
      >
        <TableHeader>
          <TableColumn key="user_id">User ID</TableColumn>
          <TableColumn key="name">Name</TableColumn>
          <TableColumn key="email">Email</TableColumn>
          <TableColumn key="student_id">Student ID</TableColumn>
          <TableColumn key="system_admin">System Admin</TableColumn>
          <TableColumn key="workspace_admin">Workspace Admin</TableColumn>
          <TableColumn key="created_workspaces">Created Workspaces</TableColumn>
          <TableColumn key="actions">Actions</TableColumn>
        </TableHeader>
        <TableBody
          items={users}
          isLoading={isLoading}
          emptyContent="No privileged users found"
          loadingContent={
            <div>
              <Spinner label="Loading..." />
            </div>
          }
        >
          {users.map((user) => (
            <TableRow key={user.user_id}>
              <TableCell>{user.user_id}</TableCell>
              <TableCell>
                {user.first_name} {user.last_name}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.student_id}</TableCell>
              <TableCell>
                <Chip
                  color={user.system_admin ? "success" : "default"}
                  size="sm"
                >
                  {user.system_admin ? "Yes" : "No"}
                </Chip>
              </TableCell>
              <TableCell>
                <Chip
                  color={user.workspace_admin ? "success" : "default"}
                  size="sm"
                >
                  {user.workspace_admin ? "Yes" : "No"}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap">
                  {renderCreatedWorkspaces(user.created_workspaces)}
                </div>
              </TableCell>
              <TableCell>
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  onClick={() => openEditModal(user)}
                >
                  <Edit />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Edit Workspace Admin Role
          </ModalHeader>
          <ModalBody>
            {selectedUser && (
              <div>
                <div className="mb-4">
                  <p className="text-sm text-default-500">User: {selectedUser.first_name} {selectedUser.last_name}</p>
                  <p className="text-sm text-default-500">Email: {selectedUser.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    isSelected={workspaceAdmin}
                    onValueChange={setWorkspaceAdmin}
                  />
                  <span>Workspace Admin</span>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleSave}
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

export default SystemAccessControl; 