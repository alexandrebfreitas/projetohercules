import React from "react";
import { createRoot } from "react-dom/client"; // Import createRoot
import App from "./App";
import "./index.css";

// Pegue o elemento root do HTML
const rootElement = document.getElementById("root");

// Crie a raiz do React usando createRoot
const root = createRoot(rootElement);

// Renderize o App
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
