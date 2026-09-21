import { useState, useEffect } from "react";
import { ThemeContext, THEME_KEY, THEME_EVENT } from "./ThemeContext";

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem(THEME_KEY) || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = (newTheme) => {
    const updatedTheme = typeof newTheme === "function" ? newTheme(theme) : newTheme;
    localStorage.setItem(THEME_KEY, updatedTheme);
    setThemeState(updatedTheme);

    window.dispatchEvent(
      new CustomEvent(THEME_EVENT, { detail: updatedTheme })
    );
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    const handleLocalChange = (e) => {
      setThemeState(e.detail);
    };

    const handleCrossTabChange = (e) => {
      if (e.key === THEME_KEY && e.newValue) {
        setThemeState(e.newValue);
      }
    };

    window.addEventListener(THEME_EVENT, handleLocalChange);
    window.addEventListener("storage", handleCrossTabChange);

    return () => {
      window.removeEventListener(THEME_EVENT, handleLocalChange);
      window.removeEventListener("storage", handleCrossTabChange);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}