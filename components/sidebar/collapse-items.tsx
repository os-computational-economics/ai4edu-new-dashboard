"use client";
import React, { useState } from "react";
import { ChevronUpIcon } from "../icons/sidebar/chevron-up-icon";
import { Accordion, AccordionItem } from "@heroui/react";

interface Props {
  items: string[];
}

export const CollapseItems = ({ items }: Props) => {

  return (
    <div className="flex gap-4 h-full items-center cursor-pointer">
      <Accordion className="px-0" defaultExpandedKeys={["0"]}>
        <AccordionItem
          key={"0"}
          classNames={{
            indicator: "data-[open=true]:-rotate-180",
            trigger:
              "py-0 min-h-[44px] hover:bg-default-100 rounded-xl active:scale-[0.98] transition-transform px-3.5",

            title:
              "px-0 flex text-base gap-2 h-full items-center cursor-pointer",
          }}
          aria-label="Accordion 1"
          title={
            <div className="flex flex-row gap-2">
              {"Quick Access"}
            </div>
          }
        >
          <div className="pl-12">
            {items.map((item, index) => (
              <div
                key={index}
                className="text-default-500 hover:text-default-900 transition-colors bg-slate-100 hover:bg-slate-200 items-center text-center mt-2 py-1 rounded-lg"
              >
                {item}
              </div>
            ))}
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
