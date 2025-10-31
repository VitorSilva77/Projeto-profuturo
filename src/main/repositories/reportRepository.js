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

async function getGradeDistribution(courseId = null) {
  const query = getDb()('matriculas')
    .select(
      getDb().raw(`
        CASE
          WHEN nota_final BETWEEN 0 AND 1.99 THEN '0 - 1.9'
          WHEN nota_final BETWEEN 2 AND 3.99 THEN '2 - 3.9'
          WHEN nota_final BETWEEN 4 AND 5.99 THEN '4 - 5.9'
          WHEN nota_final BETWEEN 6 AND 7.99 THEN '6 - 7.9'
          WHEN nota_final >= 8 THEN '8 - 10'
          ELSE NULL
        END AS faixa_nota
      `)
    )
    .count('id as quantidade')
    .where('status', 'concluido') 
    .whereNotNull('nota_final')  
    .groupBy('faixa_nota')
    .orderBy('faixa_nota', 'asc'); 

  if (courseId) {
    query.where('curso_id', courseId);
  }

  return await query;
}

module.exports = {
  getCoursePerformance,
  getEnrollmentStatus,
  getGradeDistribution 
};