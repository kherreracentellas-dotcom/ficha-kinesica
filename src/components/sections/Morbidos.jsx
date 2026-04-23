
import { ClipboardList } from 'lucide-react';
import { useFormState } from '../../hooks/useFormState';

export const Morbidos = () => {
  const { formData, setFormData, toggleNA } = useFormState();
  const isNA = formData.naSections.includes('morbidos');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      morbidos: { ...(prev.morbidos || {}), [name]: value }
    }));
  };

  return (
    <section id="morbidos" className={`clinical-section ${isNA ? 'na-active' : ''}`}>
      <div className="section-head">
        <div className="section-title">
          <h2 className="flex items-center gap-2">
            <ClipboardList className="text-accent" size={24} /> III. Antecedentes Mórbidos
          </h2>
          <p>Anamnesis clínica y tratamiento actual.</p>
        </div>
        <button 
          type="button" 
          className={`btn-na ${isNA ? 'active' : ''}`}
          onClick={() => toggleNA('morbidos')}
        >
          {isNA ? 'Anular N/A' : 'N/A'}
        </button>
      </div>

      {!isNA && (
        <div className="form-grid">
          <div className="field-group col-12">
            <label>Motivo de Consulta</label>
            <textarea 
              name="motivo_consulta"
              placeholder="Breve descripción del problema actual..."
              value={formData.morbidos?.motivo_consulta || ''}
              onChange={handleChange}
            />
          </div>

          <div className="field-group col-6">
            <label>Médico Tratante</label>
            <input 
              name="medico_tratante"
              type="text" 
              value={formData.morbidos?.medico_tratante || ''}
              onChange={handleChange}
            />
          </div>

          <div className="field-group col-12">
            <label>Diagnóstico Médico</label>
            <input 
              name="diagnostico_medico"
              type="text" 
              value={formData.morbidos?.diagnostico_medico || ''}
              onChange={handleChange}
            />
          </div>

          <div className="field-group col-12">
            <label>Enfermedades Crónicas</label>
            <textarea 
              name="enfermedades_cronicas"
              value={formData.morbidos?.enfermedades_cronicas || ''}
              onChange={handleChange}
            />
          </div>

          <div className="field-group col-12">
            <label>Cirugías Previas</label>
            <input 
              name="cirugias_previas"
              type="text" 
              value={formData.morbidos?.cirugias_previas || ''}
              onChange={handleChange}
            />
          </div>

          <div className="col-12 border-t pt-1-5 mt-1">
            <h3>Tratamiento Farmacológico</h3>
          </div>

          <div className="field-group col-12">
            <label>Fármacos de uso continuo</label>
            <textarea 
              name="farmacos_continuo"
              value={formData.morbidos?.farmacos_continuo || ''}
              onChange={handleChange}
            />
          </div>

          <div className="field-group col-12">
            <label>Fármacos de rescate</label>
            <textarea 
              name="farmacos_rescate"
              value={formData.morbidos?.farmacos_rescate || ''}
              onChange={handleChange}
            />
          </div>

          <div className="field-group col-6">
            <label>Adherencia al tratamiento</label>
            <select 
              name="adherencia"
              value={formData.morbidos?.adherencia || 'si'}
              onChange={handleChange}
            >
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="field-group col-6">
            <label>Dosis / Frecuencia</label>
            <input 
              name="farmaco_dosis"
              type="text" 
              value={formData.morbidos?.farmaco_dosis || ''}
              onChange={handleChange}
            />
          </div>
        </div>
      )}
    </section>
  );
};
