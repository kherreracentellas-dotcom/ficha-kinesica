import { User, Home, Shield, Activity, Weight } from 'lucide-react';
import { useFormState } from '../../hooks/useFormState';
import { SectionNavigation } from '../SectionNavigation';

export const Personales = () => {
  const { formData, setFormData, toggleNA } = useFormState();
  const isNA = formData.naSections.includes('personales');

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    
    setFormData(prev => {
      let newState = { ...prev };
      
      if (field) {
        newState.paciente = {
          ...prev.paciente,
          [section]: { ...prev.paciente[section], [field]: value }
        };
      } else {
        newState.paciente = { ...prev.paciente, [name]: value };
      }

      // Lógica de Cálculos Automáticos
      // 1. Edad desde Fecha de Nacimiento
      if (name === 'fecha_nacimiento' && value) {
        const birth = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        newState.paciente.edad = age > 0 ? age : 0;
      }

      // 2. Índice Paquete-Año (IPA)
      if (name.startsWith('habitos.')) {
        const cigs = parseInt(newState.paciente.habitos.cig_dia) || 0;
        const years = parseInt(newState.paciente.habitos.anos_fumando) || 0;
        newState.paciente.habitos.indice_paquete = ((cigs * years) / 20).toFixed(1);
      }

      // 3. Índice de Masa Corporal (IMC)
      if (name === 'peso' || name === 'talla') {
        const peso = parseFloat(name === 'peso' ? value : newState.paciente.peso) || 0;
        const talla = (parseFloat(name === 'talla' ? value : newState.paciente.talla) || 0) / 100;
        if (peso && talla) {
          newState.paciente.imc = (peso / (talla * talla)).toFixed(1);
        } else {
          newState.paciente.imc = '';
        }
      }

      return newState;
    });
  };

  return (
    <section id="personales" className={`clinical-section ${isNA ? 'na-active' : ''}`}>
      <div className="section-head">
        <div className="section-title">
          <h2 className="flex items-center gap-2">
            <User className="text-accent" size={24} /> I. Antecedentes Personales
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
          {/* Fila 1 */}
          <div className="field-group col-6">
            <label>Nombre Completo</label>
            <input name="nombre" type="text" value={formData.paciente.nombre} onChange={handleChange} />
          </div>
          <div className="field-group col-2">
            <label>Edad</label>
            <input name="edad" type="number" value={formData.paciente.edad} onChange={handleChange} className="bg-slate-50 font-bold text-primary" readOnly />
          </div>
          <div className="field-group col-2">
            <label>Sexo Biológico</label>
            <select name="sexo" value={formData.paciente.sexo} onChange={handleChange}>
              <option value="">Seleccionar...</option>
              <option value="M">Masculino (Cis/Trans)</option>
              <option value="F">Femenino (Cis/Trans)</option>
              <option value="I">Intersexual</option>
              <option value="NR">Prefiero no responder</option>
            </select>
          </div>
          <div className="field-group col-2">
            <label>Nacimiento</label>
            <input name="fecha_nacimiento" type="date" value={formData.paciente.fecha_nacimiento} onChange={handleChange} />
          </div>

          {/* Fila 2 */}
          <div className="field-group col-4">
            <label>RUT</label>
            <input name="rut" type="text" placeholder="12.345.678-9" value={formData.paciente.rut} onChange={handleChange} />
          </div>
          <div className="field-group col-4">
            <label>Nivel Educacional</label>
            <select name="nivel_educacional" value={formData.paciente.nivel_educacional} onChange={handleChange}>
              <option value="">Seleccionar...</option>
              <option value="sin_estudios">Sin estudios</option>
              <option value="basica_inc">Básica Incompleta</option>
              <option value="basica_comp">Básica Completa</option>
              <option value="media_inc">Media Incompleta</option>
              <option value="media_comp">Media Completa</option>
              <option value="tecnico">Técnico Nivel Superior</option>
              <option value="universitario">Universitario</option>
              <option value="postgrado">Postgrado (Magister/Doctorado)</option>
            </select>
          </div>
          <div className="field-group col-4">
            <label>Ocupación</label>
            <input name="ocupacion" type="text" value={formData.paciente.ocupacion} onChange={handleChange} />
          </div>

          {/* Fila 3 */}
          <div className="field-group col-4">
            <label>Previsión de Salud</label>
            <select name="prevision" value={formData.paciente.prevision} onChange={handleChange}>
              <option value="">Seleccione...</option>
              <option value="FONASA">FONASA</option>
              <option value="ISAPRE">ISAPRE</option>
              <option value="DIPRECA">DIPRECA</option>
              <option value="CAPREDENA">CAPREDENA</option>
              <option value="Particular">Particular</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div className="field-group col-4">
            <label>Teléfono</label>
            <input name="fono" type="text" value={formData.paciente.fono} onChange={handleChange} />
          </div>
          <div className="field-group col-4">
            <label>Fono Emergencia</label>
            <input name="fono_emergencia" type="text" value={formData.paciente.fono_emergencia} onChange={handleChange} />
          </div>

          {/* Fila 4: Antropometría */}
          <div className="col-12 border-t pt-4 mt-2">
            <h3 className="flex items-center gap-2 mb-4 text-primary"><Weight size={18} /> Antropometría</h3>
          </div>
          <div className="field-group col-3">
            <label>Peso (kg)</label>
            <input name="peso" type="number" step="0.1" value={formData.paciente.peso} onChange={handleChange} placeholder="0.0" />
          </div>
          <div className="field-group col-3">
            <label>Talla (cm)</label>
            <input name="talla" type="number" value={formData.paciente.talla} onChange={handleChange} placeholder="0" />
          </div>
          <div className="col-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-inner">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Índice de Masa Corporal</span>
                <span className="text-xs text-slate-500 italic">Cálculo automático</span>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-primary">{formData.paciente.imc || '--'}</span>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-tighter">kg/m²</span>
              </div>
            </div>
          </div>

          {/* Subsección: Entorno */}
          <div className="col-12 border-t pt-4 mt-2">
            <h3 className="flex items-center gap-2 mb-4"><Home size={18} /> Entorno y Estilo de Vida</h3>
          </div>
          <div className="field-group col-4">
            <label>Núcleo Familiar</label>
            <select name="entorno.convivencia" value={formData.paciente.entorno.convivencia} onChange={handleChange}>
              <option value="">Seleccione...</option>
              <option value="VS">Vive solo/a (V.S.)</option>
              <option value="VA">Vive acompañado (V.A.)</option>
              <option value="VP">Vive en pareja (V.P)</option>
            </select>
          </div>
          <div className="field-group col-4">
            <label>Especifique Núcleo</label>
            <input name="entorno.especifique" type="text" value={formData.paciente.entorno.especifique} onChange={handleChange} />
          </div>
          <div className="field-group col-4">
            <label>Tipo de Vivienda</label>
            <input name="entorno.tipo_vivienda" type="text" value={formData.paciente.entorno.tipo_vivienda} onChange={handleChange} />
          </div>
          <div className="field-group col-4">
            <label>Mascotas</label>
            <div className="flex gap-4 items-center h-10">
              <label className="flex items-center gap-2 normal-case"><input type="radio" name="entorno.mascotas" value="no" checked={formData.paciente.entorno.mascotas === 'no'} onChange={handleChange} /> No</label>
              <label className="flex items-center gap-2 normal-case"><input type="radio" name="entorno.mascotas" value="si" checked={formData.paciente.entorno.mascotas === 'si'} onChange={handleChange} /> Sí</label>
            </div>
          </div>
          <div className="field-group col-8">
            <label>Especifique Mascotas</label>
            <input name="entorno.mascotas_especifique" type="text" disabled={formData.paciente.entorno.mascotas === 'no'} value={formData.paciente.entorno.mascotas_especifique} onChange={handleChange} />
          </div>

          {/* Subsección: Hábitos */}
          <div className="col-12 border-t pt-4 mt-2">
            <h3 className="flex items-center gap-2 mb-4"><Shield size={18} /> Hábitos de Consumo y Riesgo Ambiental</h3>
          </div>
          <div className="field-group col-3">
            <label>Tabaquismo</label>
            <select name="habitos.tabaquismo" value={formData.paciente.habitos.tabaquismo} onChange={handleChange}>
              <option value="no">No</option>
              <option value="si">Sí</option>
              <option value="ex">Ex-fumador</option>
            </select>
          </div>
          <div className="field-group col-2">
            <label>Cig/Día</label>
            <input name="habitos.cig_dia" type="number" value={formData.paciente.habitos.cig_dia} onChange={handleChange} />
          </div>
          <div className="field-group col-2">
            <label>Años fumando</label>
            <input name="habitos.anos_fumando" type="number" value={formData.paciente.habitos.anos_fumando} onChange={handleChange} />
          </div>
          <div className="field-group col-5">
            <label>Índice Paquete-Año</label>
            <input name="habitos.indice_paquete" type="number" value={formData.paciente.habitos.indice_paquete} onChange={handleChange} className="bg-slate-50 font-bold text-accent" readOnly />
          </div>

          <div className="field-group col-4">
            <label>Exposición Biomasa/Polvo</label>
            <select name="habitos.biomasa" value={formData.paciente.habitos.biomasa} onChange={handleChange}>
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
          </div>
          <div className="field-group col-8">
            <label>Especifique Exposición</label>
            <input name="habitos.biomasa_especifique" type="text" value={formData.paciente.habitos.biomasa_especifique} onChange={handleChange} />
          </div>

          {/* Subsección: Actividad Física */}
          <div className="col-12 border-t pt-4 mt-2">
            <h3 className="flex items-center gap-2 mb-4"><Activity size={18} /> Actividad Física y Deporte</h3>
          </div>
          <div className="field-group col-4">
            <label>¿Realiza Actividad Física?</label>
            <select name="actividad_fisica.realiza" value={formData.paciente.actividad_fisica.realiza} onChange={handleChange}>
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
          </div>
          <div className="field-group col-8">
            <label>Tipo de Ejercicio</label>
            <input name="actividad_fisica.tipo" type="text" value={formData.paciente.actividad_fisica.tipo} onChange={handleChange} />
          </div>
          <div className="field-group col-3">
            <label>Frecuencia (x sem)</label>
            <input name="actividad_fisica.frecuencia" type="number" value={formData.paciente.actividad_fisica.frecuencia} onChange={handleChange} />
          </div>
          <div className="field-group col-3">
            <label>Tiempo (min)</label>
            <input name="actividad_fisica.tiempo" type="number" value={formData.paciente.actividad_fisica.tiempo} onChange={handleChange} />
          </div>
          <div className="field-group col-3">
            <label>Intensidad (Borg)</label>
            <input name="actividad_fisica.intensidad" type="number" step="0.5" value={formData.paciente.actividad_fisica.intensidad} onChange={handleChange} />
          </div>
          <div className="field-group col-3">
            <label>¿Le falta el aire?</label>
            <select name="actividad_fisica.disnea" value={formData.paciente.actividad_fisica.disnea} onChange={handleChange}>
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
          </div>

          <SectionNavigation nextId="morbidos" />
        </div>
      )}
    </section>
  );
};
