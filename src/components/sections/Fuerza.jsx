
import { Dumbbell, Hand } from 'lucide-react';
import { useFormState } from '../../hooks/useFormState';

export const Fuerza = () => {
  const { formData, setFormData, toggleNA } = useFormState();
  const isNA = formData.naSections.includes('fuerza');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      fuerza: { ...(prev.fuerza || {}), [name]: value }
    }));
  };

  return (
    <section id="fuerza" className={`clinical-section ${isNA ? 'na-active' : ''}`}>
      <div className="section-head">
        <div className="section-title">
          <h2 className="flex items-center gap-2">
            <Dumbbell className="text-accent" size={24} /> XII. Fuerza Muscular Periférica
          </h2>
          <p>Evaluación de potencia y funcionalidad muscular.</p>
        </div>
        <button 
          type="button" 
          className={`btn-na ${isNA ? 'active' : ''}`}
          onClick={() => toggleNA('fuerza')}
        >
          {isNA ? 'Anular N/A' : 'N/A'}
        </button>
      </div>

      {!isNA && (
        <div className="form-grid">
          <div className="field-group col-6">
            <label className="flex items-center gap-2"><Hand size={18} /> Dinamometría Handgrip (kg)</label>
            <input 
              name="handgrip"
              type="number" 
              step="0.1"
              placeholder="Mano dominante"
              value={formData.fuerza?.handgrip || ''}
              onChange={handleChange}
            />
          </div>

          <div className="field-group col-6">
            <label className="flex items-center gap-2">Fuerza Cuádriceps (MRC)</label>
            <select 
              name="cuadriceps"
              value={formData.fuerza?.cuadriceps || '5'}
              onChange={handleChange}
            >
              <option value="5">5/5 - Fuerza Normal</option>
              <option value="4">4/5 - Contra Resistencia</option>
              <option value="3">3/5 - Contra Gravedad</option>
              <option value="2">2/5 - Sin Gravedad</option>
              <option value="1">1/5 - Contracción visible</option>
              <option value="0">0/5 - Parálisis</option>
            </select>
          </div>
        </div>
      )}
    </section>
  );
};
