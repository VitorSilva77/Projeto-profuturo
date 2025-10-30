const courseRepository = require('../repositories/courseRepository'); // Agora este arquivo existe!
const auditService = require('./auditService');
const { getCurrentUser } = require('./authService');
const { checkRole } = require('../utils/security');
const { ROLES } = require('../utils/constants');

async function getAllCourses() {
  return courseRepository.findAll();
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

  // Salva no banco de dados REAL
  const newCourse = await courseRepository.create(courseData);

  await auditService.log(user.id, 'CREATE_COURSE', 'cursos', newCourse.id, { titulo: newCourse.titulo });
  
  return newCourse;
}

async function findCoursesByProfessor(professorId) {
    if (!professorId) {
      throw new Error('ID do professor é obrigatório.');
    }
    return courseRepository.findByProfessorId(professorId);
}

module.exports = {
  getAllCourses,
  createCourse,
  findCoursesByProfessor
};