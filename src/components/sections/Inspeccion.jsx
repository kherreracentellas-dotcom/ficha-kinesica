
import { Eye } from 'lucide-react';
import { useFormState } from '../../hooks/useFormState';

export const Inspeccion = () => {
  const { formData, setFormData, toggleNA } = useFormState();
  const isNA = formData.naSections.includes('inspeccion');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
        const currentArr = formData.inspeccion?.[name] || [];
        const newArr = checked ? [...currentArr, value] : currentArr.filter(v => v !== value);
        setFormData(prev => ({
            ...prev,
            inspeccion: { ...(prev.inspeccion || {}), [name]: newArr }
        }));
    } else {
        setFormData(prev => ({
            ...prev,
            inspeccion: { ...(prev.inspeccion || {}), [name]: value }
        }));
    }
  };

  return (
    <section id="inspeccion" className={`clinical-section ${isNA ? 'na-active' : ''}`}>
      <div className="section-head">
        <div className="section-title">
          <h2 className="flex items-center gap-2">
            <Eye className="text-accent" size={24} /> V. Inspección (Observación)
          </h2>
          <p>Análisis visual torácico y sintomatología aguda.</p>
        </div>
        <button 
          type="button" 
          className={`btn-na ${isNA ? 'active' : ''}`}
          onClick={() => toggleNA('inspeccion')}
        >
          {isNA ? 'Anular N/A' : 'N/A'}
        </button>
      </div>

      {!isNA && (
        <div className="form-grid">
          <div className="field-group col-12">
            <label>Tipo de Tórax</label>
            <div className="check-group flex flex-wrap gap-3">
              {['Normotórax', 'Cifoescoliótico', 'Tonel', 'Raquítico', 'Excavatum', 'Carinatum'].map(t => (
                <label key={t} className="checkbox-card flex items-center gap-2 p-2 border rounded cursor-pointer">
                  <input 
                    type="radio" 
                    name="tipo_torax" 
                    value={t}
                    checked={formData.inspeccion?.tipo_torax === t}
                    onChange={handleChange}
                  />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="field-group col-6">
            <label>Patrón Respiratorio</label>
            <select name="patron_respiratorio" value={formData.inspeccion?.patron_respiratorio || ''} onChange={handleChange}>
              <option value="">Seleccionar...</option>
              <option value="costal">Costal</option>
              <option value="abdominal">Abdominal</option>
              <option value="mixto">Mixto</option>
              <option value="paradojico">Paradójico</option>
            </select>
          </div>

          <div className="field-group col-6">
            <label>Uso de Musculatura Accesoria</label>
            <select name="muscultura_accesoria" value={formData.inspeccion?.muscultura_accesoria || 'no'} onChange={handleChange}>
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
          </div>

          {formData.inspeccion?.muscultura_accesoria === 'si' && (
            <div className="field-group col-12">
              <label>Tipo de Tiraje</label>
              <div className="flex gap-4">
                {['Subcostal', 'Intercostal', 'Supraclavicular'].map(tiraje => (
                  <label key={tiraje} className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      name="tiraje" 
                      value={tiraje}
                      checked={(formData.inspeccion?.tiraje || []).includes(tiraje)}
                      onChange={handleChange}
                    />
                    <span>{tiraje}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="col-12 border-t pt-1-5 mt-1">
            <h3>Tos y Secreciones</h3>
          </div>

          <div className="field-group col-6">
            <label>¿Presenta tos?</label>
            <select name="tos_presenta" value={formData.inspeccion?.tos_presenta || 'no'} onChange={handleChange}>
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
          </div>

          {formData.inspeccion?.tos_presenta === 'si' && (
            <>
              <div className="field-group col-3">
                <label>Características</label>
                <select name="tos_tipo" value={formData.inspeccion?.tos_tipo || ''} onChange={handleChange}>
                  <option value="seca">Seca</option>
                  <option value="productiva">Productiva</option>
                </select>
              </div>
              {formData.inspeccion?.tos_tipo === 'productiva' && (
                <div className="field-group col-3">
                  <label>Secreción</label>
                  <select name="tos_secrecion_tipo" value={formData.inspeccion?.tos_secrecion_tipo || ''} onChange={handleChange}>
                    <option value="serosa">Serosa</option>
                    <option value="mucosa">Mucosa</option>
                    <option value="mucopurulenta">Mucopurulenta</option>
                    <option value="purulenta">Purulenta</option>
                    <option value="hemoptoica">Hemoptoica</option>
                  </select>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
};
