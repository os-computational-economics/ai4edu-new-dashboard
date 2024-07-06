import React, { useState, useContext, createContext } from 'react'
import { useLockedBody } from '../hooks/useBodyLock'
import { NavbarWrapper } from '../navbar/navbar'
import { SidebarWrapper } from '../sidebar/sidebar'
import { SidebarContext } from './layout-context'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface Props {
  children: React.ReactNode
}
interface WorkspaceContextType {
  currentWorkspace: any
  setCurrentWorkspace: React.Dispatch<React.SetStateAction<any>>
}

const defaultWorkspaceContext: WorkspaceContextType = {
  currentWorkspace: null,
  setCurrentWorkspace: () => {}
}

export const WorkspaceContext = createContext<WorkspaceContextType>(defaultWorkspaceContext)

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
      <ToastContainer />
      <WorkspaceContext.Provider value={{ currentWorkspace, setCurrentWorkspace }}>
        <section className="flex">
          <SidebarWrapper />
          <NavbarWrapper>{children}</NavbarWrapper>
        </section>
      </WorkspaceContext.Provider>
    </SidebarContext.Provider>
  )
}
