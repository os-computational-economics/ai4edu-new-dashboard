"use client";
import React, { useEffect, useState, useRef } from "react";

import {
  Card,
  Textarea,
  ScrollShadow,
  Button,
  Tooltip,
} from "@heroui/react";
import { IoSend } from "react-icons/io5";
import { BiDetail } from "react-icons/bi";
import {
  PiThumbsUpDuotone,
  PiThumbsDownDuotone,
  PiThumbsUpFill,
  PiThumbsDownFill,
} from "react-icons/pi";

import Cookies from "js-cookie";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";

import { checkToken } from "@/utils/CookiesUtil";
import { preprocessLaTeX } from "@/utils/CustomMessageRender";
import { getCurrentUserID } from "@/utils/CookiesUtil";
import { steamChatURL, getNewThread } from "@/api/chat/chat";
import { submitRating } from "@/api/feedback/feedback";
import { GetAgentByIDResponse } from "@/api/agent/agent";
// import { FileUploadForm } from "./FileUpload";

import "katex/dist/katex.min.css";
import "highlight.js/styles/atom-one-dark.min.css";
import { getThreadbyID } from "@/api/thread/thread";
import useMount from "@/components/hooks/useMount";
import { Bot, User } from "lucide-react";
import ShinyText from "./ShinyText";
import clsx from "clsx";

interface Source {
  index: number;
  fileName: string;
  page: number;
  fileID: string;
}

interface Message {
  content: string;
  align: string;
  sources?: Source[];
  user_id?: string;
  currentChatSession?: boolean;
  MsgId?: string;
}

function Message({
  content,
  align,
  sources,
  MsgId,
  threadId,
  setSelectedDocument,
  setSelectedDocumentPage,
  currentChatSession,
}: {
  content: string;
  align: string;
  sources?: Source[];
  MsgId?: string;
  threadId?: string;
  setSelectedDocument: (fileID: string) => void;
  setSelectedDocumentPage: (page: number) => void;
  currentChatSession?: boolean;
}) {
  const [showSources, setShowSources] = useState(false);
  const [showThought, setShowThought] = useState(false);
  const [feedback, setFeedback] = useState(String); //  '0' - bad, '1' - good

  const className =
    align === "end"
      ? "bg-slate-200 dark:bg-black dark:text-white font-medium max-w-[90%]"
      : "bg-orange-50 dark:bg-slate-800 dark:text-white max-w-[90%]";
  const additionalClasses = "rounded-2xl px-4 py-2"; // Added text-sm for smaller text

  const onSourceClick = (sourceFileID: string, sourcePage: number) => {
    setSelectedDocument(sourceFileID);
    setSelectedDocumentPage(sourcePage);
  };

  const handleFeedback = (rating) => {
    console.log(threadId, MsgId);
    if (threadId && MsgId) {
      submitRating({
        thread_id: threadId,
        message_id: MsgId,
        rating: rating,
      }).then((res) => {
        console.log("Rating submitted:", res);
      });
    }
  };

  // Check if message has </think> tag
  const hasThinkTag = content.includes('</think>');
  let thoughtContent = '';
  let mainContent = content;
  
  if (hasThinkTag) {
    const parts = content.split('</think>');
    thoughtContent = parts[0];
    mainContent = parts.slice(1).join('');
  }

  return (
    <div
      className={`flex flex-col items-${align} my-1 font-medium text-black max-md:pr-5 max-md:max-w-full`}
    >
      <div className={`${className} ${additionalClasses}`}>
        {align === "end" ? (
          <div className="text-right w-full">
            <User className="inline-block size-6 text-green-600" />
          </div>
        ) : (
          <div className="text-left w-full flex flex-row">
            <Bot className="size-7 text-sky-600 mr-2" />
            {content === "" ? (
              <ShinyText text="Thinking" className="mt-1" />
            ) : null}
          </div>
        )}
        
        {hasThinkTag && !align.includes("end") && (
          <div className="mb-2">
            <button 
              onClick={() => setShowThought(!showThought)}
              className="text-blue-500 hover:text-blue-700 flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md text-sm"
            >
              <span className="mr-1">{showThought ? '▼' : '►'}</span> 
              thought process
            </button>
            
            {showThought && (
              <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 bg-opacity-70 rounded-md">
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex, rehypeHighlight]}
                >
                  {preprocessLaTeX(thoughtContent)}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )}
        
        <p className="overflow-x-auto">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex, rehypeHighlight]}
          >
            {preprocessLaTeX(hasThinkTag ? mainContent : content)}
          </ReactMarkdown>
        </p>
      </div>
      {align === "start" && currentChatSession && (
        <div className="mt-2">
          <div className="flex items-center gap-2">
            {/* <Button
              color="secondary"
              size="sm"
              variant="light"
              radius="sm"
              onClick={() => setShowSources(!showSources)}
            >
              {showSources ? 'Hide Sources' : 'Show Sources'}
            </Button> */}
            {sources && sources.length > 0 && (
              <Tooltip
                content={showSources ? "Hide Sources" : "Show Sources"}
                placement="bottom"
              >
                {/* <span className="hover:bg-gray-100 "> */}
                <span
                  className={clsx(
                    showSources
                      ? "bg-gray-100 dark:bg-neutral-700"
                      : "hover:bg-gray-100 dark:hover:bg-neutral-700",
                    "rounded-md p-1"
                  )}
                >
                  <BiDetail
                    className="text-gray-600 hover:cursor-pointer dark:text-white"
                    onClick={() => setShowSources(!showSources)}
                  />
                </span>
              </Tooltip>
            )}
            <div className="flex justify-end gap-2">
              {feedback !== "0" && (
                <Tooltip content="Good response" placement="bottom">
                  <span className="hover:bg-gray-100 rounded-md p-1 dark:hover:bg-neutral-700">
                    {feedback === "1" ? (
                      <PiThumbsUpFill className="hover:cursor-pointer dark:text-white" />
                    ) : (
                      <PiThumbsUpDuotone
                        className="hover:cursor-pointer dark:text-white"
                        onClick={() => {
                          setFeedback("1");
                          handleFeedback(1);
                        }}
                      />
                    )}
                  </span>
                </Tooltip>
              )}
              {feedback !== "1" && (
                <Tooltip content="Bad response" placement="bottom">
                  <span className="hover:bg-gray-100 rounded-md p-1 dark:hover:bg-neutral-700">
                    {feedback === "0" ? (
                      <PiThumbsDownFill className="hover:cursor-pointer dark:text-white" />
                    ) : (
                      <PiThumbsDownDuotone
                        className="hover:cursor-pointer dark:text-white"
                        onClick={() => {
                          setFeedback("0");
                          handleFeedback(0);
                        }}
                      />
                    )}
                  </span>
                </Tooltip>
              )}
            </div>
          </div>
          {showSources && sources && sources.length > 0 && (
            <ul className="mt-2 bg-gray-100 dark:bg-neutral-800 p-2 rounded-lg">
              {sources.map((source, index) => (
                <li
                  key={index}
                  className="text-sm hover:cursor-pointer"
                  onClick={() => onSourceClick(source.fileID, source.page)}
                >
                  <div>
                    <span className="dark:text-white">{source.index}.</span>{" "}
                    <span className="text-blue-800 dark:text-blue-200">
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
  inputDisabled,
  FileUploadForm,
}: {
  placeholder: string;
  message: string;
  setMessage: (value: string) => void;
  sendMessage: () => void;
  inputDisabled: boolean;
  FileUploadForm?: () => void;
}) {
  return (
    <div className="flex gap-2 px-1 py-1 inset-x-0 bottom-0 rounded-xl">
      <Textarea
        placeholder={placeholder}
        className="flex-grow"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
          }
        }}
        onKeyUp={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
        disabled={inputDisabled}
        minRows={1}
        maxRows={10}
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

const ChatPanel = ({
  agent,
  thread,
  setSelectedDocument,
  setSelectedDocumentPage,
  setUniqueFileIDs, // Add this prop
}: {
  agent: GetAgentByIDResponse;
  thread: string;
  setSelectedDocument: (fileID: string) => void;
  setSelectedDocumentPage: (page: number) => void;
  setUniqueFileIDs: (fileIDs: string[]) => void;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [threadId, setThreadId] = useState(thread);
  const [userId, setUserId] = useState(Cookies.get("user_id") || null);
  const [hasWriteAccessToThread, setHasWriteAccessToThread] = useState<
    boolean | null
  >(null);
  const [isResponseStreaming, setIsResponseStreaming] = useState(false);
  const model = agent?.model || "openai";
  const voice = agent?.voice;
  const agentID = agent?.agent_id;
  const workspace_id: string =
    agent?.workspace_id || JSON.parse(localStorage.getItem("workspace")!)?.id;
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: isResponseStreaming ? "auto" : "smooth",
        block: "end",
      });
    }
  }, [messages]);

  useEffect(() => {
    if (hasWriteAccessToThread !== null || !agent || messages.length === 0) {
      if (thread === "new") {
        setHasWriteAccessToThread(true);
      }
      return;
    }
    if (agent?.status === 1) {
      const firstMessage = messages[0];
      const currentUserID = getCurrentUserID();
      setHasWriteAccessToThread(firstMessage.user_id === currentUserID);
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
    const threadIdIsUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        threadId
      );
    if (threadIdIsUUID) {
      getThreadbyID(params).then((res) => {
        setMessages(
          res.messages.map((message) => ({
            content: message.content,
            user_id: message.user_id,
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
  });

  useEffect(() => {
    // Extract unique file IDs from messages with sources
    const fileIDSet = new Set<string>();
    messages.forEach((message) => {
      if (message.sources && message.sources.length > 0) {
        message.sources.forEach((source) => {
          fileIDSet.add(source.fileID);
        });
      }
    });
    // Convert the Set to an array and pass it to the parent
    setUniqueFileIDs(Array.from(fileIDSet));
  }, [messages]);

  const appendMessage = (content, align, sources = []) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { content, align, sources, currentChatSession: true },
    ]);
  };

  const updateLastMessage = (content, sources, MsgId) => {
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages];
      if (newMessages.length > 0) {
        newMessages[newMessages.length - 1].content = content;
        newMessages[newMessages.length - 1].sources = sources;
        newMessages[newMessages.length - 1].MsgId = MsgId;
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

  const revertLastMessage = (sentMessage) => {
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages];
      newMessages.pop(); // Remove the last message
      return newMessages;
    });
    setMessage(sentMessage); // Restore the message content
  };

  const sendMessage = async () => {
    if (isResponseStreaming || !hasWriteAccessToThread || message.trim() === "") {
      return;
    }
    setIsResponseStreaming(true);
    await checkToken();

    let currentThreadId = threadId;
    if (currentThreadId === "new") {
      currentThreadId = (await getNewThreadID()) || "error";
      setThreadId(currentThreadId);
      const newUrl = `/agents/${agentID}/${currentThreadId}`;
      window.history.replaceState(
        { ...window.history.state, as: newUrl, url: newUrl },
        "",
        newUrl
      );
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
      user_id: userId,
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
        if (!response.body) {
          throw new Error("Response body is null");
        }
        const reader = response.body
          .pipeThrough(new TextDecoderStream())
          .getReader();

        const processStream = async () => {
          let responseMessage = "";
          let sources: Source[] = []; // Initialize the sources array

          appendMessage("", "start");
          let readBuffer = ""; // Initialize the read buffer
          while (true) {
            const { done, value } = await reader.read(); // Read the next chunk of data
            readBuffer += value || ""; // Append the new value to the buffer
            const lines = readBuffer
              .split("\n")
              .filter((line) => line !== "" && line !== "\r"); // Split the buffer into lines and remove empty lines
            if (lines.length >= 3 || (done && lines.length > 0)) {
              // Check if there are at least 3 lines, or if the stream is done
              let line = ""; // Initialize the line variable
              let data: { response?: string; source?: any[]; msg_id?: string } =
                {}; // Initialize the data object
              let usedLine = 0; // Initialize the index of the last line used
              // When there are at least 3 lines, we are absolutely sure that the middle line is complete JSON
              // However, we still try to parse the last line first. If the last line is incomplete, we will use the second last line
              try {
                // Try to parse the JSON from the last line
                line = lines.at(-1) || "";
                if (line.startsWith("data: ")) {
                  data = JSON.parse(line.slice(6));
                  usedLine = -1;
                } else {
                  line = lines.at(-2) || "";
                  if (line.startsWith("data: ")) {
                    data = JSON.parse(line.slice(6));
                    usedLine = -2;
                  }
                }
              } catch (e) {
                // If there is a syntax error, get the second last line
                if (e instanceof SyntaxError) {
                  line = lines.at(-2) || "";
                  if (line.startsWith("data: ")) {
                    data = JSON.parse(line.slice(6));
                    usedLine = -2;
                  }
                }
              }

              try {
                if (
                  data.source &&
                  Array.isArray(data.source) &&
                  data.source.length > 0
                ) {
                  sources = data.source.map((src, index) => {
                    const parsedSrc = src;
                    return {
                      index: index + 1,
                      fileName: parsedSrc.file_name,
                      page: parsedSrc.page + 1,
                      fileID: parsedSrc.file_id,
                    };
                  });
                }

                responseMessage = data.response || "";
                updateLastMessage(responseMessage, sources, data.msg_id);
              } catch (e) {
                if (e instanceof SyntaxError) {
                  console.warn(
                    "Incomplete JSON received, waiting for the next chunk."
                  );
                } else {
                  console.error("Error parsing JSON:", e, line);
                }
              }
              readBuffer = usedLine === -1 ? "" : lines.at(-1) || ""; // If the last line was used, clear the buffer.
              // If the second last line was used, keep the last line in the buffer
            }
            if (done) break;
          }
          setIsResponseStreaming(false);
        };

        processStream();
      })
      .catch((err) => {
        console.error(err);
        setIsResponseStreaming(false);
        revertLastMessage(message); // Revert the message on error
      });
  };

  return (
    <Card className="m-2 ml-1" style={{ height: "calc(100% - 1rem)" }}>
      <div className="flex flex-col grow px-4 pt-5 pb-2 w-full text-base leading-6 max-md:px-5 max-md:max-w-full h-full">
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
              setSelectedDocumentPage={setSelectedDocumentPage}
              currentChatSession={message.currentChatSession}
              MsgId={message.MsgId}
              threadId={threadId}
            />
          ))}
          <div ref={lastMessageRef} className="min-h-3"></div>
        </ScrollShadow>
        <footer className="flex-shrink-0">
          <InputMessage
            placeholder={
              hasWriteAccessToThread
                ? "Enter your message"
                : "You cannot chat with this thread. This could be because the professor disabled the agent or you are viewing a thread that is not yours."
            }
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
