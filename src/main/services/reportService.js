const reportRepository = require('../repositories/reportRepository');
const { getCurrentUser } = require('./authService');
const { checkRole } = require('../utils/security');
const { ROLES } = require('../utils/constants');
const xlsx = require('xlsx');
const { dialog } = require('electron');

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

const generateCourseAveragesReport = async () => {
    try {
        // 1. Buscar os dados do banco
        const data = await reportRepository.getCourseAverages();

        if (data.length === 0) {
            return { success: false, message: 'Não há dados para gerar o relatório.' };
        }

        // 2. Converter os dados para o formato de planilha
        const worksheet = xlsx.utils.json_to_sheet(data);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Média Cursos');

        // 3. Abrir diálogo para salvar o arquivo
        const { filePath, canceled } = await dialog.showSaveDialog({
            title: 'Salvar Relatório',
            defaultPath: 'relatorio_media_cursos.xlsx',
            filters: [{ name: 'Excel Files', extensions: ['xlsx'] }]
        });

        if (canceled || !filePath) {
            return { success: true, message: 'Geração de relatório cancelada.' };
        }

        // 4. Escrever o arquivo no disco
        xlsx.writeFile(workbook, filePath);

        return { success: true, message: `Relatório salvo com sucesso em: ${filePath}` };

    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        return { success: false, message: 'Falha ao gerar o relatório.' };
    }
};

module.exports = { 
  getCoursePerformanceReport,
  getEnrollmentStatusReport,
  getGradeDistributionReport,
  generateCourseAveragesReport
};