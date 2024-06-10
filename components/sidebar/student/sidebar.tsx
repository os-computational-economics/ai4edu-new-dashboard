"use client"
import React, { useState } from "react";
import { Sidebar } from "../sidebar.styles";

import { HomeIcon } from "../../icons/sidebar/home-icon";
import { ChatsIcon } from "../../icons/sidebar/chats-icon";
import { ChevronDown, HistoryIcon } from "lucide-react";

import { SidebarItem } from "../sidebar-item";
import { SidebarMenu } from "../sidebar-menu";
import { useSidebarContext } from "../../layout/layout-context";

import { usePathname, useRouter } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CourseDropdown } from "../course-dropdown";

interface SidebarWrapperProps {
  selectedCourse: string;
  onCourseChange: (course: string) => void;
}

export const SidebarWrapper: React.FC<SidebarWrapperProps> = ({onCourseChange }) => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <aside className="h-screen z-[20] sticky top-0">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <CourseDropdown onCourseChange={onCourseChange} />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title="Home"
              icon={<HomeIcon />}
              isActive={pathname === "/"}
              href="/"
            />

            <SidebarMenu title="ECON 380">
              <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="w-[200px] "
              >
                <div className="flex items-center justify-between px-4">
                  <h4 className="text-base font-semibold">Go to Chats</h4>
                  <CollapsibleTrigger asChild>
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <div className="space-y-1">
                    <div className="ml-4 font-mono text-sm">
                      <SidebarItem
                        isActive={pathname === "/chat"}
                        title="Agent 1"
                        icon={<ChatsIcon />}
                        href="/chat"
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              <SidebarItem
                isActive={pathname === "/chathistory"}
                title="Chat History"
                icon={<HistoryIcon />}
              />
            </SidebarMenu>
          </div>
        </div>
      </div>
    </aside>
  );
};
