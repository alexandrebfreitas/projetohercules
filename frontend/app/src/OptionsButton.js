import React from "react";
import axios from "axios";

const OptionsButton = ({ item }) => {
  const handleDownload = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/file/download?path=${item.path}`, {
        responseType: "blob",
      });
      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = item.name;
      link.click();
    } catch (error) {
      console.error(`Erro ao baixar o arquivo ${item.path}:`, error);
    }
  };

  const handleZip = async () => {
    try {
      await axios.post(`http://localhost:8080/file/zip-folder`, { path: item.path });
      alert("Pasta compactada com sucesso!");
    } catch (error) {
      console.error(`Erro ao compactar a pasta ${item.path}:`, error);
    }
  };

  const handleUnzip = async () => {
    try {
      await axios.post(`http://localhost:8080/file/unzip`, { path: item.path });
      alert("Arquivo descompactado com sucesso!");
    } catch (error) {
      console.error(`Erro ao descompactar o arquivo ${item.path}:`, error);
    }
  };

  const handleRename = async () => {
    const newName = prompt("Digite o novo nome do arquivo:", item.name);
    if (!newName || newName === item.name) return;

    const newPath = item.path.replace(/[^/]+$/, newName);
    try {
      await axios.post("http://localhost:8080/file/move", {
        fileName: item.name,
        from: item.path,
        to: newPath,
      });
      alert("Arquivo renomeado com sucesso!");
      window.location.reload(); // Atualiza os dados para refletir a mudança
    } catch (error) {
      console.error(`Erro ao renomear o arquivo ${item.path}:`, error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Tem certeza que deseja deletar ${item.name}?`)) return;

    try {
      await axios.delete("http://localhost:8080/file/delete", { params: { path: item.path } });
      alert("Arquivo deletado com sucesso!");
      window.location.reload(); // Atualiza os dados para refletir a mudança
    } catch (error) {
      console.error(`Erro ao deletar o arquivo ${item.path}:`, error);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/file/download?path=${item.path}`);
      const content = prompt("Edite o conteúdo do arquivo:", response.data);
      if (content === null) return;

      await axios.post("http://localhost:8080/file/save", {
        path: item.path,
        content,
      });
      alert("Arquivo salvo com sucesso!");
    } catch (error) {
      console.error(`Erro ao editar o arquivo ${item.path}:`, error);
    }
  };

  return (
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
        <li>
          <button className="dropdown-item" onClick={handleDownload}>
            Download
          </button>
        </li>
        {item.isFolder && (
          <li>
            <button className="dropdown-item" onClick={handleZip}>
              Compactar (Zip)
            </button>
          </li>
        )}
        {!item.isFolder && item.name.endsWith(".zip") && (
          <li>
            <button className="dropdown-item" onClick={handleUnzip}>
              Descompactar (Unzip)
            </button>
          </li>
        )}
        <li>
          <button className="dropdown-item" onClick={handleRename}>
            Renomear
          </button>
        </li>
        <li>
          <button className="dropdown-item" onClick={handleDelete}>
            Deletar
          </button>
        </li>
        {!item.isFolder && (
          <li>
            <button className="dropdown-item" onClick={handleEdit}>
              Editar
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default OptionsButton;
