import React from "react";
import ReactDOM from "react-dom";
import "./index.css"; // Estilo global
import App from "./App"; // Componente principal
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root") // O React renderiza a aplicação neste elemento HTML
);

// Função opcional para medir desempenho
reportWebVitals();
