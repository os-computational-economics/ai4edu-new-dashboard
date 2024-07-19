"use client";

import React, { useState } from "react";
import {
  Checkbox,
  Switch,
  Button,
  ScrollShadow,
  Card,
  Textarea,
} from "@nextui-org/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

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

const messages = [
  { content: "This is the main chat template", align: "end" },
  { content: "Oh?", align: "start" },
  { content: "Cool", align: "start" },
  { content: "Simple", align: "end" },
  {
    content:
      "You just edit any text to type in the conversation you want to show, and delete any bubbles you don’t want to use",
    align: "end",
  },
  { content: "Boom", align: "end" },
  { content: "Hmmm", align: "start" },
  { content: "I think I get it", align: "start" },
];

const Message = ({ content, align }) => {
  const className =
    align === "end"
      ? "bg-black text-white font-medium self-end max-w-3/4"
      : "bg-neutral-200 max-w-3/4";
  const additionalClasses = "rounded-2xl px-4 py-2";

  return (
    <div
      className={`flex flex-col items-${align} my-1 font-medium text-black max-md:pr-5 max-md:max-w-full`}
    >
      <div className={`${className} ${additionalClasses}`}>{content}</div>
    </div>
  );
};

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
  <form className="flex gap-2 px-4 py-2 mt-10 inset-x-0 bottom-0 bg-white rounded-xl border border-solid border-neutral-200 text-zinc-500">
    <Textarea placeholder={placeholder} className="flex-grow" />
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
    <div className="flex h-[90vh]">
      <PanelGroup
        autoSaveId="chat-interface"
        direction="horizontal"
        className="w-full h-full"
      >
        <Panel defaultSize={25} maxSize={70} minSize={20}>
          <Card className="m-1 h-full">
            <div className="flex h-full">
              <div className="bg-white p-6">
                <h1 className="text-2xl font-bold mb-4">ECONOMICS 380</h1>
                <div className="text-wrap">
                  {selectedDocument ? (
                    <>
                      <h3 className="text-xl font-bold mb-4">
                        {selectedDocument.title}
                      </h3>
                      <ScrollShadow className="h-[700px] w-fit rounded-md">
                        <p>
                          Lorem ipsum dolor sit amet, consecteturasdas
                          adipiscing elit. Sed euismod tellus vel sapien
                          bibendum, vel bibendum odio consequat. Nullam volutpat
                          metus ac nunc dapibus, id malesuada velit aliquam.
                          Suspendisse potenti. Nulla facilisi. Duis euismod,
                          nulla sit amet aliquam lacinia, nisl nisl aliquam
                          nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod
                          tellus vel sapien bibendum, vel bibendum odio
                          consequat.Lorem ipsum dolor sit amet, consectetur
                          adipiscing elit. Sed euismod tellus vel sapien
                          bibendum, vel bibendum odio consequat. Nullam volutpat
                          metus ac nunc dapibus, id malesuada velit aliquam.
                          Suspendisse potenti. Nulla facilisi. Duis euismod,
                          nulla sit amet aliquam lacinia, nisl nisl aliquam
                          nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod
                          tellus vel sapien bibendum, vel bibendum odio
                          consequat.Lorem ipsum dolor sit amet, consectetur
                          adipiscing elit. Sed euismod tellus vel sapien
                          bibendum, vel bibendum odio consequat. Nullam volutpat
                          metus ac nunc dapibus, id malesuada velit aliquam.
                          Suspendisse potenti. Nulla facilisi. Duis euismod,
                          nulla sit amet aliquam lacinia, nisl nisl aliquam
                          nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod
                          tellus vel sapien bibendum, vel bibendum odio
                          consequat.Lorem ipsum dolor sit amet, consectetur
                          adipiscing elit. Sed euismod tellus vel sapien
                          bibendum, vel bibendum odio consequat. Nullam volutpat
                          metus ac nunc dapibus, id malesuada velit aliquam.
                          Suspendisse potenti. Nulla facilisi. Duis euismod,
                          nulla sit amet aliquam lacinia, nisl nisl aliquam
                          nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod
                          tellus vel sapien bibendum, vel bibendum odio
                          consequat.Lorem ipsum dolor sit amet, consectetur
                          adipiscing elit. Sed euismod tellus vel sapien
                          bibendum, vel bibendum odio consequat. Nullam volutpat
                          metus ac nunc dapibus, id malesuada velit aliquam.
                          Suspendisse potenti. Nulla facilisi. Duis euismod,
                          nulla sit amet aliquam lacinia, nisl nisl aliquam
                          nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod
                          tellus vel sapien bibendum, vel bibendum odio
                          consequat.Lorem ipsum dolor sit amet, consectetur
                          adipiscing elit. Sed euismod tellus vel sapien
                          bibendum, vel bibendum odio consequat. Nullam volutpat
                          metus ac nunc dapibus, id malesuada velit aliquam.
                          Suspendisse potenti. Nulla facilisi. Duis euismod,
                          nulla sit amet aliquam lacinia, nisl nisl aliquam
                          nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod
                          tellus vel sapien bibendum, vel bibendum odio
                          consequat.
                        </p>
                      </ScrollShadow>
                    </>
                  ) : (
                    <p>No document selected.</p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Panel>
        <PanelResizeHandle />
        <Panel defaultSize={75} maxSize={80} minSize={30}>
          <Card className="m-1">
            <div className="flex flex-col grow px-6 py-4 w-full text-base leading-6 bg-white max-md:px-5 max-md:max-w-full">
              <header className="flex z-10 gap-5 justify-center items-start px-6 w-full bg-white border-b border-solid border-neutral-200 max-md:flex-wrap max-md:px-5 max-md:max-w-full">
                <ChatUser name="Assistant Name" status="Powered by ChatGPT" />
              </header>
              <main className="flex flex-col mt-9 h-full">
                {messages.map((message, index) => (
                  <Message
                    key={index}
                    content={message.content}
                    align={message.align}
                  />
                ))}
              </main>
              <InputMessage placeholder="Enter your message" />
            </div>
          </Card>
        </Panel>
      </PanelGroup>
    </div>
  );
};
