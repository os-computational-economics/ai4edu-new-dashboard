"use client";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import React, { useState } from "react";
import { AcmeIcon } from "../icons/acme-icon";
import { AcmeLogo } from "../icons/acmelogo";
import { BottomIcon } from "../icons/sidebar/bottom-icon";

interface Company {
  name: string;
  location: string;
  logo: React.ReactNode;
}

const companies = [
  {
    name: "ECON 380",
    location: "Computational Economics",
    logo: <img src="/favicon.ico" className="w-9 h-9 rounded-md" alt="logo" />,
  },
  {
    name: "ACCT 101",
    location: "Accounting Principles",
    logo: <img src="/favicon.ico" className="w-9 h-9 rounded-md" alt="logo" />,
  },
  {
    name: "CSDS 101",
    location: "Introduction to Computer Science",
    logo: <img src="/favicon.ico" className="w-9 h-9 rounded-md" alt="logo" />,
  },
  {
    name: "ABCD 101",
    location: "Introduction to ABCD",
    logo: <img src="/favicon.ico" className="w-9 h-9 rounded-md" alt="logo" />,
  },
];

export const CompaniesDropdown = () => {
  const [company, setCompany] = useState<Company>(companies[0]);
  return (
    <Dropdown
      classNames={{
        base: "w-full min-w-[260px]",
      }}
    >
      <DropdownTrigger className="cursor-pointer">
        <div className="flex items-center gap-2">
          {company.logo}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-medium m-0 text-default-900 -mb-4 whitespace-nowrap">
              {company.name}
            </h3>
            <span className="text-xs font-medium text-default-500">
              {company.location}
            </span>
          </div>
          <BottomIcon />
        </div>
      </DropdownTrigger>
      <DropdownMenu
        onAction={(e) => {
          const selectedCompany = companies.find(
            (_, index) => index.toString() === e
          );
          if (selectedCompany) {
            setCompany(selectedCompany);
          }
        }}
        aria-label="Avatar Actions"
      >
        <DropdownSection title="Courses">
          {companies.map((company, index) => (
            <DropdownItem
              key={index.toString()}
              startContent={company.logo}
              description={company.location}
              classNames={{
                base: "py-4",
                title: "text-base font-semibold",
              }}
            >
              {company.name}
            </DropdownItem>
          ))}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};
