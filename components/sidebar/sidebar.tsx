import React from 'react'
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

export const SidebarWrapper = () => {
  const pathname = usePathname()
  const { collapsed, setCollapsed } = useSidebarContext()

  return (
    <aside className="h-screen z-[20] sticky top-0">
      {collapsed ? <div className={Sidebar.Overlay()} onClick={setCollapsed} /> : null}
      <div
        className={Sidebar({
          collapsed: collapsed
        })}
      >
        <div className={Sidebar.Header()}>
          <CompaniesDropdown />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem title="Home" icon={<HomeIcon />} isActive={pathname === '/'} href="/" />
            <SidebarMenu title="ECON 380">
              <SidebarItem
                isActive={pathname === '/accounts'}
                title="Accounts"
                icon={<AgentsIcon />}
                href="accounts"
              />
              <SidebarItem
                isActive={pathname === '/manage-agents'}
                title="Manage Agents"
                icon={<AgentsIcon />}
                href="manage-agents"
              />
              <SidebarItem
                isActive={pathname === '/access-control'}
                title="Access Control"
                icon={<AgentsIcon />}
                href="access-control"
              />
              <SidebarItem
                isActive={pathname === '/chat-history'}
                title="Chat History"
                icon={<AgentsIcon />}
                href="chat-history"
              />
              <SidebarItem isActive={pathname === '/chats'} title="Chats" icon={<ChatsIcon />} />
              <CollapseItems
                icon={<BalanceIcon />}
                items={['Banks Accounts', 'Credit Cards', 'Loans']}
                title="Balances"
              />
              <SidebarItem isActive={pathname === '/customers'} title="Customers" icon={<CustomersIcon />} />
            </SidebarMenu>
          </div>
        </div>
      </div>
    </aside>
  )
}
