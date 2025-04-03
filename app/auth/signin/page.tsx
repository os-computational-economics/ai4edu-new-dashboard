"use client";
import React from "react";
import { useEffect } from "react";

import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { Button, Card, Image } from "@nextui-org/react";
import { DarkModeSwitch } from "@/components/navbar/darkmodeswitch";
import { localBackend } from "@/utils/request";
import { getUserWorkspaceDetails } from "@/api/workspace/workspace"

const SigninPage: React.FC = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const refresh = urlParams.get("refresh");
      const access = urlParams.get("access");
      const firstLevelDomain =
        "." + window.location.hostname.split(".").slice(-2).join(".");

      if (refresh && access) {
        // refresh token valid for 15 days, under the domain first level domain
        Cookies.set("refresh_token", refresh, {
          expires: 15,
          domain: firstLevelDomain,
        });
        // access token valid for 30 minutes, but we set it to 29 minutes to be safe
        Cookies.set("access_token", access, {
          expires: 29 / (24 * 60),
          domain: firstLevelDomain,
        });
        getUserWorkspaceDetails()
          .then((res) => {
            console.log(res)
            Cookies.set("user_workspace_details", JSON.stringify(res.items), {
              expires: 15,
              domain: firstLevelDomain
            })})
            .catch((error) => {
              console.error("Error fetching workspace list", error)
            })

        urlParams.delete("refresh");
        urlParams.delete("access");

        redirect("/");
      }

      const refreshToken = Cookies.get("refresh_token");
      if (refreshToken) {
        redirect("/");
      }
    }
  }, []);

  const handleSSOLogin = () => {
    const currentUrl = window.location.href;
    const onlineBaseUrl = process.env.NEXT_PUBLIC_ONLINE_BASE_URL;
    let ssoVerifyUrl = `${onlineBaseUrl}/v1/prod/user/sso`;
    if (
      process.env.NODE_ENV === "development" ||
      process.env.NEXT_PUBLIC_CURRENT_ENV === "development"
    ) {
      ssoVerifyUrl = `${onlineBaseUrl}/v1/dev/user/sso`;
    }
    if (localBackend) {
      ssoVerifyUrl = `${process.env.NEXT_PUBLIC_LOCAL_BASE_URL}/v1/dev/user/sso`;
    }
    window.location.href = `https://login.case.edu/cas/login?service=${ssoVerifyUrl}?came_from=${currentUrl}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100 dark:bg-gray-800">
      <div className="absolute top-4 left-4 flex items-center space-x-2 text-2xl font-bold">
        <Image
          src="/favicon.ico"
          alt="AI4EDU"
          className="h-10 rounded-lg mr-3"
        />
        AI4EDU
      </div>
      <div className="absolute top-4 right-4">
        <DarkModeSwitch />
      </div>
      <Card className="w-full max-w-md p-8 shadow-lg rounded-xl bg-opacity-80">
        <h1 className="text-3xl font-semibold mb-6 text-center">Sign in</h1>
        <div className="flex justify-center">
          <Button
            onClick={handleSSOLogin}
            className="px-8 py-3 text-lg"
            size="lg"
          >
            <Image src="/favicon.ico" alt="AI4EDU" className="h-7 rounded-lg" />
            Sign in with CWRU
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SigninPage;
