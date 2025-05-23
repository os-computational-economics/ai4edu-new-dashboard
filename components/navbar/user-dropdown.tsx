import React, { useState, useEffect } from 'react'
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Navbar, NavbarItem } from '@nextui-org/react'
import { DarkModeSwitch } from './darkmodeswitch'
import Cookies from 'js-cookie'
import jwt, { JwtPayload } from 'jsonwebtoken'

export const UserDropdown = () => {
  const [fullName, setFullName] = useState('')
  const [nameInitials, setNameInitials] = useState('')
  const [email, setEmail] = useState('')

  const Logout = () => {
    const firstLevelDomain = '.' + window.location.hostname.split('.').slice(-2).join('.')
    Cookies.remove('refresh_token', { domain: firstLevelDomain })
    Cookies.remove('access_token', { domain: firstLevelDomain })
    Cookies.remove('full_name', { domain: firstLevelDomain })
    Cookies.remove('email', { domain: firstLevelDomain })
    localStorage.clear()
    window.location.href = '/auth/signin'
  }

  useEffect(() => {
    const access_token = Cookies.get('access_token')
    const refresh_token = Cookies.get('refresh_token')
    const firstLevelDomain = '.' + window.location.hostname.split('.').slice(-2).join('.')

    if (access_token) {
      const decodedToken = jwt.decode(access_token) as JwtPayload
      setEmail(decodedToken.email || '-')
      setFullName(`${decodedToken.first_name} ${decodedToken.last_name}` || '-')
      setNameInitials(`${decodedToken.first_name?.charAt(0)}${decodedToken.last_name?.charAt(0)}`)
      // cache full name and email into cookies for 15 days,
      // so that when access token expires but refresh token is still valid,
      // we can still show user's name and email
      Cookies.set('name_initials', `${decodedToken.first_name?.charAt(0)}${decodedToken.last_name?.charAt(0)}`, {
        expires: 15,
        domain: firstLevelDomain
      });
      Cookies.set('full_name', `${decodedToken.first_name} ${decodedToken.last_name}`, {
        expires: 15,
        domain: firstLevelDomain
      });
      Cookies.set('email', decodedToken.email, {
        expires: 15,
        domain: firstLevelDomain
      });
      Cookies.set('user_id', decodedToken.user_id, { 
        expires: 15, 
        domain: firstLevelDomain 
      });
    } else if (refresh_token) {
      setFullName(Cookies.get('full_name') || '-')
      setEmail(Cookies.get('email') || '-')
      setNameInitials(Cookies.get('name_initials') || '')
    }
  }, [])

  return (
    <Dropdown>
      
      <NavbarItem>
        
        <DropdownTrigger>
          {
            // use first letter of first name and last name
          <Avatar
            as="button"
            color="default"
            size="sm"
            radius='md'
            name={`${nameInitials}`}
          />
          }
        </DropdownTrigger>
        
      </NavbarItem>
        
      <DropdownMenu aria-label="User menu actions" onAction={(actionKey) => console.log({ actionKey })}>
        <DropdownItem isReadOnly key="profile" className="flex flex-col justify-start w-full items-start">
          <p>{fullName}</p>
          <p>{email}</p>
        </DropdownItem>
        {/* <DropdownItem key="settings">My Settings</DropdownItem>
        <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem> */}
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
