
import { Stethoscope, Heart, Waves, Music } from 'lucide-react';
import { useFormState } from '../../hooks/useFormState';

export const Auscultacion = () => {
  const { formData, setFormData, toggleNA } = useFormState();
  const isNA = formData.naSections.includes('auscultacion');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const currentArr = formData.auscultacion[name] || [];
      const newArr = checked ? [...currentArr, value] : currentArr.filter(v => v !== value);
      setFormData(prev => ({
        ...prev,
        auscultacion: { ...prev.auscultacion, [name]: newArr }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        auscultacion: { ...prev.auscultacion, [name]: value }
      }));
    }
  };

  return (
    <section id="auscultacion" className={`clinical-section ${isNA ? 'na-active' : ''}`}>
      <div className="section-head">
        <div className="section-title">
          <h2 className="flex items-center gap-2">
            <Stethoscope className="text-accent" size={24} /> VI. Percusión y Auscultación
          </h2>
          <p>Evaluación acústica de parénquima pulmonar y precordial.</p>
        </div>
        <button type="button" className={`btn-na ${isNA ? 'active' : ''}`} onClick={() => toggleNA('auscultacion')}>
          {isNA ? 'Anular N/A' : 'N/A'}
        </button>
      </div>

      {!isNA && (
        <div className="form-grid">
          {/* Percusión */}
          <div className="col-12">
            <h3 className="text-sm mb-4 flex items-center gap-2"><Waves size={16} /> Percusión</h3>
          </div>
          <div className="field-group col-6">
            <label>Hemitórax Izquierdo</label>
            <select name="percusion_izq" value={formData.auscultacion.percusion_izq} onChange={handleChange}>
              <option value="sonoridad">Sonoridad (Normal)</option>
              <option value="hipersonoridad">Hipersonoridad (Timpanismo)</option>
              <option value="matidez">Matidez</option>
            </select>
          </div>
          <div className="field-group col-6">
            <label>Hemitórax Derecho</label>
            <select name="percusion_der" value={formData.auscultacion.percusion_der} onChange={handleChange}>
              <option value="sonoridad">Sonoridad (Normal)</option>
              <option value="hipersonoridad">Hipersonoridad (Timpanismo)</option>
              <option value="matidez">Matidez</option>
            </select>
          </div>

          {/* Auscultación Pulmonar */}
          <div className="col-12 border-t pt-4 mt-2">
            <h3 className="text-sm mb-4 flex items-center gap-2"><Music size={16} /> Auscultación Pulmonar</h3>
          </div>
          <div className="field-group col-4">
            <label>Murmullo Pulmonar</label>
            <select name="murmullo" value={formData.auscultacion.murmullo} onChange={handleChange}>
              <option value="conservado">(+) Conservado</option>
              <option value="disminuido">Disminuido</option>
              <option value="abolido">Abolido</option>
            </select>
          </div>
          <div className="field-group col-4">
            <label>Zonas Afectadas</label>
            <input name="murmullo_zonas" type="text" placeholder="Ej: Basal izq..." value={formData.auscultacion.murmullo_zonas} onChange={handleChange} />
          </div>
          <div className="field-group col-4">
            <label>Laringotraqueal</label>
            <select name="laringotraqueal" value={formData.auscultacion.laringotraqueal} onChange={handleChange}>
              <option value="normal">Normal</option>
              <option value="alterada">Alterada</option>
            </select>
          </div>
          <div className="field-group col-4">
            <label>Resonancia Vocal</label>
            <select name="resonancia_vocal" value={formData.auscultacion.resonancia_vocal} onChange={handleChange}>
              <option value="normal">Normal ("99" claro)</option>
              <option value="aumentada">Aumentada (Broncofonía)</option>
              <option value="disminuida">Disminuida</option>
            </select>
          </div>

          <div className="field-group col-12">
            <label>Ruidos Agregados Continuos</label>
            <div className="flex gap-4">
              {['Sibilancias', 'Roncus', 'Estridor'].map(r => (
                <label key={r} className="flex items-center gap-2 text-xs normal-case cursor-pointer">
                  <input type="checkbox" name="ruidos_continuos" value={r} checked={formData.auscultacion.ruidos_continuos.includes(r)} onChange={handleChange} /> {r}
                </label>
              ))}
            </div>
          </div>
          <div className="field-group col-12">
            <label>Ruidos Agregados Discontinuos</label>
            <div className="flex gap-4">
              {['Crépitos Finos (fin insp.)', 'Crépitos Gruesos (inicio insp.)'].map(r => (
                <label key={r} className="flex items-center gap-2 text-xs normal-case cursor-pointer">
                  <input type="checkbox" name="ruidos_discontinuos" value={r} checked={formData.auscultacion.ruidos_discontinuos.includes(r)} onChange={handleChange} /> {r}
                </label>
              ))}
            </div>
          </div>

          {/* Auscultación Cardíaca */}
          <div className="col-12 border-t pt-4 mt-2">
            <h3 className="text-sm mb-4 flex items-center gap-2"><Heart size={16} /> Auscultación Precordial</h3>
          </div>
          <div className="field-group col-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.auscultacion.cardiaco_ritmico} onChange={(e) => setFormData(prev => ({ ...prev, auscultacion: { ...prev.auscultacion, cardiaco_ritmico: e.target.checked } }))} />
              <span>Ruidos cardíacos rítmicos y normales</span>
            </label>
          </div>
          <div className="field-group col-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.auscultacion.cardiaco_soplo} onChange={(e) => setFormData(prev => ({ ...prev, auscultacion: { ...prev.auscultacion, cardiaco_soplo: e.target.checked } }))} />
              <span>Soplos detectados</span>
            </label>
          </div>

          {formData.auscultacion.cardiaco_soplo && (
            <div className="field-group col-12 bg-surface p-3 rounded">
              <label>Grado Escala Levine (1-6)</label>
              <input name="levine_grado" type="number" min="1" max="6" value={formData.auscultacion.levine_grado} onChange={handleChange} />
            </div>
          )}
        </div>
      )}
    </section>
  );
};
