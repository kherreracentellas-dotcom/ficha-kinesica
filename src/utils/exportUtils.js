/**
 * exportUtils.js
 * Utilidades para exportar la ficha clínica a PDF y Word.
 */

export const exportToPDF = (formData) => {
  const element = document.createElement('div');
  element.style.padding = '40px';
  element.style.fontFamily = 'Inter, sans-serif';
  element.style.color = '#1e293b';

  // Helper para secciones
  const section = (title, content) => `
    <div style="margin-bottom: 25px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
      <h2 style="color: #4f46e5; font-size: 16px; text-transform: uppercase; margin-bottom: 10px;">${title}</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px;">
        ${content}
      </div>
    </div>
  `;

  const field = (label, value) => `
    <div><strong style="color: #64748b;">${label}:</strong> <span style="border-bottom: 1px dotted #cbd5e1; display: inline-block; min-width: 50px;">${value || 'N/A'}</span></div>
  `;

  element.innerHTML = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="margin: 0; color: #1e1b4b; font-size: 24px;">FICHA DE EVALUACIÓN KINÉSICA CARDIORRESPIRATORIA</h1>
      <p style="margin: 5px 0; color: #64748b; font-size: 14px;">Generado el ${new Date().toLocaleDateString('es-CL')}</p>
    </div>

    ${section('I. ANTECEDENTES PERSONALES', `
      ${field('Nombre', formData.paciente.nombre)}
      ${field('RUT', formData.paciente.rut)}
      ${field('Edad', formData.paciente.edad)}
      ${field('Sexo', formData.paciente.sexo)}
      ${field('Fono', formData.paciente.fono)}
      ${field('Previsión', formData.paciente.prevision)}
    `)}

    ${section('II. ANTECEDENTES MÓRBIDOS', `
      ${field('Motivo Consulta', formData.morbidos.motivo_consulta)}
      ${field('Diagnóstico Médico', formData.morbidos.diagnostico_medico)}
      ${field('Enfermedades', formData.morbidos.enfermedades_cronicas)}
      ${field('Fármacos Cont.', formData.morbidos.farmacos.continuo)}
    `)}

    ${section('III. SIGNOS VITALES', `
      ${field('P. Arterial', `${formData.vitales.pa_sistolica}/${formData.vitales.pa_diastolica} mmHg`)}
      ${field('PAM', formData.vitales.pam)}
      ${field('FC', formData.vitales.fc)}
      ${field('SatO2', formData.vitales.spo2)}
      ${field('IMC', formData.vitales.imc)}
    `)}

    <div style="margin-top: 50px; display: flex; justify-content: space-between; border-top: 2px solid #000; padding-top: 10px;">
      <div style="text-align: center; width: 45%;">
        <div style="height: 80px; display: flex; align-items: center; justify-content: center; margin-bottom: 5px;">
          ${formData.diagnostico.firma ? `<img src="${formData.diagnostico.firma}" style="max-height: 70px; max-width: 100%;" />` : '<div style="color: #cbd5e1; font-style: italic;">Sin firma</div>'}
        </div>
        <p style="margin: 0; font-weight: bold; font-size: 12px;">FIRMA DEL KINESIÓLOGO</p>
        <p style="margin: 0; font-size: 10px; color: #64748b;">Reg. SIS: ${formData.diagnostico.registro_profesional || '_______'}</p>
      </div>
    </div>
  `;

  const opt = {
    margin: 10,
    filename: `Ficha_${formData.paciente.nombre.replace(/\s+/g, '_')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // @ts-ignore
  window.html2pdf().from(element).set(opt).save();
};

export const exportToWord = (formData) => {
  const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>Export HTML to Word</title></head><body>`;
  const footer = "</body></html>";
  
  // Reuse some HTML logic but simpler
  const content = `
    <h1>FICHA DE EVALUACIÓN KINÉSICA CARDIORRESPIRATORIA</h1>
    <p>Fecha: ${new Date().toLocaleDateString('es-CL')}</p>
    <hr>
    <h2>I. ANTECEDENTES PERSONALES</h2>
    <p>Nombre: ${formData.paciente.nombre}</p>
    <p>RUT: ${formData.paciente.rut}</p>
    <p>Edad: ${formData.paciente.edad}</p>
    <hr>
    <h2>DIAGNÓSTICO Y PLAN</h2>
    <p>${formData.diagnostico.diagnostico_kinesico}</p>
  `;

  const sourceHTML = header + content + footer;
  
  const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
  const fileDownload = document.createElement("a");
  document.body.appendChild(fileDownload);
  fileDownload.href = source;
  fileDownload.download = `Ficha_${formData.paciente.nombre.replace(/\s+/g, '_')}.doc`;
  fileDownload.click();
  document.body.removeChild(fileDownload);
};
