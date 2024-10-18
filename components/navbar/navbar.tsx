import { Input, Link, Navbar, NavbarContent } from '@nextui-org/react'
import React, { useEffect, useState, useContext } from 'react'
import { FeedbackIcon } from '../icons/navbar/feedback-icon'
import { GithubIcon } from '../icons/navbar/github-icon'
import { SupportIcon } from '../icons/navbar/support-icon'
import { SearchIcon } from '../icons/searchicon'
import { BurguerButton } from './burguer-button'
import { NotificationsDropdown } from './notifications-dropdown'
import { UserDropdown } from './user-dropdown'
import { WorkspaceContext } from '@/components/layout/layout'

interface Props {
  children: React.ReactNode
}

interface SelectedCourse {
  id: string
  name: string
  role: string
}

export const NavbarWrapper = ({ children }: Props) => {
  const { currentWorkspace, setCurrentWorkspace } = useContext(WorkspaceContext)

  return (
    <div className="relative flex flex-col flex-1 overflow-x-hidden h-screen">
      <Navbar
        isBordered
        className="w-full"
        classNames={{
          wrapper: 'w-full max-w-full'
        }}
      >
        {/* {currentWorkspace ? (
          <NavbarContent justify="start">
            Current Workspace: {currentWorkspace?.name} - {currentWorkspace?.role}
          </NavbarContent>
        ) : (
          'no workspace selected'
        )} */}
        <NavbarContent className="md:hidden">
          <BurguerButton />
        </NavbarContent>
        <NavbarContent justify="end" className="w-fit data-[justify=end]:flex-grow-0 absolute right-5">
          {/* <NotificationsDropdown /> */}
          <NavbarContent>
            <UserDropdown />
          </NavbarContent>
        </NavbarContent>
      </Navbar>
      <div className="flex-1 dark:bg-[#121212]">{children}</div>
    </div>
  )
}
