"use client";
import React from "react";
import { Tabs, Tab } from "@heroui/react";
import WorkspaceAccessControl from "./components/WorkspaceAccessControl";
import SystemAccessControl from "./components/SystemAccessControl";

const AccessControl = () => {
  return (
    <div className="m-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Access Control</h1>
      </div>
      <Tabs aria-label="Access Control Tabs">
        <Tab key="workspace" title="Workspace Access Control">
          <WorkspaceAccessControl />
        </Tab>
        <Tab key="system" title="System Access Control">
          <SystemAccessControl />
        </Tab>
      </Tabs>
    </div>
  );
};

export default AccessControl;
