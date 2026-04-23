import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, User, ClipboardList, Activity, Eye, 
  Hand, Stethoscope, FileText, Gauge, 
  ShieldCheck, ClipboardCheck, LogOut, Menu, RefreshCw, 
  Moon, Edit3
} from 'lucide-react';
import { useFormState } from '../hooks/useFormState';
import '../css/main.css';

const SidebarItem = ({ id, icon: Icon, label, active, onClick }) => (
    <a 
    href={`#${id}`} 
    className={`nav-link group ${active ? 'active' : ''}`}
    onClick={(e) => {
      e.preventDefault();
      onClick(id);
    }}
  >
    <div className={`icon-container ${active ? 'bg-accent' : 'bg-slate-100 group-hover:bg-slate-200'} transition-colors`}>
      <Icon size={18} className={active ? 'text-white' : 'text-slate-500'} />
    </div>
    <span className="label-text">{label}</span>
  </a>
);

export const Layout = ({ children }) => {
  const { currentView, setCurrentView, currentUser, logout } = useFormState();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (currentView !== 'dashboard') {
      const element = document.getElementById(currentView);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        setTimeout(() => {
          const el = document.getElementById(currentView);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentView]);

  const menuItems = [
    { id: 'personales', icon: User, label: 'Datos Personales' },
    { id: 'morbidos', icon: ClipboardList, label: 'Antecedentes Mórbidos' },
    { id: 'vitales', icon: Activity, label: 'Signos Vitales y Hemodinamia' },
    { id: 'inspeccion', icon: Eye, label: 'Inspección' },
    { id: 'palpacion', icon: Hand, label: 'Palpación y Cardiovascular' },
    { id: 'auscultacion', icon: Stethoscope, label: 'Percusión y Auscultación' },
    { id: 'escalas', icon: Gauge, label: 'Escalas y Pruebas Funcionales' },
    { id: 'seguridad', icon: ShieldCheck, label: 'Checklist Seguridad' },
    { id: 'diagnostico', icon: ClipboardCheck, label: 'Diagnóstico y Objetivos' },
  ];

  return (
    <div className="app-container font-body">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''} border-r border-slate-200/60`}>
        <div className="brand px-8 py-10 flex items-center gap-4">
          <div className="brand-icon bg-indigo-600 shadow-lg shadow-indigo-200">
            <Activity color="white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-indigo-950 tracking-tight leading-tight">Ficha Integral</h1>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">Kinesiología</span>
          </div>
        </div>

        {currentUser && (
          <div className="user-profile-widget mx-6 mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="user-avatar bg-gradient-to-tr from-accent to-indigo-500 shadow-md ring-2 ring-white">
                {currentUser.charAt(0).toUpperCase()}
              </div>
              <div className="user-details overflow-hidden">
                <span className="user-name block font-bold text-slate-800 truncate">{currentUser}</span>
                <span className="user-status text-[10px] text-slate-400 font-bold uppercase tracking-wider">Profesional</span>
              </div>
            </div>
            <button className="text-slate-300 hover:text-red-500 transition-colors p-2" onClick={() => confirm('¿Cerrar sesión?') && logout()}>
              <LogOut size={18} />
            </button>
          </div>
        )}

        <nav className="nav-menu px-4">
          <label className="px-4 text-[10px] uppercase font-black text-slate-300 tracking-widest mb-4 block">General</label>
          <SidebarItem 
            id="dashboard" 
            icon={LayoutDashboard} 
            label="Gestión de Pacientes" 
            active={currentView === 'dashboard'}
            onClick={() => setCurrentView('dashboard')}
          />
          {menuItems.map(item => (
            <SidebarItem 
              key={item.id}
              {...item}
              active={currentView === item.id}
              onClick={() => setCurrentView(item.id)}
            />
          ))}
        </nav>
      </aside>

      <main className="content">
        <header className="top-bar">
          <div className="header-left">
            <button className="btn-menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={24} />
            </button>
            <div className="breadcrumb">
              <span className="text-muted">Evaluación</span> / 
              <span>{currentView === 'dashboard' ? 'Dashboard' : 'Formulario'}</span>
            </div>
          </div>
          <div className="actions">
            <button className="btn btn-ghost"><Moon size={20} /></button>
            <button className="btn btn-ghost"><RefreshCw size={18} /> Limpiar</button>
            <button className="btn btn-primary"><FileText size={18} /> PDF</button>
            <button className="btn btn-secondary"><Edit3 size={18} /> Word</button>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
};
