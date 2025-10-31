const { getDb } = require('../database/connection');

async function getCoursePerformance() {
  return getDb()('cursos')
    .join('matriculas', 'cursos.id', '=', 'matriculas.curso_id')
    .select(
      'cursos.titulo' 
    )
    .avg('matriculas.nota_final as mediaNota') 
    .where('matriculas.status', 'concluido')   
    .groupBy('cursos.id', 'cursos.titulo')     
    .orderBy('mediaNota', 'desc');            
}

module.exports = {
  getCoursePerformance
};