"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProjects } from "@/lib/api";
import { getToken } from "@/lib/auth";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    async function load() {
      const data = await getProjects();
      setProjects(data);
    }

    load();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-xl mb-4">My Projects</h1>

      {projects.map((p: any) => (
        <div key={p.id} className="border p-2 mb-2">
          {p.name}
        </div>
      ))}
    </div>
  );
}