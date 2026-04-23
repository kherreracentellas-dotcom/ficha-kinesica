
import { Gauge, BarChart2, Wind, ChevronsUp } from 'lucide-react';
import { useFormState } from '../../hooks/useFormState';

export const Pruebas = () => {
  const { formData, setFormData, toggleNA } = useFormState();
  const isNA = formData.naSections.includes('pruebas');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      pruebas: { ...(prev.pruebas || {}), [name]: value }
    }));
  };

  // Calculations
  const fev1 = parseFloat(formData.pruebas?.fev1_obs) || 0;
  const fvc = parseFloat(formData.pruebas?.fvc_obs) || 0;
  const ratio = (fvc > 0) ? ((fev1 / fvc) * 100).toFixed(1) : '--';
  
  const fev1_pred = parseFloat(formData.pruebas?.fev1_pred) || 0;
  const fev1_porc = (fev1_pred > 0) ? ((fev1 / fev1_pred) * 100).toFixed(0) : '--';

  const getGoldGrade = (porc) => {
    if (porc === '--') return '';
    const n = parseFloat(porc);
    if (n >= 80) return 'GOLD 1 (Leve)';
    if (n >= 50) return 'GOLD 2 (Moderado)';
    if (n >= 30) return 'GOLD 3 (Grave)';
    return 'GOLD 4 (Muy Grave)';
  };

  return (
    <section id="pruebas" className={`clinical-section ${isNA ? 'na-active' : ''}`}>
      <div className="section-head">
        <div className="section-title">
          <h2 className="flex items-center gap-2">
            <Gauge className="text-accent" size={24} /> X. Pruebas Funcionales
          </h2>
          <p>Evaluación de la función pulmonar y fuerza muscular.</p>
        </div>
        <button 
          type="button" 
          className={`btn-na ${isNA ? 'active' : ''}`}
          onClick={() => toggleNA('pruebas')}
        >
          {isNA ? 'Anular N/A' : 'N/A'}
        </button>
      </div>

      {!isNA && (
        <div className="form-grid">
          <div className="col-12">
            <h3 className="flex items-center gap-2 mb-2"><BarChart2 size={18} /> 1. Espirometría</h3>
            <div className="form-grid bg-surface p-4 rounded border">
              <div className="field-group col-4">
                <label>FVC (L)</label>
                <div className="flex gap-2">
                  <input name="fvc_obs" type="number" step="0.01" placeholder="Obs" value={formData.pruebas?.fvc_obs || ''} onChange={handleChange} />
                  <input name="fvc_pred" type="number" step="0.01" placeholder="Pred" value={formData.pruebas?.fvc_pred || ''} onChange={handleChange} />
                </div>
              </div>
              <div className="field-group col-4">
                <label>FEV1 (L)</label>
                <div className="flex gap-2">
                  <input name="fev1_obs" type="number" step="0.01" placeholder="Obs" value={formData.pruebas?.fev1_obs || ''} onChange={handleChange} />
                  <input name="fev1_pred" type="number" step="0.01" placeholder="Pred" value={formData.pruebas?.fev1_pred || ''} onChange={handleChange} />
                </div>
              </div>
              <div className="field-group col-4">
                <div className="p-3 bg-card border rounded text-center">
                  <div className="text-xs text-muted mb-1">FEV1/FVC Ratio</div>
                  <div className="text-xl font-bold text-accent">{ratio}%</div>
                  <div className="text-[10px] mt-1 font-bold">{getGoldGrade(fev1_porc)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 border-t pt-1-5 mt-1">
            <h3 className="flex items-center gap-2 mb-2"><ChevronsUp size={18} /> 2. Músculos Respiratorios</h3>
          </div>
          <div className="field-group col-6">
            <label>PIM (cmH2O)</label>
            <input name="pim_val" type="number" placeholder="Inspiratoria Máxima" value={formData.pruebas?.pim_val || ''} onChange={handleChange} />
          </div>
          <div className="field-group col-6">
            <label>PEM (cmH2O)</label>
            <input name="pem_val" type="number" placeholder="Espiratoria Máxima" value={formData.pruebas?.pem_val || ''} onChange={handleChange} />
          </div>

          <div className="col-12 border-t pt-1-5 mt-1">
            <h3 className="flex items-center gap-2 mb-2"><Wind size={18} /> 3. Flujometría (PEF)</h3>
          </div>
          <div className="field-group col-6">
            <label>PEF Observado (L/min)</label>
            <input name="pef_obs" type="number" value={formData.pruebas?.pef_obs || ''} onChange={handleChange} />
          </div>
          <div className="field-group col-6">
            <label>PEF Predicho</label>
            <input name="pef_pred" type="number" value={formData.pruebas?.pef_pred || ''} onChange={handleChange} />
          </div>
        </div>
      )}
    </section>
  );
};
