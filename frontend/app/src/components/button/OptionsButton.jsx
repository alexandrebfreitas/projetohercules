import React, { useState, useRef, useEffect } from "react";

const OptionsButton = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = (event) => {
    // Fecha o dropdown ao clicar fora dele
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeDropdown);
    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="dropdown position-relative">
      {/* Botão principal */}
      <button
        className="btn btn-sm btn-outline-secondary"
        type="button"
        onClick={toggleDropdown}
      >
        <i className="fas fa-ellipsis-h"></i>
      </button>

      {/* Dropdown de opções */}
      {isOpen && (
        <ul
          className="dropdown-menu dropdown-menu-end show"
          style={{ position: "absolute", top: "100%", right: "0", zIndex: 1050 }}
        >
          <li>
            <button className="dropdown-item" onClick={onEdit}>
              <i className="fas fa-edit me-2"></i> Editar
            </button>
          </li>
          <li>
            <button className="dropdown-item text-danger" onClick={onDelete}>
              <i className="fas fa-trash-alt me-2"></i> Deletar
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default OptionsButton;
