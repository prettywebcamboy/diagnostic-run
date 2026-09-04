import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
function App() {
  return (
    <a
      className="message"
      href="https://discord.gg/CNVAJuMqDh"
      target="_blank"
      rel="noopener noreferrer"
    >
      click me
    </a>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
