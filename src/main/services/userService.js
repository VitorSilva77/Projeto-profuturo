const userRepository = require('../repositories/userRepository');
const roleRepository = require('../repositories/roleRepository');
const auditService = require('./auditService');
const { getCurrentUser } = require('./authService');
const { checkRole, hashPassword } = require('../utils/security');
const { ROLES } = require('../utils/constants');

async function createUser(userData) {
  const { email, nome, password, roleName } = userData;
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('Não autenticado.');
  }

  checkRole(currentUser.role, [ROLES.TI]);

  // 1. Validar dados
  if (!email || !nome || !password || !roleName) {
    throw new Error('Todos os campos (nome, email, senha, tipo) são obrigatórios.');
  }

  // 2. Verificar se usuário já existe
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new Error('Este e-mail (funcional) já está em uso.');
  }
  
  // 3. Verificar se o tipo de usuário é válido
  const role = await roleRepository.findByName(roleName);
  if (!role) {
    throw new Error(`O tipo de usuário '${roleName}' é inválido.`);
  }

  // 4. Gerar hash da senha
  const password_hash = await hashPassword(password);

  // 5. Salvar no banco
  const dbData = {
    nome,
    email,
    password_hash,
    role_id: role.id,
    is_active: true
  };
  const newUser = await userRepository.create(dbData);

  // 6. Logar auditoria
  await auditService.log(currentUser.id, 'CREATE_USER', 'usuarios', newUser.id, { email: newUser.email, role: roleName });
  
  // 7. Retornar usuário (sem o hash)
  delete newUser.password_hash;
  return newUser;
}

module.exports = {
  createUser
};