import { useTheme } from "../contexts/ThemeContext";
import "./ThemeToggle.css";

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="theme-toggle-container">
      <span className={`theme-label light ${darkMode ? "" : "active"}`}>
        Light
      </span>
      <div className="theme-toggle" onClick={toggleDarkMode}>
        <div className={`toggle-circle ${darkMode ? "dark" : "light"}`}></div>
      </div>
      <span className={`theme-label dark ${darkMode ? "active" : ""}`}>
        Dark
      </span>
    </div>
  );
};

export default ThemeToggle;
