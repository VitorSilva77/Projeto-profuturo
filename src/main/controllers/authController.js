const authService = require('../services/authService');

async function handleLogin(event, payload) {
  try {
    const user = await authService.login(payload.funcional, payload.password);

    return { success: true, user };
  } catch (error) {
    console.error(error.message);
  
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