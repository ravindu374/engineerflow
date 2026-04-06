"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProjects } from "@/lib/api";

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // wait until browser fully loads
    const token = localStorage.getItem("token");
    console.log("FINAL TOKEN:", token);
    console.log("TOKEN RAW:", JSON.stringify(token));

    if (!token) {
      router.push("/login");
      return;
    }

    async function load() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects`,
          {
            headers: {
              Authorization: `Bearer ${token?.trim()}`,
            },
          }
        );

        const data = await res.json();
        console.log("API RESPONSE:", data);

        setProjects(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setCheckingAuth(false);
      }
    }

    load();
  }, []);

  if (checkingAuth) {
    return <p className="p-10">Loading...</p>;
  }

  return (
    <div className="p-10">
      <h1 className="text-xl mb-4">My Projects</h1>

      {projects.length === 0 ? (
        <p>No projects yet</p>
      ) : (
        projects.map((p: any) => (
          <div key={p.id} className="border p-2 mb-2">
            {p.name}
          </div>
        ))
      )}
    </div>
  );
}