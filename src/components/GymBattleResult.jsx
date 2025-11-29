import React, { useEffect, useState } from 'react';
import { Trophy, ChevronRight, Hash, Coins, Swords, AlertTriangle, CheckCircle2, Skull, Target } from 'lucide-react';

const GymBattleResult = ({ result, mode, stats, message, onContinue }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const isVictory = result === 'victory';
  
  // --- BLINDAJE DE DATOS ---
  const safeStats = stats || {};
  const { 
    correct = 0, 
    total = 0, 
    // Datos específicos de Estadio
    userScore = 0,
    rivalScore = 0,
    suddenDeath = false,
    money = 0 
  } = safeStats;

  // Lógica de visualización para Estadio (Ej: "2 / 3")
  // Si hubo muerte súbita, el total es la suma de rondas jugadas. Si no, es la base de 3.
  const stadiumTotalRounds = suddenDeath ? (userScore + rivalScore) : 3;
  const stadiumScoreString = `${userScore} / ${stadiumTotalRounds}`;

  // Cálculo de porcentaje para Quiz
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  // COLORES: Ajustados al Contexto Sci-Fi
  const titleColor = isVictory 
    ? 'text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-cyan-600' 
    : 'text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-700';
  
  const iconColor = isVictory ? 'text-cyan-400' : 'text-red-500';
  const glow = isVictory ? 'shadow-[0_0_50px_rgba(34,211,238,0.3)]' : 'shadow-[0_0_50px_rgba(239,68,68,0.3)]';
  const borderColor = isVictory ? 'border-cyan-500/30' : 'border-red-500/30';

  // Fila de Estadísticas
  const StatRow = ({ label, value, icon: Icon }) => (
    <div className="flex justify-between items-center border-b border-white/10 py-3 w-full group hover:bg-white/5 px-2 transition-colors rounded">
      <div className="flex items-center gap-3 opacity-70 group-hover:opacity-100 transition-opacity">
        {Icon && <Icon size={16} className={isVictory ? 'text-cyan-400' : 'text-red-400'} />}
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-300">{label}</span>
      </div>
      <span className={`text-lg font-mono font-bold tracking-tight ${isVictory ? 'text-white' : 'text-red-100'}`}>
        {value}
      </span>
    </div>
  );

  return (
    <div 
      onClick={onContinue}
      className="fixed inset-0 z-[200] bg-[#020617]/95 backdrop-blur-xl flex flex-col items-center justify-center cursor-pointer overflow-hidden font-sans select-none"
    >
      {/* --- FONDO GEOMÉTRICO --- */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-white/5 rounded-full pointer-events-none transition-all duration-[1.5s] ease-out ${animate ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}></div>
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] border border-white/5 rounded-full pointer-events-none transition-all duration-[1.5s] delay-100 ease-out ${animate ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}></div>
      
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,0,0,0)_2px,rgba(0,0,0,0.2)_2px)] bg-[size:100%_4px] opacity-20"></div>

      {/* --- ICONO SUPERIOR --- */}
      <div className={`mb-8 p-6 rounded-full border ${borderColor} bg-slate-900/60 backdrop-blur-md ${glow} transition-all duration-700 ${animate ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
        {isVictory ? (
          <CheckCircle2 size={48} className={iconColor} />
        ) : (
          <Skull size={48} className={iconColor} />
        )}
      </div>

      {/* --- TÍTULO --- */}
      <h1 className={`text-6xl md:text-7xl font-black italic uppercase tracking-tighter mb-2 leading-none transition-all duration-700 delay-100 ${titleColor} ${animate ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
        {isVictory ? 'VICTORIA' : 'DERROTA'}
      </h1>
      
      <div className={`mb-10 text-[10px] font-mono tracking-[0.5em] text-slate-500 uppercase ${animate ? 'opacity-100' : 'opacity-0'} transition-opacity delay-300`}>
        Result Analysis // {mode}
      </div>

      {/* --- DATOS / ESTADÍSTICAS --- */}
      <div className={`w-full max-w-md flex flex-col gap-1 px-8 transition-all duration-700 delay-200 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        
        {/* LÓGICA DE DATOS SEGÚN MODO */}
        {(mode === 'quiz' || mode === 'scene') && (
          <>
            <StatRow label="Aciertos" value={`${correct} / ${total}`} icon={Hash} />
            <StatRow label="Precisión" value={`${accuracy}%`} icon={Target} />
          </>
        )}

        {/* --- MODIFICACIÓN AQUÍ PARA ESTADIO --- */}
        {mode === 'stadium' && (
          <>
            <StatRow 
                label="Rondas Ganadas" 
                value={stadiumScoreString} 
                icon={Swords} 
            />
            <StatRow 
                label="Muerte Súbita" 
                value={suddenDeath ? "ACTIVADA" : "NO"} 
                icon={AlertTriangle} 
            />
          </>
        )}

        <StatRow label="Recompensa" value={`₽ ${money}`} icon={Coins} />
      </div>

      {/* --- MENSAJE INFERIOR --- */}
      <div className={`mt-12 w-full max-w-lg flex flex-col items-center gap-4 transition-all duration-1000 delay-500 ${animate ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-full flex items-center gap-4 opacity-30 px-10">
             <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white"></div>
             <div className="h-1 w-1 bg-white rounded-full"></div>
             <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white"></div>
        </div>

        <p className={`text-sm font-medium text-center max-w-xs leading-relaxed ${isVictory ? 'text-cyan-100' : 'text-red-200'}`}>
            {message}
        </p>
      </div>

      <div className="absolute bottom-8 text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2 opacity-60 animate-bounce">
          Click para continuar <ChevronRight size={12} />
      </div>

    </div>
  );
};

export default GymBattleResult;