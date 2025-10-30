// src/main/services/authService.js

const userRepository = require('../repositories/userRepository');
const auditService = require('./auditService');
const { comparePassword } = require('../utils/security');

// Armazena o usuário logado em memória no processo principal.
// Esta é a nossa "sessão" de backend.
let currentUser = null;

async function login(email, password) {
  const user = await userRepository.findByEmail(email);

  if (!user || !user.is_active) {
    throw new Error('AUTENTICACAO_FALHOU: Usuário não encontrado ou inativo.');
  }

  const isPasswordValid = await comparePassword(password, user.password_hash);

  if (!isPasswordValid) {
    throw new Error('AUTENTICACAO_FALHOU: Senha incorreta.');
  }

  // Senha válida! Armazena o usuário na "sessão"
  currentUser = {
    id: user.id,
    nome: user.nome,
    email: user.email,
    role: user.role_name // Ex: 'TI'
  };

  // Registra o log de auditoria (não precisa esperar)
  auditService.log(currentUser.id, 'USER_LOGIN_SUCCESS');

  // Retorna o usuário para o frontend (sem o hash!)
  return currentUser;
}

function logout() {
  if (currentUser) {
    auditService.log(currentUser.id, 'USER_LOGOUT');
    currentUser = null;
  }
  return true;
}

/**
 * Usado por outros serviços para obter o usuário da sessão atual.
 */
function getCurrentUser() {
  return currentUser;
}

/**
 * Usado pelo frontend para verificar se já existe uma sessão ativa
 * (ex: ao recarregar a janela).
 */
function getSession() {
  return currentUser;
}

module.exports = {
  login,
  logout,
  getSession,
  getCurrentUser
};