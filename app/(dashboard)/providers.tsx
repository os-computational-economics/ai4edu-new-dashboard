"use client";
import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { Layout } from "../../components/layout/layout";
import { useEffect } from "react";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    if (accessToken) {
      const decodedToken = jwt.decode(accessToken);
      if (decodedToken && typeof decodedToken !== "string") {
        console.log(decodedToken);
      }
    } else {
      // Redirect to login page
      router.push("/auth/signin");
    }
  }, []);
  return (
    <NextUIProvider>
      <NextThemesProvider
        defaultTheme="system"
        attribute="class"
        {...themeProps}
      >
        <Layout>{children}</Layout>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
