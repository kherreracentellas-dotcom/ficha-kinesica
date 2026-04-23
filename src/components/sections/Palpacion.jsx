import { Hand, Heart, Activity } from 'lucide-react';
import { useFormState } from '../../hooks/useFormState';
import { SectionNavigation } from '../SectionNavigation';

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
          <div className="col-12 bg-indigo-50/30 p-8 rounded-[2rem] border border-indigo-100 mb-6">
            <h3 className="text-md mb-6 flex items-center gap-3 text-indigo-900 font-black uppercase tracking-widest">
              <Heart size={20} className="text-accent" /> Perfusión y Sobrecarga Hídrica
            </h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="field-group">
                <label className="text-indigo-800">Llenado Capilar</label>
                <select name="llenado_capilar" value={formData.palpacion.llenado_capilar} onChange={handleChange} className="bg-white">
                  <option value="normal">Normal (≤ 2 seg)</option>
                  <option value="limite">Límite (2 - 3 seg)</option>
                  <option value="prolongado">Prolongado (&gt; 3 seg)</option>
                </select>
              </div>
              <div className="field-group">
                <label className="text-indigo-800">Ingurgitación Yugular</label>
                <select name="ingurgitacion" value={formData.palpacion.ingurgitacion} onChange={handleChange} className="bg-white">
                  <option value="no">Ausente (Negativo)</option>
                  <option value="si">Presente (&gt; 3 cm a 45°)</option>
                </select>
              </div>
              <div className="field-group">
                <label className="text-indigo-800">Edema (Fóvea)</label>
                <select name="edema" value={formData.palpacion.edema} onChange={handleChange} className="bg-white">
                  <option value="ausente">Ausente</option>
                  <option value="+">Grado I (+)</option>
                  <option value="++">Grado II (++)</option>
                  <option value="+++">Grado III (+++)</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mt-6">
              <div className="field-group">
                <label className="text-indigo-800">Pulsos Periféricos</label>
                <select name="pulsos" value={formData.palpacion.pulsos} onChange={handleChange} className="bg-white">
                  <option value="simetricos">Simétricos y rítmicos</option>
                  <option value="asimetricos">Asimétricos / Arritmia</option>
                  <option value="debiles">Débiles / Filiformes</option>
                </select>
              </div>
              <div className="field-group">
                <label className="text-indigo-800">Reflujo Hepatoyugular</label>
                <select name="reflujo" value={formData.palpacion.reflujo} onChange={handleChange} className="bg-white">
                  <option value="negativo">Negativo (Normal)</option>
                  <option value="positivo">Positivo (Signo de falla)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Evaluación Física Torácica */}
          <div className="col-12 mt-4">
            <h3 className="text-sm mb-4 flex items-center gap-2 text-primary font-bold border-b pb-2">
              <Activity size={16} className="text-accent" /> Palpación Física Torácica
            </h3>
          </div>
          <div className="field-group col-4">
            <label>Posición Traqueal</label>
            <select name="traquea" value={formData.palpacion.traquea} onChange={handleChange}>
              <option value="central">Central (Normal)</option>
              <option value="desviada_d">Desviada Derecha</option>
              <option value="desviada_i">Desviada Izquierda</option>
            </select>
          </div>
          <div className="field-group col-4">
            <label>Expansibilidad Torácica</label>
            <input name="expansibilidad" type="text" placeholder="Ej: Simétrica / Disminuida Base D" value={formData.palpacion.expansibilidad} onChange={handleChange} />
          </div>
          <div className="field-group col-4">
            <label>Frémitos Táctiles</label>
            <select name="fremitos" value={formData.palpacion.fremitos} onChange={handleChange}>
              <option value="normales">Vibraciones Normales</option>
              <option value="aumentados">Aumentados (Condensación)</option>
              <option value="disminuidos">Disminuidos (Derrame/Aire)</option>
              <option value="abolidos">Abolidos</option>
            </select>
          </div>

          <SectionNavigation prevId="inspeccion" nextId="auscultacion" />
        </div>
      )}
    </section>
  );
};
