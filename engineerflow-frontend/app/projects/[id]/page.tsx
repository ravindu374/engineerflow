"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Task = { id: string; title: string; status: "TODO" | "IN_PROGRESS" | "DONE" };

const COLUMNS: { key: Task["status"]; label: string; dotClass: string; countClass: string }[] = [
  { key: "TODO",        label: "Todo",        dotClass: "bg-gray-400",   countClass: "text-gray-500 bg-gray-50 border-gray-200" },
  { key: "IN_PROGRESS", label: "In progress", dotClass: "bg-amber-400",  countClass: "text-amber-700 bg-amber-50 border-amber-200" },
  { key: "DONE",        label: "Done",        dotClass: "bg-teal-500",   countClass: "text-teal-700 bg-teal-50 border-teal-200" },
];

export default function ProjectDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    async function loadTasks() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      } catch (e) { console.error(e); }
    }
    loadTasks();
  }, [id]);

  async function createTask() {
    if (!title.trim()) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, project_id: id }),
      });
      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      setTitle("");
    } catch (e) { console.error(e); }
  }

  async function updateStatus(taskId: string, status: Task["status"]) {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks/${taskId}/status?status=${status}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
    } catch (e) { console.error(e); }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-gray-50">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors text-sm"
        >
          ←
        </button>
        <h1 style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.5px" }} className="text-lg font-bold text-gray-900">
          Project Tasks
        </h1>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-8">
        {/* Add task */}
        <div className="flex gap-3 mb-8">
          <input
            type="text"
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createTask()}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-purple-400 transition-colors shadow-sm"
          />
          <button
            onClick={createTask}
            className="px-5 py-2.5 bg-teal-700 hover:bg-teal-600 text-teal-50 text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            + Add task
          </button>
        </div>

        {/* Kanban board */}
        <div className="grid grid-cols-3 gap-5">
          {COLUMNS.map(({ key, label, dotClass, countClass }) => {
            const colTasks = tasks.filter((t) => t.status === key);
            return (
              <div key={key} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                {/* Column header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${dotClass}`} />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">{label}</span>
                  </div>
                  <span className={`text-xs font-medium border rounded-full px-2.5 py-0.5 ${countClass}`}>
                    {colTasks.length}
                  </span>
                </div>

                {/* Tasks */}
                <div className="space-y-2">
                  {colTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onUpdate={updateStatus} />
                  ))}
                  {colTasks.length === 0 && (
                    <div className="text-xs text-gray-300 text-center py-6 border border-dashed border-gray-100 rounded-lg">
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function TaskCard({ task, onUpdate }: { task: Task; onUpdate: (id: string, status: Task["status"]) => void }) {
  return (
    <div className={`bg-gray-50 border border-gray-100 rounded-lg p-3 hover:border-gray-200 transition-colors ${task.status === "DONE" ? "opacity-60" : ""}`}>
      <p className="text-sm font-medium text-gray-800 mb-2.5">{task.title}</p>
      <div className="flex gap-1.5 flex-wrap">
        {task.status !== "TODO" && (
          <button
            onClick={() => onUpdate(task.id, "TODO")}
            className="text-xs px-2.5 py-1 rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 transition-colors"
          >
            ← Todo
          </button>
        )}
        {task.status !== "IN_PROGRESS" && (
          <button
            onClick={() => onUpdate(task.id, "IN_PROGRESS")}
            className="text-xs px-2.5 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
          >
            {task.status === "TODO" ? "→ Progress" : "↩ Reopen"}
          </button>
        )}
        {task.status !== "DONE" && (
          <button
            onClick={() => onUpdate(task.id, "DONE")}
            className="text-xs px-2.5 py-1 rounded-full border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors"
          >
            ✓ Done
          </button>
        )}
      </div>
    </div>
  );
}