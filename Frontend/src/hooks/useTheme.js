import { useState, useEffect } from "react";

export function useTheme() {
  const [theme, setTheme] = useState("night");

  const toggleTheme = () => {
    const newTheme = theme === "night" ? "light" : "night";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return { theme, toggleTheme };
}