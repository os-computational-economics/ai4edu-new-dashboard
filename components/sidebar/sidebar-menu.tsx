import React from "react";
import { Chip } from "@nextui-org/react";
import { Card } from "@nextui-org/react";

interface Props {
  title: string;
  children?: React.ReactNode;
}

export const SidebarMenu = ({ title, children }: Props) => {
  return (
    <Card shadow="sm" className="p-1 mb-3">
      <div className="flex gap-2 flex-col">
        <span className="text-xs font-normal ">
          <Chip size="md" className="rounded-xl">
            {title}
          </Chip>
        </span>
        {children}
      </div>
    </Card>
  );
};
