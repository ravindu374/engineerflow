"use client";

import { useState } from "react";
import { login } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const data = await login(email, password);
    console.log(data);
    alert("Check console for token");
  };

  return (
    <div className="p-10">
      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 block mb-2"
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 block mb-2"
      />
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2">
        Login
      </button>
    </div>
  );
}