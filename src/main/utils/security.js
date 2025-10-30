// src/main/utils/security.js

const bcrypt = require('bcrypt.js');
const saltRounds = 10;

/**
 * Gera um hash de senha.
 * @param {string} password - A senha em texto puro.
 * @returns {Promise<string>} O hash da senha.
 */
async function hashPassword(password) {
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compara uma senha em texto puro com um hash.
 * @param {string} password - A senha em texto puro.
 * @param {string} hash - O hash armazenado no banco.
 * @returns {Promise<boolean>} True se a senha for válida.
 */
async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Verifica se um usuário possui uma das roles permitidas.
 * @param {string} userRole - A role do usuário (ex: 'TI')
 * @param {string[]} allowedRoles - Array de roles permitidas (ex: ['TI', 'RH'])
 */
function checkRole(userRole, allowedRoles = []) {
  if (!allowedRoles.includes(userRole)) {
    // Lança um erro que será pego pelo Controller
    throw new Error('ACESSO_NEGADO: Permissão insuficiente.');
  }
}

module.exports = {
  hashPassword,
  comparePassword,
  checkRole
};