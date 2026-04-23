
import { ShieldCheck } from 'lucide-react';
import { useFormState } from '../../hooks/useFormState';

export const Seguridad = () => {
  const { formData, setFormData, toggleNA } = useFormState();
  const isNA = formData.naSections.includes('seguridad');

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      seguridad: { ...(prev.seguridad || {}), [name]: checked }
    }));
  };

  const checks = [
    { id: 'indicacion', label: 'Indicación Médica', desc: 'Orden vigente y clara para kinesioterapia.' },
    { id: 'vias', label: 'Accesos y Vías', desc: 'Asegurar permeabilidad (Vía arterial, TOT/TQT, Drenajes).' },
    { id: 'alimento', label: 'Alimentación', desc: 'Ayuno > 1 hora o nutrición enteral pausada.' },
    { id: 'clinica', label: 'Estabilidad', desc: 'Sin arritmias no controladas o hemorragia activa.' }
  ];

  return (
    <section id="seguridad" className={`clinical-section ${isNA ? 'na-active' : ''}`}>
      <div className="section-head">
        <div className="section-title">
          <h2 className="flex items-center gap-2 text-warning">
            <ShieldCheck size={24} /> XIII. Checklist de Seguridad
          </h2>
          <p>Verificación crítica antes de iniciar la intervención.</p>
        </div>
        <button 
          type="button" 
          className={`btn-na ${isNA ? 'active' : ''}`}
          onClick={() => toggleNA('seguridad')}
        >
          {isNA ? 'Anular N/A' : 'N/A'}
        </button>
      </div>

      {!isNA && (
        <div className="form-grid">
          <div className="col-12">
            <div className="flex flex-col gap-3">
              {checks.map(c => (
                <label key={c.id} className="checkbox-card flex items-center gap-4 p-4 border rounded cursor-pointer hover:bg-warning-light/20">
                  <input 
                    type="checkbox" 
                    name={c.id} 
                    checked={formData.seguridad?.[c.id] || false}
                    onChange={handleChange}
                  />
                  <div>
                    <div className="font-bold">{c.label}</div>
                    <div className="text-xs text-muted">{c.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
