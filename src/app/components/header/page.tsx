'use client';
import React, { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = [
    { label: "Form", path: "/components/admin-form-builder" },
    { label: "Kanban-Board", path: "/components/kanban" },
    { label: "Settings", path: "/settings" },
    { label: "San", path: "/san" },
  ];

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white text-white flex items-center justify-between px-6 z-30 shadow-md">
        {/* Logo (left side) */}
        <img src="/wigoh.png" alt="brand-logo" width={90} height={40} />

        {/* Toggle button (right side) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`
            text-3xl transition-colors duration-300 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-orange-400
            ${sidebarOpen ? "text-purple-900" : "text-orange-500 hover:text-purple-900"}
          `}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-20 right-0 w-64 h-[calc(100vh-5rem)] bg-purple-900 text-white
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
          z-20 shadow-lg border-l-4 border-orange-500
        `}
      >
        <nav className="p-6">
          <ul className="space-y-6">
            {links.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className="
                    block text-lg font-semibold px-3 py-2 rounded-md
                    transition-all duration-300
                    hover:bg-orange-500 hover:text-white
                    active:bg-orange-700 active:scale-95
                    focus:outline-none focus:ring-2 focus:ring-orange-400
                  "
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Transparent overlay to close sidebar (no dark background) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed top-20 left-0 right-0 bottom-0 bg-transparent z-10"
        />
      )}
    </>
  );
}
