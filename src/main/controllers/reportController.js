const reportService = require('../services/reportService');

async function handleGetCoursePerformance(event) {
  try {
    const data = await reportService.getCoursePerformanceReport();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = { 
  handleGetCoursePerformance 
};