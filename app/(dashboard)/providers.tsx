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
import { getCurrentUserID } from "@/utils/CookiesUtil";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  useMount(() => {
    // send a OnPage event to Vercel Analytics every 30 seconds
    (function sendOnPageEvent() {
      try {
        const userInfo = JSON.stringify({
          userID: getCurrentUserID(),
        });
        const pageInfo = JSON.stringify({
          title: document.title,
          timestamp: new Date().toISOString(),
          url: window.location.href,
        });
        // make sure both userInfo and pageInfo are not empty before sending the event
        // this is to avoid sending empty events
        // judging empty by checking if the string length is less than 10
        if (userInfo.length < 10 || pageInfo.length < 10) {
          return;
        }
        track("OnPage", {
          userInfo: userInfo,
          PageInfo: pageInfo,
        });
      } catch (e) {
        track("TrackingError", {
          error: String(e),
        });
      }
      setTimeout(sendOnPageEvent, 30000);
    })();
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
