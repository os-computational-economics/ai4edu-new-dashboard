import React from "react";
import { useTheme as useNextTheme } from "next-themes";
import { Switch } from "@nextui-org/react";
import { MoonIcon } from "../icons/navbar/moon-icon";
import { SunIcon } from "../icons/navbar/sun-icon";

export const DarkModeSwitch = () => {
  const { setTheme, resolvedTheme } = useNextTheme();
  return (
    <Switch
      isSelected={resolvedTheme === "dark" ? true : false}
      thumbIcon={({ isSelected }) => (isSelected ? <MoonIcon /> : <SunIcon />)}
      onValueChange={(e) => setTheme(e ? "dark" : "light")}
      color="default"
      size="lg"
    />
  );
};
