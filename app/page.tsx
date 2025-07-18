"use client";
import React, { useState, useEffect } from "react";

type ClassItem = {
  id: string;
  name: string;
  time: string;
  location: string;
};

type Task = {
  id: string;
  text: string;
  done: boolean;
};

type Note = {
  id: string;
  text: string;
};

const initialClasses: ClassItem[] = [
  { id: "1", name: "Math 101", time: "Mon 9:00-10:30", location: "Room 201" },
  { id: "2", name: "Biology 202", time: "Tue 11:00-12:30", location: "Room 105" },
  { id: "3", name: "History 303", time: "Wed 14:00-15:30", location: "Room 307" },
  { id: "4", name: "CS 404", time: "Thu 16:00-17:30", location: "Room 410" },
];

export default function Home() {
  // Time and Date
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  // Classes
  const [classes] = useState<ClassItem[]>(initialClasses);

  // Quick Tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState("");

  // Notes
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteInput, setNoteInput] = useState("");

  // Navigation
  const navItems = [
    { label: "Notes", href: "#" },
    { label: "Calendar", href: "#" },
    { label: "Books/Journal", href: "#" },
    { label: "Schedule", href: "#" },
  ];

  function addTask() {
    if (!taskInput.trim()) return;
    setTasks([...tasks, { id: Math.random().toString(36).slice(2), text: taskInput, done: false }]);
    setTaskInput("");
  }

  function toggleTask(id: string) {
    setTasks(tasks =>
      tasks.map(t => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function removeTask(id: string) {
    setTasks(tasks => tasks.filter(t => t.id !== id));
  }

  function addNote() {
    if (!noteInput.trim()) return;
    setNotes([...notes, { id: Math.random().toString(36).slice(2), text: noteInput }]);
    setNoteInput("");
  }

  function removeNote(id: string) {
    setNotes(notes => notes.filter(n => n.id !== id));
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col items-center p-4 sm:p-8 font-sans">
      {/* Header */}
      <header className="w-full max-w-5xl mb-6">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-bold tracking-wide text-[#6c63ff]">HOME PAGE</h1>
          <div className="w-full h-2 bg-gray-200 rounded mt-2 mb-2" />
        </div>
      </header>

      {/* Main Layout */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <aside className="md:col-span-1 flex flex-col gap-6">
          {/* Time + Date */}
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold mb-1">Time + Date</span>
            <span className="text-2xl font-mono">{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            <span className="text-sm text-gray-500">{now.toLocaleDateString()}</span>
          </div>
          {/* Quick Tasks */}
          <div className="bg-white rounded-xl shadow p-4">
            <span className="font-semibold text-base mb-2 block">Quick Tasks</span>
            <div className="flex gap-2 mb-2">
              <input
                className="border rounded px-2 py-1 text-sm flex-1"
                placeholder="Add a task..."
                value={taskInput}
                onChange={e => setTaskInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTask()}
              />
              <button
                className="bg-[#6c63ff] text-white px-3 py-1 rounded hover:bg-[#554fd8] text-sm"
                onClick={addTask}
                aria-label="Add task"
              >
                +
              </button>
            </div>
            <ul className="space-y-1">
              {tasks.map(task => (
                <li key={task.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span className={task.done ? "line-through text-gray-400" : ""}>{task.text}</span>
                  <button
                    className="ml-auto text-red-400 hover:text-red-600"
                    onClick={() => removeTask(task.id)}
                    aria-label="Remove task"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* Quick Notes */}
          <div className="bg-white rounded-xl shadow p-4">
            <span className="font-semibold text-base mb-2 block">Quick Notes</span>
            <div className="flex gap-2 mb-2">
              <input
                className="border rounded px-2 py-1 text-sm flex-1"
                placeholder="Add a note..."
                value={noteInput}
                onChange={e => setNoteInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addNote()}
              />
              <button
                className="bg-[#6c63ff] text-white px-3 py-1 rounded hover:bg-[#554fd8] text-sm"
                onClick={addNote}
                aria-label="Add note"
              >
                +
              </button>
            </div>
            <ul className="space-y-1">
              {notes.map(note => (
                <li key={note.id} className="flex items-center gap-2">
                  <span className="flex-1">{note.text}</span>
                  <button
                    className="ml-auto text-red-400 hover:text-red-600"
                    onClick={() => removeNote(note.id)}
                    aria-label="Remove note"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Center: Classes */}
        <main className="md:col-span-2 flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Classes</h2>
            <div className="flex flex-col gap-4">
              {classes.map(cls => (
                <div key={cls.id} className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center gap-2">
                  <div className="flex-1">
                    <div className="font-bold text-lg">{cls.name}</div>
                    <div className="text-sm text-gray-500">{cls.time} &middot; {cls.location}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-[#e0e7ff] text-[#6c63ff] px-3 py-1 rounded text-xs font-semibold">Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Right Sidebar: Navigation */}
        <aside className="md:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow p-4">
            <span className="font-semibold text-base mb-2 block">Navigation</span>
            <ul className="space-y-2">
              {navItems.map(item => (
                <li key={item.label} className="flex items-center gap-2">
                  <input type="checkbox" className="accent-[#6c63ff]" disabled />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow p-4 h-40 flex items-center justify-center text-gray-300">
            {/* Placeholder for image or widget */}
            <span className="text-6xl">📚</span>
          </div>
        </aside>
      </div>
    </div>
  );
}