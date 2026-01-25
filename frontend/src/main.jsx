import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Global styles to ensure the root layout allows for full-screen centering
const style = document.createElement('style');
style.textContent = `
  html, body, #root {
    width: 100%;
    height: 100%;
    margin: 0;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 0.8s linear infinite;
    display: inline-block;
  }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
