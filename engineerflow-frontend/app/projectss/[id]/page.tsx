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
      {tasks.length === 0 ? (
        <p>No tasks yet</p>
      ) : (
        tasks.map((t) => (
          <div key={t.id} className="border p-2 mb-2">
            {t.title} - {t.status}
          </div>
        ))
      )}
    </div>
  );
}