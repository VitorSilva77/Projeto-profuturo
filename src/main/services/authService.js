const userRepository = require('../repositories/userRepository');
const auditService = require('./auditService');
const { comparePassword } = require('../utils/security');

let currentUser = null;

async function login(funcional, password) {
  const user = await userRepository.findByFuncional(funcional);

  if (!user || !user.is_active) {
    throw new Error('AUTENTICACAO_FALHOU: Usuário não encontrado ou inativo.');
  }

  console.log('============================================');
  console.log('[DEBUG AUTH] Tentando autenticar...');
  console.log(`[DEBUG AUTH] Funcional recebido: "${funcional}"`);
  console.log(`[DEBUG AUTH] Senha recebida (frontend): "${password}"`); 
  console.log(`[DEBUG AUTH] Hash lido (banco de dados): "${user.password_hash}"`);
  console.log('============================================');

  const isPasswordValid = await comparePassword(password, user.password_hash);

  if (!isPasswordValid) {
    throw new Error('AUTENTICACAO_FALHOU: Senha incorreta.');
  }

  currentUser = {
    id: user.id,
    nome: user.nome,
    email: user.email,
    role: user.role_name 
  };

  auditService.log(currentUser.id, 'USER_LOGIN_SUCCESS');

  return currentUser;
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

function getSession() {
  return currentUser;
}

module.exports = {
  login,
  logout,
  getSession,
  getCurrentUser
};