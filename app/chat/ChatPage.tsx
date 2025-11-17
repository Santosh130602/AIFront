"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";
import API from "../lib/api";

export default function ChatPage() {
  const params = useSearchParams();
  const router = useRouter();

  const [convId, setConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const id = params.get("convId");
    setConvId(id);
    id ? loadMessages(id) : setMessages([]);
  }, [params]);

  async function loadMessages(id: string) {
    try {
      const res = await API.get(`/conversations/${id}/messages`);
      setMessages(res.data);
    } catch (e) {
      console.log(e);
    }
  }

  async function sendMessage(text: string) {
    setMessages((m) => [
      ...m,
      { role: "user", content: text, createdAt: new Date().toISOString() },
    ]);

    setLoading(true);

    try {
      const res = await API.post("/ai/respond", {
        message: text,
        conversationId: convId,
      });

      const newId = res.data.conversationId;
      if (newId) {
        setConvId(newId);
        router.replace(`/chat?convId=${newId}`);
      }

      const newMsgs = res.data.messages.map((m: any) =>
        m.toolName
          ? {
              role: "tool",
              content: m.summary,
              toolName: m.toolName,
              createdAt: new Date().toISOString(),
            }
          : {
              role: m.role,
              content: m.content,
              createdAt: m.createdAt || new Date().toISOString(),
            }
      );

      setMessages((prev) => [...prev, ...newMsgs]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Server error" }]);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (boxRef.current)
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [messages]);



  function openConversation(id: string | null) {
    id ? router.push(`/chat?convId=${id}`) : router.push("/chat");
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar onSelect={openConversation} />

      {/* Mobile toggle button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-3 left-3 p-2 bg-[#111827] rounded-lg z-50"
      >
        <span className="material-symbols-outlined text-white">menu</span>
      </button>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="w-64 h-full bg-[#111827] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar
              onSelect={(id) => {
                openConversation(id);
                setSidebarOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Chat window */}
      <div className="flex-1 flex flex-col">
        <div
          ref={boxRef}
          className="flex-1 overflow-y-auto p-6"
        >
          <div className="max-w-4xl mx-auto flex flex-col gap-8">
            {messages.map((msg, idx) => (
              <MessageBubble message={msg} key={idx} />
            ))}
          </div>
        </div>

        <MessageInput onSend={sendMessage} sending={loading} />
      </div>
    </div>
  );
}
