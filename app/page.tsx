"use client";
import React, { useState } from "react";
import Image from "next/image";

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

/**
 * Adds a prefix to image src if running on a GitHub Pages custom domain.
 * Example: If url is userid.github.io/repo-name.com, 
 * then add '/repo-name' in front of the image src.
 */
function withRepoPrefix(src: string): string {
  if (typeof window !== "undefined") {
    const host = window.location.host;
    // Check for GitHub Pages pattern: userid.github.io/repo-name.com
    // and extract repo name (between first / and .com)
    const match = host.match(/^[^.]+\.github\.io\/([^/]+)/);
    let repo = "";
    if (match && match[1]) {
      repo = match[1];
    } else {
      // fallback: try to get repo from pathname if deployed as /repo-name/
      const pathMatch = window.location.pathname.match(/^\/([^/]+)\//);
      if (pathMatch && pathMatch[1]) {
        repo = pathMatch[1];
      }
    }
    if (repo && !src.startsWith(`/${repo}`)) {
      return `/${repo}${src.startsWith("/") ? src : "/" + src}`;
    }
  }
  return src;
}

export default function Home() {
  // Quick Tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState("");

  // Notes
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteInput, setNoteInput] = useState("");

  // Classes
  const [classes] = useState<ClassItem[]>(initialClasses);

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
    <div className="flex flex-col gap-6">
      {/* Logo at the top */}
      <div className="flex justify-center mt-4 mb-2">
        <Image
          src={withRepoPrefix("/images/logo.png")}
          alt="App Logo"
          width={64}
          height={64}
          priority
        />
      </div>

      {/* Quick Tasks */}
      <section className="bg-white rounded-xl shadow p-4">
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
      </section>

      {/* Quick Notes */}
      <section className="bg-white rounded-xl shadow p-4">
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
      </section>

      {/* Classes */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Classes</h2>
        <div className="flex flex-col gap-4">
          {classes.map(cls => (
            <div key={cls.id} className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center gap-2">
              <div className="flex-1">
                <div className="font-bold text-lg">{cls.name}</div>
                <div className="text-sm text-gray-500">{cls.time} &middot; {cls.location}</div>
              </div>
              <div className="flex gap-2">
                <button className="text-sm text-gray-500 hover:text-gray-700 underline">
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}