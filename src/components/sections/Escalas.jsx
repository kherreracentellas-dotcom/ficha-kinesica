import { Gauge, Activity, TrendingUp, FlaskConical, Image as ImageIcon, FileText, ClipboardList } from 'lucide-react';
import { useFormState } from '../../hooks/useFormState';

export const Escalas = () => {
  const { formData, setFormData, toggleNA } = useFormState();
  const isNA = formData.naSections.includes('escalas');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      escalas: { ...(prev.escalas || {}), [name]: value }
    }));
  };

  return (
    <section id="escalas" className={`clinical-section ${isNA ? 'na-active' : ''}`}>
      <div className="section-head">
        <div className="section-title">
          <h2 className="flex items-center gap-2">
            <Gauge className="text-accent" size={24} /> VII. Exámenes, Escalas y Pruebas Funcionales
          </h2>
          <p>Objetivación de gravedad, capacidad funcional y resultados de laboratorio/imagen.</p>
        </div>
        <button type="button" className={`btn-na ${isNA ? 'active' : ''}`} onClick={() => toggleNA('escalas')}>
          {isNA ? 'Anular N/A' : 'N/A'}
        </button>
      </div>

      {!isNA && (
        <div className="form-grid">
          {/* A. Estratificación de Gravedad */}
          <div className="col-12">
            <h3 className="text-sm mb-4 flex items-center gap-2 text-primary font-bold border-b pb-2">
              <TrendingUp size={18} /> A. Estratificación de Gravedad
            </h3>
          </div>
          
          <div className="field-group col-4 bg-surface p-3 rounded">
            <label>Score de Tal (Pediatría)</label>
            <div className="flex items-center gap-2 mt-1">
              <input name="tal_puntaje" type="number" placeholder="Ptos" value={formData.escalas.tal_puntaje} onChange={handleChange} />
              <select name="tal_gravedad" value={formData.escalas.tal_gravedad} onChange={handleChange} className="text-xs">
                <option value="">Gravedad...</option>
                <option value="leve">Leve</option>
                <option value="moderada">Moderada</option>
                <option value="grave">Grave</option>
              </select>
            </div>
          </div>

          <div className="field-group col-4 bg-surface p-3 rounded">
            <label>Wood-Downes-Ferrés</label>
            <input name="wood_puntaje" type="number" placeholder="Ptos" value={formData.escalas.wood_puntaje} onChange={handleChange} />
            <input name="wood_interpretacion" type="text" placeholder="Interpretación" value={formData.escalas.wood_interpretacion} onChange={handleChange} className="mt-2 text-xs" />
          </div>

          <div className="field-group col-4 bg-surface p-3 rounded">
            <label>Índice BODE (EPOC)</label>
            <input name="bode_puntaje" type="number" placeholder="Ptos" value={formData.escalas.bode_puntaje} onChange={handleChange} />
            <input name="bode_riesgo" type="text" placeholder="Riesgo mortalidad" value={formData.escalas.bode_riesgo} onChange={handleChange} className="mt-2 text-xs" />
          </div>

          {/* B. Exámenes Complementarios */}
          <div className="col-12 mt-4">
            <h3 className="text-sm mb-4 flex items-center gap-2 text-primary font-bold border-b pb-2">
              <FlaskConical size={18} /> B. Exámenes Complementarios
            </h3>
          </div>

          <div className="col-12 bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-4 shadow-inner">
            <label className="font-bold text-xs mb-4 block uppercase tracking-widest text-slate-500 border-b pb-2">Gasometría Arterial</label>
            <div className="grid grid-cols-5 gap-4">
              <div className="field-group">
                <label className="text-[10px]">pH</label>
                <input name="gas_ph" type="number" step="0.01" value={formData.escalas.gas_ph} onChange={handleChange} className="bg-white" />
              </div>
              <div className="field-group">
                <label className="text-[10px]">PaO2</label>
                <input name="gas_pao2" type="number" value={formData.escalas.gas_pao2} onChange={handleChange} className="bg-white" />
              </div>
              <div className="field-group">
                <label className="text-[10px]">PaCO2</label>
                <input name="gas_paco2" type="number" value={formData.escalas.gas_paco2} onChange={handleChange} className="bg-white" />
              </div>
              <div className="field-group">
                <label className="text-[10px]">HCO3</label>
                <input name="gas_hco3" type="number" step="0.1" value={formData.escalas.gas_hco3} onChange={handleChange} className="bg-white" />
              </div>
              <div className="field-group">
                <label className="text-[10px]">SatO2 %</label>
                <input name="gas_sato2" type="number" value={formData.escalas.gas_sato2} onChange={handleChange} className="bg-white" />
              </div>
            </div>
          </div>

          <div className="field-group col-4">
            <label className="flex items-center gap-2"><ImageIcon size={14} /> Rx de Tórax</label>
            <textarea name="rx_torax" rows="3" value={formData.escalas.rx_torax} onChange={handleChange} placeholder="Describa hallazgos relevantes..." />
          </div>
          <div className="field-group col-4">
            <label className="flex items-center gap-2"><ImageIcon size={14} /> TAC</label>
            <textarea name="tac" rows="3" value={formData.escalas.tac} onChange={handleChange} placeholder="Hallazgos de tomografía..." />
          </div>
          <div className="field-group col-4">
            <label className="flex items-center gap-2"><ImageIcon size={14} /> RM</label>
            <textarea name="rm" rows="3" value={formData.escalas.rm} onChange={handleChange} placeholder="Resonancia magnética..." />
          </div>

          {/* C. Pruebas Funcionales */}
          <div className="col-12 mt-6">
            <h3 className="text-sm mb-4 flex items-center gap-2 text-primary font-bold border-b pb-2">
              <FileText size={18} /> C. Pruebas Funcionales Respiratorias
            </h3>
          </div>

          <div className="vital-card col-6 h-full justify-between">
            <div>
              <label className="font-bold text-xs mb-4 block text-slate-600 border-b pb-2">Espirometría</label>
              <div className="grid grid-cols-3 gap-3">
                <div className="field-group">
                  <label className="text-[10px]">VEF1 %</label>
                  <input name="espiro_vef1" type="number" value={formData.escalas.espiro_vef1} onChange={handleChange} />
                </div>
                <div className="field-group">
                  <label className="text-[10px]">CVF %</label>
                  <input name="espiro_cvf" type="number" value={formData.escalas.espiro_cvf} onChange={handleChange} />
                </div>
                <div className="field-group">
                  <label className="text-[10px]">VEF1/CVF</label>
                  <input name="espiro_relacion" type="number" step="0.01" value={formData.escalas.espiro_relacion} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="text-[10px] mb-1">Interpretación del Patrón</label>
              <input name="espiro_patron" type="text" placeholder="Normal / Obstructivo..." value={formData.escalas.espiro_patron} onChange={handleChange} />
            </div>
          </div>

          <div className="vital-card col-6 h-full justify-between">
            <div>
              <label className="font-bold text-xs mb-4 block text-slate-600 border-b pb-2">Pletismografía y Flujometría</label>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="field-group">
                  <label className="text-[10px]">CPT %</label>
                  <input name="pletismo_cpt" type="number" value={formData.escalas.pletismo_cpt} onChange={handleChange} />
                </div>
                <div className="field-group">
                  <label className="text-[10px]">VR %</label>
                  <input name="pletismo_vr" type="number" value={formData.escalas.pletismo_vr} onChange={handleChange} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="field-group">
                  <label className="text-[10px]">PEF (L/min)</label>
                  <input name="flujometria" type="number" value={formData.escalas.flujometria} onChange={handleChange} />
                </div>
                <div className="field-group">
                  <label className="text-[10px]">PIM</label>
                  <input name="pim" type="number" value={formData.escalas.pim} onChange={handleChange} />
                </div>
                <div className="field-group">
                  <label className="text-[10px]">PEM</label>
                  <input name="pem" type="number" value={formData.escalas.pem} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>

          {/* D. Pruebas de Capacidad Aeróbica */}
          <div className="col-12 mt-4">
            <h3 className="text-sm mb-4 flex items-center gap-2 text-primary font-bold border-b pb-2">
              <Activity size={18} /> D. Capacidad Aeróbica y Esfuerzo
            </h3>
          </div>

          <div className="vital-card col-4">
            <label className="font-bold text-xs mb-2 block text-accent">Test de Marcha (6MWT)</label>
            <div className="field-group">
              <label className="text-[10px]">Distancia (m)</label>
              <input name="marcha_distancia" type="number" value={formData.escalas.marcha_distancia} onChange={handleChange} />
            </div>
            <div className="field-group mt-1">
              <label className="text-[10px]">Borg Final</label>
              <input name="marcha_borg" type="number" step="0.5" value={formData.escalas.marcha_borg} onChange={handleChange} />
            </div>
          </div>

          <div className="vital-card col-4">
            <label className="font-bold text-xs mb-2 block text-accent">Ergoespirometría / STS</label>
            <div className="field-group">
              <label className="text-[10px]">VO2 Max (mL/kg/min)</label>
              <input name="vo2_max" type="number" step="0.1" value={formData.escalas.vo2_max} onChange={handleChange} />
            </div>
            <div className="field-group mt-1">
              <label className="text-[10px]">Sit-to-Stand (Reps)</label>
              <input name="sts_repeticiones" type="number" value={formData.escalas.sts_repeticiones} onChange={handleChange} />
            </div>
          </div>

          <div className="vital-card col-4">
            <label className="font-bold text-xs mb-2 block text-accent">Calidad de Vida (Scores)</label>
            <div className="field-group">
              <label className="text-[10px]">CAT (EPOC)</label>
              <input name="cat_score" type="number" value={formData.escalas.cat_score} onChange={handleChange} />
            </div>
            <div className="field-group mt-1">
              <label className="text-[10px]">SGRQ (St. George)</label>
              <input name="sgrq_score" type="number" value={formData.escalas.sgrq_score} onChange={handleChange} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
