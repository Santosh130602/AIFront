"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "./lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function login(e: any) {
    e.preventDefault();
    setErr("");
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      router.push("/chat");
    } catch (error: any) {
      setErr(error?.response?.data?.error || "Login failed");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-white p-6 rounded-xl shadow max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-center mb-4 text-blue-600">Login</h2>

        {err && <p className="text-red-600 text-sm mb-2">{err}</p>}

        <form onSubmit={login} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
            Login
          </button>
        </form>

        <button
          className="w-full text-sm text-blue-600 mt-4"
          onClick={() => router.push("/register")}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
