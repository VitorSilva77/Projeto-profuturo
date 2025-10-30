// src/main/services/auditService.js

const { getDb } = require('../database/connection');

/**
 * Registra uma ação no log de auditoria.
 * @param {number} usuario_id - ID do usuário que executou a ação.
 * @param {string} acao - Ex: 'LOGIN', 'CREATE_COURSE'.
 * @param {string} target_type - Tabela afetada (ex: 'cursos').
 * @param {number} target_id - ID do registro afetado.
 * @param {object} detalhes - (Opcional) JSON com dados extras.
 */
async function log(usuario_id, acao, target_type = null, target_id = null, detalhes = {}) {
  try {
    await getDb()('logs_auditoria').insert({
      usuario_id,
      acao,
      target_type,
      target_id,
      detalhes: JSON.stringify(detalhes)
    });
  } catch (err) {
    // Não trava a aplicação se o log falhar, apenas registra no console
    console.error('Falha ao registrar log de auditoria:', err.message);
  }
}

module.exports = {
  log
};