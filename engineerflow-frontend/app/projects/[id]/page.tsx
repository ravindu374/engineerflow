"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProjectDetails() {
  const { id } = useParams();

  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function loadTasks() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    }

    loadTasks();
  }, [id]);

  // CREATE TASK
  async function createTask() {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          project_id: id,
        }),
      }
    );

    const newTask = await res.json();
    setTasks((prev) => [...prev, newTask]);
    setTitle("");
  }

  // MOVE THIS OUTSIDE createTask
  async function updateStatus(taskId: string, status: string) {
    const token = localStorage.getItem("token");

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks/${taskId}/status?status=${status}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // update UI instantly
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status } : t
      )
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-xl mb-4">Project Tasks</h1>

      {/* CREATE TASK */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 mr-2"
        />

        <button
          onClick={createTask}
          className="bg-green-500 text-white px-4 py-2"
        >
          Add Task
        </button>
      </div>

      {/* TASK LIST */}
      {tasks.map((t) => (
        <div key={t.id} className="border p-2 mb-2">
          <div className="font-semibold">{t.title}</div>
          <div>Status: {t.status}</div>

          <div className="mt-2">
            <button
              onClick={() => updateStatus(t.id, "TODO")}
              className="mr-2 px-2 py-1 bg-gray-300"
            >
              TODO
            </button>

            <button
              onClick={() => updateStatus(t.id, "IN_PROGRESS")}
              className="mr-2 px-2 py-1 bg-yellow-400"
            >
              IN PROGRESS
            </button>

            <button
              onClick={() => updateStatus(t.id, "DONE")}
              className="px-2 py-1 bg-green-500 text-white"
            >
              DONE
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}