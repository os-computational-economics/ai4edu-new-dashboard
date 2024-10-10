// @ts-nocheck
"use client";
import React, { useEffect, useState, useRef } from "react";

import { Card, Textarea, ScrollShadow, Button } from "@nextui-org/react";
import { MdAttachFile, MdExpandLess, MdExpandMore } from "react-icons/md";
import { IoSend } from "react-icons/io5";

import Cookies from "js-cookie";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";

import { preprocessLaTeX } from "@/utils/CustomMessageRender";
import { getCurrentUserStudentID } from "@/utils/CookiesUtil";
import { steamChatURL, getNewThread } from "@/api/chat/chat";
import { FileUploadForm } from "./FileUpload";

import "katex/dist/katex.min.css";
import "highlight.js/styles/atom-one-dark.min.css";
import { getThreadbyID } from "@/api/thread/thread";
import useMount from "@/components/hooks/useMount";

function Message({
  content,
  align,
  sources,
  setSelectedDocument,
}: {
  content: string;
  align: string;
  sources?: string[];
}) {
  const [showSources, setShowSources] = useState(false);

  const className =
    align === "end"
      ? "bg-black text-white font-medium self-end max-w-2/3"
      : "bg-neutral-200 max-w-[90%]";
  const additionalClasses = "rounded-2xl px-4 py-2 text-md"; // Added text-sm for smaller text

  const onSourceClick = (sourceFileID) => {
    setSelectedDocument(sourceFileID);
  };

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
      {sources && sources.length > 0 && (
        <div className="mt-2">
          <Button
            color="#F4F4F5"
            size="sm"
            variant="light"
            radius="sm"
            iconRight={showSources ? <MdExpandLess /> : <MdExpandMore />}
            onClick={() => setShowSources(!showSources)}
          >
            {showSources ? "Hide Sources" : "Display Sources"}
          </Button>
          {showSources && (
            <ul className="mt-2 bg-gray-100 p-2 rounded-lg">
              {sources.map((source, index) => (
                <li
                  key={index}
                  className="text-sm hover:cursor-pointer"
                  onClick={() => onSourceClick(source.fileID)}
                >
                  <div>
                    <span>{source.index}.</span>{" "}
                    <span className="text-blue-800">
                      {source.fileName}, page {source.page}
                    </span>
                  </div>
                </li>
              ))}
              <li className="text-gray-400 text-xs">
                *Click to view the source file.
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function InputMessage({
  placeholder,
  message,
  setMessage,
  sendMessage,
  FileUploadForm,
  inputDisabled,
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
        disabled={inputDisabled}
      />
      {/* <Button isIconOnly variant="light" aria-label="Attach file" onClick={FileUploadForm}>
        <MdAttachFile className="text-2xl" />
      </Button> */}
      <Button
        isIconOnly
        color="primary"
        aria-label="Send message"
        onClick={sendMessage}
        disabled={inputDisabled}
      >
        <IoSend className="text-xl" />
      </Button>
    </div>
  );
}

const ChatPanel = ({ agent, thread, setSelectedDocument }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [threadId, setThreadId] = useState(thread);
  const [studentId, setStudentId] = useState(Cookies.get("student_id") || null);
  const [hasWriteAccessToThread, setHasWriteAccessToThread] = useState(null);
  const model = agent?.model || "openai";
  const voice = agent?.voice;
  const agentID = agent?.agent_id;
  const workspace_id =
    agent?.workspace_id || JSON.parse(localStorage.getItem("workspace")!)?.id;
  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (hasWriteAccessToThread !== null || !agent || messages.length === 0) {
      return;
    }
    if (agent?.status === 1) {
      const firstMessage = messages[0];
      const currentUserID = getCurrentUserStudentID();
      setHasWriteAccessToThread(
        firstMessage.user_id === currentUserID
      );
    } else {
      // if agent is not active or deleted, user can't write to the thread anyway, so no need to check
      setHasWriteAccessToThread(false);
    }
  }, [messages, agent, hasWriteAccessToThread]);

  useMount(() => {
    const params = { thread_id: threadId };
    // if query param new_thread=true, don't fetch messages, and remove the query param
    const urlParams = new URLSearchParams(window.location.search);
    // check if threadId is a UUID
    const threadIdIsUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      threadId
    );
    if (threadIdIsUUID) {
      getThreadbyID(params).then((res) => {
        setMessages(
          res.messages.map((message) => ({
            ...message,
            align: message.role === "human" ? "end" : "start",
          }))
        );
      });
    } else if (threadId === "new") {
      // nothing to do for now
    } else {
      // invalid url, redirect to home
      window.location.href = "/";
    }
  }, [agent]);

  const appendMessage = (content, align, sources = []) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { content, align, sources },
    ]);
  };

  const updateLastMessage = (content, sources) => {
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages];
      if (newMessages.length > 0) {
        newMessages[newMessages.length - 1].content = content;
        newMessages[newMessages.length - 1].sources = sources;
      }
      return newMessages;
    });
  };

  const getNewThreadID = async () => {
    console.log(threadId);
    const params = {
      agent_id: agentID,
      workspace_id: workspace_id,
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
    if (currentThreadId === "new") {
      currentThreadId = await getNewThreadID();
      setThreadId(currentThreadId);
      const newUrl = `/agents/${agentID}/${currentThreadId}`;
      window.history.replaceState({...window.history.state, as: newUrl, url: newUrl}, '', newUrl);
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
      workspace_id: workspace_id,
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

        const processStream = async () => {
          let responseMessage = "";
          let sources = []; // Initialize sources array here

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

                  if (
                    data.source &&
                    Array.isArray(data.source) &&
                    data.source.length > 0
                  ) {
                    sources = data.source.map((src, index) => {
                      const parsedSrc = JSON.parse(src.replace(/'/g, '"'));
                      return {
                        index: index + 1,
                        fileName: parsedSrc.file_name,
                        page: parsedSrc.page + 1,
                        fileID: parsedSrc.file_id,
                      };
                    });
                  }

                  responseMessage = data.response;
                  updateLastMessage(responseMessage, sources);
                } catch (e) {
                  if (e instanceof SyntaxError) {
                    console.warn(
                      "Incomplete JSON received, waiting for the next chunk."
                    );
                  } else {
                    console.error("Error parsing JSON:", e, line);
                  }
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

  return (
    <Card className="mt-1 mb-1 h-full rounded-xl">
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
              sources={message.sources}
              setSelectedDocument={setSelectedDocument}
            />
          ))}
          <div ref={lastMessageRef}></div>
        </ScrollShadow>
        <footer className="flex-shrink-0">
          <InputMessage
            placeholder={hasWriteAccessToThread? "Enter your message": "You cannot chat with this thread. This could be because the professor disabled the agent or you are viewing a thread that is not yours."}
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
            inputDisabled={!hasWriteAccessToThread}
          />
          <div className="flex justify-center	text-gray-500 text-xs">
            AI can make errors. Please verify important information.
          </div>
        </footer>
      </div>
    </Card>
  );
};

export default ChatPanel;
