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
            <label className="font-bold text-xs mb-4 block uppercase tracking-widest text-slate-500 border-b pb-2">Gasometría Arterial (EAB)</label>
            <div className="grid grid-cols-5 gap-4">
              <div className="field-group">
                <label className="text-[10px]">pH</label>
                <input name="gas_ph" type="number" step="0.01" placeholder="7.35-7.45" value={formData.escalas.gas_ph} onChange={handleChange} className="bg-white font-bold" />
              </div>
              <div className="field-group">
                <label className="text-[10px]">PaO2 (mmHg)</label>
                <input name="gas_pao2" type="number" placeholder="80-100" value={formData.escalas.gas_pao2} onChange={handleChange} className="bg-white font-bold" />
              </div>
              <div className="field-group">
                <label className="text-[10px]">PaCO2 (mmHg)</label>
                <input name="gas_paco2" type="number" placeholder="35-45" value={formData.escalas.gas_paco2} onChange={handleChange} className="bg-white font-bold" />
              </div>
              <div className="field-group">
                <label className="text-[10px]">HCO3 (mEq/L)</label>
                <input name="gas_hco3" type="number" step="0.1" placeholder="22-26" value={formData.escalas.gas_hco3} onChange={handleChange} className="bg-white font-bold" />
              </div>
              <div className="field-group">
                <label className="text-[10px]">SatO2 (%)</label>
                <input name="gas_sato2" type="number" placeholder="> 94%" value={formData.escalas.gas_sato2} onChange={handleChange} className="bg-white font-bold" />
              </div>
            </div>
          </div>

          <div className="field-group col-4">
            <label className="flex items-center gap-2 font-bold text-primary"><ImageIcon size={14} className="text-accent" /> Rx de Tórax</label>
            <textarea name="rx_torax" rows="4" value={formData.escalas.rx_torax} onChange={handleChange} placeholder="Infiltrados, condensación, cardiomegalia, etc." className="bg-white" />
          </div>
          <div className="field-group col-4">
            <label className="flex items-center gap-2 font-bold text-primary"><ImageIcon size={14} className="text-accent" /> TAC de Tórax / AngioTAC</label>
            <textarea name="tac" rows="4" value={formData.escalas.tac} onChange={handleChange} placeholder="Patrón intersticial, bronquiectasias, TEP..." className="bg-white" />
          </div>
          <div className="field-group col-4">
            <label className="flex items-center gap-2 font-bold text-primary"><FileText size={14} className="text-accent" /> Otros Laboratorios</label>
            <textarea name="otros_lab" rows="4" value={formData.escalas.otros_lab} onChange={handleChange} placeholder="Procalcitonina, Proteína C Reactiva, BNP, Troponinas..." className="bg-white" />
          </div>

          {/* C. Pruebas Funcionales */}
          <div className="col-12 mt-8">
            <h3 className="text-sm mb-4 flex items-center gap-2 text-primary font-bold border-b pb-2">
              <FileText size={18} className="text-accent" /> C. Pruebas Funcionales Respiratorias
            </h3>
          </div>

          <div className="col-6 bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <label className="font-black text-[10px] mb-4 block text-slate-400 uppercase tracking-widest">Espirometría (Post-BD)</label>
              <div className="grid grid-cols-3 gap-4">
                <div className="field-group">
                  <label className="text-[10px] font-bold">VEF1 (%)</label>
                  <input name="espiro_vef1" type="number" value={formData.escalas.espiro_vef1} onChange={handleChange} className="bg-white" />
                </div>
                <div className="field-group">
                  <label className="text-[10px] font-bold">CVF (%)</label>
                  <input name="espiro_cvf" type="number" value={formData.escalas.espiro_cvf} onChange={handleChange} className="bg-white" />
                </div>
                <div className="field-group">
                  <label className="text-[10px] font-bold">VEF1/CVF</label>
                  <input name="espiro_relacion" type="number" step="0.01" value={formData.escalas.espiro_relacion} onChange={handleChange} className="bg-white" />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Interpretación del Patrón</label>
              <select name="espiro_patron" value={formData.escalas.espiro_patron} onChange={handleChange} className="bg-white mt-2">
                <option value="normal">Normal</option>
                <option value="obstructivo">Obstructivo</option>
                <option value="restrictivo">Restrictivo Sugerido</option>
                <option value="mixto">Mixto</option>
              </select>
            </div>
          </div>

          <div className="col-6 bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm">
            <label className="font-black text-[10px] mb-4 block text-slate-400 uppercase tracking-widest">Pletismografía / Presiones</label>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="field-group">
                <label className="text-[10px] font-bold">CPT (%)</label>
                <input name="pletismo_cpt" type="number" value={formData.escalas.pletismo_cpt} onChange={handleChange} className="bg-white" />
              </div>
              <div className="field-group">
                <label className="text-[10px] font-bold">VR (%)</label>
                <input name="pletismo_vr" type="number" value={formData.escalas.pletismo_vr} onChange={handleChange} className="bg-white" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200">
              <div className="field-group">
                <label className="text-[10px] font-bold">PEF (L/min)</label>
                <input name="flujometria" type="number" value={formData.escalas.flujometria} onChange={handleChange} className="bg-white" />
              </div>
              <div className="field-group">
                <label className="text-[10px] font-bold">PIM (cmH2O)</label>
                <input name="pim" type="number" value={formData.escalas.pim} onChange={handleChange} className="bg-white" />
              </div>
              <div className="field-group">
                <label className="text-[10px] font-bold">PEM (cmH2O)</label>
                <input name="pem" type="number" value={formData.escalas.pem} onChange={handleChange} className="bg-white" />
              </div>
            </div>
          </div>

          {/* D. Pruebas de Capacidad Aeróbica */}
          <div className="col-12 mt-10">
            <h3 className="text-sm mb-4 font-bold text-primary border-b pb-2">D. Tolerancia al Esfuerzo y Calidad de Vida</h3>
          </div>

          <div className="col-4 bg-indigo-900 text-white p-6 rounded-3xl shadow-xl shadow-indigo-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Test de Marcha (6MWT)</span>
              <Activity size={18} className="text-accent" />
            </div>
            <div className="field-group mb-4">
              <label className="text-[10px] opacity-70">Distancia Recorrida (m)</label>
              <input name="marcha_distancia" type="number" value={formData.escalas.marcha_distancia} onChange={handleChange} className="bg-white/10 border-white/20 text-white placeholder:text-white/30" />
            </div>
            <div className="field-group">
              <label className="text-[10px] opacity-70">Borg Final (Disnea)</label>
              <input name="marcha_borg" type="number" step="0.5" value={formData.escalas.marcha_borg} onChange={handleChange} className="bg-white/10 border-white/20 text-white placeholder:text-white/30" />
            </div>
          </div>

          <div className="col-4 bg-emerald-900 text-white p-6 rounded-3xl shadow-xl shadow-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Funcionalidad</span>
              <TrendingUp size={18} className="text-emerald-400" />
            </div>
            <div className="field-group mb-4">
              <label className="text-[10px] opacity-70">VO2 Max Estimado</label>
              <input name="vo2_max" type="number" step="0.1" value={formData.escalas.vo2_max} onChange={handleChange} className="bg-white/10 border-white/20 text-white" />
            </div>
            <div className="field-group">
              <label className="text-[10px] opacity-70">Sit-to-Stand (1 min)</label>
              <input name="sts_repeticiones" type="number" value={formData.escalas.sts_repeticiones} onChange={handleChange} className="bg-white/10 border-white/20 text-white" />
            </div>
          </div>

          <div className="col-4 bg-slate-900 text-white p-6 rounded-3xl shadow-xl shadow-slate-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Calidad de Vida</span>
              <ClipboardList size={18} className="text-slate-400" />
            </div>
            <div className="field-group mb-4">
              <label className="text-[10px] opacity-70">CAT Score (EPOC)</label>
              <input name="cat_score" type="number" value={formData.escalas.cat_score} onChange={handleChange} className="bg-white/10 border-white/20 text-white" />
            </div>
            <div className="field-group">
              <label className="text-[10px] opacity-70">SGRQ Total (%)</label>
              <input name="sgrq_score" type="number" value={formData.escalas.sgrq_score} onChange={handleChange} className="bg-white/10 border-white/20 text-white" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
