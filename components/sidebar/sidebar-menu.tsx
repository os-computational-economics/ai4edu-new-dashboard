import React from 'react'
import { Chip } from '@nextui-org/react'

interface Props {
  title: string
  children?: React.ReactNode
}

export const SidebarMenu = ({ title, children }: Props) => {
  return (
    <div className="flex gap-2 flex-col pl-6">
      <span className="text-xs font-normal ">
        <Chip color="primary" variant="flat" size="md">
          {title}
        </Chip>
      </span>
      {children}
    </div>
  )
}
