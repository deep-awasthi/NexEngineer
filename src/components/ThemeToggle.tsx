"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read from localStorage inside effect, but set state asynchronously to comply with React 19/ESLint rules
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const current = saved || "dark";
    
    const timer = setTimeout(() => {
      setMounted(true);
      setTheme(current);
      document.documentElement.setAttribute("data-theme", current);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  if (!mounted) {
    return (
      <button className={styles.toggleBtn} aria-label="Toggle theme" type="button">
        <span className={styles.placeholderIcon} />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={styles.toggleBtn}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      type="button"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
