"use client";
import React from "react";

export default function TimeDateCard() {
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
      <span className="text-lg font-semibold mb-1">Time + Date</span>
      <span className="text-2xl font-mono">
        {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
      <span className="text-sm text-gray-500">{now.toLocaleDateString()}</span>
    </div>
  );
}