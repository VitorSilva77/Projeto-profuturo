const reportService = require('../services/reportService');

async function handleGetCoursePerformance(event, courseId) { 
  try {
    const data = await reportService.getCoursePerformanceReport(courseId); 
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = { 
  handleGetCoursePerformance 
};