require('dotenv').config();

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');


const dbConnection = require('./database/connection');
const authController = require('./controllers/authController');
const courseController = require('./controllers/courseController');
const userController = require('./controllers/userController'); 
const reportController = require('./controllers/reportController'); 

function registerIpcHandlers() {
  // Autenticação
  ipcMain.handle('auth:login', authController.handleLogin);
  ipcMain.handle('auth:logout', authController.handleLogout);
  ipcMain.handle('auth:get-session', authController.handleGetSession);

  // Cursos
  ipcMain.handle('courses:get-all', courseController.handleGetAllCourses);
  ipcMain.handle('courses:getByProfessor', courseController.getCoursesByProfessor);
  ipcMain.handle('courses:create', courseController.handleCreateCourse);

  // Usuários 
  ipcMain.handle('users:create', userController.handleCreateUser);

  // Relatórios 
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

  mainWindow.loadFile(path.join(__dirname, '../renderer/views/index.html'));
  
  mainWindow.webContents.openDevTools();
}

// Ciclo de vida da aplicação
app.whenReady().then(() => {
  dbConnection.init();

  registerIpcHandlers();

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});