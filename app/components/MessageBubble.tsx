
interface ChatMessage {
  role: "user" | "assistant" | "tool";
  content: string;
  toolName?: string;
  createdAt?: string;
}

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const time = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  // USER
  if (message.role === "user") {
    return (
      <div className="flex items-start justify-end gap-3">
        <div className="flex flex-col items-end max-w-[70%]">
          <div className="text-xs text-[#6b7280]">{time}</div>
          <div className="px-4 py-3 bg-[#135bec] text-white rounded-xl rounded-br-none">
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  // TOOL
  if (message.role === "tool") {
    return (
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-cover bg-center" style={{
          backgroundImage:
            "url('https://i.ibb.co/CKVY9ZC/ai-avatar.png')"
        }} />

        <div className="flex flex-col max-w-[70%]">
          <div className="text-xs text-[#6b7280] mb-1">{time}</div>

          <div className="px-4 py-3 bg-[#1f2937] border-l-4 border-[#14b8a6] rounded-xl">
            <div className="text-[#e5e7eb]">{message.content}</div>
          </div>

          <div className="flex items-center gap-2 bg-[#374151] px-3 py-1 rounded-lg mt-2 text-[#9ca3af] text-sm">
            <span className="material-symbols-outlined text-[#14b8a6]">
              database
            </span>
            Generated via {message.toolName}
          </div>
        </div>
      </div>
    );
  }

  // ASSISTANT
  return (
    <div className="flex items-start gap-3">
      <div
        className="w-10 h-10 rounded-full bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://i.ibb.co/CKVY9ZC/ai-avatar.png')",
        }}
      />

      <div className="flex flex-col max-w-[70%]">
        <div className="text-xs text-[#6b7280]">{time}</div>

        <div className="px-4 py-3 bg-[#1f2937] text-[#e5e7eb] rounded-xl rounded-bl-none">
          {message.content}
        </div>
      </div>
    </div>
  );
}
