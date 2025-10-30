// src/main/controllers/courseController.js

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

// ... outros handlers (update, delete)

module.exports = {
  handleGetAllCourses,
  handleCreateCourse
};