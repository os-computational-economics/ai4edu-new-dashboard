import React, { useState, useEffect } from 'react'
import { Sidebar } from './sidebar.styles'
import { Avatar, Tooltip } from '@nextui-org/react'
import { CompaniesDropdown } from './companies-dropdown'
import { HomeIcon } from '../icons/sidebar/home-icon'
import { AgentsIcon } from '../icons/sidebar/agents-icon'
import { BalanceIcon } from '../icons/sidebar/balance-icon'
import { AccountsIcon } from '../icons/sidebar/accounts-icon'
import { CustomersIcon } from '../icons/sidebar/customers-icon'
import { ChatsIcon } from '../icons/sidebar/chats-icon'
import { CollapseItems } from './collapse-items'
import { SidebarItem } from './sidebar-item'
import { SidebarMenu } from './sidebar-menu'
import { FilterIcon } from '../icons/sidebar/filter-icon'
import { useSidebarContext } from '../layout/layout-context'
import { ChangeLogIcon } from '../icons/sidebar/changelog-icon'
import { usePathname } from 'next/navigation'
import { Image } from '@nextui-org/react'

// Mock API call to fetch courses
const fetchCourses = async () => {
  return [
    {
      name: 'ECON 380',
      location: 'Computational Economics - Student',
      logo: <Image src="/favicon.ico" alt="logo" className="w-11 rounded-md" />,
      role: 'student'
    },
    {
      name: 'ACCT 101',
      location: 'Accounting Principles - Student',
      logo: <Image src="/favicon.ico" alt="logo" className="w-11 rounded-md" />,
      role: 'student'
    },
    {
      name: 'CSDS 101',
      location: 'Introduction to Computer Science - Teacher',
      logo: <Image src="/favicon.ico" alt="logo" className="w-11 rounded-md" />,
      role: 'teacher'
    },
    {
      name: 'ABCD 101',
      location: 'Introduction to ABCD - Admin',
      logo: <Image src="/favicon.ico" alt="logo" className="w-11 rounded-md" />,
      role: 'admin'
    }
  ]
}

export const SidebarWrapper = () => {
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const pathname = usePathname()
  const { collapsed, setCollapsed } = useSidebarContext()

  useEffect(() => {
    const getCourses = async () => {
      const courses = await fetchCourses()
      setCourses(courses)
    }
    getCourses()
  }, [])

  const renderSidebarItems = (role) => {
    const commonItems = [
      <SidebarItem
        key="accounts"
        title="Accounts"
        icon={<AccountsIcon />}
        isActive={pathname === '/accounts'}
        href="accounts"
      />
    ]

    if (role === 'teacher' || role === 'admin') {
      commonItems.push(
        <SidebarItem
          key="manage-agents"
          isActive={pathname === '/manage-agents'}
          title="Manage Agents"
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

    if (role === 'admin') {
      commonItems.push(
        <SidebarItem
          key="access-control"
          isActive={pathname === '/access-control'}
          title="Access Control"
          icon={<AgentsIcon />}
          href="access-control"
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
          <CompaniesDropdown courses={courses} setSelectedCourse={setSelectedCourse} />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem title="Home" icon={<HomeIcon />} isActive={pathname === '/'} href="/" />
            {selectedCourse && (
              <SidebarMenu title={selectedCourse.name}>{renderSidebarItems(selectedCourse.role)}</SidebarMenu>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
