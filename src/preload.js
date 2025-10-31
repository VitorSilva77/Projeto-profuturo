const { contextBridge, ipcRenderer } = require('electron');

const apiKey = 'api';

const api = {

  /**
   * Tenta fazer login 
   * @param {object} credentials - { funcional, password }
   * @returns {Promise<{success: boolean, user?: object, error?: string}>}
   */
  login: (credentials) => ipcRenderer.invoke('auth:login', credentials),

  /**
   * Faz logout do sistema.
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  logout: () => ipcRenderer.invoke('auth:logout'),

  /**
   * Verifica se há uma sessão de usuário ativa 
   * @returns {Promise<{success: boolean, user?: object, error?: string}>}
   */
  getSession: () => ipcRenderer.invoke('auth:get-session'),

  //cursos
  /**
   * Busca todos os cursos.
   * @returns {Promise<{success: boolean, data?: object[], error?: string}>}
   */
  getAllCourses: () => ipcRenderer.invoke('courses:get-all'),
  getCoursesByProfessor: (professorId) => ipcRenderer.invoke('courses:getByProfessor', professorId),

  /**
   * Cria um novo curso
   * @param {object} courseData - { titulo, descricao, carga_horaria, professor_id }
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  createCourse: (courseData) => ipcRenderer.invoke('courses:create', courseData),
  
  //usuários
  createUser: (userData) => ipcRenderer.invoke('users:create', userData),

  //relatórios
  getCoursePerformanceReport: () => ipcRenderer.invoke('reports:course-performance'), 

  //auditoria
};

try {
  contextBridge.exposeInMainWorld(apiKey, api);
} catch (error) {
  console.error('Falha ao expor a API do preload:', error);
}