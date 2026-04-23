import { createContext, useState, useEffect } from 'react';

export const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('kine_user'));
  const [currentView, setCurrentView] = useState('dashboard');
  const [patients, setPatients] = useState(() => JSON.parse(localStorage.getItem('kine_patients') || '[]'));
  
  const [formData, setFormData] = useState({
    naSections: [],
    paciente: {},
    biopsicosociales: {},
    morbidos: {},
    vitales: { fio2: '21%' },
    inspeccion: { tiraje: [], ruidos_agregados: [] },
    palpacion: { linfo_ubic: [] },
    auscultacion: { ruidos_agregados: [] },
    examenes: {},
    mecanica: {},
    pruebas: {},
    capacidad: {},
    fuerza: {},
    seguridad: {},
    diagnostico: {}
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
