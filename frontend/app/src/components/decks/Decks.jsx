import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import AceEditor from "react-ace";
import OptionsButton from "../button/OptionsButton";
import apiRoutes, { API_BASE_URL } from "../../config/routes";

// Importar o modo de texto e temas
import "ace-builds/src-noconflict/mode-text"; // Modo para arquivos de texto
import "ace-builds/src-noconflict/theme-github"; // Tema claro
import "ace-builds/src-noconflict/theme-monokai"; // Tema escuro

const Decks = () => {
  const [studies, setStudies] = useState([]); // Estudos na pasta raiz "estudos"
  const [editingFile, setEditingFile] = useState(null);
  const [fileContent, setFileContent] = useState("");

  useEffect(() => {
    loadStudies();
  }, []);

  // Carrega os estudos na pasta "estudos"
  const loadStudies = async () => {
    try {
      const response = await axios.get("http://localhost:8080/file/list?path=estudos");
      const studiesData = response.data
        .filter((item) => item.endsWith("/")) // Apenas pastas são consideradas estudos
        .map((study) => ({
          name: study.replace(/\/$/, ""),
          path: `estudos/${study}`,
          items: [],
          expanded: false,
        }));

      setStudies(studiesData);

      // Carrega os arquivos/pastas dentro de cada estudo
      for (const study of studiesData) {
        await loadStudyItems(study);
      }
    } catch (error) {
      console.error("Erro ao carregar os estudos:", error);
    }
  };

  // Carrega os itens dentro de um estudo específico
  const loadStudyItems = async (study) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/file/list?path=${encodeURIComponent(study.path)}`
      );
      setStudies((prevStudies) =>
        prevStudies.map((s) =>
          s.name === study.name
            ? { ...s, items: response.data.map((item) => ({ name: item.replace(/\/$/, ""), isFolder: item.endsWith("/"), path: `${study.path}/${item}`, items: [], expanded: false })) }
            : s
        )
      );
    } catch (error) {
      console.error(`Erro ao carregar itens para o estudo ${study.name}:`, error);
    }
  };

  // Expande uma pasta e carrega os seus itens
  const toggleFolder = async (folder, studyIndex, parentPath = "") => {
    const folderPath = parentPath
      ? `${parentPath}/${folder.name}`
      : `${studies[studyIndex].path}/${folder.name}`;

    if (folder.expanded) {
      // Colapsa a pasta
      setStudies((prevStudies) =>
        prevStudies.map((study, index) =>
          index === studyIndex
            ? {
                ...study,
                items: study.items.map((item) =>
                  item.name === folder.name ? { ...item, expanded: false } : item
                ),
              }
            : study
        )
      );
    } else {
      // Expande a pasta e carrega os itens
      try {
        const response = await axios.get(
          `http://localhost:8080/file/list?path=${encodeURIComponent(folderPath)}`
        );

        const folderItems = response.data.map((item) => ({
          name: item.replace(/\/$/, ""),
          isFolder: item.endsWith("/"),
          expanded: false,
          items: [],
        }));

        setStudies((prevStudies) =>
          prevStudies.map((study, index) =>
            index === studyIndex
              ? {
                  ...study,
                  items: study.items.map((item) =>
                    item.name === folder.name
                      ? { ...item, expanded: true, items: folderItems }
                      : item
                  ),
                }
              : study
          )
        );
      } catch (error) {
        console.error(`Erro ao expandir a pasta ${folder.name}:`, error);
      }
    }
  };

  // Manipula o movimento dos itens entre os estudos e pastas
  // Funções auxiliares definidas uma vez
  const findItemsByPath = (items, path) => {
      if (!path || path.trim() === "") return items; // Retorna itens raiz se o caminho for vazio
      const parts = path.split("/");
      let currentItems = items;
      for (const part of parts) {
          const folder = currentItems.find((item) => item.name === part && item.isFolder);
          if (!folder) return []; // Retorna vazio se a pasta não for encontrada
          currentItems = folder.items;
      }
      return currentItems;
  };

  const updateItemsByPath = (study, path, newItems) => {
      const parts = path.split("/");
      let currentItems = study.items;
      for (const part of parts.slice(0, -1)) {
          const folder = currentItems.find((item) => item.name === part && item.isFolder);
          if (folder) currentItems = folder.items;
      }
      const folder = currentItems.find((item) => item.name === parts[parts.length - 1]);
      if (folder) folder.items = newItems;
      return { ...study };
  };

  // onDragEnd atualizado
  const onDragEnd = async (result) => {
      if (!result.destination) return;

      const { source, destination } = result;

      // Identificar as colunas e os caminhos de origem e destino
      const sourceStudyIndex = parseInt(source.droppableId.split("-")[0], 10);
      const destinationStudyIndex = parseInt(destination.droppableId.split("-")[0], 10);

      const sourceParentPath = source.droppableId.split("-").slice(1).join("/");
      const destinationParentPath = destination.droppableId.split("-").slice(1).join("/");

      const sourceStudy = studies[sourceStudyIndex];
      const destinationStudy = studies[destinationStudyIndex];

      // Localizar os itens nas colunas correspondentes
      let sourceItems = sourceParentPath
          ? findItemsByPath(sourceStudy.items, sourceParentPath)
          : sourceStudy.items;

      let destinationItems = destinationParentPath
          ? findItemsByPath(destinationStudy.items, destinationParentPath)
          : destinationStudy.items;

      if (!sourceItems || !destinationItems) {
          console.error("Erro ao localizar itens para mover.");
          return;
      }

      // Remover o item da origem
      const [movedItem] = sourceItems.splice(source.index, 1);

      // Atualizar o caminho do item movido
      movedItem.path = destinationParentPath
          ? `${destinationStudy.path}/${destinationParentPath}/${movedItem.name}`
          : `${destinationStudy.path}/${movedItem.name}`;

      // Adicionar o item ao destino
      destinationItems.splice(destination.index, 0, movedItem);

      // Atualizar o estado local das colunas sem recarregar tudo
      setStudies((prevStudies) =>
          prevStudies.map((study, idx) => {
              if (idx === sourceStudyIndex) {
                  return sourceParentPath
                      ? updateItemsByPath(study, sourceParentPath, sourceItems)
                      : { ...study, items: sourceItems };
              } else if (idx === destinationStudyIndex) {
                  return destinationParentPath
                      ? updateItemsByPath(study, destinationParentPath, destinationItems)
                      : { ...study, items: destinationItems };
              }
              return study;
          })
      );

      // Enviar a atualização para o backend
      try {
          await axios.post("http://localhost:8080/file/move", {
              fileName: movedItem.name,
              from: sourceParentPath ? `${sourceStudy.path}/${sourceParentPath}` : sourceStudy.path,
              to: destinationParentPath ? `${destinationStudy.path}/${destinationParentPath}` : destinationStudy.path,
          });
      } catch (error) {
          console.error(`Erro ao mover o item ${movedItem.name}:`, error);

          // Reverter o estado local em caso de erro
          setStudies((prevStudies) =>
              prevStudies.map((study, idx) => {
                  if (idx === destinationStudyIndex) {
                      return destinationParentPath
                          ? updateItemsByPath(study, destinationParentPath, destinationItems.filter((item) => item !== movedItem))
                          : { ...study, items: destinationItems.filter((item) => item !== movedItem) };
                  } else if (idx === sourceStudyIndex) {
                      return sourceParentPath
                          ? updateItemsByPath(study, sourceParentPath, [...sourceItems, movedItem])
                          : { ...study, items: [...sourceItems, movedItem] };
                  }
                  return study;
              })
          );
      }
  };





  // Encontra itens por caminho


  // Função para deletar arquivos
  const deleteFile = async (filePath, studyIndex) => {
    try {
      await axios.delete("http://localhost:8080/file/delete", { params: { path: filePath } });
      setStudies((prevStudies) =>
        prevStudies.map((study, index) =>
          index === studyIndex
            ? { ...study, items: study.items.filter((item) => item.path !== filePath) }
            : study
        )
      );
    } catch (error) {
      console.error(`Erro ao deletar o arquivo ${filePath}:`, error);
    }
  };


  // Função para renomear arquivos
  const renameFile = async (filePath, newName) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/file/rename`, null, {
        params: {
          path: filePath,
          newName: newName,
        },
      });

      // Atualize o estado local para refletir o novo nome
      setStudies((prevStudies) =>
        prevStudies.map((study) => ({
          ...study,
          items: study.items.map((item) =>
            item.path === filePath
              ? {
                  ...item,
                  name: newName,
                  path: filePath.replace(/[^/]+$/, newName), // Atualize o caminho com o novo nome
                }
              : item
          ),
        }))
      );

      console.log(response.data);
    } catch (error) {
      console.error("Erro ao renomear o arquivo:", error.response?.data || error.message);
    }
  };


  // Função para editar conteúdo de arquivos
  const openEditor = async (filePath) => {
    try {
      const response = await axios.get(`http://localhost:8080/file/download?path=${filePath}`);
      setEditingFile(filePath);
      setFileContent(response.data);
    } catch (error) {
      console.error(`Erro ao abrir o arquivo ${filePath}:`, error);
    }
  };

  // Função para salvar o conteúdo do arquivo
  const saveFile = async () => {
    if (!editingFile || !fileContent) {
      alert("Arquivo ou conteúdo não definido.");
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("path", editingFile); // Adiciona o parâmetro path
      formData.append("content", fileContent); // Adiciona o conteúdo do arquivo

      await axios.post(`${API_BASE_URL}/file/save`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Necessário para @RequestParam
        },
      });

//       alert("Arquivo salvo com sucesso!");
      setEditingFile(null);
    } catch (error) {
      console.error("Erro ao salvar o arquivo:", error.response || error);
      alert("Erro ao salvar o arquivo. Consulte o log para mais detalhes.");
    }
  };


  return (
    <div className="container-fluid">
      <h1 className="text-center my-4">Estudos</h1>
      <div className="d-flex flex-row gap-3 overflow-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          {studies.map((study, index) => (
            <Droppable key={index} droppableId={`${index}`}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-light rounded shadow-sm p-3"
                  style={{
                    minWidth: "300px",
                    maxWidth: "300px",
                    overflowY: "auto",
                  }}
                >
                  <h5 className="text-center">{study.name}</h5>
                  {study.items.map((item, itemIndex) => (
                    <Draggable
                      key={`${item.name}-${itemIndex}`}
                      draggableId={`${item.path}`}
                      index={itemIndex}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="border mb-2 p-2 rounded bg-white d-flex flex-column"
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            {item.isFolder && (
                              <button
                                className="btn btn-sm btn-outline-primary me-2"
                                onClick={() => toggleFolder(item, index, study.path)}
                              >
                                {item.expanded ? "-" : "+"}
                              </button>
                            )}
                            <span>{item.name}</span>
                            <div className="btn-group">
                              <button
                                className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                ...
                              </button>
                              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                {item.isFolder || item.name.endsWith(".zip") ? (
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() => renameFile(item.path, prompt("Novo nome do arquivo:", item.name), index)}
                                    >
                                      Renomear
                                    </button>
                                  </li>
                                ) : (
                                  <>
                                    <li>
                                      <button
                                        className="dropdown-item"
                                        onClick={() => openEditor(item.path)}
                                      >
                                        Editar
                                      </button>
                                    </li>
                                    <li>
                                      <button
                                        className="dropdown-item"
                                        onClick={() => renameFile(item.path, prompt("Novo nome do arquivo:", item.name), index)}
                                      >
                                        Renomear
                                      </button>
                                    </li>
                                  </>
                                )}
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => deleteFile(item.path, index)}
                                  >
                                    Deletar
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>
                          {item.expanded && (
                            <Droppable droppableId={`${index}-${item.name}`}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  className="ms-3"
                                >
                                  {item.items.map((subItem, subItemIndex) => (
                                    <Draggable
                                      key={`${subItem.name}-${subItemIndex}`}
                                      draggableId={`${index}-${subItem.name}`}
                                      index={subItemIndex}
                                    >
                                      {(provided) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className="border-bottom p-2"
                                        >
                                          {subItem.isFolder ? "📁" : "📄"} {subItem.name}
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>

      {editingFile && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Arquivo: {editingFile}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingFile(null)}
                ></button>
              </div>
              <div className="modal-body">
                <AceEditor
                  mode="text"
                  theme="github"
                  value={fileContent}
                  onChange={(value) => setFileContent(value)}
                  name="file-editor"
                  editorProps={{ $blockScrolling: true }}
                  width="100%"
                  height="400px"
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingFile(null)}
                >
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={saveFile}>
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Decks;
