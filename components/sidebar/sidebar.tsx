import React, { useState, useEffect } from 'react'
import { Sidebar } from './sidebar.styles'
import { Avatar, Tooltip, Image } from '@nextui-org/react'
import CourseDropdown from './course-dropdown'
import { HomeIcon } from '../icons/sidebar/home-icon'
import { AgentsIcon } from '../icons/sidebar/agents-icon'
import { AccountsIcon } from '../icons/sidebar/accounts-icon'
import { ChatsIcon } from '../icons/sidebar/chats-icon'
import { SidebarItem } from './sidebar-item'
import { SidebarMenu } from './sidebar-menu'
import { useSidebarContext } from '../layout/layout-context'
import { usePathname } from 'next/navigation'

interface SelectedCourse {
  id: string
  name: string
  role: string
  semester: string
}

export const SidebarWrapper = () => {
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState<SelectedCourse | null>(null)
  const pathname = usePathname()
  const { collapsed, setCollapsed } = useSidebarContext()

  useEffect(() => {
    const storedCourses = JSON.parse(localStorage.getItem('courses') || '{}') || []
    setCourses(storedCourses)

    const storedSelectedCourse = JSON.parse(localStorage.getItem('selectedCourse') || '{}')
    if (storedSelectedCourse) {
      setSelectedCourse(storedSelectedCourse)
    }

    const handleCourseSelected = (event) => {
      setSelectedCourse(event.detail)
    }

    window.addEventListener('courseSelected', handleCourseSelected)

    return () => {
      window.removeEventListener('courseSelected', handleCourseSelected)
    }
  }, [])

  const renderCommonItems = (role) => {
    const commonItems = [
      <SidebarItem key="home" title="Home" icon={<HomeIcon />} isActive={pathname === '/'} href="/" />
    ]
    if (role === 'admin') {
      commonItems.push(
        <SidebarItem
          key="access-control"
          isActive={pathname === '/access-control'}
          title="Access Control"
          icon={<AgentsIcon />}
          href="access-control"
        />,
        <SidebarItem
          key="chat-history"
          isActive={pathname === '/chat-history'}
          title="Chat History"
          icon={<ChatsIcon />}
          href="chat-history"
        />
      )
    }
    return commonItems
  }

  const renderSidebarItems = (role) => {
    const commonItems = [<></>]

    if (role === 'teacher') {
      commonItems.push(
        <SidebarItem
          key="roster"
          isActive={pathname === '/roster'}
          title="Roster"
          icon={<AccountsIcon />}
          href="roster"
        />,
        <SidebarItem
          key="manage-agents"
          isActive={pathname === '/manage-agents'}
          title="Learning Assistants"
          icon={<AgentsIcon />}
          href="manage-agents"
        />,
        <SidebarItem
          key="chat-history"
          isActive={pathname === '/chat-history'}
          title="Chat History"
          icon={<ChatsIcon />}
          href="chat-history"
        />
      )
    }

    if (role === 'student') {
      commonItems.push(
        <SidebarItem
          key="manage-agents"
          isActive={pathname === '/manage-agents'}
          title="Learning Assistants"
          icon={<AgentsIcon />}
          href="manage-agents"
        />,
        <SidebarItem
          key="chat-history"
          isActive={pathname === '/chat-history'}
          title="Chat History"
          icon={<ChatsIcon />}
          href="chat-history"
        />
      )
    }

    return commonItems
  }

  return (
    <aside className="h-screen z-[20] sticky top-0">
      {collapsed ? <div className={Sidebar.Overlay()} onClick={setCollapsed} /> : null}
      <div className={Sidebar({ collapsed: collapsed })}>
        <div className={Sidebar.Header()}>
          <CourseDropdown courses={courses} setSelectedCourse={setSelectedCourse} />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            {renderCommonItems(selectedCourse?.role)}
            {selectedCourse && selectedCourse.role != 'admin' && (
              <SidebarMenu title={selectedCourse.name}>{renderSidebarItems(selectedCourse.role)}</SidebarMenu>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default SidebarWrapper
