import React, { useState, useEffect } from "react";
import AceEditor from "react-ace";
import axios from "axios";
import apiRoutes from "../config/apiRoutes";

import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/theme-github";

const Editor = ({ filePath, onClose }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    loadFile();
  }, [filePath]);

  const loadFile = async () => {
    try {
      const response = await axios.get(apiRoutes.downloadFile(filePath));
      setContent(response.data);
    } catch (error) {
      console.error("Erro ao carregar o arquivo:", error);
    }
  };

  const saveFile = async () => {
    try {
      await axios.post(apiRoutes.saveFile, { path: filePath, content });
      alert("Arquivo salvo com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao salvar o arquivo:", error);
    }
  };

  return (
    <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Arquivo: {filePath}</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <AceEditor
              mode="text"
              theme="github"
              value={content}
              onChange={setContent}
              name="file-editor"
              editorProps={{ $blockScrolling: true }}
              width="100%"
              height="400px"
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={saveFile}>
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
