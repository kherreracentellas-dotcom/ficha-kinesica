import { createContext, useState, useEffect } from 'react';
import { FormContext } from './Context';

export const FormProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('kine_user'));
  const [currentView, setCurrentView] = useState('dashboard');
  const [patients, setPatients] = useState(() => JSON.parse(localStorage.getItem('kine_patients') || '[]'));
  
  const [formData, setFormData] = useState({
    naSections: [],
    paciente: {
      nombre: '', edad: '', fecha_nacimiento: '', rut: '', ocupacion: '',
      prevision: '', fono: '', fono_emergencia: '', nivel_educacional: '',
      entorno: { convivencia: '', especifique: '', tipo_vivienda: '', mascotas: 'no', mascotas_especifique: '' },
      habitos: { tabaquismo: 'no', cig_dia: '', anos_fumando: '', indice_paquete: '', biomasa: 'no', biomasa_especifique: '', alcohol: 'no', alcohol_frecuencia: '' },
      actividad_fisica: { realiza: 'no', tipo: '', frecuencia: '', tiempo: '', intensidad: '', disnea: 'no' }
    },
    morbidos: {
      motivo_consulta: '', médico_tratante: '', diagnostico_medico: '',
      enfermedades_cronicas: '', cirugias_previas: '', alergias: '',
      antecedentes_familiares: '',
      farmacos: { continuo: '', rescate: '', adherencia: 'si', dosis: '' }
    },
    vitales: {
      pa_sistolica: '', pa_diastolica: '', pam: '', fc: '', fr: '',
      spo2: '', fio2: '21', temp: '', peso: '', talla: '', imc: ''
    },
    inspeccion: {
      tipo_torax: 'normotorax', patron_respiratorio: 'costal', uso_musculatura: 'no', tiraje: [],
      cianosis: 'no', cianosis_tipo: '', coriza: 'no', coriza_tipo: '',
      disnea_mmrc: '', fatiga_borg: '',
      tos: { presenta: 'no', horario: '', caracter: '', secrecion: '' }
    },
    palpacion: {
      llenado_capilar: 'normal', ingurgitacion: 'no', reflujo: 'negativo',
      pulsos: 'simetricos', edema: 'ausente', traquea: '', expansibilidad: '',
      fremitos: 'normales'
    },
    auscultacion: {
      percusion_izq: 'sonoridad', percusion_der: 'sonoridad',
      murmullo: 'conservado', laringotraqueal: '', resonancia_vocal: 'normal',
      ruidos_continuos: [], ruidos_discontinuos: [],
      cardiaco_ritmico: true, cardiaco_soplo: false, levine_grado: ''
    },
    escalas: {
      tal_puntaje: '', tal_gravedad: '', wood_puntaje: '', wood_interpretacion: '',
      bode_puntaje: '', bode_riesgo: '',
      marcha_distancia: '', marcha_borg: '', sts_repeticiones: '',
      // Nuevos campos de exámenes
      gas_ph: '', gas_pao2: '', gas_paco2: '', gas_hco3: '', gas_sato2: '',
      rx_torax: '', tac: '', rm: '',
      espiro_vef1: '', espiro_cvf: '', espiro_relacion: '', espiro_patron: '',
      pletismo_cpt: '', pletismo_vr: '', pletismo_relacion: '',
      flujometria: '', pim: '', pem: '',
      vo2_max: '', umbral_anaerobico: '',
      cat_score: '', sgrq_score: '', otro_cuestionario: '', otro_puntaje: ''
    },
    seguridad: {
      indicacion_medica: false, vias_invasivas: false, alimentacion: false, condicion_clinica: false
    },
    diagnostico: {
      diagnostico_kinesico: '', objetivo_general: '', objetivos_especificos: '',
      plan_tratamiento: '', registro_profesional: ''
    }
  });

  useEffect(() => {
    if (currentUser) localStorage.setItem('kine_user', currentUser);
    else localStorage.removeItem('kine_user');
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('kine_patients', JSON.stringify(patients));
  }, [patients]);

  const toggleNA = (sectionId) => {
    setFormData(prev => ({
      ...prev,
      naSections: prev.naSections.includes(sectionId)
        ? prev.naSections.filter(id => id !== sectionId)
        : [...prev.naSections, sectionId]
    }));
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  return (
    <FormContext.Provider value={{ 
      currentUser, setCurrentUser, 
      currentView, setCurrentView, 
      patients, setPatients,
      formData, setFormData,
      toggleNA, logout
    }}>
      {children}
    </FormContext.Provider>
  );
};
