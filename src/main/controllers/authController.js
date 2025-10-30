// src/main/controllers/authController.js

const authService = require('../services/authService');

// O 'event' é o primeiro argumento padrão do ipcMain.handle
// O 'payload' (ex: { email, password }) é o segundo.

async function handleLogin(event, payload) {
  try {
    const user = await authService.login(payload.funcional, payload.password);
    return { success: true, user };
  } catch (error) {
    console.error(error.message);
    // Retorna um objeto de erro padronizado para o frontend
    return { success: false, error: error.message };
  }
}

async function handleLogout() {
  try {
    authService.logout();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function handleGetSession() {
  try {
    const user = authService.getSession();
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = {
  handleLogin,
  handleLogout,
  handleGetSession
};