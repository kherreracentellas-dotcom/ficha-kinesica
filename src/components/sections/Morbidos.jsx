import { ClipboardList, Stethoscope, Pill, Activity } from 'lucide-react';
import { useFormState } from '../../hooks/useFormState';
import { SectionNavigation } from '../SectionNavigation';

export const Morbidos = () => {
  const { formData, setFormData, toggleNA } = useFormState();
  const isNA = formData.naSections.includes('morbidos');

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Si el valor viene de un botón rápido
    if (name === 'enfermedades_cronicas_quick') {
      const current = formData.morbidos.enfermedades_cronicas;
      const newVal = current ? `${current}, ${value}` : value;
      setFormData(prev => ({
        ...prev,
        morbidos: { ...prev.morbidos, enfermedades_cronicas: newVal }
      }));
      return;
    }

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
            <div className="flex flex-wrap gap-2 mt-3">
              {['Asma', 'EPOC', 'HTA', 'Diabetes T2', 'ICC', 'TBC', 'COVID-19'].map(disease => (
                <button 
                  key={disease} 
                  type="button"
                  onClick={() => handleChange({ target: { name: 'enfermedades_cronicas_quick', value: disease } })}
                  className="px-3 py-1 rounded-full border border-slate-200 text-[10px] font-bold text-slate-500 hover:border-accent hover:text-accent hover:bg-indigo-50 transition-all"
                >
                  + {disease}
                </button>
              ))}
            </div>
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

          <div className="col-12 border-t pt-8 mt-4">
            <h3 className="flex items-center gap-2 mb-6 text-primary font-bold"><Pill size={20} className="text-accent" /> Tratamiento Farmacológico y Adherencia</h3>
          </div>
          
          <div className="field-group col-6">
            <label className="flex items-center gap-2 font-bold text-slate-600">
              <Pill size={14} className="text-slate-400" /> Fármacos de Uso Continuo
            </label>
            <textarea name="farmacos.continuo" rows="4" value={formData.morbidos.farmacos.continuo} onChange={handleChange} placeholder="Ej: Corticoides, antihipertensivos, broncodilatadores de larga acción..." />
          </div>
          
          <div className="field-group col-6">
            <label className="flex items-center gap-2 font-bold text-slate-600">
              <Activity size={14} className="text-slate-400" /> Fármacos de Rescate
            </label>
            <textarea name="farmacos.rescate" rows="4" value={formData.morbidos.farmacos.rescate} onChange={handleChange} placeholder="Ej: Salbutamol, Berodual, etc." />
          </div>

          <div className="field-group col-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <label className="font-bold text-primary mb-2">Adherencia</label>
            <select name="farmacos.adherencia" value={formData.morbidos.farmacos.adherencia} onChange={handleChange} className="bg-white">
              <option value="si">Alta Adherencia (Sí)</option>
              <option value="no">Baja Adherencia (No)</option>
              <option value="regular">Regular</option>
            </select>
          </div>
          
          <div className="field-group col-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <label className="font-bold text-primary mb-2">Observaciones de Tratamiento</label>
            <input name="farmacos.dosis" type="text" value={formData.morbidos.farmacos.dosis} onChange={handleChange} placeholder="Dosis, frecuencia o efectos secundarios reportados..." className="bg-white" />
          </div>

          <SectionNavigation prevId="personales" nextId="vitales" />
        </div>
      )}
    </section>
  );
};
