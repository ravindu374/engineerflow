"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "@/lib/api";
import { getCurrentUser } from "@/lib/api";

const ACCENT_COLORS = ["bg-purple-500", "bg-teal-500", "bg-orange-500", "bg-pink-500", "bg-blue-500", "bg-amber-500"];

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    async function load() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        setUser(userData);
      } catch (e) {
        console.error(e);
      } finally {
        setCheckingAuth(false);
      }
    }
    load();
  }, []);

  async function handleCreate() {
    if (!name.trim()) return;
    try {
      const newProject = await createProject(name, description);
      setProjects((prev) => [...prev, newProject]);
      setName("");
      setDescription("");
    } catch (e) {
      console.error(e);
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-sm text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-gray-50">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <h1 style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.5px" }} className="text-xl font-bold text-gray-900">
          work<span className="text-purple-600">flow</span>
        </h1>
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-full px-4 py-1.5">
          <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-medium flex items-center justify-center">
            {user?.full_name
              ?.split(" ")
              .map((n: string) => n[0])
              .join("")
              .slice(0, 2) || "U"}
          </div>
          <span className="text-sm text-gray-500">{user?.full_name || "Loading..."}</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-8">
        {/* Create project */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 mb-8 shadow-sm">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">New project</p>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-purple-400 transition-colors"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-purple-400 transition-colors"
            />
            <button
              onClick={handleCreate}
              className="px-5 py-2.5 bg-purple-700 hover:bg-purple-600 text-purple-50 text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
            >
              + Create
            </button>
          </div>
        </div>

        {/* Project list */}
        {projects.length === 0 ? (
          <div className="text-center py-20 text-gray-300 text-sm">No projects yet — create one above</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p: any, i: number) => (
              <div
                key={p.id}
                onClick={() => router.push(`/projects/${p.id}`)}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:border-purple-200 transition-all duration-200 shadow-sm"
              >
                <div className={`h-1 w-full ${ACCENT_COLORS[i % ACCENT_COLORS.length]}`} />
                <div className="p-5">
                  <h3 style={{ fontFamily: "'Syne', sans-serif" }} className="font-semibold text-gray-900 text-base mb-1">
                    {p.name}
                  </h3>
                  {p.description && (
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2">{p.description}</p>
                  )}
                  <span className="inline-flex items-center text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-3 py-1 mt-1">
                    View tasks →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}