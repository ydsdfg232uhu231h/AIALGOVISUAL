import "./Loading.css";
import { useTheme } from "../context/ThemeContext";

export default function Loading({
  message = "Loading workspace...",
  sub = "Syncing your algorithms & profile",
}) {
  const { theme } = useTheme();

  return (
    <div
      className="load-screen-container"
      data-theme={theme}
      role="status"
      aria-live="polite"
    >
      <div className="load-spinner-wrap">
        <div className="load-spinner" />
        <div className="load-spinner-core" />
      </div>

      <div className="load-content">
        <h2 className="load-title">{message}</h2>
        <span className="load-subtitle">{sub}</span>
      </div>
    </div>
  );
}