// src/main/repositories/reportRepository.js
const { getDb } = require('../database/connection');

/**
 * Calcula a média de nota_final para cada curso.
 * Agrupa por curso e retorna apenas cursos que tiveram status 'concluido'.
 */
async function getCoursePerformance() {
  return getDb()('cursos')
    .join('matriculas', 'cursos.id', '=', 'matriculas.curso_id')
    .select(
      'cursos.titulo' // Seleciona o título do curso
    )
    .avg('matriculas.nota_final as mediaNota') // Calcula a média das notas
    .where('matriculas.status', 'concluido')   // Apenas de matrículas concluídas
    .groupBy('cursos.id', 'cursos.titulo')     // Agrupa pelo curso
    .orderBy('mediaNota', 'desc');             // Ordena pela maior média
}

module.exports = {
  getCoursePerformance
};