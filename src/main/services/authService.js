const userRepository = require('../repositories/userRepository');
const auditService = require('./auditService');
const { comparePassword } = require('../utils/security');


async function login(funcional, password) {
  const user = await userRepository.findByFuncional(funcional);

  if (!user || !user.is_active) {
    throw new Error('AUTENTICACAO_FALHOU: Usuário não encontrado ou inativo.');
  }

  console.log('============================================');
  console.log('[DEBUG AUTH] Tentando autenticar...');
  console.log(`[DEBUG AUTH] Funcional recebido: "${funcional}"`);
  console.log(`[DEBUG AUTH] Senha recebida (frontend): "${password}"`); 
  console.log(`[DEBUG AUTH] Hash lido (banco de dados): "${user.password_hash}"`);
  console.log('============================================');

  const isPasswordValid = await comparePassword(password, user.password_hash);

  if (!isPasswordValid) {
    throw new Error('AUTENTICACAO_FALHOU: Senha incorreta.');
  }

  auditService.log(user.id, 'USER_LOGIN_SUCCESS');

  return user;
}

function logout() {
  if (user) {
    auditService.log(user.id, 'USER_LOGOUT');
    user = null;
  }
  return true;
}


module.exports = {
  login,
  logout,
};