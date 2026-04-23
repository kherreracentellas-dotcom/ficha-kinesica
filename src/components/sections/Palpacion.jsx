import { Hand, Heart, Activity } from 'lucide-react';
import { useFormState } from '../../hooks/useFormState';

export const Palpacion = () => {
  const { formData, setFormData, toggleNA } = useFormState();
  const isNA = formData.naSections.includes('palpacion');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      palpacion: { ...(prev.palpacion || {}), [name]: value }
    }));
  };

  return (
    <section id="palpacion" className={`clinical-section ${isNA ? 'na-active' : ''}`}>
      <div className="section-head">
        <div className="section-title">
          <h2 className="flex items-center gap-2">
            <Hand className="text-accent" size={24} /> V. Palpación y Evaluación Cardiovascular Integrada
          </h2>
          <p>Integración de signos de sobrecarga hídrica y falla ventricular.</p>
        </div>
        <button type="button" className={`btn-na ${isNA ? 'active' : ''}`} onClick={() => toggleNA('palpacion')}>
          {isNA ? 'Anular N/A' : 'N/A'}
        </button>
      </div>

      {!isNA && (
        <div className="form-grid">
          {/* Evaluación Cardiovascular */}
          <div className="col-12">
            <h3 className="text-sm mb-4 flex items-center gap-2"><Heart size={16} /> Evaluación Cardiovascular</h3>
          </div>
          <div className="field-group col-4">
            <label>Llenado Capilar</label>
            <select name="llenado_capilar" value={formData.palpacion.llenado_capilar} onChange={handleChange}>
              <option value="normal">Normal (≤ 2 seg)</option>
              <option value="limite">Límite (2 - 3 seg)</option>
              <option value="prolongado">Prolongado (&gt; 3 seg)</option>
            </select>
          </div>
          <div className="field-group col-4">
            <label>Ingurgitación Yugular (45°)</label>
            <select name="ingurgitacion" value={formData.palpacion.ingurgitacion} onChange={handleChange}>
              <option value="no">No</option>
              <option value="si">Sí (&gt; 3 cm)</option>
            </select>
          </div>
          <div className="field-group col-4">
            <label>Reflujo Hepatoyugular</label>
            <select name="reflujo" value={formData.palpacion.reflujo} onChange={handleChange}>
              <option value="negativo">Negativo</option>
              <option value="positivo">Positivo</option>
            </select>
          </div>
          <div className="field-group col-6">
            <label>Pulsos Periféricos</label>
            <select name="pulsos" value={formData.palpacion.pulsos} onChange={handleChange}>
              <option value="simetricos">Simétricos y presentes</option>
              <option value="asimetricos">Asimétricos / Débiles</option>
            </select>
          </div>
          <div className="field-group col-6">
            <label>Edema Periférico (Fóvea)</label>
            <select name="edema" value={formData.palpacion.edema} onChange={handleChange}>
              <option value="ausente">Ausente</option>
              <option value="+">+</option>
              <option value="++">++</option>
              <option value="+++">+++</option>
            </select>
          </div>

          {/* Evaluación Física Torácica */}
          <div className="col-12 border-t pt-4 mt-2">
            <h3 className="text-sm mb-4 flex items-center gap-2"><Activity size={16} /> Evaluación Física Torácica</h3>
          </div>
          <div className="field-group col-4">
            <label>Tráquea</label>
            <input name="traquea" type="text" placeholder="Central / Desviada" value={formData.palpacion.traquea} onChange={handleChange} />
          </div>
          <div className="field-group col-4">
            <label>Expansibilidad (T-S / T-I)</label>
            <input name="expansibilidad" type="text" value={formData.palpacion.expansibilidad} onChange={handleChange} />
          </div>
          <div className="field-group col-4">
            <label>Frémitos Táctiles</label>
            <select name="fremitos" value={formData.palpacion.fremitos} onChange={handleChange}>
              <option value="normales">Normales</option>
              <option value="aumentados">Aumentados</option>
              <option value="disminuidos">Disminuidos</option>
            </select>
          </div>
        </div>
      )}
    </section>
  );
};
