document.addEventListener('DOMContentLoaded', () => {
    const btnGenerate = document.getElementById('btn-generate-course-average');

    if (btnGenerate) {
        btnGenerate.addEventListener('click', async () => {
            try {
                const result = await window.api.generateCourseAveragesReport();
                // Você pode usar um sistema de notificação mais robusto
                alert(result.message); 
            } catch (error) {
                console.error('Erro ao gerar relatório:', error);
                alert('Ocorreu um erro ao tentar gerar o relatório.');
            }
        });
    }
});