const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * Gera um hash de senha
 * @param {string} password - A senha inicial
 * @returns {Promise<string>} O hash da senha
 */
async function hashPassword(password) {
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compara uma senha em texto puro com um hash
 * @param {string} password - A senha inicial
 * @param {string} hash - O hash armazenado no banco
 * @returns {Promise<boolean>} True se a senha for valida
 */
async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Verifica se um usuário possui uma das roles permitidas
 * @param {string} userRole - A role do usuário 
 * @param {string[]} allowedRoles - Array de roles permitidas 
 */
function checkRole(userRole, allowedRoles = []) {
  if (!allowedRoles.includes(userRole)) {
    throw new Error('ACESSO_NEGADO: Permissão insuficiente.');
  }
}

module.exports = {
  hashPassword,
  comparePassword,
  checkRole
};