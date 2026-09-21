import { createContext, useContext } from "react";

export const THEME_KEY = "aafps_theme";
export const THEME_EVENT = "aafps_theme_changed";

export const ThemeContext = createContext();

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}