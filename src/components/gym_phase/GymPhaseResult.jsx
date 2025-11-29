import React from 'react';
import { Trophy, XCircle, Clock, Zap, Coins, Skull, CheckCircle2 } from 'lucide-react';


const GymPhaseResult = ({ 
  success,       // true/false
  type,          // 'quiz', 'stadium', 'scene'
  stats,         // Objeto con datos: { score, total, time, userScore, rivalScore, suddenDeath }
  onContinue,    // Función al hacer click
  nextText       // Texto inferior (ej: "Avanzar al siguiente entrenador")
}) => {

  // --- CONFIGURACIÓN VISUAL ---
  const theme = {
    color: success ? 'text-cyan-400' : 'text-red-500',
    bgGradient: success 
      ? 'from-cyan-950/90 via-[#050b14]/95 to-cyan-950/90' 
      : 'from-red-950/90 via-[#050b14]/95 to-red-950/90',
    borderColor: success ? 'border-cyan-500/30' : 'border-red-500/30',
    title: success ? 'VICTORIA' : 'DERROTA',
    icon: success ? <Trophy size={64} className="text-cyan-400" /> : <XCircle size={64} className="text-red-500" />
  };

  // --- RENDERIZADO DE FILAS DE DATOS ---
  const DataRow = ({ label, value, icon: Icon, isLast }) => (
    <div className={`flex items-center justify-between py-3 ${!isLast ? 'border-b border-white/10' : ''}`}>
      <div className="flex items-center gap-3 text-slate-400">
        {Icon && <Icon size={16} />}
        <span className="text-sm uppercase tracking-wider font-medium">{label}</span>
      </div>
      <span className={`text-xl font-mono font-bold ${theme.color} drop-shadow-md`}>
        {value}
      </span>
    </div>
  );

  return (
    <div 
        onClick={onContinue}
        className={`
            absolute inset-0 z-[100] flex flex-col items-center justify-center 
            bg-gradient-to-b ${theme.bgGradient} backdrop-blur-xl animate-fade-in cursor-pointer select-none
        `}
    >
        {/* --- DECORACIÓN DE FONDO (Círculos Tech) --- */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full ${success ? 'animate-spin-slow' : ''}`}></div>
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-white/5 rounded-full ${success ? 'animate-reverse-spin' : ''}`}></div>
            <div className={`absolute top-0 left-0 w-full h-1 ${success ? 'bg-cyan-500' : 'bg-red-500'} shadow-[0_0_20px_currentColor]`}></div>
        </div>

        {/* --- CONTENIDO CENTRAL --- */}
        <div className="relative z-10 w-full max-w-lg px-8 py-10 animate-zoom-in">
            
            {/* 1. TÍTULO Y ESTADO */}
            <div className="text-center mb-10">
                <div className="mb-4 flex justify-center drop-shadow-2xl opacity-90 scale-110">
                    {theme.icon}
                </div>
                <h1 className={`text-6xl md:text-7xl font-black italic uppercase tracking-tighter leading-none ${theme.color} drop-shadow-lg mb-2`}>
                    {theme.title}
                </h1>
                <div className="flex items-center justify-center gap-4 opacity-60">
                    <div className="h-px w-12 bg-white"></div>
                    <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white">Resultados de Fase</span>
                    <div className="h-px w-12 bg-white"></div>
                </div>
            </div>

            {/* 2. LISTA DE ESTADÍSTICAS (ADAPTABLE) */}
            <div className={`bg-black/40 border-y ${theme.borderColor} px-6 py-2 backdrop-blur-sm mb-12`}>
                
                {/* SI ES QUIZ O ESCENA */}
                {(type === 'quiz' || type === 'scene') && (
                    <>
                        <DataRow 
                            label="Respuestas Correctas" 
                            value={`${stats.score} / ${stats.total}`} 
                            icon={CheckCircle2} 
                        />
                        <DataRow 
                            label="Tiempo Transcurrido" 
                            value={stats.time || "00:00"} // Placeholder por ahora
                            icon={Clock} 
                        />
                        <DataRow 
                            label="Recompensa" 
                            value={`₽ ${success ? '500' : '0'}`} 
                            icon={Coins} 
                            isLast 
                        />
                    </>
                )}

                {/* SI ES ESTADIO */}
                {type === 'stadium' && (
                    <>
                        <DataRow 
                            label="Marcador Final" 
                            value={`${stats.userScore} - ${stats.rivalScore}`} 
                            icon={Zap} 
                        />
                        <DataRow 
                            label="Muerte Súbita" 
                            value={stats.suddenDeath ? "SÍ" : "NO"} 
                            icon={Skull} 
                        />
                        <DataRow 
                            label="Recompensa" 
                            value={`₽ ${success ? '1000' : '0'}`} 
                            icon={Coins} 
                            isLast 
                        />
                    </>
                )}
            </div>

            {/* 3. FOOTER (INSTRUCCIÓN) */}
            <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 animate-pulse mb-2">
                    {nextText}
                </p>
                <div className="text-[10px] text-slate-600 font-mono">
                    Tap anywhere in the blank area to continue
                </div>
            </div>

        </div>
    </div>
  );
};

export default GymPhaseResult;