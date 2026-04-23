import { Hand } from 'lucide-react';
import { useFormState } from '../../hooks/useFormState';

export const Palpacion = () => {
  const { formData, setFormData, toggleNA } = useFormState();
  const isNA = formData.naSections.includes('palpacion');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
        const currentArr = formData.palpacion?.[name] || [];
        const newArr = checked ? [...currentArr, value] : currentArr.filter(v => v !== value);
        setFormData(prev => ({
            ...prev,
            palpacion: { ...(prev.palpacion || {}), [name]: newArr }
        }));
    } else {
        setFormData(prev => ({
            ...prev,
            palpacion: { ...(prev.palpacion || {}), [name]: value }
        }));
    }
  };

  return (
    <section id="palpacion" className={`clinical-section ${isNA ? 'na-active' : ''}`}>
      <div className="section-head">
        <div className="section-title">
          <h2 className="flex items-center gap-2">
            <Hand className="text-accent" size={24} /> VI. Palpación y Evaluación Cardiovascular
          </h2>
          <p>Signos de sobrecarga hídrica y examen segmentario.</p>
        </div>
        <button 
          type="button" 
          className={`btn-na ${isNA ? 'active' : ''}`}
          onClick={() => toggleNA('palpacion')}
        >
          {isNA ? 'Anular N/A' : 'N/A'}
        </button>
      </div>

      {!isNA && (
        <div className="form-grid">
          <div className="field-group col-6">
            <label>Linfonodos palpables</label>
            <select name="linfonodos" value={formData.palpacion?.linfonodos || 'no'} onChange={handleChange}>
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
          </div>

          {formData.palpacion?.linfonodos === 'si' && (
            <div className="field-group col-6">
              <label>Ubicación</label>
              <div className="flex gap-4">
                {['Cervicales', 'Axilares', 'Inguinales'].map(l => (
                  <label key={l} className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      name="linfo_ubic" 
                      value={l}
                      checked={(formData.palpacion?.linfo_ubic || []).includes(l)}
                      onChange={handleChange}
                    />
                    <span>{l}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="field-group col-6">
            <label>Tráquea</label>
            <input 
              name="traquea"
              type="text" 
              placeholder="Ej: Centrada"
              value={formData.palpacion?.traquea || ''}
              onChange={handleChange}
            />
          </div>

          <div className="field-group col-6">
            <label>Expansibilidad (T-S / T-I)</label>
            <input 
              name="expansibilidad"
              type="text" 
              placeholder="Ej: Conservada"
              value={formData.palpacion?.expansibilidad || ''}
              onChange={handleChange}
            />
          </div>

          <div className="field-group col-6">
            <label>Frémitos Táctiles</label>
            <select name="fremitos" value={formData.palpacion?.fremitos || 'normales'} onChange={handleChange}>
              <option value="normales">Normales</option>
              <option value="aumentados">Aumentados</option>
              <option value="disminuidos">Disminuidos</option>
            </select>
          </div>

          <div className="field-group col-6">
            <label>Llenado Capilar</label>
            <select name="llenado_capilar" value={formData.palpacion?.llenado_capilar || 'normal'} onChange={handleChange}>
              <option value="normal">Normal (≤ 2 seg)</option>
              <option value="limite">Límite (2 - 3 seg)</option>
              <option value="prolongado">Prolongado (&gt; 3 seg)</option>
            </select>
          </div>

          <div className="field-group col-6">
            <label>Edema Periférico (Fóvea)</label>
            <select name="edema" value={formData.palpacion?.edema || 'ausente'} onChange={handleChange}>
              <option value="ausente">Ausente</option>
              <option value="1">+</option>
              <option value="2">++</option>
              <option value="3">+++</option>
            </select>
          </div>
        </div>
      )}
    </section>
  );
};
