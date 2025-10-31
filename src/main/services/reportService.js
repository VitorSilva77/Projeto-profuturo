const reportRepository = require('../repositories/reportRepository');
const { getCurrentUser } = require('./authService');
const { checkRole } = require('../utils/security');
const { ROLES } = require('../utils/constants');

async function getCoursePerformanceReport(courseId = null) { 
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Não autenticado.');
  }

  checkRole(user.role_name, [ROLES.TI, ROLES.RH, ROLES.PROFESSOR]); 

  return reportRepository.getCoursePerformance(courseId); 
}

async function getEnrollmentStatusReport(courseId = null) {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Não autenticado.');
  }
  checkRole(user.role_name, [ROLES.TI, ROLES.RH, ROLES.PROFESSOR]);
  return reportRepository.getEnrollmentStatus(courseId);
}

async function getGradeDistributionReport(courseId = null) {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Não autenticado.');
  }
  checkRole(user.role_name, [ROLES.TI, ROLES.RH, ROLES.PROFESSOR]);
  return reportRepository.getGradeDistribution(courseId); 
}

module.exports = { 
  getCoursePerformanceReport,
  getEnrollmentStatusReport,
  getGradeDistributionReport 
};