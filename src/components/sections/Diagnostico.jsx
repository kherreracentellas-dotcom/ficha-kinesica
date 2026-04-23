
import { ClipboardCheck, Save, Target, ListChecks, FileText } from 'lucide-react';
import { useFormState } from '../../hooks/useFormState';
import { exportToPDF, exportToWord } from '../../utils/exportUtils';
import { fichaCompletaSchema } from '../../utils/schemas';
import { SignatureCanvas } from '../SignatureCanvas';
import Swal from 'sweetalert2';

export const Diagnostico = () => {
  const { formData, setFormData, setCurrentView, setPatients } = useFormState();

  const handleSignatureSave = (data) => {
    setFormData(prev => ({
      ...prev,
      diagnostico: { ...prev.diagnostico, firma: data }
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      diagnostico: { ...(prev.diagnostico || {}), [name]: value }
    }));
  };

  const handleSave = () => {
    // Preparar datos para validación (convertir tipos si es necesario)
    const dataToValidate = {
      ...formData,
      paciente: {
        ...formData.paciente,
        edad: parseInt(formData.paciente.edad) || 0
      }
    };

    const result = fichaCompletaSchema.safeParse(dataToValidate);

    if (!result.success) {
      const firstError = result.error.errors[0].message;
      Swal.fire({
        icon: 'error',
        title: 'Error de Validación',
        text: firstError,
        confirmButtonColor: '#4f46e5'
      });
      return;
    }

    // Si es válido, guardar en el historial
    const newEntry = {
      ...formData,
      id: formData.id || Date.now(),
      fecha: new Date().toLocaleDateString('es-CL'),
    };

    setPatients(prev => {
      const exists = prev.find(p => p.id === newEntry.id);
      if (exists) {
        return prev.map(p => p.id === newEntry.id ? newEntry : p);
      }
      return [newEntry, ...prev];
    });

    Swal.fire({
      icon: 'success',
      title: 'Ficha Guardada',
      text: 'La evaluación se ha registrado exitosamente.',
      confirmButtonColor: '#4f46e5'
    }).then(() => {
      setCurrentView('dashboard');
    });
  };

  return (
    <section id="diagnostico" className="clinical-section">
      <div className="section-head">
        <div className="section-title">
          <h2 className="flex items-center gap-2">
            <ClipboardCheck className="text-accent" size={24} /> IX. Diagnóstico Kinésico y Objetivos
          </h2>
          <p>Definición del plan terapéutico basado en el modelo CIF.</p>
        </div>
      </div>

      <div className="form-grid">
        <div className="col-12 mb-4 p-4 bg-slate-50 border-l-4 border-slate-400 rounded-r text-xs text-slate-600">
          <strong>Modelo CIF:</strong> Considere deficiencias estructurales, limitación en la actividad y restricción en la participación para su diagnóstico.
        </div>

        <div className="field-group col-12">
          <label>Diagnóstico Kinésico</label>
          <textarea 
            name="diagnostico_kinesico"
            rows="3"
            placeholder="Ej: Deficiencia estructural de parénquima pulmonar secundaria a EPOC, con limitación moderada en la deambulación..."
            value={formData.diagnostico.diagnostico_kinesico}
            onChange={handleChange}
          />
        </div>

        <div className="field-group col-12">
          <label className="flex items-center gap-2"><Target size={14} /> Objetivo General</label>
          <input 
            name="objetivo_general"
            type="text" 
            placeholder="Ej: Optimizar la ventilación y capacidad aeróbica..."
            value={formData.diagnostico.objetivo_general}
            onChange={handleChange}
          />
        </div>

        <div className="field-group col-12">
          <label className="flex items-center gap-2"><ListChecks size={14} /> Objetivos Específicos</label>
          <textarea 
            name="objetivos_especificos"
            rows="4"
            placeholder="1. Permeabilizar vía aérea...
2. Reeducar patrón respiratorio...
3. Incrementar fuerza de musculatura periférica..."
            value={formData.diagnostico.objetivos_especificos}
            onChange={handleChange}
          />
        </div>

        <div className="col-12 border-t pt-10 mt-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="field-group w-full md:w-5/12">
              <label className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-4 block">Validación del Profesional</label>
              <div className="signature-box aspect-video bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-inner relative transition-all focus-within:border-accent">
                <SignatureCanvas 
                  onSave={handleSignatureSave} 
                  initialData={formData.diagnostico.firma} 
                />
                {!formData.diagnostico.firma && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 pointer-events-none">
                    <span className="text-xs font-bold uppercase tracking-tighter opacity-50">Firma Manual Aquí</span>
                  </div>
                )}
              </div>
            </div>
            <div className="field-group w-full md:w-4/12">
              <label className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-4 block">Identificación Civil / Salud</label>
              <input 
                name="registro_profesional"
                type="text" 
                placeholder="Nº Registro SIS"
                value={formData.diagnostico.registro_profesional}
                onChange={handleChange}
                className="text-lg font-black tracking-widest py-6"
              />
              <p className="text-[10px] text-slate-400 mt-3 italic">Verifique que su número de registro coincida con la Superintendencia de Salud.</p>
            </div>
          </div>
        </div>

        <div className="col-12 mt-12 flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-4">
            <button className="btn-final-save group" onClick={handleSave}>
              <div className="flex items-center gap-4 bg-indigo-600 px-12 py-5 rounded-2xl text-white font-black text-xl shadow-2xl shadow-indigo-200 group-hover:bg-indigo-700 transition-all group-hover:-translate-y-1">
                <Save size={24} /> 
                <span>Finalizar y Guardar</span>
              </div>
            </button>
            
            <div className="flex gap-2">
              <button 
                className="flex items-center gap-2 bg-white border-2 border-indigo-100 px-6 py-4 rounded-2xl text-indigo-600 font-bold hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-50"
                onClick={() => exportToPDF(formData)}
              >
                <FileText size={20} />
                <span>Descargar PDF</span>
              </button>
              <button 
                className="flex items-center gap-2 bg-white border-2 border-blue-100 px-6 py-4 rounded-2xl text-blue-600 font-bold hover:bg-blue-50 transition-colors shadow-lg shadow-blue-50"
                onClick={() => exportToWord(formData)}
              >
                <FileText size={20} />
                <span>Word (.doc)</span>
              </button>
            </div>
          </div>

          <button className="text-slate-400 font-bold text-sm hover:text-red-500 transition-colors uppercase tracking-widest" onClick={() => setCurrentView('dashboard')}>
            Descartar cambios y salir
          </button>
        </div>
      </div>
    </section>
  );
};
