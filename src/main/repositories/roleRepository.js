// src/main/repositories/roleRepository.js
const { getDb } = require('../database/connection');

/**
 * Busca uma role pelo nome (ex: 'TI', 'RH')
 */
async function findByName(nome) {
  return getDb()('roles')
    .where('nome', nome)
    .first();
}

module.exports = {
  findByName
};