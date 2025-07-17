"use client";
import React, { useState } from "react";

type Task = {
  id: string;
  text: string;
  due: string;
  priority: "Low" | "Medium" | "High";
  completed: boolean;
};

type Reward = {
  id: string;
  label: string;
  xp: number;
  emoji: string;
  disabled: boolean;
};

const REWARDS: Reward[] = [
  { id: "gaming", label: "Gaming Credit ($20)", xp: 1200, emoji: "🎮", disabled: true },
  { id: "book", label: "Bookstore Voucher ($5)", xp: 300, emoji: "📚", disabled: true },
  { id: "movie", label: "Movie Ticket", xp: 500, emoji: "🎬", disabled: true },
  { id: "coffee", label: "Coffee Voucher", xp: 200, emoji: "☕️", disabled: true },
  { id: "gift", label: "Online Store Gift Card ($10)", xp: 1000, emoji: "🎁", disabled: true },
];

const XP_PER_TASK = 20;
const LEVEL_XP = 100;

function getLevel(xp: number) {
  return Math.floor(xp / LEVEL_XP) + 1;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [due, setDue] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Low");
  const [xp, setXp] = useState(0);
  const [xpHistory, setXpHistory] = useState<{ task: string; xp: number }[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  React.useEffect(() => {
    let stored = window.localStorage.getItem("gamified-todo-userid");
    if (!stored) {
      stored = "User-" + Math.random().toString(36).slice(2, 10);
      window.localStorage.setItem("gamified-todo-userid", stored);
    }
    setUserId(stored);
  }, []);

  const completedCount = tasks.filter((t) => t.completed).length;
  const level = getLevel(xp);
  const xpInLevel = xp - LEVEL_XP * (level - 1);

  function addTask() {
    if (!input.trim()) return;
    setTasks([
      ...tasks,
      {
        id: Math.random().toString(36).slice(2),
        text: input,
        due,
        priority,
        completed: false,
      },
    ]);
    setInput("");
    setDue("");
    setPriority("Low");
  }

  function completeTask(id: string) {
    setTasks((tasks) =>
      tasks.map((t) =>
        t.id === id ? { ...t, completed: true } : t
      )
    );
    const task = tasks.find((t) => t.id === id);
    setXp((xp) => xp + XP_PER_TASK);
    setXpHistory((hist) => [
      { task: task?.text || "Task", xp: XP_PER_TASK },
      ...hist,
    ]);
  }

  function deleteTask(id: string) {
    setTasks((tasks) => tasks.filter((t) => t.id !== id));
  }

  function canRedeem(reward: Reward) {
    return xp >= reward.xp;
  }

  function redeemReward(reward: Reward) {
    if (!canRedeem(reward)) return;
    setXp((xp) => xp - reward.xp);
    setXpHistory((hist) => [
      { task: `Redeemed: ${reward.label}`, xp: -reward.xp },
      ...hist,
    ]);
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col items-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-5xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-xl shadow p-6 mb-2">
          <h1 className="text-3xl font-bold text-[#6c63ff] mb-2 sm:mb-0">Gamified To-Do</h1>
          <div className="text-sm text-gray-700 flex flex-col items-end">
            <span>
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-base">person</span>
                {userId ? userId : "…"}
              </span>
            </span>
            <span>
              Level: <b>{level}</b> | Tasks Completed: <b>{completedCount}</b>
            </span>
            <span className="text-xs text-gray-400">
              Your ID: {userId ? btoa(userId).slice(0, 24) : "…"}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Tasks */}
          <div className="flex-1 bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-green-500">check_circle</span>
              Your Tasks
            </h2>
            {/* Add Task */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <input
                className="border rounded px-3 py-2 flex-1 text-sm outline-[#6c63ff]"
                placeholder="Add a new task..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
              />
              <input
                className="border rounded px-3 py-2 text-sm w-36 outline-[#6c63ff]"
                type="date"
                value={due}
                onChange={(e) => setDue(e.target.value)}
              />
              <select
                className="border rounded px-3 py-2 text-sm w-32 outline-[#6c63ff]"
                value={priority}
                onChange={(e) => setPriority(e.target.value as "Low" | "Medium" | "High")}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <button
                className="bg-[#6c63ff] text-white rounded px-4 py-2 font-semibold hover:bg-[#554fd8] transition"
                onClick={addTask}
              >
                + Add Task
              </button>
            </div>
            {/* Task List */}
            <div className="flex flex-col gap-2">
              {tasks.length === 0 && (
                <div className="text-gray-400 text-center py-8">No tasks yet!</div>
              )}
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between rounded-lg px-4 py-3 border ${
                    task.completed
                      ? "bg-green-50 text-gray-400 line-through"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{task.text}</span>
                    <div className="text-xs flex gap-4 text-gray-500">
                      {task.due && (
                        <span>
                          <span className="material-symbols-outlined text-base align-middle">event</span>
                          Due: {task.due}
                        </span>
                      )}
                      <span>
                        Priority:{" "}
                        <span
                          className={
                            task.priority === "High"
                              ? "text-red-500"
                              : task.priority === "Medium"
                              ? "text-yellow-500"
                              : "text-green-500"
                          }
                        >
                          {task.priority}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!task.completed && (
                      <button
                        className="bg-[#6c63ff] text-white rounded-full px-3 py-1 text-xs font-semibold hover:bg-[#554fd8] transition"
                        onClick={() => completeTask(task.id)}
                        title="Mark as done"
                      >
                        Done
                      </button>
                    )}
                    <button
                      className="bg-red-100 text-red-500 rounded-full p-2 hover:bg-red-200 transition"
                      onClick={() => deleteTask(task.id)}
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Progress, Rewards, XP */}
          <div className="flex flex-col gap-4 w-full lg:w-80">
            {/* Progress */}
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-yellow-500">emoji_events</span>
                Progress
              </h3>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold">Level {level}</span>
                <span className="text-xs text-gray-400">{xpInLevel} / {LEVEL_XP} XP</span>
              </div>
              <div className="w-full bg-gray-200 rounded h-2 mb-2">
                <div
                  className="bg-[#6c63ff] h-2 rounded"
                  style={{ width: `${(xpInLevel / LEVEL_XP) * 100}%` }}
                />
              </div>
              <div className="text-xs text-gray-500">
                Keep completing tasks to reach Level {level + 1}!
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold text-base flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-blue-400">filter_alt</span>
                Upcoming Tasks ({tasks.filter((t) => !t.completed).length})
              </h3>
              {tasks.filter((t) => !t.completed).length === 0 ? (
                <div className="text-xs text-gray-400">No uncompleted tasks!</div>
              ) : (
                <ul className="text-xs text-gray-700 list-disc ml-4">
                  {tasks
                    .filter((t) => !t.completed)
                    .map((t) => (
                      <li key={t.id}>{t.text}</li>
                    ))}
                </ul>
              )}
            </div>

            {/* XP History */}
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold text-base flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-green-400">history</span>
                XP History
              </h3>
              {xpHistory.length === 0 ? (
                <div className="text-xs text-gray-400">No XP history yet.</div>
              ) : (
                <ul className="text-xs text-gray-700 flex flex-col gap-1">
                  {xpHistory.slice(0, 5).map((h, i) => (
                    <li key={i}>
                      {h.task}{" "}
                      <span className={h.xp > 0 ? "text-green-500" : "text-red-500"}>
                        {h.xp > 0 ? "+" : ""}
                        {h.xp} XP
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Rewards */}
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold text-base flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-purple-400">card_giftcard</span>
                Rewards
              </h3>
              <div className="flex flex-col gap-3">
                {REWARDS.map((reward) => (
                  <div
                    key={reward.id}
                    className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{reward.emoji}</span>
                      <div>
                        <div className="font-medium">{reward.label}</div>
                        <div className="text-xs text-gray-500">{reward.xp} XP</div>
                      </div>
                    </div>
                    <button
                      className={`rounded px-4 py-1 font-semibold text-sm transition ${
                        canRedeem(reward)
                          ? "bg-[#6c63ff] text-white hover:bg-[#554fd8]"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                      disabled={!canRedeem(reward)}
                      onClick={() => redeemReward(reward)}
                    >
                      Redeem
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Google Fonts and Material Symbols */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        rel="stylesheet"
      />
      <style>{`
        body, html {
          font-family: 'Inter', sans-serif;
        }
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
}