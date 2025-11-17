import { Suspense } from "react";
import ChatPage from "./ChatPage";

export default function ChatPageWrapper() {
  return (
    <Suspense fallback={<div className="text-white p-6">Loading chat…</div>}>
      <ChatPage />
    </Suspense>
  );
}
