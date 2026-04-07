"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "@/lib/api";

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    async function load() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setCheckingAuth(false);
      }
    }

    load();
  }, []);

  async function handleCreate() {
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
    return <p className="p-10">Loading...</p>;
  }

  return (
    <div className="p-10">
      <h1 className="text-xl mb-4">My Projects</h1>

      {/* CREATE FORM */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mr-2"
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 mr-2"
        />

        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Create
        </button>
      </div>

      {/* PROJECT LIST */}
      {projects.length === 0 ? (
        <p>No projects yet</p>
      ) : (
        projects.map((p: any) => (
          <div key={p.id} className="border p-2 mb-2">
            {<div
                key={p.id}
                onClick={() => router.push(`/projects/${p.id}`)}
                className="border p-2 mb-2 cursor-pointer hover:bg-gray-100"
              >
                {p.name}
              </div>}
          </div>
        ))
      )}
    </div>
  );
}