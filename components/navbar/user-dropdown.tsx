import React, { useState, useEffect } from 'react'

import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Navbar, NavbarItem } from '@nextui-org/react'
import { DarkModeSwitch } from './darkmodeswitch'
import Cookies from 'js-cookie'
import jwt, { JwtPayload } from 'jsonwebtoken'

export const UserDropdown = () => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')

  const Logout = () => {
    Cookies.remove('refresh_token')
    Cookies.remove('access_token')
    Cookies.remove('full_name')
    window.location.href = '/auth/signin'
  }

  useEffect(() => {
    const token = Cookies.get('access_token')
    const decodedToken = jwt.decode(token) as JwtPayload
    console.log('decodedToken', decodedToken)
    setEmail(decodedToken.email || '-')
    setFullName(`${decodedToken.first_name} ${decodedToken.last_name}` || '-')
  }, [])

  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Avatar
            as="button"
            color="secondary"
            size="md"
            src="https://source.boringavatars.com/beam/120/Mari?colors=ADEADA,BDEADB,CDEADC,DDEADD,B9E1F0"
          />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu aria-label="User menu actions" onAction={(actionKey) => console.log({ actionKey })}>
        <DropdownItem key="profile" className="flex flex-col justify-start w-full items-start">
          <p>{fullName}</p>
          <p>{email}</p>
        </DropdownItem>
        <DropdownItem key="settings">My Settings</DropdownItem>
        <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          className="text-danger"
          showDivider
          onClick={() => {
            Logout()
          }}
        >
          Log Out
        </DropdownItem>
        <DropdownItem
          key="switch"
          style={{
            transition: 'background-color 0.2s ease',
            backgroundColor: 'transparent',
            cursor: 'default'
          }}
        >
          <DarkModeSwitch />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
