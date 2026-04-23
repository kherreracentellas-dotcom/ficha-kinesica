
import { Users } from 'lucide-react';
import { useFormState } from '../../hooks/useFormState';

export const Biopsicosociales = () => {
  const { formData, setFormData, toggleNA } = useFormState();
  const isNA = formData.naSections.includes('biopsicosociales');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      biopsicosociales: { ...(prev.biopsicosociales || {}), [name]: value }
    }));
  };

  const ica = (formData.biopsicosociales?.tabaco_cantidad || 0) * (formData.biopsicosociales?.tabaco_anos || 0) / 20;

  return (
    <section id="biopsicosociales" className={`clinical-section ${isNA ? 'na-active' : ''}`}>
      <div className="section-head">
        <div className="section-title">
          <h2 className="flex items-center gap-2">
            <Users className="text-accent" size={24} /> II. Antecedentes Biopsicosociales
          </h2>
          <p>Entorno, esquema familiar y hábitos de consumo del paciente.</p>
        </div>
        <button 
          type="button" 
          className={`btn-na ${isNA ? 'active' : ''}`}
          onClick={() => toggleNA('biopsicosociales')}
        >
          {isNA ? 'Anular N/A' : 'N/A'}
        </button>
      </div>

      {!isNA && (
        <div className="form-grid">
          <div className="col-12 mt-1"><label>Núcleo Familiar</label></div>
          <div className="col-12 check-group flex gap-4">
            {['V.S. (Vive Solo)', 'V.A. (Acompañado)', 'V.P. (Pareja)'].map(val => (
              <label key={val} className="checkbox-card flex items-center gap-2 p-2 border rounded cursor-pointer">
                <input 
                  type="radio" 
                  name="nucleo_familiar" 
                  value={val}
                  checked={formData.biopsicosociales?.nucleo_familiar === val}
                  onChange={handleChange}
                />
                <span>{val}</span>
              </label>
            ))}
          </div>
          
          <div className="field-group col-12">
            <label>Especificar otro / Observaciones entorno</label>
            <input 
              name="nucleo_especificar"
              type="text" 
              value={formData.biopsicosociales?.nucleo_especificar || ''}
              onChange={handleChange}
            />
          </div>

          <div className="field-group col-6">
            <label>Tipo de Vivienda</label>
            <input 
              name="tipo_vivienda"
              type="text" 
              value={formData.biopsicosociales?.tipo_vivienda || ''}
              onChange={handleChange}
            />
          </div>

          <div className="field-group col-6">
            <label>¿Tiene Mascotas?</label>
            <select 
              name="mascotas"
              value={formData.biopsicosociales?.mascotas || 'no'}
              onChange={handleChange}
            >
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
          </div>

          {formData.biopsicosociales?.mascotas === 'si' && (
            <div className="field-group col-12">
              <label>Especificar ambiente mascotas</label>
              <input 
                name="mascotas_especificar"
                type="text" 
                placeholder="Ej: Perro dentro de casa"
                value={formData.biopsicosociales?.mascotas_especificar || ''}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="col-12 border-t pt-1-5 mt-1">
            <h3>Hábitos de Consumo</h3>
          </div>

          <div className="field-group col-4">
            <label>¿Tabaquismo?</label>
            <select 
              name="tabaquismo"
              value={formData.biopsicosociales?.tabaquismo || 'no'}
              onChange={handleChange}
            >
              <option value="no">No / Ex-fumador</option>
              <option value="si">Sí (Activo)</option>
            </select>
          </div>

          {formData.biopsicosociales?.tabaquismo === 'si' && (
            <>
              <div className="field-group col-4">
                <label>Cig/día</label>
                <input 
                  name="tabaco_cantidad"
                  type="number" 
                  value={formData.biopsicosociales?.tabaco_cantidad || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="field-group col-4">
                <label>Años fumando</label>
                <input 
                  name="tabaco_anos"
                  type="number" 
                  value={formData.biopsicosociales?.tabaco_anos || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="field-group col-12">
                <div className="p-3 bg-surface rounded font-mono text-sm">
                  Índice Cajetilla-Año: <span className="font-bold text-accent">{ica.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}

          <div className="field-group col-6">
            <label>¿Realiza actividad física?</label>
            <select 
              name="actividad"
              value={formData.biopsicosociales?.actividad || 'no'}
              onChange={handleChange}
            >
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
          </div>

          {formData.biopsicosociales?.actividad === 'si' && (
            <div className="col-12 form-grid m-0">
              <div className="field-group col-6">
                <label>Tipo de ejercicio</label>
                <input 
                  name="ejercicio_tipo"
                  type="text" 
                  value={formData.biopsicosociales?.ejercicio_tipo || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="field-group col-3">
                <label>Veces x semana</label>
                <input 
                  name="ejercicio_frecuencia"
                  type="number" 
                  value={formData.biopsicosociales?.ejercicio_frecuencia || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="field-group col-3">
                <label>Intensidad (Borg)</label>
                <input 
                  name="ejercicio_intensidad"
                  type="number" 
                  step="0.1"
                  value={formData.biopsicosociales?.ejercicio_intensidad || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
