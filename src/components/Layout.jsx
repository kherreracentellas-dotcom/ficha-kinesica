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
    className={`nav-link ${active ? 'active' : ''}`}
    onClick={(e) => {
      e.preventDefault();
      onClick(id);
    }}
  >
    <Icon size={18} /> {label}
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
        // If element not found yet (e.g. just switched from dashboard), 
        // wait a bit for the render
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
    <div className="app-container">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-icon">
            <Activity color="white" size={24} />
          </div>
          <div>
            <span>Kinesiología</span>
            <h1>Ficha Integral</h1>
          </div>
        </div>

        {currentUser && (
          <div className="user-profile-widget">
            <div className="user-info">
              <div className="user-avatar">{currentUser.charAt(0).toUpperCase()}</div>
              <div className="user-details">
                <span className="user-name">{currentUser}</span>
                <span className="user-status">Kinesiólogo</span>
              </div>
            </div>
            <button className="btn-logout" onClick={() => confirm('¿Cerrar sesión?') && logout()}>
              <LogOut size={16} />
            </button>
          </div>
        )}

        <nav className="nav-menu">
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
