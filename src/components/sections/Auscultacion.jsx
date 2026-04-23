
import { Stethoscope, Heart, Waves, Music } from 'lucide-react';
import { useFormState } from '../../hooks/useFormState';
import { SectionNavigation } from '../SectionNavigation';

export const Auscultacion = () => {
  const { formData, setFormData, toggleNA } = useFormState();
  const isNA = formData.naSections.includes('auscultacion');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => {
      const currentSection = { ...(prev.auscultacion || {}) };
      
      if (type === 'checkbox') {
        const currentArr = Array.isArray(currentSection[name]) ? currentSection[name] : [];
        const newArr = checked 
          ? [...currentArr, value] 
          : currentArr.filter(v => v !== value);
        
        return {
          ...prev,
          auscultacion: { ...currentSection, [name]: newArr }
        };
      }
      
      return {
        ...prev,
        auscultacion: { ...currentSection, [name]: value }
      };
    });
  };

  return (
    <section id="auscultacion" className={`clinical-section ${isNA ? 'na-active' : ''}`}>
      <div className="section-head">
        <div className="section-title">
          <h2 className="flex items-center gap-2">
            <Stethoscope className="text-accent" size={24} /> VI. Percusión y Auscultación
          </h2>
          <p>Evaluación acústica de parénquima pulmonar y precordial.</p>
        </div>
        <button type="button" className={`btn-na ${isNA ? 'active' : ''}`} onClick={() => toggleNA('auscultacion')}>
          {isNA ? 'Anular N/A' : 'N/A'}
        </button>
      </div>

      {!isNA && (
        <div className="form-grid">
          {/* Percusión */}
          <div className="col-12">
            <h3 className="text-sm mb-4 flex items-center gap-2"><Waves size={16} /> Percusión</h3>
          </div>
          <div className="field-group col-6">
            <label>Hemitórax Izquierdo</label>
            <select name="percusion_izq" value={formData.auscultacion.percusion_izq} onChange={handleChange}>
              <option value="sonoridad">Sonoridad (Normal)</option>
              <option value="hipersonoridad">Hipersonoridad (Timpanismo)</option>
              <option value="matidez">Matidez</option>
            </select>
          </div>
          <div className="field-group col-6">
            <label>Hemitórax Derecho</label>
            <select name="percusion_der" value={formData.auscultacion.percusion_der} onChange={handleChange}>
              <option value="sonoridad">Sonoridad (Normal)</option>
              <option value="hipersonoridad">Hipersonoridad (Timpanismo)</option>
              <option value="matidez">Matidez</option>
            </select>
          </div>

          {/* Auscultación Pulmonar */}
          <div className="col-12 border-t pt-4 mt-2">
            <h3 className="text-sm mb-4 flex items-center gap-2"><Music size={16} /> Auscultación Pulmonar</h3>
          </div>
          <div className="field-group col-4">
            <label>Murmullo Pulmonar</label>
            <select name="murmullo" value={formData.auscultacion.murmullo} onChange={handleChange}>
              <option value="conservado">(+) Conservado</option>
              <option value="disminuido">Disminuido</option>
              <option value="abolido">Abolido</option>
            </select>
          </div>
          <div className="field-group col-4">
            <label>Zonas Afectadas</label>
            <input name="murmullo_zonas" type="text" placeholder="Ej: Basal izq..." value={formData.auscultacion.murmullo_zonas} onChange={handleChange} />
          </div>
          <div className="field-group col-4">
            <label>Laringotraqueal</label>
            <select name="laringotraqueal" value={formData.auscultacion.laringotraqueal} onChange={handleChange}>
              <option value="normal">Normal</option>
              <option value="alterada">Alterada</option>
            </select>
          </div>
          <div className="field-group col-4">
            <label>Resonancia Vocal</label>
            <select name="resonancia_vocal" value={formData.auscultacion.resonancia_vocal} onChange={handleChange}>
              <option value="normal">Normal ("99" claro)</option>
              <option value="aumentada">Aumentada (Broncofonía)</option>
              <option value="disminuida">Disminuida</option>
            </select>
          </div>

          <div className="col-12 bg-slate-50 p-6 rounded-2xl border border-slate-100 mt-4">
            <label className="font-bold text-xs mb-4 block uppercase tracking-widest text-slate-500">Ruidos Agregados Continuos</label>
            <div className="flex flex-wrap gap-3">
              {['Sibilancias', 'Roncus', 'Estridor', 'Silencio Auscultatorio'].map(r => (
                <label key={r} className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 cursor-pointer transition-all ${formData.auscultacion.ruidos_continuos.includes(r) ? 'bg-accent border-accent text-white shadow-md' : 'bg-white border-slate-100 text-slate-500 hover:border-accent/30'}`}>
                  <input type="checkbox" name="ruidos_continuos" value={r} checked={formData.auscultacion.ruidos_continuos.includes(r)} onChange={handleChange} className="hidden" />
                  <span className="text-xs font-bold">{r}</span>
                </label>
              ))}
            </div>
            
            <label className="font-bold text-xs mb-4 mt-6 block uppercase tracking-widest text-slate-500">Ruidos Agregados Discontinuos</label>
            <div className="flex flex-wrap gap-3">
              {['Crépitos Finos', 'Crépitos Gruesos', 'Frote Pleural'].map(r => (
                <label key={r} className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 cursor-pointer transition-all ${formData.auscultacion.ruidos_discontinuos.includes(r) ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-600/30'}`}>
                  <input type="checkbox" name="ruidos_discontinuos" value={r} checked={formData.auscultacion.ruidos_discontinuos.includes(r)} onChange={handleChange} className="hidden" />
                  <span className="text-xs font-bold">{r}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Auscultación Cardíaca */}
          <div className="col-12 mt-8">
            <h3 className="text-sm mb-4 font-bold text-primary flex items-center gap-2 border-b pb-2">
              <Heart size={16} className="text-accent" /> Auscultación Precordial
            </h3>
          </div>
          <div className="col-12 grid grid-cols-2 gap-4">
            <label className={`flex flex-col gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.auscultacion.cardiaco_ritmico ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-white border-slate-100 text-slate-400 opacity-60'}`}>
              <div className="flex items-center justify-between">
                <span className="font-bold">Ritmo Cardíaco</span>
                <input type="checkbox" checked={formData.auscultacion.cardiaco_ritmico} onChange={(e) => setFormData(prev => ({ ...prev, auscultacion: { ...prev.auscultacion, cardiaco_ritmico: e.target.checked } }))} className="w-5 h-5 accent-emerald-600" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider">{formData.auscultacion.cardiaco_ritmico ? 'Rítmico y Normal' : 'Arritmia / No evaluado'}</span>
            </label>

            <label className={`flex flex-col gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.auscultacion.cardiaco_soplo ? 'bg-red-50 border-red-500 text-red-900' : 'bg-white border-slate-100 text-slate-400 opacity-60'}`}>
              <div className="flex items-center justify-between">
                <span className="font-bold">Soplos Cardíacos</span>
                <input type="checkbox" checked={formData.auscultacion.cardiaco_soplo} onChange={(e) => setFormData(prev => ({ ...prev, auscultacion: { ...prev.auscultacion, cardiaco_soplo: e.target.checked } }))} className="w-5 h-5 accent-red-600" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider">{formData.auscultacion.cardiaco_soplo ? 'Soplo Detectado' : 'Sin Soplos'}</span>
            </label>
          </div>

          {formData.auscultacion.cardiaco_soplo && (
            <div className="field-group col-12 bg-red-50/30 p-6 rounded-2xl border border-red-100 mt-2">
              <label className="text-red-900 font-bold">Intensidad (Escala Levine 1-6)</label>
              <div className="flex gap-2 mt-4">
                {[1, 2, 3, 4, 5, 6].map(v => (
                  <button key={v} onClick={() => setFormData(prev => ({ ...prev, auscultacion: { ...prev.auscultacion, levine_grado: v } }))} className={`flex-1 py-3 rounded-xl font-bold transition-all ${formData.auscultacion.levine_grado === v ? 'bg-red-600 text-white shadow-lg' : 'bg-white border border-red-100 text-red-400'}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          <SectionNavigation prevId="palpacion" nextId="escalas" />
        </div>
      )}
    </section>
  );
};
