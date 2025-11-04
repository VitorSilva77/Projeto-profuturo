const { getDb } = require('../database/connection');

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
      'roles.nome as role_name' 
    )
    .first(); 
}

async function findByFuncional(funcional) {
  return getDb()('usuarios')
    .join('roles', 'usuarios.role_id', '=', 'roles.id')
    .where('usuarios.funcional', funcional) 
    .select(
      'usuarios.id',
      'usuarios.nome',
      'usuarios.email',
      'usuarios.password_hash',
      'usuarios.is_active',
      'roles.nome as role_name'
    )
    .first();
}

async function create(userData) {

  const [newUserId] = await getDb()('usuarios').insert(userData);
  return getDb()('usuarios').where('id', newUserId).first();
}

module.exports = {
  findByEmail,
  create,
  findByFuncional 
};