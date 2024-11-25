import React, { useState, useEffect } from "react";
import {
  faHome,
  faBook,
  faCloudSun,
  faWater,
  faLayerGroup,
  faChartLine,
  faFolderOpen,
  faMap,
  faUser,
  faEnvelope,
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Sidebar.css";

const sidebarItems = [
  { label: "Home", icon: faHome, path: "/" },
  {
    label: "Rodadas de Preço",
    icon: faBook,
    submenu: [
      { label: "Meteorologia", icon: faCloudSun, path: "/meteorologia" },
      { label: "Hidrologia", icon: faWater, path: "/hidrologia" },
      { label: "Decks", icon: faLayerGroup, path: "/decks" },
      { label: "Resultados", icon: faChartLine, path: "/resultados" },
    ],
  },
  { label: "File Mapping", icon: faFolderOpen, path: "/file-mapping" },
  { label: "Map", icon: faMap, path: "/map" },
  { label: "About", icon: faUser, path: "/about" },
  { label: "Contact", icon: faEnvelope, path: "/contact" },
];

function Sidebar({ initialCollapsed = false }) {
  const [isCollapsed, setIsCollapsed] = useState(
    JSON.parse(localStorage.getItem("isCollapsed")) || initialCollapsed
  );
  const [expandedSubmenus, setExpandedSubmenus] = useState({}); // Controla os submenus individualmente

  useEffect(() => {
    localStorage.setItem("isCollapsed", JSON.stringify(isCollapsed));

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new bootstrap.Tooltip(tooltipTriggerEl, { delay: { show: 1000, hide: 0 } });
    });
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleSubmenu = (index) => {
    setExpandedSubmenus((prev) => ({
      ...prev,
      [index]: !prev[index], // Alterna o estado de expansão do submenu específico
    }));
  };

  return (
    <div
      className={`d-flex flex-column bg-dark vh-100 position-fixed sidebar ${
        isCollapsed ? "collapsed" : "expanded"
      }`}
      style={{ transition: "width 0.5s ease-in-out" }}
    >
      <button
        className="btn btn-success btn-sm m-2 position-absolute toggle-btn"
        style={{ padding: "0.25rem 0.2rem", fontSize: "0.8rem" }}
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} />
      </button>
      <nav className="nav flex-column mt-4">
        {sidebarItems.map((item, index) =>
          item.submenu ? (
            <div key={index} className="nav-item">
              <button
                className={`btn btn-dark text-start w-100 d-flex align-items-center ${
                  isCollapsed ? "justify-content-center" : ""
                }`}
                type="button"
                onClick={() => toggleSubmenu(index)}
                data-bs-toggle={isCollapsed ? "tooltip" : undefined}
                title={isCollapsed ? item.label : ""}
              >
                <FontAwesomeIcon icon={item.icon} className={isCollapsed ? "" : "me-2"} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
              <ul
                className={`list-unstyled submenu ${
                  expandedSubmenus[index] ? "expanded" : "collapsed"
                }`}
                style={{
                  maxHeight: expandedSubmenus[index] ? "500px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.5s ease",
                }}
              >
                {item.submenu.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <button
                      className={`btn btn-dark text-start w-100 d-flex align-items-center ${
                        isCollapsed ? "justify-content-center" : ""
                      }`}
                      data-bs-toggle={isCollapsed ? "tooltip" : undefined}
                      title={isCollapsed ? subItem.label : ""}
                      onClick={() => (window.location.href = subItem.path)}
                    >
                      <FontAwesomeIcon
                        icon={subItem.icon}
                        className={isCollapsed ? "" : "me-2"}
                      />
                      {!isCollapsed && <span>{subItem.label}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <button
              key={index}
              className={`btn btn-dark text-start w-100 d-flex align-items-center ${
                isCollapsed ? "justify-content-center" : ""
              }`}
              data-bs-toggle={isCollapsed ? "tooltip" : undefined}
              title={isCollapsed ? item.label : ""}
              onClick={() => (window.location.href = item.path)}
            >
              <FontAwesomeIcon icon={item.icon} className={isCollapsed ? "" : "me-2"} />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          )
        )}
      </nav>
    </div>
  );
}

export default Sidebar;
