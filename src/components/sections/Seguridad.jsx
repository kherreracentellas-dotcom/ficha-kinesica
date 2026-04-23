import { ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useFormState } from '../../hooks/useFormState';

export const Seguridad = () => {
  const { formData, setFormData, toggleNA } = useFormState();
  const isNA = formData.naSections.includes('seguridad');

  const handleCheck = (field) => {
    setFormData(prev => ({
      ...prev,
      seguridad: { ...prev.seguridad, [field]: !prev.seguridad[field] }
    }));
  };

  return (
    <section id="seguridad" className={`clinical-section ${isNA ? 'na-active' : ''}`}>
      <div className="section-head">
        <div className="section-title">
          <h2 className="flex items-center gap-2">
            <ShieldCheck className="text-accent" size={24} /> VIII. Checklist de Seguridad Pre-Kinesioterapia
          </h2>
          <p>Verificación obligatoria previa a la intervención (Atención Cerrada / Urgencias).</p>
        </div>
        <button type="button" className={`btn-na ${isNA ? 'active' : ''}`} onClick={() => toggleNA('seguridad')}>
          {isNA ? 'Anular N/A' : 'N/A'}
        </button>
      </div>

      {!isNA && (
        <div className="form-grid">
          <div className="col-12 mb-4 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r flex gap-3">
            <AlertTriangle className="text-amber-500 shrink-0" size={20} />
            <p className="text-sm text-amber-900">
              <strong>Atención:</strong> Antes de iniciar, verifique la estabilidad hemodinámica (PAM &lt; 120 mmHg), ayuno y fijaciones.
            </p>
          </div>

          <div className="col-12 flex flex-col gap-3">
            <div 
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${formData.seguridad.indicacion_medica ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}
              onClick={() => handleCheck('indicacion_medica')}
            >
              <CheckCircle2 className={formData.seguridad.indicacion_medica ? 'text-green-500' : 'text-slate-300'} size={24} />
              <div>
                <span className="font-bold block">Indicación Médica</span>
                <span className="text-xs text-muted">Revisada, documentada y actualizada en la ficha clínica.</span>
              </div>
            </div>

            <div 
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${formData.seguridad.vias_invasivas ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}
              onClick={() => handleCheck('vias_invasivas')}
            >
              <CheckCircle2 className={formData.seguridad.vias_invasivas ? 'text-green-500' : 'text-slate-300'} size={24} />
              <div>
                <span className="font-bold block">Vías Invasivas y Dispositivos</span>
                <span className="text-xs text-muted">Catéteres, TOT/TQT o drenajes fijados correctamente.</span>
              </div>
            </div>

            <div 
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${formData.seguridad.alimentacion ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}
              onClick={() => handleCheck('alimentacion')}
            >
              <CheckCircle2 className={formData.seguridad.alimentacion ? 'text-green-500' : 'text-slate-300'} size={24} />
              <div>
                <span className="font-bold block">Alimentación / Vía Enteral</span>
                <span className="text-xs text-muted">Paciente con ayuno de &ge; 1 hora o nutrición enteral pausada.</span>
              </div>
            </div>

            <div 
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${formData.seguridad.condicion_clinica ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}
              onClick={() => handleCheck('condicion_clinica')}
            >
              <CheckCircle2 className={formData.seguridad.condicion_clinica ? 'text-green-500' : 'text-slate-300'} size={24} />
              <div>
                <span className="font-bold block">Condición Clínica Estable</span>
                <span className="text-xs text-muted">Sin inestabilidad aguda, hemorragia activa o arritmias.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
