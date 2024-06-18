import React, { useState } from "react";
import {
  useModal,
  Button,
  Input,
  Card,
  useDisclosure,
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { fileUploadURL } from "@/api/chat/chat";
import { on } from "events";
import { set } from "react-hook-form";

export const FileUploadForm: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [confirmUploadButtonText, setConfirmUploadButtonText] =
    useState("Confirm Upload");
  const [confirmUploadButtonDisabled, setConfirmUploadButtonDisabled] =
    useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      if (selectedFile.size > 10485760) {
        return;
      }
      if (!selectedFile.type.match(/application\/pdf/)) {
        return;
      }
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleUpload = async () => {
    setConfirmUploadButtonText("Uploading...");
    setConfirmUploadButtonDisabled(true);
    if (!file) {
      return;
    }
    if (!fileName) {
      return;
    }
    if (file && fileName) {
      if (file.size > 10485760) {
        return;
      }
      if (!file.type.match(/application\/pdf/)) {
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("file_name", fileName);

      fetch(fileUploadURL, {
      // fetch("http://localhost:8000/v1/dev/user/upload_file", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          onOpenChange();
          setFileName("");
          setFile(null);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        })
        .finally(() => {
          setConfirmUploadButtonText("Confirm Upload");
          setConfirmUploadButtonDisabled(false);
        });
    }
  };

  return (
    <div>
      <Input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        fullWidth
        required
      />
      <Button onClick={handleUpload} disabled={confirmUploadButtonDisabled}>
        {confirmUploadButtonText}
      </Button>
    </div>
  );
};
