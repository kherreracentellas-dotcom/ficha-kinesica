
import { Activity, Info, Thermometer } from 'lucide-react';
import { useFormState } from '../../hooks/useFormState';
import { SectionNavigation } from '../SectionNavigation';

export const Vitales = () => {
  const { formData, setFormData, toggleNA } = useFormState();
  const isNA = formData.naSections.includes('vitales');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newVitales = { ...(prev.vitales || {}), [name]: value };
      
      // Cálculo de PAM
      const sis = parseFloat(name === 'pa_sistolica' ? value : newVitales.pa_sistolica) || 0;
      const dia = parseFloat(name === 'pa_diastolica' ? value : newVitales.pa_diastolica) || 0;
      if (sis && dia) {
        newVitales.pam = ((2 * dia + sis) / 3).toFixed(0);
      } else {
        newVitales.pam = '';
      }

      return { ...prev, vitales: newVitales };
    });
  };

  // Local values for UI feedback
  const pam = formData.vitales.pam || '--';

  const pamWarning = parseFloat(pam) > 120;

  return (
    <section id="vitales" className={`clinical-section ${isNA ? 'na-active' : ''}`}>
      <div className="section-head">
        <div className="section-title">
          <h2 className="flex items-center gap-2">
            <Activity className="text-accent" size={24} /> III. Signos Vitales y Hemodinamia
          </h2>
          <p>Monitorización de estabilidad y límites de seguridad.</p>
        </div>
        <button 
          type="button" 
          className={`btn-na ${isNA ? 'active' : ''}`}
          onClick={() => toggleNA('vitales')}
        >
          {isNA ? 'Anular N/A' : 'N/A'}
        </button>
      </div>

      {!isNA && (
        <div className="form-grid">
          <div className="col-12 mb-2 p-3 bg-blue-50 border-l-4 border-accent text-sm text-primary flex items-start gap-2">
            <Info size={16} className="mt-0.5 flex-shrink-0" />
            <p>Es imperativo monitorizar la estabilidad hemodinámica. La PAM actúa como limitante para la terapia si se encuentra alterada.</p>
          </div>

          {/* Fila PA */}
          <div className="vital-card col-6 border-l-4 border-l-accent">
            <label className="vital-label text-accent"><Activity size={18} /> Presión Arterial (mmHg)</label>
            <div className="flex items-center gap-4 mt-2">
              <div className="field-group flex-1">
                <label className="text-[10px] text-center">Sistólica</label>
                <input name="pa_sistolica" type="number" placeholder="Sis" value={formData.vitales.pa_sistolica} onChange={handleChange} className="text-center text-xl font-bold" />
              </div>
              <span className="text-3xl text-slate-300 mt-4">/</span>
              <div className="field-group flex-1">
                <label className="text-[10px] text-center">Diastólica</label>
                <input name="pa_diastolica" type="number" placeholder="Dia" value={formData.vitales.pa_diastolica} onChange={handleChange} className="text-center text-xl font-bold" />
              </div>
            </div>
            <div className={`mt-4 p-4 rounded-xl flex flex-col gap-1 items-center justify-center transition-all ${pamWarning ? 'bg-red-50 border border-red-200 text-red-600' : 'bg-slate-50 border border-slate-100 text-slate-600'}`}>
              <span className="text-[10px] uppercase font-bold tracking-widest">Presión Arterial Media</span>
              <span className="text-2xl font-black">{pam} <small className="text-sm font-normal">mmHg</small></span>
              {pamWarning && <span className="text-[10px] font-bold uppercase animate-pulse flex items-center gap-1">⚠️ Suspender intervención</span>}
            </div>
          </div>

          <div className="col-6 grid grid-cols-2 gap-4">
            <div className="field-group">
              <label>FC (lpm)</label>
              <input name="fc" type="number" value={formData.vitales.fc} onChange={handleChange} className="text-center font-bold" />
            </div>
            <div className="field-group">
              <label>FR (rpm)</label>
              <input name="fr" type="number" value={formData.vitales.fr} onChange={handleChange} className="text-center font-bold" />
            </div>
            <div className="field-group">
              <label>SpO2 (%)</label>
              <input name="spo2" type="number" value={formData.vitales.spo2} onChange={handleChange} className="text-center font-bold text-accent" />
            </div>
            <div className="field-group">
              <label>FiO2 (%)</label>
              <input name="fio2" type="number" value={formData.vitales.fio2} onChange={handleChange} className="text-center font-bold" />
            </div>
          </div>

          {/* Fila O2 & T° */}
          <div className="field-group col-6">
            <label>Vía Administración O2</label>
            <select name="via_o2" value={formData.vitales.via_o2} onChange={handleChange}>
              <option value="Aire Ambiental">Aire Ambiental (FiO2 21%)</option>
              <option value="Naricera">Naricera</option>
              <option value="Mascarilla Simple">Mascarilla Simple</option>
              <option value="Venturi">Venturi</option>
              <option value="Reservorio">Mascarilla con Reservorio</option>
              <option value="VMNI">VMNI</option>
              <option value="CNAF">CNAF (Cánula Alto Flujo)</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div className="field-group col-6">
            <label className="flex items-center gap-2"><Thermometer size={14} /> Temperatura (°C)</label>
            <input name="temp" type="number" step="0.1" value={formData.vitales.temp} onChange={handleChange} />
          </div>

          <SectionNavigation prevId="morbidos" nextId="inspeccion" />
        </div>
      )}
    </section>
  );
};
