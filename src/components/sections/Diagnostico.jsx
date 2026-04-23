
import { ClipboardCheck, Save } from 'lucide-react';
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
    // In a real app, this would call a save function from context
    alert('Ficha guardada exitosamente en el almacenamiento local.');
    setCurrentView('dashboard');
  };

  return (
    <section id="diagnostico" className="clinical-section">
      <div className="section-head">
        <div className="section-title">
          <h2 className="flex items-center gap-2">
            <ClipboardCheck className="text-accent" size={24} /> XIV. Diagnóstico y Objetivos
          </h2>
          <p>Resumen clínico, metas terapéuticas y validación.</p>
        </div>
      </div>

      <div className="form-grid">
        <div className="field-group col-12">
          <label>Diagnóstico Kinésico (CIF)</label>
          <textarea 
            name="diagnostico_kinesico"
            placeholder="Deficiencia, limitación en la actividad, restricción en participación..."
            value={formData.diagnostico?.diagnostico_kinesico || ''}
            onChange={handleChange}
          />
        </div>

        <div className="field-group col-12">
          <label>Objetivo General</label>
          <input 
            name="objetivo_general"
            type="text" 
            value={formData.diagnostico?.objetivo_general || ''}
            onChange={handleChange}
          />
        </div>

        <div className="field-group col-12">
          <label>Objetivos Específicos</label>
          <textarea 
            name="objetivos_especificos"
            value={formData.diagnostico?.objetivos_especificos || ''}
            onChange={handleChange}
          />
        </div>

        <div className="field-group col-12">
          <label>Plan de Tratamiento / Indicaciones</label>
          <textarea 
            name="plan_tratamiento"
            value={formData.diagnostico?.plan_tratamiento || ''}
            onChange={handleChange}
          />
        </div>

        <div className="col-12 border-t pt-5 mt-5 flex justify-center gap-4">
          <button className="btn btn-primary px-8 py-3 flex items-center gap-2" onClick={handleSave}>
            <Save size={20} /> Guardar Ficha Completa
          </button>
          <button className="btn btn-ghost" onClick={() => setCurrentView('dashboard')}>
            Cancelar y Volver
          </button>
        </div>
      </div>
    </section>
  );
};
