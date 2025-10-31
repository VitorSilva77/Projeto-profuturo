const courseService = require('../services/courseService');

async function handleGetAllCourses() {
  try {
    const courses = await courseService.getAllCourses();
    return { success: true, data: courses };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function handleCreateCourse(event, courseData) {
  try {
    const newCourse = await courseService.createCourse(courseData);
    return { success: true, data: newCourse };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

const getCoursesByProfessor = async (event, professorId) => {
  try {
    const courses = await courseService.findCoursesByProfessor(professorId);
    return { success: true, data: courses };
  } catch (error) {
    console.error('Erro ao buscar cursos por professor:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  handleGetAllCourses,
  handleCreateCourse,
  getCoursesByProfessor
};