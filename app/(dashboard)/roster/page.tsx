"use client";
import React, { useState, useEffect, useContext } from "react";
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
  addToast,
} from "@heroui/react";
import { getUserList, User } from "@/api/auth/auth";
import { addUsersViaCsv } from "@/api/workspace/workspace";
import { WorkspaceContext } from "@/components/layout/layout";
import Upload from "@/components/upload/upload";

const Tables = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setisLoading] = useState(false);
  const [file, setFile] = useState(null);

  const totalPage = Math.ceil(total / pageSize);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { currentWorkspace, setCurrentWorkspace } =
    useContext(WorkspaceContext);

  useEffect(() => {
    fetchUserList(currentPage, pageSize);
  }, []);

  const fetchUserList = (page: number, pageSize: number) => {
    const params = {
      page,
      page_size: pageSize,
      workspace_id:
        currentWorkspace?.id ||
        JSON.parse(localStorage.getItem("workspace")!)?.id,
    };

    getUserList(params)
      .then((res) => {
        setisLoading(false);
        setUsers(res.items);
        setTotal(res.total);
      })
      .catch((error) => {
        setisLoading(false);
        console.error("Error fetching users:", error);
      });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setisLoading(true);
    fetchUserList(page, pageSize);
  };

  const handleSearch = (reload) => {
    if (reload) {
      setisLoading(true);
      setCurrentPage(1); // Reset to first page for new search

      fetchUserList(1, pageSize);
    }
  };

  const handleFileChange = (event) => {
    console.log("file:", event);
    setFile(event.target.files[0]);
    // handleFileUpload()
  };

  const handleFileUpload = (file) => {
    if (!file) {
      addToast({
        title: "Please select a file to upload",
        color: "danger",
      });
      return;
    }

    const formData = new FormData();

    const workspaceId =
      currentWorkspace?.id ||
      JSON.parse(localStorage.getItem("workspace")!)?.id;
    const urlWorkspace = `admin/workspace/add_users_via_csv?workspace_id=${workspaceId}`;

    formData.append("file", file);

    addUsersViaCsv(formData, urlWorkspace)
      .then((response) => {
        addToast({
          title: "Users added successfully",
          color: "success",
        });
        setCurrentPage(1);
        setFile(null);
        fetchUserList(currentPage, pageSize);
      })
      .catch((error) => {
        addToast({
          title: "Error uploading file",
          color: "danger",
        });
        console.error("Error uploading file:", error);
      });
  };

  const openModal = () => setIsModalVisible(true);

  return (
    <div className="m-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold my-1">Course Roster</h1>
        <div className="flex gap-2 items-center">
          {/* <Tooltip content="Upload student roster from SIS">
            <MdInfoOutline />
          </Tooltip>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="py-2 px-4 border border-gray-300 rounded-lg text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          {file && <Button onClick={handleFileUpload}>Add Students</Button>} */}
          <p className="text-gray-600 text-tiny">
            Download{" "}
            <a
              href="/template.csv"
              download="template.csv"
              className="text-blue-700 font-bold "
            >
              template
            </a>
          </p>
          <Button color="primary" onClick={() => openModal()}>
            Add Student
          </Button>
        </div>
      </div>

      <Upload
        isOpen={isModalVisible}
        modalTitle="Add Student"
        customMessage="Upload the CSV file downloaded from SIS or from template."
        onClose={() => setIsModalVisible(false)}
        onFileUpload={handleFileUpload}
        acceptFileTypes={".csv"}
        maxFileSizeMB={1}
      />
      <Table
        topContentPlacement="outside"
        aria-label="Users List"
        bottomContent={
          totalPage > 0 && (
            <div>
              <div className="flex h-full w-full items-center justify-center">
                <Pagination
                  isDisabled={isLoading}
                  page={currentPage}
                  total={totalPage}
                  onChange={handlePageChange}
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
  );
};

export default Tables;
