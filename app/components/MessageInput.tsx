"use client";
import { useState } from "react";

interface MessageInputProps {
  onSend: (value: string) => void;
  sending: boolean;
}

export default function MessageInput({ onSend, sending }: MessageInputProps) {
  const [text, setText] = useState("");

  function submit() {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  }

  return (
    <div className="p-4 border-t border-[#1f2937]">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), submit())}
          className="flex-1 bg-[#1f2937] border border-[#374151] text-white px-3 py-3 rounded-lg resize-none"
          placeholder="Type your message..."
        />

        <button
          onClick={submit}
          disabled={sending}
          className="w-12 h-12 rounded-lg bg-[#135bec] text-white flex items-center justify-center"
        >
          <span className="material-symbols-outlined">send</span>
        </button>
      </div>
    </div>
  );
}
