"use client";
import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { Layout } from "../../components/layout/layout";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import useMount from "@/components/hooks/useMount";
import { getCurrentUserStudentID, getCurrentUserID } from "@/utils/CookiesUtil";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  useMount(() => {
    // send a OnPage event to Vercel Analytics every 30 seconds
    const interval = setInterval(() => {
      try {
        const userInfo = JSON.stringify({
          studentID: getCurrentUserStudentID(),
          userID: getCurrentUserID(),
        });
        const pageInfo = JSON.stringify({
          title: document.title,
          timestamp: new Date().toISOString(),
          url: window.location.href,
        });
        track("OnPage", {
          userInfo: userInfo,
          PageInfo: pageInfo,
        });
      } catch (e) {
        track("TrackingError", {
          error: String(e),
        });
      }
    }, 30000);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    const refreshToken = Cookies.get("refresh_token");
    if (!refreshToken) {
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
