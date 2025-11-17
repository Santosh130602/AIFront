"use client";
import { useEffect, useState } from "react";
import API from "../lib/api";
import Link from "next/link";



interface Conversation {
  _id: string;
  title: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [convs, setConvs] = useState<Conversation[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await API.get("/conversations");
      setConvs(res.data);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="min-h-screen p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Chat History</h2>

      <div className="grid gap-4 mt-4">
        {convs.map((c) => (
          <Link
            key={c._id}
            href={`/chat?convId=${c._id}`}
            className="p-4 bg-[#111827] border border-[#1f2937] rounded-xl hover:bg-[#1f2937]"
          >
            <div className="font-semibold">{c.title}</div>
            <div className="text-sm text-[#6b7280]">
              {new Date(c.createdAt).toLocaleString()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
