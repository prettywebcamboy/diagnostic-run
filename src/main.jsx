import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

function App() {
  return <div className="message">you're strange</div>;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
