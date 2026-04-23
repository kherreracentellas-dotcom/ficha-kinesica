
import { Wind } from 'lucide-react';
import { useFormState } from '../../hooks/useFormState';

export const Mecanica = () => {
  const { formData, setFormData, toggleNA } = useFormState();
  const isNA = formData.naSections.includes('mecanica');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      mecanica: { 
        ...(prev.mecanica || {}), 
        [name]: type === 'checkbox' ? checked : value 
      }
    }));
  };

  return (
    <section id="mecanica" className={`clinical-section ${isNA ? 'na-active' : ''}`}>
      <div className="section-head">
        <div className="section-title">
          <h2 className="flex items-center gap-2">
            <Wind className="text-accent" size={24} /> IX. Mecánica Respiratoria
          </h2>
          <p>Dinámica ventilatoria y parámetros de ventilación.</p>
        </div>
        <button 
          type="button" 
          className={`btn-na ${isNA ? 'active' : ''}`}
          onClick={() => toggleNA('mecanica')}
        >
          {isNA ? 'Anular N/A' : 'N/A'}
        </button>
      </div>

      {!isNA && (
        <div className="form-grid">
          <div className="field-group col-12">
            <label className="checkbox-card flex items-center gap-2 p-3 border rounded cursor-pointer">
              <input 
                type="checkbox" 
                name="uso_vm" 
                checked={formData.mecanica?.uso_vm || false}
                onChange={handleChange}
              />
              <span className="font-bold">Paciente en Ventilación Mecánica (VM)</span>
            </label>
          </div>

          {formData.mecanica?.uso_vm && (
            <div className="col-12 bg-surface p-4 rounded mb-2 border border-accent/20">
              <div className="form-grid m-0">
                <div className="field-group col-4">
                  <label>Presión Pico (PIP)</label>
                  <div className="flex items-center gap-2">
                    <input name="pip" type="number" step="0.1" value={formData.mecanica?.pip || ''} onChange={handleChange} />
                    <span className="text-xs">cmH2O</span>
                  </div>
                </div>
                <div className="field-group col-4">
                  <label>Presión Meseta</label>
                  <div className="flex items-center gap-2">
                    <input name="plateau" type="number" step="0.1" value={formData.mecanica?.plateau || ''} onChange={handleChange} />
                    <span className="text-xs">cmH2O</span>
                  </div>
                </div>
                <div className="field-group col-4">
                  <label>PEEP</label>
                  <div className="flex items-center gap-2">
                    <input name="peep" type="number" step="0.1" value={formData.mecanica?.peep || ''} onChange={handleChange} />
                    <span className="text-xs">cmH2O</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="field-group col-6">
            <label>Complianza (Distensibilidad)</label>
            <input 
              name="distensibilidad"
              type="text" 
              placeholder="Ej: 35 ml/cmH2O"
              value={formData.mecanica?.distensibilidad || ''}
              onChange={handleChange}
            />
          </div>

          <div className="field-group col-6">
            <label>Resistencia de la Vía Aérea</label>
            <input 
              name="resistencia"
              type="text" 
              placeholder="Ej: Aumentada (> 10)"
              value={formData.mecanica?.resistencia || ''}
              onChange={handleChange}
            />
          </div>
        </div>
      )}
    </section>
  );
};
