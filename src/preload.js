// src/preload.js

const { contextBridge, ipcRenderer } = require('electron');

// O "apiKey" é o nome que daremos à API no objeto 'window' do frontend.
// Ex: window.api.login(...)
const apiKey = 'api';

// Esta é a API que será exposta
const api = {
  /**
   * -----------------------------------------------------------------
   * Autenticação (auth)
   * -----------------------------------------------------------------
   */

  /**
   * Tenta fazer login no sistema.
   * @param {object} credentials - { email, password }
   * @returns {Promise<{success: boolean, user?: object, error?: string}>}
   */
  login: (credentials) => ipcRenderer.invoke('auth:login', credentials),

  /**
   * Faz logout do sistema.
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  logout: () => ipcRenderer.invoke('auth:logout'),

  /**
   * Verifica se há uma sessão de usuário ativa no backend.
   * @returns {Promise<{success: boolean, user?: object, error?: string}>}
   */
  getSession: () => ipcRenderer.invoke('auth:get-session'),

  /**
   * -----------------------------------------------------------------
   * Cursos (courses)
   * -----------------------------------------------------------------
   */

  /**
   * Busca todos os cursos.
   * @returns {Promise<{success: boolean, data?: object[], error?: string}>}
   */
  getAllCourses: () => ipcRenderer.invoke('courses:get-all'),

  /**
   * Cria um novo curso.
   * @param {object} courseData - { titulo, descricao, carga_horaria, professor_id }
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  createCourse: (courseData) => ipcRenderer.invoke('courses:create', courseData),
  
  // (Aqui você adicionaria as outras chamadas do CRUD de cursos)
  // updateCourse: (id, courseData) => ipcRenderer.invoke('courses:update', id, courseData),
  // deleteCourse: (id) => ipcRenderer.invoke('courses:delete', id),
  // getCourseById: (id) => ipcRenderer.invoke('courses:get-by-id', id),

  /**
   * -----------------------------------------------------------------
   * Usuários (users) - (Exemplos de como seriam)
   * -----------------------------------------------------------------
   */
  
  // getAllUsers: () => ipcRenderer.invoke('users:get-all'),
  createUser: (userData) => ipcRenderer.invoke('users:create', userData),

  /**
   * -----------------------------------------------------------------
   * Relatórios (reports) - (Exemplos de como seriam)
   * -----------------------------------------------------------------
   */
  
  getCoursePerformanceReport: () => ipcRenderer.invoke('reports:course-performance'), 

  /**
   * -----------------------------------------------------------------
   * Auditoria (audit) - (Exemplos de como seriam)
   * -----------------------------------------------------------------
   */
  
  // getAuditLogs: (filters) => ipcRenderer.invoke('audit:get-logs', filters),
};

// -----------------------------------------------------------------
// Exposição Segura
// -----------------------------------------------------------------
// Garante que o preload só funcione se a 'contextIsolation' estiver ativa
try {
  contextBridge.exposeInMainWorld(apiKey, api);
} catch (error) {
  console.error('Falha ao expor a API do preload:', error);
}