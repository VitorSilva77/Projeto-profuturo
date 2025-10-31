const reportRepository = require('../repositories/reportRepository');
const { getCurrentUser } = require('./authService');
const { checkRole } = require('../utils/security');
const { ROLES } = require('../utils/constants');

async function getCoursePerformanceReport(courseId = null) { 
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Não autenticado.');
  }

  checkRole(user.role, [ROLES.TI, ROLES.RH, ROLES.PROFESSOR]); 

  return reportRepository.getCoursePerformance(courseId); 
}

module.exports = { 
  getCoursePerformanceReport 
};