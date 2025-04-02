import React, { useState, useEffect } from 'react'
import { Sidebar } from './sidebar.styles'
import { Avatar, Tooltip, Image } from '@nextui-org/react'
import CourseDropdown from './course-dropdown'
import { HomeIcon } from '../icons/sidebar/home-icon'
import { SidebarItem } from './sidebar-item'
import { SidebarMenu } from './sidebar-menu'
import { useSidebarContext } from '../layout/layout-context'
import { usePathname } from 'next/navigation'
import { CustomersIcon } from '../icons/sidebar/customers-icon'
import { CollapseItems } from './collapse-items'
import { isSystemAdmin, isWorkspaceAdmin, formatedCourses } from '@/utils/CookiesUtil'
import { useRouter } from 'next/navigation'
import { Users, BotMessageSquare, History, Settings, KeySquare, LayoutDashboard } from 'lucide-react'

interface SelectedCourse {
  id: string
  name: string
  role: string
  semester: string
}

interface Course {
  id: string
  role: string
  name: string
}

export const SidebarWrapper = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<SelectedCourse | null>(null)
  const pathname = usePathname()
  const { collapsed, setCollapsed } = useSidebarContext()
  const router = useRouter()

  useEffect(() => {
    const handleCourseSelected = (event) => {
      console.log('event.detail', event.detail)
      setSelectedCourse(event.detail)
    }

    window.addEventListener('courseSelected', handleCourseSelected)

    if (typeof window !== 'undefined') {
      const savedCourse = localStorage.getItem('workspace')
      if (savedCourse) {
        setSelectedCourse(JSON.parse(savedCourse))
      }
    }

    return () => {
      window.removeEventListener('courseSelected', handleCourseSelected)
    }
  }, [])

  const renderCommonItems = (): React.ReactNode[] => {
    return [<SidebarItem key="dashboard" title="Dashboard" icon={<LayoutDashboard />} isActive={pathname === '/'} href="/" />]
  }

  const renderSidebarItems = (role: string): React.ReactNode[] => {
    const sidebarItems: React.ReactNode[] = []

    if (role === 'teacher') {
      sidebarItems.push(
        <SidebarItem
          key="roster"
          isActive={pathname === '/roster'}
          title="Roster"
          icon={<Users />}
          href="roster"
        />,
        <SidebarItem
          key="agents"
          isActive={pathname === '/agents'}
          title="Agents"
          icon={<BotMessageSquare />}
          href="agents"
        />,
        <SidebarItem
          key="chat-history"
          isActive={pathname === '/chat-history'}
          title="Chat History"
          icon={<History />}
          href="chat-history"
        />
      )
    }

    if (role === 'student') {
      sidebarItems.push(
        <SidebarItem
          key="agents"
          isActive={pathname === '/agents'}
          title="Agents"
          icon={<BotMessageSquare />}
          href="agents"
        />,
        <SidebarItem
          key="chat-history"
          isActive={pathname === '/chat-history'}
          title="Chat History"
          icon={<History />}
          href="chat-history"
        />
      )
    }

    return sidebarItems
  }

  const renderAdminItems = (): React.ReactNode[] => {
    const adminItems: React.ReactNode[] = []

    adminItems.push(
      <SidebarItem
        key="workspace"
        isActive={pathname === '/workspace'}
        title="Workspace Management"
        icon={<Settings size={32} />}
        href="workspace"
      />,
      <SidebarItem
        key="access-control"
        isActive={pathname === '/access-control'}
        title="Access Control"
        icon={<KeySquare />}
        href="access-control"
      />
      // <SidebarItem
      //   key="chat-history-admin"
      //   isActive={pathname === '/chat-history'}
      //   title="Chat History Admin"
      //   icon={<ChatsIcon />}
      //   href="chat-history"
      // />
    )

    return adminItems
  }

  return (
    <aside className="h-screen z-[20] sticky top-0">
      {collapsed ? <div className={Sidebar.Overlay()} onClick={setCollapsed} /> : null}
      <div className={Sidebar({ collapsed: collapsed })}>
        <div className={Sidebar.Header()}>
          <Image src="/favicon.ico" alt="logo" className="rounded-md" />
          <div>
            <div className="text-xl font-medium m-0 text-default-900 whitespace-nowrap">AI4EDU</div>
            {/* <div className="text-xs font-medium text-default-500">Learning Assitant</div> */}
          </div>
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            {renderCommonItems()}
            {selectedCourse && (
              <SidebarMenu title={selectedCourse.name}>{renderSidebarItems(selectedCourse.role)}</SidebarMenu>
            )}
            {isSystemAdmin() ? <SidebarMenu title="System Admin">{renderAdminItems()}</SidebarMenu>
              : isWorkspaceAdmin() ? <SidebarMenu title="Workspace Admin">{renderAdminItems()}</SidebarMenu>
              : null}
            {}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default SidebarWrapper
