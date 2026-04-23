
import { FileText, Image, Beaker } from 'lucide-react';
import { useFormState } from '../../hooks/useFormState';

export const Examenes = () => {
  const { formData, setFormData, toggleNA } = useFormState();
  const isNA = formData.naSections.includes('examenes');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      examenes: { ...(prev.examenes || {}), [name]: value }
    }));
  };

  // Auto-calc PAFI if po2 and fio2 are present
  const po2 = parseFloat(formData.examenes?.gas_po2) || 0;
  const fio2Str = formData.vitales?.fio2 || '21';
  const fio2Num = parseFloat(fio2Str.replace('%', '')) / 100 || 0.21;
  const pafi = (po2 && fio2Num) ? (po2 / fio2Num).toFixed(0) : '--';

  return (
    <section id="examenes" className={`clinical-section ${isNA ? 'na-active' : ''}`}>
      <div className="section-head">
        <div className="section-title">
          <h2 className="flex items-center gap-2">
            <FileText className="text-accent" size={24} /> VIII. Exámenes Complementarios
          </h2>
          <p>Resultados imagenológicos y de laboratorio relevantes.</p>
        </div>
        <button 
          type="button" 
          className={`btn-na ${isNA ? 'active' : ''}`}
          onClick={() => toggleNA('examenes')}
        >
          {isNA ? 'Anular N/A' : 'N/A'}
        </button>
      </div>

      {!isNA && (
        <div className="form-grid">
          <div className="field-group col-12">
            <label className="flex items-center gap-2"><Image size={18} /> Informe de Imagenología (Rx, TAC, Eco)</label>
            <textarea 
              name="imagenologia"
              placeholder="Hallazgos relevantes..."
              value={formData.examenes?.imagenologia || ''}
              onChange={handleChange}
            />
          </div>

          <div className="col-12 border-t pt-1-5 mt-1">
            <h3 className="flex items-center gap-2 mb-2"><Beaker size={18} /> Gases Arteriales (EAB)</h3>
          </div>
          
          <div className="field-group col-3">
            <label>pH</label>
            <input 
              name="gas_ph"
              type="number" 
              step="0.01"
              placeholder="7.35-7.45"
              value={formData.examenes?.gas_ph || ''}
              onChange={handleChange}
            />
          </div>
          <div className="field-group col-3">
            <label>pCO2</label>
            <input 
              name="gas_pco2"
              type="number" 
              placeholder="35-45"
              value={formData.examenes?.gas_pco2 || ''}
              onChange={handleChange}
            />
          </div>
          <div className="field-group col-3">
            <label>pO2</label>
            <input 
              name="gas_po2"
              type="number" 
              placeholder="80-100"
              value={formData.examenes?.gas_po2 || ''}
              onChange={handleChange}
            />
          </div>
          <div className="field-group col-3">
            <label>HCO3-</label>
            <input 
              name="gas_hco3"
              type="number" 
              placeholder="22-26"
              value={formData.examenes?.gas_hco3 || ''}
              onChange={handleChange}
            />
          </div>

          <div className="field-group col-6">
            <div className="p-3 bg-surface rounded font-mono">
              Relación PaO2/FiO2 (PAFI): <span className="font-bold text-accent">{pafi}</span>
              <div className="text-xs text-muted mt-1">Basado en FiO2: {fio2Str}</div>
            </div>
          </div>

          <div className="field-group col-12 mt-1">
            <label>Otros Biomarcadores (BNP, Troponinas, PCR)</label>
            <textarea 
              name="otros_examenes"
              value={formData.examenes?.otros_examenes || ''}
              onChange={handleChange}
            />
          </div>
        </div>
      )}
    </section>
  );
};
