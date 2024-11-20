"use client";
import React, { useState } from "react";
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
} from "@nextui-org/react";
import { File } from "lucide-react";
import { Agent } from "@/api/agent/agent";

const ChatFileList = ({
  agent,
  setSelectedDocument,
}: {
  agent: Agent;
  setSelectedDocument: (string) => void;
}) => {
  const [fileSearchQuery, setFileSearchQuery] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <Popover
      placement="bottom"
      offset={10}
      size="lg"
      isOpen={isPopoverOpen}
      onOpenChange={setIsPopoverOpen}
    >
      <PopoverTrigger>
        <Button isIconOnly variant="flat">
          <Tooltip content="View Files" placement="bottom" closeDelay={50}>
            <File size={20} />
          </Tooltip>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[80vw] sm:w-[50vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw]">
        {(titleProps) => (
          <div className="pr-1 pl-0 py-2 w-full">
            <p className="text-md font-bold text-foreground pl-2" {...titleProps}>
              Files
            </p>
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
                  {agent?.agent_files &&
                    Object.entries(agent.agent_files)
                      .filter(([file_id, file_name]) =>
                        file_name
                          .toLowerCase()
                          .includes(fileSearchQuery.toLowerCase())
                      )
                      .map(([file_id, file_name]) => (
                        <div
                          key={file_id}
                          onClick={() => {
                            setSelectedDocument(file_id);
                            setIsPopoverOpen(false);
                          }}
                        >
                          <Card
                            key={file_id}
                            className="flex flex-row items-center gap-2 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                            shadow="sm"
                          >
                            <CardHeader>
                              <span className="text-sm text-wrap break-words">
                                {file_name}
                              </span>
                            </CardHeader>
                          </Card>
                        </div>
                      ))}
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
