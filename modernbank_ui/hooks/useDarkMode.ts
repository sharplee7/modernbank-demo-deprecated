import { useState, useEffect } from "react";

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mode = localStorage.getItem("dark-mode") === "true";
      setDarkMode(mode);
      document.documentElement.classList.toggle("dark", mode);
    }
  }, []);

  const toggleDarkMode = (): void => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("dark-mode", newMode.toString());
    document.documentElement.classList.toggle("dark", newMode);
  };

  return { darkMode, toggleDarkMode };
} 