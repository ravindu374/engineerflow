"use client";

import { useState } from "react";
import { login } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.access_token);
      router.push("/dashboard");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

      <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl p-10 shadow-sm">
        {/* Logo */}
        <div className="mb-8">
          <h1 style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.5px" }} className="text-2xl font-bold text-gray-900">
            work<span className="text-purple-600">flow</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">Sign in to manage your projects</p>
        </div>

        {/* Fields */}
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-purple-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-purple-400 transition-colors"
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="mt-7 w-full py-3 bg-purple-700 hover:bg-purple-600 text-purple-50 text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in →"}
        </button>

        <p className="text-center text-xs text-gray-400 mt-6">
          No account?{" "}
          <Link href="/register" className="text-purple-600 underline">
          Request access
          </Link>
        </p>
      </div>
    </div>
  );
}