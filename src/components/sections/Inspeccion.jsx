import { Eye } from 'lucide-react';
import { useFormState } from '../../hooks/useFormState';

export const Inspeccion = () => {
  const { formData, setFormData, toggleNA } = useFormState();
  const isNA = formData.naSections.includes('inspeccion');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle nested tos fields
    if (name.includes('tos.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        inspeccion: { 
          ...prev.inspeccion, 
          tos: { ...prev.inspeccion.tos, [field]: value } 
        }
      }));
      return;
    }

    if (type === 'checkbox') {
      const currentArr = formData.inspeccion.tiraje || [];
      const newArr = checked ? [...currentArr, value] : currentArr.filter(v => v !== value);
      setFormData(prev => ({ ...prev, inspeccion: { ...prev.inspeccion, tiraje: newArr } }));
    } else {
      setFormData(prev => ({ ...prev, inspeccion: { ...prev.inspeccion, [name]: value } }));
    }
  };

  return (
    <section id="inspeccion" className={`clinical-section ${isNA ? 'na-active' : ''}`}>
      <div className="section-head">
        <div className="section-title">
          <h2 className="flex items-center gap-2">
            <Eye className="text-accent" size={24} /> IV. Inspección (Observación)
          </h2>
          <p>Evaluación visual del tórax y signos clínicos agudos.</p>
        </div>
        <button type="button" className={`btn-na ${isNA ? 'active' : ''}`} onClick={() => toggleNA('inspeccion')}>
          {isNA ? 'Anular N/A' : 'N/A'}
        </button>
      </div>

      {!isNA && (
        <div className="form-grid">
          {/* Evaluación Torácica */}
          <div className="col-12">
            <h3 className="text-sm mb-4">Evaluación Torácica</h3>
          </div>
          <div className="field-group col-4">
            <label>Tipo de Tórax</label>
            <select name="tipo_torax" value={formData.inspeccion.tipo_torax} onChange={handleChange}>
              <option value="normotorax">Normotórax</option>
              <option value="cifoescoliotico">Cifoescoliótico</option>
              <option value="tonel">Tonel (Enfisematoso)</option>
              <option value="raquitico">Raquítico</option>
              <option value="excavatum">Pectus Excavatum</option>
              <option value="carinatum">Pectus Carinatum</option>
            </select>
          </div>
          <div className="field-group col-4">
            <label>Patrón Respiratorio</label>
            <select name="patron_respiratorio" value={formData.inspeccion.patron_respiratorio} onChange={handleChange}>
              <option value="costal">Costal</option>
              <option value="abdominal">Abdominal</option>
              <option value="mixto">Mixto</option>
              <option value="paradojico">Paradójico</option>
            </select>
          </div>
          <div className="field-group col-4">
            <label>Uso Musc. Accesoria</label>
            <select name="uso_musculatura" value={formData.inspeccion.uso_musculatura} onChange={handleChange}>
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
          </div>

          {formData.inspeccion.uso_musculatura === 'si' && (
            <div className="field-group col-12 bg-surface p-3 rounded flex gap-4">
              <span className="text-xs font-bold">Tiraje:</span>
              {['Subcostal', 'Intercostal', 'Supraclavicular'].map(t => (
                <label key={t} className="flex items-center gap-2 text-xs normal-case cursor-pointer">
                  <input type="checkbox" value={t} checked={formData.inspeccion.tiraje.includes(t)} onChange={handleChange} /> {t}
                </label>
              ))}
            </div>
          )}

          {/* Signos Clínicos */}
          <div className="col-12 border-t pt-4 mt-2">
            <h3 className="text-sm mb-4">Signos Clínicos y Síntomas</h3>
          </div>
          <div className="field-group col-4">
            <label>Cianosis</label>
            <select name="cianosis" value={formData.inspeccion.cianosis} onChange={handleChange}>
              <option value="no">No</option>
              <option value="peribucal">Peribucal</option>
              <option value="periferica">Periférica</option>
              <option value="mixta">Mixta</option>
            </select>
          </div>
          <div className="field-group col-4">
            <label>Coriza Nasal</label>
            <select name="coriza" value={formData.inspeccion.coriza} onChange={handleChange}>
              <option value="no">No</option>
              <option value="hialina">Hialina</option>
              <option value="mucopurulenta">Mucopurulenta</option>
            </select>
          </div>
          <div className="field-group col-4">
            <label>Disnea Aparición</label>
            <select name="disnea_aparicion" value={formData.inspeccion.disnea_aparicion} onChange={handleChange}>
              <option value="reposo">En reposo</option>
              <option value="esfuerzo">Al esfuerzo</option>
            </select>
          </div>
          <div className="field-group col-2">
            <label>Grado mMRC</label>
            <input name="disnea_mmrc" type="number" min="0" max="4" placeholder="0-4" value={formData.inspeccion.disnea_mmrc} onChange={handleChange} />
          </div>
          <div className="field-group col-2">
            <label>Fatiga Borg</label>
            <input name="fatiga_borg" type="number" min="0" max="10" placeholder="0-10" value={formData.inspeccion.fatiga_borg} onChange={handleChange} />
          </div>

          {/* Evaluación de la Tos */}
          <div className="col-12 border-t pt-4 mt-2">
            <h3 className="text-sm mb-4">Evaluación de la Tos</h3>
          </div>
          <div className="field-group col-3">
            <label>¿Presenta Tos?</label>
            <select name="tos.presenta" value={formData.inspeccion.tos.presenta} onChange={handleChange}>
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
          </div>
          <div className="field-group col-3">
            <label>Horario</label>
            <select name="tos.horario" value={formData.inspeccion.tos.horario} onChange={handleChange}>
              <option value="diurna">Diurna</option>
              <option value="nocturna">Nocturna</option>
              <option value="continua">Continua</option>
            </select>
          </div>
          <div className="field-group col-3">
            <label>Característica</label>
            <select name="tos.caracter" value={formData.inspeccion.tos.caracter} onChange={handleChange}>
              <option value="seca">Seca</option>
              <option value="productiva">Productiva</option>
            </select>
          </div>
          <div className="field-group col-3">
            <label>Tipo Secreción</label>
            <select name="tos.secrecion" value={formData.inspeccion.tos.secrecion} onChange={handleChange}>
              <option value="serosa">Serosa</option>
              <option value="mucosa">Mucosa</option>
              <option value="mucopurulenta">Mucopurulenta</option>
              <option value="purulenta">Purulenta</option>
              <option value="hemoptoica">Hemoptoica</option>
            </select>
          </div>
        </div>
      )}
    </section>
  );
};
