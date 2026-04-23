
import { Activity } from 'lucide-react';
import { useFormState } from '../../hooks/useFormState';
import { ClinicalCalculations } from '../../utils/clinicalCalculations';

export const Capacidad = () => {
  const { formData, setFormData, toggleNA } = useFormState();
  const isNA = formData.naSections.includes('capacidad');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      capacidad: { ...(prev.capacidad || {}), [name]: value }
    }));
  };

  const predicted = ClinicalCalculations.calculateTM6MPredicted(
    formData.paciente?.sexo || 'masculino',
    formData.paciente?.edad || 0,
    formData.vitales?.paciente_peso || 0,
    formData.vitales?.paciente_talla || 0
  );

  const percentage = ClinicalCalculations.calculateTM6MPercentage(
    formData.capacidad?.tm6m_recorrida || 0,
    predicted
  );

  return (
    <section id="capacidad" className={`clinical-section ${isNA ? 'na-active' : ''}`}>
      <div className="section-head">
        <div className="section-title">
          <h2 className="flex items-center gap-2">
            <Activity className="text-accent" size={24} /> XI. Capacidad Funcional
          </h2>
          <p>Evaluación de esfuerzo y desempeño físico en campo.</p>
        </div>
        <button 
          type="button" 
          className={`btn-na ${isNA ? 'active' : ''}`}
          onClick={() => toggleNA('capacidad')}
        >
          {isNA ? 'Anular N/A' : 'N/A'}
        </button>
      </div>

      {!isNA && (
        <div className="form-grid">
          <div className="col-12 bg-surface p-4 rounded border">
            <h3 className="mb-3">Test de Marcha de 6 Minutos (TM6M)</h3>
            <div className="form-grid m-0">
              <div className="field-group col-4">
                <label className="text-accent font-bold">Recorrida (m)</label>
                <input 
                  name="tm6m_recorrida"
                  type="number" 
                  className="text-xl font-bold"
                  value={formData.capacidad?.tm6m_recorrida || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="field-group col-4">
                <label>Predicha (m)</label>
                <div className="text-xl font-bold p-2">{predicted} m</div>
              </div>
              <div className="field-group col-4">
                <label>% Alcance</label>
                <div className="text-xl font-bold text-accent p-2">{percentage}%</div>
              </div>
            </div>

            <div className="col-12 border-t pt-3 mt-3">
              <label className="font-bold mb-2 block text-sm">Dinámica del Test (Inicio → Fin)</label>
              <div className="form-grid m-0">
                <div className="field-group col-4">
                  <label className="text-xs">Borg (Disnea/Fatiga)</label>
                  <input name="tm6m_borg" placeholder="Ej: 0 → 4" value={formData.capacidad?.tm6m_borg || ''} onChange={handleChange} />
                </div>
                <div className="field-group col-4">
                  <label className="text-xs">SpO2 (%)</label>
                  <input name="tm6m_spo2" placeholder="Ej: 98 → 94" value={formData.capacidad?.tm6m_spo2 || ''} onChange={handleChange} />
                </div>
                <div className="field-group col-4">
                  <label className="text-xs">Frec. Cardíaca</label>
                  <input name="tm6m_fc" placeholder="Ej: 70 → 115" value={formData.capacidad?.tm6m_fc || ''} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
