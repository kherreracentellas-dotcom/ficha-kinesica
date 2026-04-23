import { ClipboardList, Stethoscope, Pill } from 'lucide-react';
import { useFormState } from '../../hooks/useFormState';

export const Morbidos = () => {
  const { formData, setFormData, toggleNA } = useFormState();
  const isNA = formData.naSections.includes('morbidos');

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    if (field) {
      setFormData(prev => ({
        ...prev,
        morbidos: {
          ...prev.morbidos,
          [section]: { ...(prev.morbidos[section] || {}), [field]: value }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        morbidos: { ...prev.morbidos, [name]: value }
      }));
    }
  };

  return (
    <section id="morbidos" className={`clinical-section ${isNA ? 'na-active' : ''}`}>
      <div className="section-head">
        <div className="section-title">
          <h2 className="flex items-center gap-2">
            <ClipboardList className="text-accent" size={24} /> II. Antecedentes Mórbidos (Anamnesis)
          </h2>
          <p>Motivo de consulta e historial clínico del paciente.</p>
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
            <textarea name="motivo_consulta" rows="2" value={formData.morbidos.motivo_consulta} onChange={handleChange} placeholder="¿Por qué consulta el paciente?" />
          </div>

          <div className="col-12 border-t pt-4 mt-2">
            <h3 className="flex items-center gap-2 mb-4"><Stethoscope size={18} /> Historial Clínico</h3>
          </div>
          <div className="field-group col-6">
            <label>Médico Tratante</label>
            <input name="médico_tratante" type="text" value={formData.morbidos.médico_tratante} onChange={handleChange} />
          </div>
          <div className="field-group col-6">
            <label>Diagnóstico Médico</label>
            <input name="diagnostico_medico" type="text" value={formData.morbidos.diagnostico_medico} onChange={handleChange} />
          </div>
          <div className="field-group col-12">
            <label>Enfermedades Crónicas</label>
            <textarea name="enfermedades_cronicas" value={formData.morbidos.enfermedades_cronicas} onChange={handleChange} placeholder="Asma, EPOC, HTA, Diabetes, etc." />
          </div>
          <div className="field-group col-6">
            <label>Cirugías Previas</label>
            <textarea name="cirugias_previas" value={formData.morbidos.cirugias_previas} onChange={handleChange} />
          </div>
          <div className="field-group col-6">
            <label>Alergias</label>
            <textarea name="alergias" value={formData.morbidos.alergias} onChange={handleChange} />
          </div>
          <div className="field-group col-12">
            <label>Antecedentes Familiares</label>
            <input name="antecedentes_familiares" type="text" value={formData.morbidos.antecedentes_familiares} onChange={handleChange} placeholder="Cardiopatías, asma, cáncer, etc." />
          </div>

          <div className="col-12 border-t pt-4 mt-2">
            <h3 className="flex items-center gap-2 mb-4"><Pill size={18} /> Tratamiento Farmacológico</h3>
          </div>
          <div className="field-group col-12">
            <label>Fármacos de Uso Continuo</label>
            <textarea name="farmacos.continuo" value={formData.morbidos.farmacos.continuo} onChange={handleChange} placeholder="Ej: corticoides, antihipertensivos..." />
          </div>
          <div className="field-group col-12">
            <label>Fármacos de Rescate</label>
            <textarea name="farmacos.rescate" value={formData.morbidos.farmacos.rescate} onChange={handleChange} placeholder="Ej: Salbutamol..." />
          </div>
          <div className="field-group col-4">
            <label>Adherencia al Tratamiento</label>
            <select name="farmacos.adherencia" value={formData.morbidos.farmacos.adherencia} onChange={handleChange}>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="field-group col-8">
            <label>Dosis / Frecuencia</label>
            <input name="farmacos.dosis" type="text" value={formData.morbidos.farmacos.dosis} onChange={handleChange} />
          </div>
        </div>
      )}
    </section>
  );
};
