import React, { useState, useEffect } from "react";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarItem,
} from "@heroui/react";
import { DarkModeSwitch } from "./darkmodeswitch";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AUTH_PATH, LOGIN_PERSISTENCE_IN_DAYS } from "@/utils/constants";

export const UserDropdown = () => {
  const [fullName, setFullName] = useState("");
  const [nameInitials, setNameInitials] = useState("");
  const [email, setEmail] = useState("");

  const Logout = () => {
    Cookies.remove("refresh_token");
    Cookies.remove("access_token");
    Cookies.remove("full_name");
    Cookies.remove("email");
    localStorage.clear();
    window.location.href = AUTH_PATH;
  };

  useEffect(() => {
    const access_token = Cookies.get("access_token");
    const refresh_token = Cookies.get("refresh_token");

    if (access_token) {
      const decodedToken = jwt.decode(access_token) as JwtPayload;
      setEmail(decodedToken.email || "-");
      setFullName(
        `${decodedToken.first_name} ${decodedToken.last_name}` || "-"
      );
      setNameInitials(
        `${decodedToken.first_name?.charAt(0)}${decodedToken.last_name?.charAt(
          0
        )}`
      );
      // cache full name and email into cookies for 15 days,
      // so that when access token expires but refresh token is still valid,
      // we can still show user's name and email
      Cookies.set(
        "name_initials",
        `${decodedToken.first_name?.charAt(0)}${decodedToken.last_name?.charAt(
          0
        )}`,
        {
          expires: LOGIN_PERSISTENCE_IN_DAYS,
        }
      );
      Cookies.set(
        "full_name",
        `${decodedToken.first_name} ${decodedToken.last_name}`,
        {
          expires: LOGIN_PERSISTENCE_IN_DAYS,
        }
      );
      Cookies.set("email", decodedToken.email, {
        expires: LOGIN_PERSISTENCE_IN_DAYS,
      });
      Cookies.set("user_id", decodedToken.user_id, {
        expires: LOGIN_PERSISTENCE_IN_DAYS,
      });
    } else if (refresh_token) {
      setFullName(Cookies.get("full_name") || "-");
      setEmail(Cookies.get("email") || "-");
      setNameInitials(Cookies.get("name_initials") || "");
    }
  }, []);

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
              radius="md"
              name={`${nameInitials}`}
            />
          }
        </DropdownTrigger>
      </NavbarItem>

      <DropdownMenu
        aria-label="User menu actions"
        onAction={(actionKey) => console.log({ actionKey })}
      >
        <DropdownItem
          isReadOnly
          key="profile"
          className="flex flex-col justify-start w-full items-start"
        >
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
          onPress={() => {
            Logout();
          }}
        >
          Log Out
        </DropdownItem>
        <DropdownItem
          key="switch"
          style={{
            transition: "background-color 0.2s ease",
            backgroundColor: "transparent",
            cursor: "default",
          }}
        >
          <DarkModeSwitch />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
