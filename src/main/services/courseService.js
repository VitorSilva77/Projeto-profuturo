// src/main/services/courseService.js

const courseRepository = require('../repositories/courseRepository'); // (Você precisará criar este arquivo)
const auditService = require('./auditService');
const { getCurrentUser } = require('./authService');
const { checkRole } = require('../utils/security');
const { ROLES } = require('../utils/constants');

// Vamos supor que você criou o 'courseRepository'
// const courseRepository = require('../repositories/courseRepository');

async function getAllCourses() {
  // Em um sistema real, você chamaria o repositório
  // return courseRepository.findAll();
  
  // Por enquanto, vamos simular:
  console.log('Buscando todos os cursos...');
  return [{ id: 1, titulo: 'Curso de Electron' }];
}

async function createCourse(courseData) {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Não autenticado.');
  }

  // REGRA DE NEGÓCIO: Somente TI ou RH podem criar cursos.
  checkRole(user.role, [ROLES.TI, ROLES.RH]);

  // Lógica de validação (ex: verificar se 'titulo' existe)
  if (!courseData.titulo) {
    throw new Error('O título do curso é obrigatório.');
  }

  // const newCourse = await courseRepository.create(courseData);
  const newCourse = { id: 2, ...courseData }; // Simulação

  await auditService.log(user.id, 'CREATE_COURSE', 'cursos', newCourse.id, { titulo: newCourse.titulo });
  
  return newCourse;
}

// ... outros métodos (update, delete) com checagem de role e auditoria

module.exports = {
  getAllCourses,
  createCourse
};