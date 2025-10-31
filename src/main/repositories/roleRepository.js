const { getDb } = require('../database/connection');

async function findByName(nome) {
  return getDb()('roles')
    .where('nome', nome)
    .first();
}

module.exports = {
  findByName
};