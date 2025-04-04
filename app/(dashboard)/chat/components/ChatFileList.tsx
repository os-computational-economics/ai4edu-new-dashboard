"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Input,
  Card,
  CardHeader,
  ScrollShadow,
  Switch,
} from "@heroui/react";
import { File } from "lucide-react";
import { GetAgentByIDResponse } from "@/api/agent/agent";
import { HAVE_SEEN_FILE_TOOLTIP_LOCAL_STORAGE_KEY } from "@/utils/constants";

const ChatFileList = ({
  agent,
  setSelectedDocument,
  uniqueFileIDs,
}: {
  agent: GetAgentByIDResponse;
  setSelectedDocument: (string) => void;
  uniqueFileIDs: string[];
}) => {
  const [fileSearchQuery, setFileSearchQuery] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [showReferencedFilesOnly, setShowReferencedFilesOnly] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasSeenTooltip, setHasSeenTooltip] = useState(true);

  useEffect(() => {
    const hasSeenTooltipValue = localStorage.getItem(
      HAVE_SEEN_FILE_TOOLTIP_LOCAL_STORAGE_KEY
    );
    if (!hasSeenTooltipValue) {
      setHasSeenTooltip(false);
      const showTimer = setTimeout(() => {
        setShowTooltip(true);

        const hideTimer = setTimeout(() => {
          setShowTooltip(false);
          localStorage.setItem(
            HAVE_SEEN_FILE_TOOLTIP_LOCAL_STORAGE_KEY,
            "true"
          );
          setHasSeenTooltip(true);
        }, 9000);

        return () => clearTimeout(hideTimer);
      }, 2000);

      return () => clearTimeout(showTimer);
    }
  }, []);

  return (
    <Popover
      placement="bottom"
      offset={10}
      size="lg"
      isOpen={isPopoverOpen}
      onOpenChange={setIsPopoverOpen}
      onClose={() => {
        setFileSearchQuery("");
      }}
    >
      <PopoverTrigger>
        <Button isIconOnly variant="flat">
          <Tooltip
            content="View Files"
            placement="bottom"
            closeDelay={50}
            offset={15}
            {...(!hasSeenTooltip && { isOpen: showTooltip })}
          >
            <File size={20} />
          </Tooltip>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[80vw] sm:w-[50vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw]">
        {(titleProps) => (
          <div className="pr-1 pl-0 py-2 w-full">
            <div className="flex flex-row items-center justify-between">
              <p
                className="text-md font-bold text-foreground pl-2"
                {...titleProps}
              >
                Files
              </p>
              <div className="flex flex-row items-center gap-2">
                <div className="text-sm text-foreground">
                  Referenced files only
                </div>
                <Switch
                  size="sm"
                  isSelected={showReferencedFilesOnly}
                  onChange={() =>
                    setShowReferencedFilesOnly(!showReferencedFilesOnly)
                  }
                />
              </div>
            </div>
            {agent && (
              <div className="mt-2 flex flex-col gap-2 w-full">
                <Input
                  size="sm"
                  placeholder="Search files"
                  radius="sm"
                  onChange={(e) => setFileSearchQuery(e.target.value)}
                  onClear={() => setFileSearchQuery("")}
                  isClearable
                  className="px-2"
                />
                <ScrollShadow className="flex flex-col gap-2 overflow-auto py-1 px-2 max-h-[70vh]">
                  {showReferencedFilesOnly && uniqueFileIDs.length === 0 ? (
                    <div className="px-2 py-4 text-center text-sm text-foreground-muted">
                      No files have been referenced in this chat session. Only
                      referenced files are shown when this toggle is enabled.
                    </div>
                  ) : (
                    agent.agent_files &&
                    Object.entries(agent.agent_files)
                      .filter(([file_id, file_name]) => {
                        const matchesSearch = file_name
                          .toLowerCase()
                          .includes(fileSearchQuery.toLowerCase());
                        const isReferenced = uniqueFileIDs.includes(file_id);
                        return (
                          matchesSearch &&
                          (!showReferencedFilesOnly || isReferenced)
                        );
                      })
                      .map(([file_id, file_name]) => (
                        <div
                          key={file_id}
                          onClick={() => {
                            setSelectedDocument(file_id);
                            setIsPopoverOpen(false);
                          }}
                        >
                          <Card
                            className="flex flex-row items-center gap-2 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800"
                            shadow="sm"
                          >
                            <CardHeader>
                              <span className="text-sm text-wrap break-words">
                                {file_name}
                              </span>
                            </CardHeader>
                          </Card>
                        </div>
                      ))
                  )}
                </ScrollShadow>
              </div>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ChatFileList;
