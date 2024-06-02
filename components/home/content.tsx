"use client";
import React from "react";
import dynamic from "next/dynamic";
import { TableWrapper } from "../table/table";
import { CardBalance1 } from "./card-balance1";
import { CardBalance2 } from "./card-balance2";
import { CardBalance3 } from "./card-balance3";
import { CardAgents } from "./card-agents";
import { CardTransactions } from "./card-transactions";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";

const Chart = dynamic(
  () => import("../charts/steam").then((mod) => mod.Steam),
  {
    ssr: false,
  }
);

export const Content = () => (
  <div className="h-full lg:px-6 pb-6">
    <div className="flex justify-center gap-4 xl:gap-6 pt-1 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-5 max-w-[90rem] mx-auto w-full">
      <div className="mt-1 gap-6 flex flex-col w-full">
        {/* Card Section Top */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold">Courses</h3>
          <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-5  justify-center w-full">
            <CardBalance1 />
            <CardBalance2 />
            <CardBalance3 />
          </div>
        </div>
      </div>

      {/* Left Section */}
      <div className="mt-1 gap-2 flex flex-col xl:max-w-md w-full">
        <h3 className="text-xl font-semibold">Recent Agents</h3>
        <div className="flex flex-col justify-center gap-4 flex-wrap md:flex-nowrap md:flex-col">
          <CardTransactions />
        </div>
      </div>
    </div>
  </div>
);
