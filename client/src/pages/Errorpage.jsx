import { useTheme } from "../context/ThemeContext";
import "./Errorpage.css";

function Errorpage({ message }) {
  const { theme } = useTheme();

  return (
    <div id="error-container" data-theme={theme}>
      <h1 id="error">
        <span id="error-icon">&#x26A0;</span>
        <span id="error-text">{message || "An error has occurred!"}</span>
      </h1>
    </div>
  );
}

export default Errorpage;