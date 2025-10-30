// src/main/controllers/userController.js
const userService = require('../services/userService');

async function handleCreateUser(event, userData) {
  try {
    // 'userData' virá do frontend (ex: { nome, email, password, roleName })
    const newUser = await userService.createUser(userData);
    return { success: true, data: newUser };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = {
  handleCreateUser
};