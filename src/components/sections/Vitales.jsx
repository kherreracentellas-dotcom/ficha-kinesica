
import { Activity, Info } from 'lucide-react';
import { useFormState } from '../../hooks/useFormState';

export const Vitales = () => {
  const { formData, setFormData, toggleNA } = useFormState();
  const isNA = formData.naSections.includes('vitales');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      vitales: { ...(prev.vitales || {}), [name]: value }
    }));
  };

  // Calculations
  const sis = parseFloat(formData.vitales?.presion_sistolica) || 0;
  const dia = parseFloat(formData.vitales?.presion_diastolica) || 0;
  const pam = (sis && dia) ? ((2 * dia + sis) / 3).toFixed(1) : '--';

  const peso = parseFloat(formData.vitales?.paciente_peso) || 0;
  const talla = parseFloat(formData.vitales?.paciente_talla) / 100 || 0;
  const imc = (peso && talla) ? (peso / (talla * talla)).toFixed(1) : '--';

  const getStatusClass = (val, min, max) => {
    if (val === '--') return '';
    const num = parseFloat(val);
    if (num < min || num > max) return 'val-indicator danger';
    return 'val-indicator success';
  };

  return (
    <section id="vitales" className={`clinical-section ${isNA ? 'na-active' : ''}`}>
      <div className="section-head">
        <div className="section-title">
          <h2 className="flex items-center gap-2">
            <Activity className="text-accent" size={24} /> IV. Signos Vitales y Hemodinamia
          </h2>
          <p>Evaluación fisiológica objetiva y cálculos de riesgo.</p>
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
          <div className="vital-card col-6">
            <div className="vital-card-header flex justify-between items-center mb-2">
              <label className="font-bold">Presión Arterial</label>
              <div className="tooltip-icon" title="PAM = [ (2×D)+S ] / 3"><Info size={14} /></div>
            </div>
            <div className="vital-inputs-row flex items-center gap-4 mb-3">
              <div className="field-group">
                <input 
                  name="presion_sistolica"
                  type="number" 
                  placeholder="Sis"
                  value={formData.vitales?.presion_sistolica || ''}
                  onChange={handleChange}
                />
                <span className="text-xs text-muted">Sistólica</span>
              </div>
              <span className="text-xl text-muted">/</span>
              <div className="field-group">
                <input 
                  name="presion_diastolica"
                  type="number" 
                  placeholder="Dia"
                  value={formData.vitales?.presion_diastolica || ''}
                  onChange={handleChange}
                />
                <span className="text-xs text-muted">Diastólica</span>
              </div>
              <span className="text-sm text-muted">mmHg</span>
            </div>
            <div className="p-2 bg-surface rounded flex justify-between items-center">
              <span className="text-sm font-bold">PAM: {pam}</span>
              <span className={getStatusClass(pam, 70, 105)}>
                {pam !== '--' && (parseFloat(pam) < 70 ? 'Baja' : parseFloat(pam) > 105 ? 'Alta' : 'Normal')}
              </span>
            </div>
          </div>

          <div className="vital-card col-3">
            <label>FC (lpm)</label>
            <input 
              name="fc"
              type="number" 
              placeholder="0"
              value={formData.vitales?.fc || ''}
              onChange={handleChange}
            />
          </div>

          <div className="vital-card col-3">
            <label>FR (rpm)</label>
            <input 
              name="fr"
              type="number" 
              placeholder="0"
              value={formData.vitales?.fr || ''}
              onChange={handleChange}
            />
          </div>

          <div className="col-12 border-t pt-1-5 mt-1">
            <h3>Antropometría</h3>
          </div>
          <div className="field-group col-4">
            <label>Peso (kg)</label>
            <input 
              name="paciente_peso"
              type="number" 
              step="0.1"
              value={formData.vitales?.paciente_peso || ''}
              onChange={handleChange}
            />
          </div>
          <div className="field-group col-4">
            <label>Talla (cm)</label>
            <input 
              name="paciente_talla"
              type="number" 
              value={formData.vitales?.paciente_talla || ''}
              onChange={handleChange}
            />
          </div>
          <div className="field-group col-4">
            <label>IMC: {imc}</label>
            <div className={`p-2 rounded text-center text-xs font-bold ${getStatusClass(imc, 18.5, 24.9)}`}>
              {imc !== '--' && (parseFloat(imc) < 18.5 ? 'Bajo Peso' : parseFloat(imc) > 30 ? 'Obesidad' : parseFloat(imc) > 25 ? 'Sobrepeso' : 'Normal')}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
