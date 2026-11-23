"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const saved = localStorage.getItem("pizzahub-theme");
      const isDark =
        saved === "dark" ||
        (!saved &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);

      setDark(isDark);
      document.documentElement.classList.toggle("dark", isDark);
    });
  }, []);

  function toggle() {
    const next = !dark;

    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("pizzahub-theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-9 w-9 items-center justify-center rounded-xl text-[#51483f] transition hover:bg-[#f2e8dc] dark:text-[#e8ddd0] dark:hover:bg-white/10"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}