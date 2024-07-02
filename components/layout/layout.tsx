import React, { useState, useContext } from 'react'
import { useLockedBody } from '../hooks/useBodyLock'
import { NavbarWrapper } from '../navbar/navbar'
import { SidebarWrapper } from '../sidebar/sidebar'
import { SidebarContext } from './layout-context'

interface Props {
  children: React.ReactNode
}

export const WorkspaceContext = React.createContext()

export const Layout = ({ children }: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [_, setLocked] = useLockedBody(false)
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
    setLocked(!sidebarOpen)
  }
  const [currentWorkspace, setCurrentWorkspace] = useState()

  return (
    <SidebarContext.Provider
      value={{
        collapsed: sidebarOpen,
        setCollapsed: handleToggleSidebar
      }}
    >
      <WorkspaceContext.Provider value={[currentWorkspace, setCurrentWorkspace]}>
        <section className="flex">
          <SidebarWrapper />
          <NavbarWrapper>{children}</NavbarWrapper>
        </section>
      </WorkspaceContext.Provider>
    </SidebarContext.Provider>
  )
}
