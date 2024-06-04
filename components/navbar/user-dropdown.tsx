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
    Cookies.remove('email')
    localStorage.clear()
    window.location.href = '/auth/signin'
  }

  useEffect(() => {
    const access_token = Cookies.get('access_token')
    const refresh_token = Cookies.get('refresh_token')
    if (access_token) {
      const decodedToken = jwt.decode(access_token) as JwtPayload
      console.log('decodedToken', decodedToken)
      setEmail(decodedToken.email || '-')
      setFullName(`${decodedToken.first_name} ${decodedToken.last_name}` || '-')
      // cache full name and email into cookies for 15 days,
      // so that when access token expires but refresh token is still valid,
      // we can still show user's name and email
      Cookies.set('full_name', `${decodedToken.first_name} ${decodedToken.last_name}`, { expires: 15 })
      Cookies.set('email', decodedToken.email, { expires: 15 })
    } else if (refresh_token) {
      setFullName(Cookies.get('full_name') || '-')
      setEmail(Cookies.get('email') || '-')
    }
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
