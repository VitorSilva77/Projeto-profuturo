const { getDb } = require('../database/connection');

async function create(courseData) {
  const [newCourseId] = await getDb()('cursos').insert(courseData);
  
  return getDb()('cursos').where('id', newCourseId).first();
}

/**
 * Busca todos os cursos.
 */
async function findAll() {
  return getDb()('cursos').select('*');
}

// ... adicione outras funções (findById, update, delete) conforme necessário

module.exports = {
  create,
  findAll
};