"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "../lib/api";
import { AxiosError } from "axios";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setErr("");

    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      router.push("/chat");
    } catch (e: AxiosError | any) {
      setErr(e?.response?.data?.error || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1720] px-4">
      <div className="w-full max-w-md bg-[#111827] p-8 rounded-xl border border-[#1f2937]">
        <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
        <p className="text-[#9ca3af] mb-6">Login to continue</p>

        {err && (
          <div className="mb-4 text-red-400 bg-red-900/30 p-3 rounded">
            {err}
          </div>
        )}

        <form onSubmit={login} className="flex flex-col gap-4">
          <input
            className="bg-[#1f2937] border border-[#374151] px-3 py-3 rounded text-white"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="bg-[#1f2937] border border-[#374151] px-3 py-3 rounded text-white"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full py-3 bg-[#135bec] text-white font-semibold rounded-lg">
            Log In
          </button>
        </form>

        <div className="text-center text-[#9ca3af] text-sm mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-[#135bec]">Sign Up</a>
        </div>
      </div>
    </div>
  );
}
