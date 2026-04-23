import { useState } from 'react';
import { FormProvider } from './context/FormContext';
import { useFormState } from './hooks/useFormState';
import { Layout } from './components/Layout';
import { Activity, Search, PlusCircle, FileText } from 'lucide-react';

// Sections
import { Personales } from './components/sections/Personales';
import { Morbidos } from './components/sections/Morbidos';
import { Vitales } from './components/sections/Vitales';
import { Inspeccion } from './components/sections/Inspeccion';
import { Palpacion } from './components/sections/Palpacion';
import { Auscultacion } from './components/sections/Auscultacion';
import { Escalas } from './components/sections/Escalas';
import { Seguridad } from './components/sections/Seguridad';
import { Diagnostico } from './components/sections/Diagnostico';

import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const { setCurrentUser } = useFormState();
  const handleSubmit = (e) => {
    e.preventDefault();
    const user = e.target.username.value;
    if (user) setCurrentUser(user);
  };

  return (
    <div className="auth-overlay active bg-slate-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="auth-card shadow-2xl border border-white/20"
      >
        <div className="auth-header">
          <div className="brand-icon mb-6 bg-gradient-to-br from-indigo-600 to-accent shadow-lg">
            <Activity color="white" size={32} />
          </div>
          <h2 className="text-3xl font-black mb-2 tracking-tight">Acceso Profesional</h2>
          <p className="text-slate-500 text-sm">Plataforma de Evaluación Kinésica</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-6">
          <div className="field-group">
            <label className="text-indigo-900">Nombre de Usuario</label>
            <input name="username" type="text" placeholder="Ej: kherrera" required className="bg-slate-50 border-slate-200 focus:bg-white transition-all" />
          </div>
          <div className="field-group">
            <label className="text-indigo-900">Contraseña Local</label>
            <input type="password" placeholder="••••••••" required className="bg-slate-50 border-slate-200 focus:bg-white transition-all" />
          </div>
          <div className="auth-actions mt-4">
            <button type="submit" className="btn btn-primary w-full py-4 text-lg shadow-indigo-200">
              Iniciar Sesión
            </button>
          </div>
          <div className="pt-4 border-t border-slate-100 mt-2">
            <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              Seguridad Estudiantil UST
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const Dashboard = () => {
  const { setCurrentView, patients, setPatients, setFormData } = useFormState();
  const [search, setSearch] = useState('');

  const filteredPatients = patients.filter(p => 
    p.paciente.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.paciente.rut.toLowerCase().includes(search.toLowerCase())
  );

  const handleLoad = (patient) => {
    setFormData(patient);
    setCurrentView('personales');
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar esta ficha permanentemente?')) {
      setPatients(prev => prev.filter(p => p.id !== id));
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="dashboard-view"
    >
      <div className="dashboard-header mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="welcome-text">
          <h2 className="text-4xl font-black mb-2 tracking-tight text-primary">Panel de Gestión</h2>
          <p className="text-slate-500 font-medium">Control centralizado de evaluaciones y pacientes.</p>
        </div>
        <button className="btn btn-primary px-8 py-3 shadow-xl" onClick={() => setCurrentView('personales')}>
          <PlusCircle size={20} /> Nueva Ficha Clínica
        </button>
      </div>

      <div className="form-grid">
        <div className="col-12">
            <div className="bg-card p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 min-h-[500px]">
                <div className="flex items-center gap-4 mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 focus-within:border-accent focus-within:bg-white focus-within:shadow-lg transition-all group">
                    <Search size={22} className="text-slate-400 group-focus-within:text-accent transition-colors" />
                    <input 
                      type="text" 
                      className="w-full bg-transparent border-none focus:outline-none text-lg text-primary placeholder:text-slate-300" 
                      placeholder="Buscar por nombre, RUT o diagnóstico..." 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                
                {patients.length === 0 ? (
                    <div className="text-center py-32 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                          <FileText size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-slate-700">Historial Vacío</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mb-8 font-medium">Aún no has registrado ninguna ficha. Comienza ahora para generar tu base de datos clínica.</p>
                        <button className="btn btn-ghost bg-white shadow-sm border-slate-200 px-8" onClick={() => setCurrentView('personales')}>
                           Crear mi primera ficha
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPatients.map(p => (
                          <motion.div 
                            layout
                            key={p.id} 
                            className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer"
                            onClick={() => handleLoad(p)}
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-primary font-bold group-hover:bg-accent group-hover:text-white transition-colors">
                                {p.paciente.nombre.charAt(0)}
                              </div>
                              <span className="text-[10px] font-black uppercase text-slate-400">{p.fecha}</span>
                            </div>
                            <h4 className="font-black text-lg text-primary truncate mb-1">{p.paciente.nombre}</h4>
                            <p className="text-sm text-slate-500 font-medium mb-4">{p.paciente.rut}</p>
                            
                            <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-2">
                              <div className="flex gap-2">
                                <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-[10px] font-bold uppercase">IMC: {p.paciente.imc || 'N/A'}</span>
                                <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg text-[10px] font-bold uppercase">{p.paciente.prevision || 'FONASA'}</span>
                              </div>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                                className="text-slate-300 hover:text-red-500 transition-colors"
                              >
                                <PlusCircle size={18} className="rotate-45" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
    </motion.div>
  );
};

const FormView = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="clinical-sections-container"
    >
      <Personales />
      <Morbidos />
      <Vitales />
      <Inspeccion />
      <Palpacion />
      <Auscultacion />
      <Escalas />
      <Seguridad />
      <Diagnostico />
    </motion.div>
  );
};

const AppContent = () => {
  const { currentUser, currentView } = useFormState();

  return (
    <AnimatePresence mode="wait">
      {!currentUser ? (
        <Login key="login" />
      ) : (
        <Layout key="layout">
          {currentView === 'dashboard' ? <Dashboard key="dash" /> : <FormView key="form" />}
        </Layout>
      )}
    </AnimatePresence>
  );
};

function App() {
  return (
    <FormProvider>
      <AppContent />
    </FormProvider>
  );
}

export default App;
