import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Dashboard from "./Dashboard";

function Home() {
  return <div>Welcome to Home Page</div>;
}

function Pricing() {
  return <div>Welcome to Pricing Page</div>;
}

function Meteorologia() {
  return <div>Welcome to Meteorologia Page</div>;
}

function App() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Router>
      <div>
        {/* Header */}
        <Header />

        {/* Sidebar */}
        <div
          style={{
            position: "fixed",
            top: "60px", // Ajusta para ficar abaixo do header fixo
            left: 0,
            height: "calc(100vh - 60px)", // Garante que ocupe toda a altura restante
            zIndex: 1050, // Ajuste para sempre estar acima do conteúdo
          }}
        >
          <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        </div>

        {/* Main Content */}
        <main
          className="content"
          style={{
            marginLeft: "80px" , // Ajusta margem com base no estado do sidebar
            marginTop: "60px", // Respeita o header fixo
            padding: "20px",
            transition: "margin-left 0.3s ease", // Transição suave para o movimento do sidebar
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/meteorologia" element={<Meteorologia />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Adicione outras rotas conforme necessário */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
