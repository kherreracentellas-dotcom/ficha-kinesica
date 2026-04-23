import { User } from 'lucide-react';
import { useFormState } from '../../hooks/useFormState';

export const Personales = () => {
  const { formData, setFormData, toggleNA } = useFormState();
  const isNA = formData.naSections.includes('personales');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      paciente: { ...prev.paciente, [name]: value }
    }));
  };

  return (
    <section id="personales" className={`clinical-section ${isNA ? 'na-active' : ''}`}>
      <div className="section-head">
        <div className="section-title">
          <h2 className="flex items-center gap-2">
            <User className="text-accent" size={24} /> Antecedentes Personales
          </h2>
          <p>Información básica y datos de contacto del paciente.</p>
        </div>
        <button 
          type="button" 
          className={`btn-na ${isNA ? 'active' : ''}`}
          onClick={() => toggleNA('personales')}
        >
          {isNA ? 'Anular N/A' : 'N/A'}
        </button>
      </div>

      {!isNA && (
        <div className="form-grid">
          <div className="field-group col-6">
            <label>Nombre Completo</label>
            <input 
              name="nombre"
              type="text" 
              placeholder="Ej: Juan Pérez"
              value={formData.paciente.nombre}
              onChange={handleChange}
            />
          </div>
          <div className="field-group col-3">
            <label>RUT</label>
            <input 
              name="rut"
              type="text" 
              placeholder="12.345.678-9"
              value={formData.paciente.rut}
              onChange={handleChange}
            />
          </div>
          <div className="field-group col-3">
            <label>Edad</label>
            <input 
              name="edad"
              type="number" 
              placeholder="Años"
              value={formData.paciente.edad}
              onChange={handleChange}
            />
          </div>
          <div className="field-group col-12">
            <label>Diagnóstico Médico</label>
            <textarea 
              name="diagnostico_medico"
              rows="2" 
              placeholder="Ingrese diagnóstico clínico..."
              value={formData.paciente.diagnostico_medico}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
      )}
    </section>
  );
};
