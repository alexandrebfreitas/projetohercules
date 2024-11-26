import React from "react";
import OptionsButton from "../button/OptionsButton";

const Card = ({ item, onExpand, onDelete, onRename, onEdit }) => {
  return (
    <div className="card mb-3 shadow-sm">
      {/* Cabeçalho do Card */}
      <div className="card-header d-flex justify-content-between align-items-center">
        <span>{item.isFolder ? "📁" : "📄"} {item.name}</span>
        <OptionsButton
          onRename={() => onRename(item)}
          onDelete={() => onDelete(item)}
          onEdit={() => onEdit(item)}
        />
      </div>

      {/* Corpo do Card */}
      {item.expanded && (
        <div className="card-body">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => onExpand(item)}
          >
            Expandir
          </button>
        </div>
      )}
    </div>
  );
};

export default Card;
