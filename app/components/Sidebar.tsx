"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import API from "../lib/api";

interface SidebarProps {
  onSelect: (id: string | null) => void;
}

export default function Sidebar({ onSelect }: SidebarProps) {
  const [convs, setConvs] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false); // mobile overlay open
  const panelRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeConvId = searchParams?.get("convId") || null;

  useEffect(() => {
    loadConversations();
    const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (stored) setUser(JSON.parse(stored));
  }, []);

  async function loadConversations() {
    try {
      const res = await API.get("/conversations");
      setConvs(res.data || []);
    } catch (err) {
      console.error("Failed to load convos", err);
    }
  }

  // Close when clicking outside panel (mobile)
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!open) return;
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  function handleSelect(id: string | null) {
    // close mobile overlay on selection
    setOpen(false);
    onSelect(id);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  return (
    <>
      {/* Floating hamburger button (mobile) */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          aria-label={open ? "Close sidebar" : "Open sidebar"}
          onClick={() => setOpen((s) => !s)}
          className="w-11 h-11 rounded-lg bg-[#111827] border border-[#1f2937] flex items-center justify-center shadow-md"
        >
          <span className="material-symbols-outlined text-white">
            {open ? "D" : "menu"}
          </span>
        </button>
      </div>

      {/* Desktop persistent sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-[#111827] border-r border-[#1f2937] p-4">
        {/* user */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-12 h-12 rounded-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://i.ibb.co/5GzXkwq/user.png')",
            }}
          />
          <div>
            <div className="text-white font-semibold">{user?.name || "User"}</div>
            <div className="text-[#9ca3af] text-sm">{user?.email || ""}</div>
          </div>
        </div>

        {/* New chat */}
        <button
          onClick={() => handleSelect(null)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#135bec] text-white mb-5"
        >
          <span className="material-symbols-outlined">add</span>
          New Chat
        </button>

        {/* Recent header */}
        <div className="text-xs text-[#6b7280] mb-2">RECENT</div>

        {/* Recent convos */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2">
          {convs.map((c) => {
            const active = c._id === activeConvId;
            return (
              <button
                key={c._id}
                onClick={() => handleSelect(c._id)}
                className={`w-full flex items-start gap-3 px-3 py-2 rounded-lg text-left transition ${
                  active
                    ? "bg-[#1b2638] ring-1 ring-[#135bec]/40"
                    : "bg-[#1f2937] hover:bg-[#2d3646]"
                }`}
              >
                <span
                  className={`material-symbols-outlined ${active ? "text-[#135bec]" : "text-[#9ca3af]"}`}
                >
                  chat_bubble
                </span>

                <div className="flex-1">
                  <div className={`text-sm truncate ${active ? "text-white font-medium" : "text-white"}`}>
                    {c.title || "Untitled"}
                  </div>
                  <div className="text-xs text-[#6b7280] mt-1">
                    {new Date(c.createdAt).toLocaleString()}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="mt-4 pt-4 border-t border-[#1f2937] flex flex-col gap-2">
          

          <button
            onClick={handleLogout}
            className="mt-2 flex items-center gap-3 text-[#f87171] hover:text-white"
          >
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay + sliding panel */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40">
          {/* Backdrop (blur + translucent) */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Sliding panel */}
          <div
            ref={panelRef}
            className={`relative z-50 h-full w-64 bg-[#111827] p-4 transform transition-transform duration-300 ease-out translate-x-0`}
            // panelRef used for outside click detection in parent useEffect
          >
            {/* top: small close icon */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://i.ibb.co/5GzXkwq/user.png')",
                  }}
                />
                <div>
                  <div className="text-white font-semibold">{user?.name || "User"}</div>
                  <div className="text-[#9ca3af] text-sm">{user?.email || ""}</div>
                </div>
              </div>

              <button
                aria-label="Close sidebar"
                onClick={() => setOpen(false)}
                className="p-2 rounded-md bg-[#0f1720] border border-[#1f2937] text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* New chat */}
            <button
              onClick={() => handleSelect(null)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#135bec] text-white mb-4"
            >
              <span className="material-symbols-outlined">add</span>
              New Chat
            </button>

            <div className="text-xs text-[#6b7280] mb-2">RECENT</div>

            <div className="flex flex-col gap-2 overflow-y-auto max-h-[60vh] pb-4">
              {convs.map((c) => {
                const active = c._id === activeConvId;
                return (
                  <button
                    key={c._id}
                    onClick={() => handleSelect(c._id)}
                    className={`w-full flex items-start gap-3 px-3 py-2 rounded-lg text-left transition ${
                      active
                        ? "bg-[#1b2638] ring-1 ring-[#135bec]/40"
                        : "bg-[#1f2937] hover:bg-[#2d3646]"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined ${active ? "text-[#135bec]" : "text-[#9ca3af]"}`}
                    >
                      chat_bubble
                    </span>

                    <div className="flex-1">
                      <div className={`text-sm truncate ${active ? "text-white font-medium" : "text-white"}`}>
                        {c.title || "Untitled"}
                      </div>
                      <div className="text-xs text-[#6b7280] mt-1">
                        {new Date(c.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto pt-4 border-t border-[#1f2937] flex flex-col gap-2">
              

              <button
                onClick={() => { setOpen(false); handleLogout(); }}
                className="mt-2 flex items-center gap-3 text-[#f87171] hover:text-white"
              >
                <span className="material-symbols-outlined">logout</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
