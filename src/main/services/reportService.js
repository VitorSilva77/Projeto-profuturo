const reportRepository = require('../repositories/reportRepository');
const { getCurrentUser } = require('./authService');
const { checkRole } = require('../utils/security');
const { ROLES } = require('../utils/constants');

async function getCoursePerformanceReport() {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Não autenticado.');
  }

  checkRole(user.role, [ROLES.TI, ROLES.RH]);
  
  return reportRepository.getCoursePerformance();
}

module.exports = { 
  getCoursePerformanceReport 
};