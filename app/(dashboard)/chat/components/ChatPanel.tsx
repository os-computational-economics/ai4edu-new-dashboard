// @ts-nocheck
"use client";
import React, { useEffect, useState, useRef } from "react";

import { Textarea } from "@nextui-org/react";
import { MdAttachFile } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { VscChromeMinimize } from "react-icons/vsc";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

import Cookies from "js-cookie";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";

import { preprocessLaTeX } from "@/utils/CustomMessageRender";
import { steamChatURL, getNewThread } from "@/api/chat/chat";
import { FileUploadForm } from "./FileUpload";
import {
  Modal,
  ModalContent,
  ModalHeader,
  Card,
  ScrollShadow,
  Button,
  Badge,
} from "@nextui-org/react";

import "katex/dist/katex.min.css";
import "highlight.js/styles/atom-one-dark.min.css";

function Message({ content, align }: { content: string; align: string }) {
  const className =
    align === "end"
      ? "bg-black text-white font-medium self-end max-w-3/4"
      : "bg-neutral-200 max-w-3/4";
  const additionalClasses = "rounded-2xl px-4 py-2";

  return (
    <div
      className={`flex flex-col items-${align} my-1 font-medium text-black max-md:pr-5 max-md:max-w-full`}
    >
      <div className={`${className} ${additionalClasses}`}>
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeHighlight]}
        >
          {preprocessLaTeX(content)}
        </ReactMarkdown>
      </div>
    </div>
  );
}

function InputMessage({
  placeholder,
  message,
  setMessage,
  sendMessage,
  FileUploadForm,
}: {
  placeholder: string;
  message: string;
  setMessage: (value: string) => void;
  sendMessage: () => void;
}) {
  return (
    <div className="flex gap-2 px-4 py-2 inset-x-0 bottom-0 bg-white rounded-xl">
      <Textarea
        placeholder={placeholder}
        className="flex-grow"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
      />
      <Button
        isIconOnly
        variant="light"
        aria-label="Attach file"
        onClick={FileUploadForm}
      >
        <MdAttachFile className="text-2xl" />
      </Button>
      <Button
        isIconOnly
        color="primary"
        aria-label="Send message"
        onClick={sendMessage}
      >
        <IoSend className="text-xl" />
      </Button>
    </div>
  );
}

const ChatPanel = ({ agent, onClose, selectedDocument, onMinimize }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [threadId, setThreadId] = useState(
    localStorage.getItem("threadIdLocalStorageKey") || null
  );
  const [studentId, setStudentId] = useState(Cookies.get("student_id") || null);
  const [isMinimized, setIsMinimized] = useState(false);
  const model = agent.model || "openai";
  const voice = agent.voice;
  const agentID = agent.agent_id;
  const lastMessageRef = useRef(null);

  useEffect(() => {
    console.log("$$$", agent);
  }, [agent]);

  const appendMessage = (content, align) => {
    setMessages((prevMessages) => [...prevMessages, { content, align }]);
  };

  const updateLastMessage = (content) => {
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages];
      if (newMessages.length > 0) {
        newMessages[newMessages.length - 1].content = content;
      }
      return newMessages;
    });
  };

  const getNewThreadID = async () => {
    console.log(threadId);
    const params = {
      agent_id: agentID,
      user_id: studentId,
    };

    try {
      const res = await getNewThread(params);
      console.log("res", res);
      setThreadId(res.thread_id);
      localStorage.setItem("threadIdLocalStorageKey", res.thread_id);
      return res.thread_id;
    } catch (error) {
      console.error("Error fetching id:", error);
      return null;
    }
  };

  const sendMessage = async () => {
    let currentThreadId = threadId;
    if (!currentThreadId) {
      currentThreadId = await getNewThreadID();
    }

    if (!currentThreadId || message.trim() === "") return;

    const formattedMessages = messages.map((msg, index) => ({
      role: msg.align === "end" ? "user" : "assistant",
      content: msg.content,
    }));

    const chatMessage = {
      dynamic_auth_code: "random",
      messages: {
        ...formattedMessages,
        [formattedMessages.length]: { role: "user", content: message },
      },
      thread_id: currentThreadId,
      provider: model,
      user_id: studentId,
      agent_id: agentID,
      voice: voice,
    };

    appendMessage(message, "end");
    setMessage("");

    const access_token = Cookies.get("access_token");

    fetch(steamChatURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer access=${access_token}`,
      },
      body: JSON.stringify(chatMessage),
    })
      .then((response) => {
        const reader = response.body
          .pipeThrough(new TextDecoderStream())
          .getReader();

        let responseMessage = "";

        const processStream = async () => {
          appendMessage("", "start");
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const lines = value
              .split("\n")
              .filter((line) => line.trim() !== "");
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const data = JSON.parse(line.slice(6));
                  responseMessage = data.response;
                  updateLastMessage(responseMessage);
                } catch (e) {
                  console.error("Error parsing JSON:", e, line);
                }
              }
            }
          }
        };
        processStream();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const AgentInfo = () => (
    <div className="flex flex-col ml-8 mt-4 text-3xl">
      {agent?.agent_name}
      <span className="text-sm">
        <span className="text-gray-700 mr-6">{agent?.workspace_id}</span>
        {agent?.status === 1 ? (
          <span className="text-green-700">Active</span>
        ) : (
          <span className="text-red-700">Inactive</span>
        )}
      </span>
    </div>
  );

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // if (isMinimized && selectedDocument) {
  //   return (
  //     <div 
  //       className="absolute bottom-4 right-4 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300 ease-in-out hover:bg-blue-600 z-100"
  //       onClick={toggleMinimize}
  //     >
  //       <IoChatbubbleEllipsesOutline size={32} color="white" />
  //     </div>
  //   );
  // }
  
  if (onMinimize && selectedDocument && isMinimized) {
    return (
      <div 
        className="fixed bottom-4 right-4 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300 ease-in-out hover:bg-blue-600 z-10"
        onClick={toggleMinimize}
      >
        <IoChatbubbleEllipsesOutline size={32} color="white" />
      </div>
    );
  }

  return (
    <Card className="m-1 h-full rounded-xl">
    <span className="z-10">
      <AgentInfo />
    </span>
    <Button
          isIconOnly
          variant="light"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-2 z-10"
        >
          <IoClose size={24} />
        </Button>
    {selectedDocument && (
      <>
        <Button
          isIconOnly
          variant="light"
          onClick={toggleMinimize}
          aria-label="Minimize"
          className="absolute right-12 top-2 z-10"
        >
          <VscChromeMinimize size={24} />
        </Button>
      </>
    )}
    <div className="flex flex-col grow px-6 py-4 w-full text-base leading-6 bg-white max-md:px-5 max-md:max-w-full h-full">
      <ScrollShadow
        size={20}
        className="flex flex-col overflow-auto h-full pr-4"
      >
        {messages.map((message, index) => (
          <Message
            key={index}
            content={message.content}
            align={message.align}
          />
        ))}
        <div ref={lastMessageRef}></div>
      </ScrollShadow>
      <footer className="flex-shrink-0">
        <InputMessage
          placeholder="Enter your message"
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </footer>
    </div>
  </Card>
  // <Card className="m-1 h-full rounded-xl">
  //     <span className="z-10">
  //       <AgentInfo />
  //     </span>
  //     <Button
  //       isIconOnly
  //       variant="light"
  //       onClick={onClose}
  //       aria-label="Close"
  //       className="absolute right-4 top-2 z-10"
  //     >
  //       <IoClose size={24} />
  //     </Button>
  //     <Button
  //         isIconOnly
  //         variant="light"
  //         onClick={onMinimize}
  //         aria-label="Minimize"
  //         className="absolute right-12 top-2 z-10"
  //       >
  //         <VscChromeMinimize size={24} />
  //       </Button>
  //     {selectedDocument && (
  //       <Button
  //         isIconOnly
  //         variant="light"
  //         onClick={onMinimize}
  //         aria-label="Minimize"
  //         className="absolute right-12 top-2 z-10"
  //       >
  //         <VscChromeMinimize size={24} />
  //       </Button>
  //     )}
  //     <div className="flex flex-col grow px-6 py-4 w-full text-base leading-6 bg-white max-md:px-5 max-md:max-w-full h-full">
  //       <ScrollShadow
  //         size={20}
  //         className="flex flex-col overflow-auto h-full pr-4"
  //       >
  //         {messages.map((message, index) => (
  //           <Message
  //             key={index}
  //             content={message.content}
  //             align={message.align}
  //           />
  //         ))}
  //         <div ref={lastMessageRef}></div>
  //       </ScrollShadow>
  //       <footer className="flex-shrink-0">
  //         <InputMessage
  //           placeholder="Enter your message"
  //           message={message}
  //           setMessage={setMessage}
  //           sendMessage={sendMessage}
  //         />
  //       </footer>
  //     </div>
  //   </Card>
  );
};

export default ChatPanel;
