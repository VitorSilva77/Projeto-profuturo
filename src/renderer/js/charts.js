// src/renderer/js/charts.js

// Espera o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
  // Verifica se a biblioteca Chart.js foi carregada
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js não foi carregado. Os gráficos não serão renderizados.');
    return;
  }

  // Gráfico 1: Attendance
  const attendanceCtx = document.getElementById('attendanceChart');
  if (attendanceCtx) {
    new Chart(attendanceCtx, {
      type: 'doughnut',
      data: {
        labels: ['Presente', 'Ausente'],
        datasets: [{
          label: 'Frequência',
          data: [85, 15], // Dados de exemplo
          backgroundColor: ['#4CAF50', '#F44336'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Taxa de Frequência'
          }
        }
      }
    });
  }

  // Gráfico 2: Performance
  const performanceCtx = document.getElementById('performanceChart');
  if (performanceCtx) {
    new Chart(performanceCtx, {
      type: 'bar',
      data: {
        labels: ['Curso A', 'Curso B', 'Curso C', 'Curso D'],
        datasets: [{
          label: 'Média de Notas',
          data: [7.5, 9.0, 6.5, 8.2], // Dados de exemplo
          backgroundColor: '#2196F3',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Desempenho por Curso'
          }
        }
      }
    });
  }
  
  // (Adicione o gráfico 'progressChart' aqui)
});