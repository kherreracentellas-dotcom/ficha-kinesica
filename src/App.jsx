
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

const Login = () => {
  const { setCurrentUser } = useFormState();
  const handleSubmit = (e) => {
    e.preventDefault();
    const user = e.target.username.value;
    if (user) setCurrentUser(user);
  };

  return (
    <div className="auth-overlay active">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-icon mb-4">
            <Activity color="white" size={28} />
          </div>
          <h2 className="text-2xl mb-2">Acceso Profesional</h2>
          <p className="text-muted text-sm">Ingresa tus credenciales para gestionar las fichas clínicas.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="field-group">
            <label>Nombre de Usuario</label>
            <input name="username" type="text" placeholder="Ej: kherrera" required />
          </div>
          <div className="field-group">
            <label>Contraseña Local</label>
            <input type="password" placeholder="••••••••" required />
          </div>
          <div className="auth-actions mt-2">
            <button type="submit" className="btn btn-primary w-full">
              Entrar al Sistema
            </button>
          </div>
          <p className="text-center text-xs text-muted opacity-60">
            Los datos se almacenan localmente de forma segura.
          </p>
        </form>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { setCurrentView, patients } = useFormState();
  
  return (
    <div className="dashboard-view">
      <div className="dashboard-header mb-4 flex justify-between items-center">
        <div className="welcome-text">
          <h2 className="text-3xl font-bold mb-1">Panel de Gestión</h2>
          <p className="text-muted">Gestión integral de evaluaciones kinésicas.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setCurrentView('personales')}>
          <PlusCircle size={18} /> Nueva Evaluación
        </button>
      </div>

      <div className="form-grid mt-4">
        <div className="col-12">
            <div className="bg-card p-4 rounded border shadow-sm">
                <div className="flex items-center gap-3 mb-6 p-2 bg-surface rounded">
                    <Search size={20} className="text-muted ml-2" />
                    <input type="text" className="w-full bg-transparent border-none focus:outline-none py-1" placeholder="Buscar por nombre o RUT del paciente..." />
                </div>
                
                {patients.length === 0 ? (
                    <div className="text-center py-20 bg-surface/50 rounded-xl border border-dashed">
                        <FileText size={64} className="mx-auto mb-4 text-muted opacity-20" />
                        <h3 className="text-xl font-semibold mb-2">No hay fichas registradas</h3>
                        <p className="text-muted max-w-xs mx-auto">Comienza creando una nueva evaluación para tu primer paciente.</p>
                        <button className="btn btn-ghost mt-6" onClick={() => setCurrentView('personales')}>
                           Crear mi primera ficha
                        </button>
                    </div>
                ) : (
                    <div className="patient-list">
                        {/* Map patients here */}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

const FormView = () => {
  return (
    <div className="clinical-sections-container">
      <Personales />
      <Morbidos />
      <Vitales />
      <Inspeccion />
      <Palpacion />
      <Auscultacion />
      <Escalas />
      <Seguridad />
      <Diagnostico />
    </div>
  );
};

const AppContent = () => {
  const { currentUser, currentView } = useFormState();

  if (!currentUser) return <Login />;

  return (
    <Layout>
      {currentView === 'dashboard' ? <Dashboard /> : <FormView />}
    </Layout>
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
