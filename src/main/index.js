// src/main/index.js

// 1. Carregar variáveis de ambiente (DEVE SER A PRIMEIRA COISA)
require('dotenv').config();

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// 2. Importar conexão e controllers
const dbConnection = require('./database/connection');
const authController = require('./controllers/authController');
const courseController = require('./controllers/courseController');
// ... importe outros controllers (user, report, etc.)

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // Aponta para o preload que iremos criar depois
      preload: path.join(__dirname, '../preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Em desenvolvimento, carregue de um servidor local (ex: Vite/React)
  // mainWindow.loadURL('http://localhost:5173'); 
  
  // Em produção, carregue o HTML
  // mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  // Apenas para exemplo, vamos carregar o index.html
  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  
  // Abrir DevTools (opcional)
  mainWindow.webContents.openDevTools();
}

// 3. Registra todos os Handlers da "API"
function registerIpcHandlers() {
  // Autenticação
  ipcMain.handle('auth:login', authController.handleLogin);
  ipcMain.handle('auth:logout', authController.handleLogout);
  ipcMain.handle('auth:get-session', authController.handleGetSession);

  // Cursos
  ipcMain.handle('courses:get-all', courseController.handleGetAllCourses);
  ipcMain.handle('courses:create', courseController.handleCreateCourse);
  
  // ... registre todos os outros ...
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