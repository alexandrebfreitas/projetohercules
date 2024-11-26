import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";

function Header() {
  return (
    <header className="header bg-dark text-white d-flex align-items-center justify-content-between px-4 position-fixed w-100">
      <div className="d-flex align-items-center">
        <span className="badge bg-primary ms-2">Hercules</span>
      </div>
      <nav>
        <button className="btn btn-outline-light me-2">Create router</button>
        <button className="btn btn-outline-light">Create chatbot</button>
      </nav>
    </header>
  );
}

export default Header;
