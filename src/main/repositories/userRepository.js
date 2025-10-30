// src/main/repositories/userRepository.js

const { getDb } = require('../database/connection');

/**
 * Busca um usuário pelo email, incluindo sua role.
 */
async function findByEmail(email) {
  return getDb()('usuarios')
    .join('roles', 'usuarios.role_id', '=', 'roles.id')
    .where('usuarios.email', email)
    .select(
      'usuarios.id',
      'usuarios.nome',
      'usuarios.email',
      'usuarios.password_hash',
      'usuarios.is_active',
      'roles.nome as role_name' // Renomeia 'roles.nome' para 'role_name'
    )
    .first(); // Retorna o primeiro resultado ou undefined
}

/**
 * Cria um novo usuário.
 */
async function create(userData) {

  const [newUserId] = await getDb()('usuarios').insert(userData);
  return getDb()('usuarios').where('id', newUserId).first();
}

// ... adicione outras funções (findById, findAll, update, delete) conforme necessário

module.exports = {
  findByEmail,
  create
};