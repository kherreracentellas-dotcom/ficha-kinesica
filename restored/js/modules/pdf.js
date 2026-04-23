/**
 * pdf.js
 * Logic for generating clinical reports and exporting to PDF.
 */

export const PDFModule = {
    generateReportHtml(form) {
        const name = form.querySelector('[name="paciente_nombre"]')?.value?.trim() || 'Desconocido';
        const rut = form.querySelector('[name="paciente_rut"]')?.value?.trim() || 'N/A';
        const dateStr = new Date().toLocaleDateString('es-CL');

        return `
            <div id="dynamic-report">
                <div class="report-header">
                    <h1>INFORME KINÉSICO</h1>
                    <p><strong>Paciente:</strong> ${name} | <strong>RUT:</strong> ${rut} | <strong>Fecha:</strong> ${dateStr}</p>
                </div>
                <p>Reporte generado automáticamente.</p>
                <!-- Simplified for now, can be expanded to full form capture -->
            </div>
        `;
    },

    exportToPDF(form) {
        const reportHtml = this.generateReportHtml(form);
        const opt = {
            margin: 1,
            filename: `Ficha_${Date.now()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        // Using html2pdf if available globally
        if (window.html2pdf) {
            window.html2pdf().from(reportHtml).set(opt).save();
        }
    }
};
