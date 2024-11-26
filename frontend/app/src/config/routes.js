const API_BASE_URL = "http://localhost:8080"; // URL base do servidor

const apiRoutes = {
  listFiles: (path) => `${API_BASE_URL}/file/list?path=${encodeURIComponent(path)}`,
  downloadFile: (path) => `${API_BASE_URL}/file/download?path=${encodeURIComponent(path)}`,
  saveFile: `${API_BASE_URL}/file/save`,
  deleteFile: (path) => `${API_BASE_URL}/file/delete?path=${encodeURIComponent(path)}`,
  moveFile: `${API_BASE_URL}/file/move`,
  createFolder: `${API_BASE_URL}/file/create-folder`,
};

export { API_BASE_URL }; // Exportando API_BASE_URL diretamente
export default apiRoutes; // Exportando apiRoutes como padrão