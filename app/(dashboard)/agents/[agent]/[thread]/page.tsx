"use client";
import React, { useState, useEffect, useContext, Suspense } from "react";
import { getAgentByID, GetAgentByIDResponse } from "@/api/agent/agent";
import useMount from "@/components/hooks/useMount";
import ChatPage from "../../../chat/ChatPage";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const modelList = [
  { value: "openai", label: "OpenAI - ChatGPT" },
  { value: "anthropic", label: "Anthropic - Claude AI" },
];

const Page = ({
  params,
  searchParams,
}: {
  params: { agent: string; thread: string };
  searchParams: { from?: string };
}) => {
  const [agent, setAgent] = useState<GetAgentByIDResponse | null>(null);

  const [status, setStatus] = useState(1); // 1 - new Agent, 2 - Edit Agent

  const router = useRouter();

  useMount(() => {
    fetchAgent();
  });

  const generateShareUrl = (agent) => {
    const baseUrl = "https://chat.ai4edu.io";
    const url = `${baseUrl}/agent/${agent.agent_id}`;
    return url;
  };

  const CopyToClipboard = (agent) => {
    navigator.clipboard.writeText(generateShareUrl(agent));
    toast.success("Copied to clipboard!", {
      hideProgressBar: true,
      autoClose: 2000,
    });
  };

  const fetchAgent = () => {
    getAgentByID({ agent_id: params.agent })
      .then((res) => {
        if (res !== undefined) {
          setAgent(res);
          console.log(res);
        }
      })
      .catch((error) => {
        console.error("Error fetching agents:", error);
      });
  };
  const closeChatModal = () => {
    // go back to previous page
    if (searchParams.from === "chat-history") {
      router.push("/chat-history");
    } else {
      router.push("/agents");
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="mx-6 ">
        <ToastContainer />
        {agent && (
          <ChatPage
            isOpen={true}
            onClose={closeChatModal}
            status={status}
            agent={agent}
            thread={params.thread}
          />
        )}
      </div>
    </Suspense>
  );
};

export default Page;
