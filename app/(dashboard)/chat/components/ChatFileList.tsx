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
} from "@nextui-org/react";
import { File } from "lucide-react";
import { Agent } from "@/api/agent/agent";

const ChatFileList = ({ agent }: { agent: Agent }) => {
  const [fileSearchQuery, setFileSearchQuery] = useState("");

  return (
    <Popover placement="bottom" offset={10} size="lg">
      <PopoverTrigger>
        <Button isIconOnly variant="flat">
          <Tooltip content="View Files" placement="bottom" closeDelay={50}>
            <File size={20} />
          </Tooltip>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px]">
        {(titleProps) => (
          <div className="px-1 py-2 w-full">
            <p className="text-md font-bold text-foreground" {...titleProps}>
              Files
            </p>
            {agent && (
              <div className="mt-2 flex flex-col gap-2 w-full">
                <Input
                  size="sm"
                  placeholder="Search files"
                  radius="sm"
                  value={fileSearchQuery}
                  onChange={(e) => setFileSearchQuery(e.target.value)}
                />
                <div className="flex flex-col gap-2">
                  {agent?.agent_files &&
                    Object.entries(agent.agent_files)
                      .filter(([file_id, file_name]) =>
                        file_name
                          .toLowerCase()
                          .includes(fileSearchQuery.toLowerCase())
                      )
                      .map(([file_id, file_name]) => (
                        <Card
                          key={file_id}
                          className="flex flex-row items-center gap-2"
                          shadow="sm"
                        >
                          <CardHeader>
                            <span className="text-sm">{file_name}</span>
                          </CardHeader>
                        </Card>
                      ))}
                </div>
              </div>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ChatFileList;
