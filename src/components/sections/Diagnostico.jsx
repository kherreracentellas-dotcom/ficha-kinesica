
import { ClipboardCheck, Save, Target, ListChecks } from 'lucide-react';
import { useFormState } from '../../hooks/useFormState';

export const Diagnostico = () => {
  const { formData, setFormData, setCurrentView } = useFormState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      diagnostico: { ...(prev.diagnostico || {}), [name]: value }
    }));
  };

  const handleSave = () => {
    alert('Ficha Kinésica guardada exitosamente en el historial local.');
    setCurrentView('dashboard');
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

        <div className="col-12 border-t pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="field-group w-full md:w-1/2">
              <label>Firma y Timbre del Profesional</label>
              <div className="signature-container h-32 flex items-center justify-center text-muted text-xs italic">
                Espacio para firma digital o manual
              </div>
            </div>
            <div className="field-group w-full md:w-1/3">
              <label>Registro Profesional / Superintendencia</label>
              <input 
                name="registro_profesional"
                type="text" 
                placeholder="Nº de Registro"
                value={formData.diagnostico.registro_profesional}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="col-12 border-t pt-8 mt-8 flex justify-center gap-4">
          <button className="btn btn-primary px-10 py-4 text-lg" onClick={handleSave}>
            <Save size={20} /> Finalizar y Guardar Ficha
          </button>
          <button className="btn btn-ghost" onClick={() => setCurrentView('dashboard')}>
            Cancelar y Volver
          </button>
        </div>
      </div>
    </section>
  );
};
