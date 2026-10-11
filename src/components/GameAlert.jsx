import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle, Terminal, ChevronRight } from 'lucide-react';

const GameAlert = ({ isOpen, title, message, type = 'info', onClose }) => {
  if (!isOpen) return null;

  // Cerrar con tecla Enter o Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Configuración de estilos y colores según el tipo
  const styles = {
    success: {
      border: 'border-green-500',
      iconColor: 'text-green-400',
      titleColor: 'text-green-500',
      bgGradient: 'from-green-900/20',
      icon: CheckCircle,
      // Estilos del Botón
      buttonGradient: 'from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500',
      buttonShadow: 'shadow-[0_0_20px_rgba(34,197,94,0.4)]'
    },
    error: {
      border: 'border-red-500',
      iconColor: 'text-red-500',
      titleColor: 'text-red-500',
      bgGradient: 'from-red-900/20',
      icon: XCircle,
      buttonGradient: 'from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500',
      buttonShadow: 'shadow-[0_0_20px_rgba(239,68,68,0.4)]'
    },
    warning: {
      border: 'border-yellow-500',
      iconColor: 'text-yellow-500',
      titleColor: 'text-yellow-500',
      bgGradient: 'from-yellow-900/20',
      icon: AlertTriangle,
      buttonGradient: 'from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500',
      buttonShadow: 'shadow-[0_0_20px_rgba(234,179,8,0.4)]'
    },
    info: {
      border: 'border-cyan-500',
      iconColor: 'text-cyan-400',
      titleColor: 'text-cyan-500',
      bgGradient: 'from-cyan-900/20',
      icon: Info,
      buttonGradient: 'from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500',
      buttonShadow: 'shadow-[0_0_20px_rgba(34,211,238,0.4)]'
    },
    cheat: {
      border: 'border-purple-500',
      iconColor: 'text-purple-400',
      titleColor: 'text-purple-500',
      bgGradient: 'from-purple-900/20',
      icon: Terminal,
      buttonGradient: 'from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500',
      buttonShadow: 'shadow-[0_0_20px_rgba(168,85,247,0.4)]'
    }
  };

  const currentStyle = styles[type] || styles.info;
  const Icon = currentStyle.icon;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-fade-in">
      
      <div className={`
        relative w-full max-w-md bg-[#0f172a] border-2 ${currentStyle.border} 
        rounded-xl shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden animate-bounce-in
      `}>
        
        {/* Fondo Decorativo */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0"></div>
        <div className={`absolute inset-0 bg-gradient-to-b ${currentStyle.bgGradient} to-transparent opacity-40 z-0`}></div>
        
        {/* Header */}
        <div className={`relative z-10 flex items-center gap-3 p-5 border-b border-white/10 bg-black/40`}>
            <Icon size={28} className={`${currentStyle.iconColor} drop-shadow-md`} />
            <h3 className={`font-black italic uppercase tracking-widest text-xl ${currentStyle.titleColor} drop-shadow-md`}>
                {title}
            </h3>
        </div>

        {/* Body */}
        <div className="relative z-10 p-8 bg-black/10">
            <p className="text-slate-200 font-medium text-sm leading-relaxed whitespace-pre-line tracking-wide">
                {message}
            </p>
        </div>

        {/* Footer / Botón Actualizado */}
        <div className="relative z-10 p-5 border-t border-white/10 bg-black/40 flex justify-end">
            <button 
                onClick={onClose}
                className={`
                    group relative px-8 py-3 rounded-lg font-black uppercase tracking-[0.2em] text-xs text-white
                    bg-gradient-to-r ${currentStyle.buttonGradient}
                    ${currentStyle.buttonShadow}
                    transition-all duration-300 transform hover:scale-105 active:scale-95
                    flex items-center gap-2 border-t border-white/20
                `}
            >
                <span>ENTENDIDO</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>

        {/* Decoraciones Tech Esquinas */}
        <div className={`absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 ${currentStyle.border} rounded-tr opacity-60`}></div>
        <div className={`absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 ${currentStyle.border} rounded-bl opacity-60`}></div>

      </div>
    </div>
  );
};

export default GameAlert;