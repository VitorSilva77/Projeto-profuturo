// src/main/index.js (Corrigido)

require('dotenv').config();

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// 2. Importar conexão e TODOS os controllers
const dbConnection = require('./database/connection');
const authController = require('./controllers/authController');
const courseController = require('./controllers/courseController');
const userController = require('./controllers/userController'); 
// ADICIONADO: Importar o reportController
const reportController = require('./controllers/reportController'); 

// 3. Registra todos os Handlers da "API" (FUNÇÃO ÚNICA)
function registerIpcHandlers() {
  // Autenticação
  ipcMain.handle('auth:login', authController.handleLogin);
  ipcMain.handle('auth:logout', authController.handleLogout);
  ipcMain.handle('auth:get-session', authController.handleGetSession);

  // Cursos
  ipcMain.handle('courses:get-all', courseController.handleGetAllCourses);
  ipcMain.handle('courses:getByProfessor', courseController.getCoursesByProfessor);
  ipcMain.handle('courses:create', courseController.handleCreateCourse);

  // Usuários (Estava faltando)
  ipcMain.handle('users:create', userController.handleCreateUser);

  // Relatórios (Estava faltando)
  ipcMain.handle('reports:course-performance', reportController.handleGetCoursePerformance);
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // CORREÇÃO: Apontar para o arquivo HTML dentro de /views
  mainWindow.loadFile(path.join(__dirname, '../renderer/views/index.html'));
  
  mainWindow.webContents.openDevTools();
}

// 4. Ciclo de vida da aplicação
app.whenReady().then(() => {
  // Inicializa a conexão com o banco ANTES de tudo
  dbConnection.init();

  // Registra os handlers
  registerIpcHandlers();
  
  // Cria a janela
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});