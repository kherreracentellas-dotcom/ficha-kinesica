import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

export const SectionNavigation = ({ nextId, prevId, isLast = false }) => {
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="col-12 mt-12 flex justify-between items-center py-8 border-t border-slate-100">
      {prevId ? (
        <button 
          onClick={() => scrollTo(prevId)}
          className="flex items-center gap-2 text-slate-400 font-bold hover:text-primary transition-all group"
        >
          <div className="w-10 h-10 rounded-full border-2 border-slate-100 flex items-center justify-center group-hover:border-primary transition-all">
            <ArrowLeft size={18} />
          </div>
          <span>Anterior</span>
        </button>
      ) : <div />}

      {nextId ? (
        <button 
          onClick={() => scrollTo(nextId)}
          className="flex items-center gap-3 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-accent transition-all shadow-lg shadow-slate-200"
        >
          <span>Siguiente Sección</span>
          <ArrowRight size={18} />
        </button>
      ) : isLast ? (
        <div className="flex items-center gap-2 text-emerald-500 font-black italic">
          <CheckCircle size={20} />
          <span>Evaluación Completa</span>
        </div>
      ) : <div />}
    </div>
  );
};
