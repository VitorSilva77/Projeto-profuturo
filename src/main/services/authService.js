const userRepository = require('../repositories/userRepository');
const auditService = require('./auditService');
const { comparePassword } = require('../utils/security');

let currentUser = null;

async function login(funcional, password) {
  const user = await userRepository.findByFuncional(funcional);

  if (!user || !user.is_active) {
    throw new Error('AUTENTICACAO_FALHOU: Usuário não encontrado ou inativo.');
  }
  
  const isPasswordValid = await comparePassword(password, user.password_hash);

  if (!isPasswordValid) {
    throw new Error('AUTENTICACAO_FALHOU: Senha incorreta.');
  }

  auditService.log(user.id, 'USER_LOGIN_SUCCESS');

  currentUser = user; 
  
  return user;
}

function logout() {
  if (currentUser) { 
    auditService.log(currentUser.id, 'USER_LOGOUT');
    currentUser = null;
  }
  return true;
}

function getCurrentUser() {
  return currentUser;
}

function setCurrentUser(user) {
  if (user && user.id) {
    currentUser = user;
    console.log(`AUTHSERVICE: Sessão restaurada para ${user.nome}`);
  } else {
    currentUser = null;
  }
}

module.exports = {
  login,
  logout,
  getCurrentUser ,
  setCurrentUser
};