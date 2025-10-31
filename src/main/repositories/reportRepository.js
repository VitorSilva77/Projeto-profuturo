const { getDb } = require('../database/connection');

async function getCoursePerformance(courseId = null) {
  const query = getDb()('cursos')
    .join('matriculas', 'cursos.id', '=', 'matriculas.curso_id')
    .select(
      'cursos.titulo' 
    )
    .avg('matriculas.nota_final as mediaNota') 
    .where('matriculas.status', 'concluido')   
    .groupBy('cursos.id', 'cursos.titulo')     
    .orderBy('mediaNota', 'desc');
    
  if (courseId) {
    query.where('cursos.id', courseId);
  }

  return await query;
}

async function getEnrollmentStatus(courseId = null) {
  const query = getDb()('matriculas')
    .select('status')
    .count('id as count')
    .whereIn('status', ['concluido', 'cursando'])
    .groupBy('status');

  if (courseId) {
    query.where('curso_id', courseId);
  }

  return await query;
}

module.exports = {
  getCoursePerformance,
  getEnrollmentStatus
};