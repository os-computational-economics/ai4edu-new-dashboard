"use client";
import React from "react";
import { Button, Card, Image } from "@nextui-org/react";
import { DarkModeSwitch } from "@/components/navbar/darkmodeswitch";

const SigninPage: React.FC = () => {
  const handleSSOLogin = () => {
    // Implement SSO login logic here
    console.log("SSO login initiated");
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
