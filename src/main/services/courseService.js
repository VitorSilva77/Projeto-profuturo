const courseRepository = require('../repositories/courseRepository'); 
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

  checkRole(user.role_name, [ROLES.TI, ROLES.RH]);

  if (!courseData.titulo) {
    throw new Error('O título do curso é obrigatório.');
  }

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