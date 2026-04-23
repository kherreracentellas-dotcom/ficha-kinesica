
import { Stethoscope, Heart, Waves } from 'lucide-react';
import { useFormState } from '../../hooks/useFormState';

export const Auscultacion = () => {
  const { formData, setFormData, toggleNA } = useFormState();
  const isNA = formData.naSections.includes('auscultacion');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
        const currentArr = formData.auscultacion?.[name] || [];
        const newArr = checked ? [...currentArr, value] : currentArr.filter(v => v !== value);
        setFormData(prev => ({
            ...prev,
            auscultacion: { ...(prev.auscultacion || {}), [name]: newArr }
        }));
    } else {
        setFormData(prev => ({
            ...prev,
            auscultacion: { ...(prev.auscultacion || {}), [name]: value }
        }));
    }
  };

  return (
    <section id="auscultacion" className={`clinical-section ${isNA ? 'na-active' : ''}`}>
      <div className="section-head">
        <div className="section-title">
          <h2 className="flex items-center gap-2">
            <Stethoscope className="text-accent" size={24} /> VII. Percusión y Auscultación
          </h2>
          <p>Evaluación acústica de parénquima pulmonar y precordial.</p>
        </div>
        <button 
          type="button" 
          className={`btn-na ${isNA ? 'active' : ''}`}
          onClick={() => toggleNA('auscultacion')}
        >
          {isNA ? 'Anular N/A' : 'N/A'}
        </button>
      </div>

      {!isNA && (
        <div className="form-grid">
          <div className="col-12">
            <h3 className="flex items-center gap-2 mb-2"><Waves size={18} /> Percusión Pulmonar</h3>
            <div className="form-grid">
              <div className="field-group col-6">
                <label>Hemitórax Izquierdo</label>
                <select name="percusion_izq" value={formData.auscultacion?.percusion_izq || 'sonoridad'} onChange={handleChange}>
                  <option value="sonoridad">Sonoridad (Normal)</option>
                  <option value="hipersonoridad">Hipersonoridad</option>
                  <option value="matidez">Matidez</option>
                  <option value="timpanismo">Timpanismo</option>
                </select>
              </div>
              <div className="field-group col-6">
                <label>Hemitórax Derecho</label>
                <select name="percusion_der" value={formData.auscultacion?.percusion_der || 'sonoridad'} onChange={handleChange}>
                  <option value="sonoridad">Sonoridad (Normal)</option>
                  <option value="hipersonoridad">Hipersonoridad</option>
                  <option value="matidez">Matidez</option>
                  <option value="timpanismo">Timpanismo</option>
                </select>
              </div>
            </div>
          </div>

          <div className="col-12 border-t pt-1-5 mt-1">
            <h3 className="flex items-center gap-2 mb-2"><Stethoscope size={18} /> Auscultación Pulmonar</h3>
          </div>
          <div className="field-group col-4">
            <label>Murmullo Pulmonar</label>
            <select name="murmullo" value={formData.auscultacion?.murmullo || 'normal'} onChange={handleChange}>
              <option value="normal">Normal / (+) Conservado</option>
              <option value="disminuido">Disminuido</option>
              <option value="abolido">Abolido</option>
              <option value="aumentado">Aumentado</option>
            </select>
          </div>

          <div className="field-group col-12">
            <label>Ruidos Agregados</label>
            <div className="flex flex-wrap gap-3">
              {['Sibilancias', 'Roncus', 'Estridor', 'Crépitos Finos', 'Crépitos Gruesos', 'Frote Pleural'].map(r => (
                <label key={r} className="checkbox-card flex items-center gap-2 p-2 border rounded cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="ruidos_agregados" 
                    value={r}
                    checked={(formData.auscultacion?.ruidos_agregados || []).includes(r)}
                    onChange={handleChange}
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="col-12 border-t pt-1-5 mt-1">
            <h3 className="flex items-center gap-2 mb-2"><Heart size={18} /> Auscultación Cardíaca</h3>
          </div>
          <div className="field-group col-12">
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  name="cardiaco_soplo" 
                  checked={formData.auscultacion?.cardiaco_soplo || false}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    auscultacion: { ...(prev.auscultacion || {}), cardiaco_soplo: e.target.checked }
                  }))}
                />
                <span>Presencia de Soplos</span>
              </label>
            </div>
          </div>

          {formData.auscultacion?.cardiaco_soplo && (
            <div className="field-group col-12 bg-surface p-3 rounded">
                <div className="form-grid m-0">
                    <div className="field-group col-4">
                        <label>Grado Levine</label>
                        <select name="levine_grado" value={formData.auscultacion?.levine_grado || '1'} onChange={handleChange}>
                            <option value="1">I/VI</option>
                            <option value="2">II/VI</option>
                            <option value="3">III/VI</option>
                            <option value="4">IV/VI</option>
                        </select>
                    </div>
                    <div className="field-group col-8">
                        <label>Foco</label>
                        <input name="soplo_foco" type="text" placeholder="Ej: Mitral" value={formData.auscultacion?.soplo_foco || ''} onChange={handleChange} />
                    </div>
                </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
