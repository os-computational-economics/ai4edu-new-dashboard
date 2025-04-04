"use client";
import React, { useState, Suspense } from "react";
import { getAgentByID, GetAgentByIDResponse } from "@/api/agent/agent";
import useMount from "@/components/hooks/useMount";
import ChatPage from "../../../chat/ChatPage";

import { useRouter } from "next/navigation";
import { addToast } from "@heroui/react";

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
    addToast({
      title: "Copied to clipboard!",
      color: "success",
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
