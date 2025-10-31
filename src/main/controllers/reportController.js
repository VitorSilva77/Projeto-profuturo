const reportService = require('../services/reportService');

async function handleGetCoursePerformance(event, courseId) { 
  try {
    const data = await reportService.getCoursePerformanceReport(courseId); 
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function handleGetEnrollmentStatus(event, courseId) {
  try {
    const data = await reportService.getEnrollmentStatusReport(courseId);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = { 
  handleGetCoursePerformance,
  handleGetEnrollmentStatus
};