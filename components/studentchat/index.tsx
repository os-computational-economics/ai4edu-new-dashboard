"use client";

import React, { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"


import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface MessageProps {
  content: string;
  className: string;
  additionalClasses?: string;
}

interface ChatUserProps {
  name: string;
  status: string;
}

interface ChatDateProps {
  date: string;
}

interface InputMessageProps {
  placeholder: string;
}

const Message: React.FC<MessageProps> = ({
  content,
  className,
  additionalClasses = "",
}) => (
  <section
    className={`${className} ${additionalClasses} justify-center px-4 py-3 mt-2 rounded-2xl`}
  >
    {content}
  </section>
);

const ChatUser: React.FC<ChatUserProps> = ({ name, status }) => (
  <section className="flex gap-4">
    <div className="flex flex-col">
      <h2 className="font-medium text-black">{name}</h2>
      <p className="text-ellipsis text-zinc-700">{status}</p>
    </div>
  </section>
);

const ChatDate: React.FC<ChatDateProps> = ({ date }) => (
  <time className="mt-9 text-center text-zinc-500">{date}</time>
);

const InputMessage: React.FC<InputMessageProps> = ({ placeholder }) => (
  <form className="flex gap-2 px-4 py-2 mt-10 inset-x-0 bottom-0 bg-white rounded-lg border border-solid border-neutral-200 text-zinc-500">
    <label htmlFor="messageInput" className="sr-only">
      {placeholder}
    </label>
    <input
      id="messageInput"
      type="text"
      placeholder={placeholder}
      className="flex-1 text-ellipsis"
      aria-label={placeholder}
    />
    <img
      loading="lazy"
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/9432ba68df7a4aa97d33ac355c8e33e288f6afba050db4410438593ee51fbc1f?apiKey=e949a1eb83934463a3acc167ebb849e4&"
      alt="Send message"
      className="shrink-0 w-6 aspect-square"
    />
    <img
      loading="lazy"
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/0de5d4861d3d36a4402a46c2e5a595b5d66c24acbd0a2df3042bf3759bc5748d?apiKey=e949a1eb83934463a3acc167ebb849e4&"
      alt="More options"
      className="shrink-0 w-6 aspect-square"
    />
  </form>
);

type Document = {
  id: number;
  title: string;
};


export const Chat = () => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );

  type MenuItemType = {
    src: string;
    alt: string;
    label: string;
  };

  const documents: Document[] = [
    { id: 1, title: "Document 1" },
    { id: 2, title: "Document 2" },
    { id: 3, title: "Document 3" },
    { id: 4, title: "Document 4" },
  ];

  const docclick = (document: Document) => {
    setSelectedDocument(document);
  };

  return (
    <div className="flex h-[calc(100vh-30px)]">
      <aside className="z-[20] sticky top-0">
        <div className="flex flex-col grow pb-20 w-full bg-white border-l border-solid border-neutral-200">
          <header className="flex flex-col justify-center text-center mx-4 max-md:mx-2.5">
            <section className="flex flex-col justify-center">
              <h2 className="justify-center px-4 py-2 mt-6 text-base font-medium text-white bg-black rounded-lg max-md:px-5">
                Objectives
              </h2>
              <p className="pt-3 text-base text-ellipsis text-zinc-700 font-bold">
                Add a vehicle
              </p>
              <div className="flex items-center py-1 text-base text-ellipsis text-zinc-700 font-bold">
                <span>Progress:</span>
                <span className="ml-2">100%</span>
              </div>
              <div className="flex items-center py-1 text-base text-ellipsis text-zinc-700 font-bold">
                <span>Customer Mood:</span>
                <span className="ml-2 text-green-400">Happy</span>
              </div>
              <p className="text-base text-ellipsis py-2 text-zinc-700">
                Remember to use your guidelines!
              </p>
            </section>
            <section className="flex flex-col justify-center mt-3">
              <div>
                <h2 className="justify-center px-4 py-2 mt-3 text-base font-medium text-white bg-black rounded-lg max-md:px-5">
                  Task Guide
                </h2>
                <div className="flex space-x-2 mt-5 ml-1">
                  <Checkbox id="terms1" />
                  <label
                    htmlFor="terms1"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Greetings
                  </label>
                </div>
                <div className="flex space-x-2 mt-5 ml-1">
                  <Checkbox id="terms1" />
                  <label
                    htmlFor="terms1"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Verify Caller
                  </label>
                </div>
                <div className="flex space-x-2 mt-5 ml-1">
                  <Checkbox id="terms1" />
                  <label
                    htmlFor="terms1"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Verify Intention
                  </label>
                </div>
                <div className="flex space-x-2 mt-5 ml-1">
                  <Checkbox id="terms1" />
                  <label
                    htmlFor="terms1"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Make/Model/Year/VIN
                  </label>
                </div>
              </div>
            </section>
            <section className="flex flex-col h-full justify-center mt-3">
              <div>
                <h2 className="justify-center px-4 py-2 mt-3 text-base font-medium text-white bg-black rounded-lg max-md:px-5">
                  Documents
                </h2>
                {documents.map((document) => (
                  <div
                    key={document.id}
                    className="flex justify-center space-x-2 mt-5 ml-1 cursor-pointer"
                    onClick={() => docclick(document)}
                  >
                    <label
                      htmlFor={`document-${document.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {document.title}
                    </label>
                  </div>
                ))}
              </div>
            </section>
            <section className="flex flex-col justify-center items-center">
              <h2 className="justify-center py-2 mt-6 mb-6 w-full text-base font-medium text-white bg-black rounded-lg max-md:px-5">
                Settings
              </h2>
              <div className="flex items-center space-x-2">
                <Switch id="microphone" />
                <Label htmlFor="microphone">Enable Microphone</Label>
              </div>
              <Button className="justify-center mt-3" variant="destructive">Reset Chat</Button>
            </section>
          </header>
        </div>
      </aside>
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full rounded-lg border"
      >
        <ResizablePanel defaultSize={25}>
          <div className="flex h-full">
            <div className="bg-white p-6">
              <h1 className="text-2xl font-bold mb-4">ECONOMICS 380</h1>
              <div className="text-wrap">
                {selectedDocument ? (
                  <>
                    <h3 className="text-xl font-bold mb-4">
                      {selectedDocument.title}
                    </h3>
                    <ScrollArea className="h-[700px] w-fit rounded-md">
                      <p>
                        Lorem ipsum dolor sit amet, consecteturasdas adipiscing
                        elit. Sed euismod tellus vel sapien bibendum, vel
                        bibendum odio consequat. Nullam volutpat metus ac nunc
                        dapibus, id malesuada velit aliquam. Suspendisse
                        potenti. Nulla facilisi. Duis euismod, nulla sit amet
                        aliquam lacinia, nisl nisl aliquam nisl, nec aliquam
                        nisl nisl sit amet nisl. Sed euismod tellus vel sapien
                        bibendum, vel bibendum odio consequat.Lorem ipsum dolor
                        sit amet, consectetur adipiscing elit. Sed euismod
                        tellus vel sapien bibendum, vel bibendum odio consequat.
                        Nullam volutpat metus ac nunc dapibus, id malesuada
                        velit aliquam. Suspendisse potenti. Nulla facilisi. Duis
                        euismod, nulla sit amet aliquam lacinia, nisl nisl
                        aliquam nisl, nec aliquam nisl nisl sit amet nisl. Sed
                        euismod tellus vel sapien bibendum, vel bibendum odio
                        consequat.Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit. Sed euismod tellus vel sapien bibendum,
                        vel bibendum odio consequat. Nullam volutpat metus ac
                        nunc dapibus, id malesuada velit aliquam. Suspendisse
                        potenti. Nulla facilisi. Duis euismod, nulla sit amet
                        aliquam lacinia, nisl nisl aliquam nisl, nec aliquam
                        nisl nisl sit amet nisl. Sed euismod tellus vel sapien
                        bibendum, vel bibendum odio consequat.Lorem ipsum dolor
                        sit amet, consectetur adipiscing elit. Sed euismod
                        tellus vel sapien bibendum, vel bibendum odio consequat.
                        Nullam volutpat metus ac nunc dapibus, id malesuada
                        velit aliquam. Suspendisse potenti. Nulla facilisi. Duis
                        euismod, nulla sit amet aliquam lacinia, nisl nisl
                        aliquam nisl, nec aliquam nisl nisl sit amet nisl. Sed
                        euismod tellus vel sapien bibendum, vel bibendum odio
                        consequat.Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit. Sed euismod tellus vel sapien bibendum,
                        vel bibendum odio consequat. Nullam volutpat metus ac
                        nunc dapibus, id malesuada velit aliquam. Suspendisse
                        potenti. Nulla facilisi. Duis euismod, nulla sit amet
                        aliquam lacinia, nisl nisl aliquam nisl, nec aliquam
                        nisl nisl sit amet nisl. Sed euismod tellus vel sapien
                        bibendum, vel bibendum odio consequat.Lorem ipsum dolor
                        sit amet, consectetur adipiscing elit. Sed euismod
                        tellus vel sapien bibendum, vel bibendum odio consequat.
                        Nullam volutpat metus ac nunc dapibus, id malesuada
                        velit aliquam. Suspendisse potenti. Nulla facilisi. Duis
                        euismod, nulla sit amet aliquam lacinia, nisl nisl
                        aliquam nisl, nec aliquam nisl nisl sit amet nisl. Sed
                        euismod tellus vel sapien bibendum, vel bibendum odio
                        consequat.
                      </p>
                    </ScrollArea>
                  </>
                ) : (
                  <p>No document selected.</p>
                )}
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>
          <div className="flex flex-col grow px-6 py-4 w-full text-base leading-6 bg-white max-md:px-5 max-md:max-w-full">
            <header className="flex z-10 gap-5 justify-center items-start px-6 w-full bg-white border-b border-solid border-neutral-200 max-md:flex-wrap max-md:px-5 max-md:max-w-full">
              <ChatUser name="Agent Name" status="Powered by ChatGPT" />
            </header>
            <main className="flex flex-col mt-9 h-full">
              <Message
                content="This is the main chat template"
                className="bg-black text-white font-medium self-end"
              />
              <ChatDate date="Nov 30, 2023, 9:41 AM" />
              <section className="flex flex-col items-start pr-20 mt-9 font-medium text-black max-md:pr-5 max-md:max-w-full">
                <Message
                  content="Oh?"
                  className="bg-neutral-200"
                  additionalClasses="whitespace-nowrap rounded-3xl"
                />
                <Message
                  content="Cool"
                  className="bg-neutral-200"
                  additionalClasses="whitespace-nowrap rounded-3xl"
                />
              </section>
              <section className="flex flex-col items-end pl-20 mt-9 font-medium text-white max-md:pl-5 max-md:max-w-full">
                <Message
                  content="Simple"
                  className="bg-black"
                  additionalClasses="whitespace-nowrap rounded-2xl"
                />
                <Message
                  content="You just edit any text to type in the conversation you want to show, and delete any bubbles you don’t want to use"
                  className="bg-black"
                  additionalClasses="max-w-full leading-6 w-[480px]"
                />
                <Message
                  content="Boom"
                  className="bg-black"
                  additionalClasses="whitespace-nowrap rounded-2xl"
                />
              </section>
              <section className="flex flex-col items-start pr-20 mt-9 font-medium text-black max-md:pr-5 max-md:max-w-full">
                <Message
                  content="Hmmm"
                  className="bg-neutral-200"
                  additionalClasses="whitespace-nowrap rounded-3xl"
                />
                <Message
                  content="I think I get it"
                  className="bg-neutral-200"
                  additionalClasses="rounded-3xl"
                />
              </section>
            </main>
            <InputMessage placeholder="Enter your message" />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
