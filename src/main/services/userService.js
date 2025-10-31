const userRepository = require('../repositories/userRepository');
const roleRepository = require('../repositories/roleRepository');
const auditService = require('./auditService');
const { getCurrentUser } = require('./authService');
const { checkRole, hashPassword } = require('../utils/security');
const { ROLES } = require('../utils/constants');

async function createUser(userData) {
  const { funcional, email, nome, password, roleName } = userData;
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('Não autenticado.');
  }

  checkRole(currentUser.role_name, [ROLES.TI]);

  // Valida dados
  if (!funcional || !email || !nome || !password || !roleName) {
    throw new Error('Todos os campos (nome, email, senha, tipo) são obrigatórios.');
  }

  //Verifica se usuário já existe
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new Error('Este e-mail (funcional) já está em uso.');
  }

  const existingUserFuncional = await userRepository.findByFuncional(funcional);
  if (existingUserFuncional) {
    throw new Error('Este funcional já está em uso.');
  }
  
  // Verifica se o tipo de usuário é válido
  const role = await roleRepository.findByName(roleName);
  if (!role) {
    throw new Error(`O tipo de usuário '${roleName}' é inválido.`);
  }

  // Gera hash da senha
  const password_hash = await hashPassword(password);

  //Salva no banco
  const dbData = {
    funcional,
    nome,
    email,
    password_hash,
    role_id: role.id,
    is_active: true
  };
  const newUser = await userRepository.create(dbData);

  //Loga auditoria
  await auditService.log(currentUser.id, 'CREATE_USER', 'usuarios', newUser.id, { email: newUser.email, role: roleName });
  
  //Retorna usuário (sem o hash)
  delete newUser.password_hash;
  return newUser;
}

module.exports = {
  createUser
};