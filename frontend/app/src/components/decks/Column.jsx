import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Card from "./Card";

const Column = ({ study, index, onExpand, onDelete, onRename, onEdit }) => {
  return (
    <div className="column bg-light rounded shadow-sm p-3">
      {/* Cabeçalho da Coluna */}
      <h5 className="text-center">{study.name}</h5>

      {/* Corpo da Coluna */}
      <Droppable droppableId={`${index}`}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {study.items.map((item, itemIndex) => (
              <Draggable
                key={item.path}
                draggableId={item.path}
                index={itemIndex}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-2"
                  >
                    <Card
                      item={item}
                      onExpand={onExpand}
                      onDelete={onDelete}
                      onRename={onRename}
                      onEdit={onEdit}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
