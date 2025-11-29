import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ArrowLeft, Menu, Trophy, Map, BookOpen, Play, Lock, ChevronLeft, ChevronRight, Leaf, Shield, LogIn } from 'lucide-react';

// --- DEFINICIÓN DE DATOS ---
const ILLUSTRATIONS = {
  pokedex: ['assets/pokemon/normal/123.png', 'assets/pokemon/normal/124.png', 'assets/pokemon/normal/125.png'],
  gym: ['/assets/gym_leaders/misty_full_art.png', '/assets/gym_leaders/brock_full_art.png'],
  elite: ['/assets/gym_leaders/lance_full_art.png'],
  safari: ['assets/pokemon/normal/115.png'],
  rocket: ['assets/pokemon/normal/150.png'] // Mewtwo queda bien para Rocket
};

const MODES = [
  {
    id: 'pokedex',
    title: 'MODO POKÉDEX',
    subtitle: 'El desafío clásico',
    desc: 'Completa la enciclopedia definitiva. Captura a los 150 Pokémon de Kanto.',
    icon: <BookOpen size={20} />,
    color: 'from-blue-500 to-cyan-500',
    rules: ["Responde para capturar.", "Completa los 150.", "Abre nuevas zonas."]
  },
  {
    id: 'gym',
    title: 'GIMNASIOS',
    subtitle: 'Camino a la Liga',
    desc: 'Enfréntate a los 8 Líderes. Demuestra tu conocimiento sobre tipos.',
    icon: <Map size={20} />,
    color: 'from-orange-500 to-red-500',
    rules: ["Desbloqueo: 5 Capturas.", "Reto Brock: 10 Capturas.", "Gana Medallas."]
  },
  {
    id: 'elite',
    title: 'ALTO MANDO',
    subtitle: 'La prueba final',
    desc: 'Derrota a la Élite 4 y al Campeón para convertirte en Leyenda.',
    icon: <Trophy size={20} />,
    color: 'from-purple-600 to-indigo-600',
    rules: ["Req: 8 Medallas + 90 Capturas.", "Lore avanzado.", "Encuentro con Mewtwo."]
  },
  {
    id: 'safari',
    title: 'ZONA SAFARI',
    subtitle: 'Captura Rápida',
    desc: 'Un modo contrarreloj donde debes capturar Pokémon raros.',
    icon: <Leaf size={20} />,
    color: 'from-green-500 to-emerald-500',
    rules: ["Tiempo limitado.", "Mecánicas de cebo/roca.", "Pokémon exclusivos."]
  },
  {
    id: 'rocket',
    title: 'TEAM ROCKET',
    subtitle: 'Infiltración',
    desc: 'Detén los planes malvados de Giovanni y recupera los Pokémon robados.',
    icon: <Shield size={20} />,
    // CAMBIO DE COLOR: Negro a Rojo para estética villano
    color: 'from-gray-900 to-red-900', 
    rules: ["Batallas dobles.", "Robo de objetos.", "Historia oscura."]
  }
];

// --- SUB-COMPONENTE OPTIMIZADO (LA TARJETA) ---
const GameModeCard = React.memo(({ mode, isActive, index, onClick, capturedCount, gymProgress, isLocked }) => {
    // Lógica de colores dinámica
    const isRocket = mode.id === 'rocket';
    const themeColor = isRocket ? 'rocket' : (mode.id === 'hard' || mode.id === 'gym' ? 'red' : 'cyan');
    
    let glowColor = 'rgba(34,211,238,0.5)';
    let borderColor = 'border-cyan-400';
    let progressBarColor = 'bg-cyan-400';
    let progressTextColor = 'text-cyan-400';
    let iconColor = 'text-cyan-400';
    let bgPulse = 'bg-cyan-500';

    if (themeColor === 'red') {
        glowColor = 'rgba(239,68,68,0.5)';
        borderColor = 'border-red-500';
        progressBarColor = 'bg-red-500';
        progressTextColor = 'text-red-400';
        iconColor = 'text-red-500';
        bgPulse = 'bg-red-500';
    } else if (themeColor === 'rocket') {
        glowColor = 'rgba(127,29,29,0.8)'; // Rojo oscuro
        borderColor = 'border-red-900';
        progressBarColor = 'bg-red-800';
        progressTextColor = 'text-red-700';
        iconColor = 'text-white';
        bgPulse = 'bg-red-900';
    }
    
    // Calculamos porcentaje una sola vez
    let progressPercent = 0;
    if (mode.id === 'pokedex') progressPercent = (capturedCount / 150) * 100;
    if (mode.id === 'gym') progressPercent = (gymProgress / 8) * 100;

    const progressText = mode.id === 'pokedex' ? `${capturedCount}/150` : mode.id === 'gym' ? `${gymProgress}/8` : '';

    return (
        <div 
            onClick={() => onClick(index)}
            className={`
                relative group cursor-pointer transition-all duration-500 ease-out will-change-transform
                ${isActive ? 'w-48 h-64 -translate-y-4 z-10' : 'w-36 h-48 translate-y-2 opacity-40 hover:opacity-80 hover:-translate-y-0 z-0'}
            `}
        >
            <div className={`
                absolute inset-0 bg-[#020617] overflow-hidden transform skew-x-[-10deg] border-2 transition-all duration-300
                ${isActive ? `${borderColor} shadow-[0_0_30px_${glowColor}]` : 'border-slate-700 grayscale'}
            `}>
                {/* Fondo animado solo si está activo */}
                {isActive && (
                    <div className="absolute inset-0 opacity-20 pointer-events-none animate-[grid-move_3s_linear_infinite]"
                         style={{ backgroundImage: `radial-gradient(${themeColor === 'red' || isRocket ? '#ef4444' : '#22d3ee'} 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>
                )}

                <div className="absolute inset-0 bg-[#020617] flex items-center justify-center overflow-hidden">
                    {isActive && (
                        <div className={`absolute inset-0 blur-2xl opacity-50 transform scale-150 ${bgPulse}`}></div>
                    )}
                    <div className={`transform transition-all duration-500 ${isActive ? `scale-[3] ${iconColor}` : 'scale-[2] text-slate-700'}`}>
                        {mode.icon}
                    </div>
                </div>

                {isLocked && (
                    <div className="absolute inset-0 bg-black/80 z-30 flex flex-col items-center justify-center backdrop-blur-[2px]">
                        <div className="transform skew-x-[10deg] border border-slate-600 bg-slate-900/90 p-2 rounded flex flex-col items-center">
                            <Lock size={20} className="text-slate-500 mb-1" />
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Bloqueado</span>
                        </div>
                    </div>
                )}

                <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col items-center z-20 skew-x-[10deg]">
                    <h3 className={`text-sm font-black uppercase tracking-tighter leading-none mb-2 text-center transition-colors ${isActive ? 'text-white drop-shadow-lg' : 'text-slate-500'}`}>
                        {mode.title}
                    </h3>
                    {!isLocked && (
                        <div className="w-full flex flex-col gap-1">
                            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                                <div className={`h-full transition-all duration-1000 ${progressBarColor}`} style={{ width: `${progressPercent}%` }}></div>
                            </div>
                            {isActive && progressText && (
                                <div className="flex justify-between w-full"><span className="text-[8px] font-mono text-slate-400">DATA</span><span className={`text-[8px] font-mono font-bold ${progressTextColor}`}>{progressText}</span></div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

// --- COMPONENTE PRINCIPAL ---
const GameModeSelection = ({ profile, capturedData, onStartMode, onBack, onGoToMenu }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentIllustration, setCurrentIllustration] = useState(ILLUSTRATIONS.pokedex[0]);
  const [animateImg, setAnimateImg] = useState(false);

  // Optimizamos la lectura de datos
  const stats = useMemo(() => {
    const count = capturedData ? (Array.isArray(capturedData) ? capturedData.length : Object.values(capturedData).filter(x=>x === true).length) : 0;
    return {
        capturedCount: count,
        gymProgress: profile.gymProgress || 0,
        rocketUnlocked: profile.rocketUnlocked || false // Leemos el flag del perfil
    };
  }, [capturedData, profile]);

  const activeModeData = MODES[selectedIndex];
  const selectedModeId = activeModeData.id;

  // --- LÓGICA DE BLOQUEO CORREGIDA ---
  // Definimos las condiciones individuales PRIMERO
  const isGymLocked = stats.capturedCount < 5;
  const isEliteLocked = stats.capturedCount < 80 || stats.gymProgress < 8;
  const isRocketLocked = !stats.rocketUnlocked; // Se desbloquea si el flag es true

  // Lógica general para el botón de inicio
  const isCurrentLocked = 
      (selectedModeId === 'gym' && isGymLocked) || 
      (selectedModeId === 'elite' && isEliteLocked) || 
      (selectedModeId === 'safari') || // Safari siempre bloqueado por ahora
      (selectedModeId === 'rocket' && isRocketLocked);

  useEffect(() => {
    setAnimateImg(true);
    const timeout = setTimeout(() => {
      const collection = ILLUSTRATIONS[selectedModeId] || ILLUSTRATIONS.pokedex;
      let img = collection[Math.floor(Math.random() * collection.length)];
      if (!img) img = ILLUSTRATIONS.pokedex[0]; 
      setCurrentIllustration(img);
      setAnimateImg(false);
    }, 200); 
    return () => clearTimeout(timeout);
  }, [selectedModeId]);

  const handleStart = () => {
    if (isCurrentLocked) return;
    if (selectedModeId === 'pokedex') onStartMode('pokedex_difficulty_select'); 
    else onStartMode(selectedModeId);
  };

  const handleCardClick = useCallback((index) => setSelectedIndex(index), []);
  const goNext = () => setSelectedIndex(prev => Math.min(prev + 1, MODES.length - 1));
  const goPrev = () => setSelectedIndex(prev => Math.max(prev - 1, 0));

  return (
    <div className="w-screen h-screen bg-[#0f172a] text-white relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-white">
      {/* FONDOS */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.10)_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none"></div>
      
      {/* Fondo Dinámico según modo (Añadido caso rocket) */}
      <div className={`
        absolute inset-0 bg-gradient-to-br z-0 transition-colors duration-700
        ${activeModeData.id === 'pokedex' ? 'from-blue-900/40 to-slate-900' : ''}
        ${activeModeData.id === 'gym' ? 'from-green-900/40 to-slate-900' : ''}
        ${activeModeData.id === 'elite' ? 'from-purple-900/40 to-slate-900' : ''}
        ${activeModeData.id === 'rocket' ? 'from-red-950/60 to-black' : ''}
        ${activeModeData.id === 'safari' ? 'from-emerald-900/40 to-slate-900' : ''}
      `}></div>
      
      {/* ILUSTRACIÓN */}
      <div className={`absolute inset-0 flex items-center justify-center z-0 transition-all duration-500 transform ${animateImg ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'}`}>
         <img src={currentIllustration} alt="Illustration" className="h-[90%] w-auto max-w-none object-contain drop-shadow-xl filter brightness-110 mt-4" style={{ maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)' }} />
      </div>

      {/* HEADER */}
      <div className="absolute top-6 left-0 w-full px-8 z-50 flex justify-between pointer-events-none">
        <button onClick={onBack} className="pointer-events-auto flex items-center gap-2 bg-slate-900/80 hover:bg-slate-700 text-slate-200 hover:text-white px-5 py-2.5 rounded-tl-xl rounded-br-xl border-l-4 border-cyan-500 shadow-lg backdrop-blur-md text-xs font-bold tracking-widest uppercase transition-all transform hover:translate-x-1">
            <ArrowLeft size={16} /> VOLVER
        </button>
        <button onClick={onGoToMenu} className="pointer-events-auto flex items-center gap-2 bg-slate-900/80 hover:bg-slate-700 text-slate-200 hover:text-white px-5 py-2.5 rounded-tr-xl rounded-bl-xl border-r-4 border-yellow-500 shadow-lg backdrop-blur-md text-xs font-bold tracking-widest uppercase transition-all transform hover:-translate-x-1">
            MENÚ <Menu size={16} />
        </button>
      </div>

      {/* INFO CENTRAL */}
      <div className="absolute top-20 bottom-40 left-0 right-0 flex items-center justify-between px-8 md:px-16 z-20 pointer-events-none">
         <div className="max-w-sm space-y-3 pointer-events-auto">
            <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-black tracking-[0.2em] bg-gradient-to-r ${activeModeData.color} text-white mb-1`}>MODO SELECCIONADO</div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase drop-shadow-xl leading-none">{activeModeData.title}</h1>
            <h2 className="text-lg text-cyan-300 font-light uppercase tracking-widest border-b border-white/20 pb-1 mb-2 w-fit">{activeModeData.subtitle}</h2>
            <p className="text-slate-300 text-xs leading-relaxed bg-black/50 p-3 rounded-lg border-l-2 border-white/50 backdrop-blur-sm max-w-xs">{activeModeData.desc}</p>
        </div>
        <div className="max-w-xs space-y-2 pointer-events-auto text-right">
            <div className="bg-slate-900/70 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl space-y-3 transform skew-x-[-5deg]">
                 <ul className="space-y-2 skew-x-[5deg]">
                    {activeModeData.rules.map((rule, idx) => (
                        <li key={idx} className="flex items-start justify-end gap-2 text-xs text-slate-300"><span className="text-right">{rule}</span><span className={`mt-1 w-1 h-1 rounded-full bg-gradient-to-br ${activeModeData.color}`}></span></li>
                    ))}
                </ul>
                <div className="pt-2 flex justify-end skew-x-[5deg]">
                    <button onClick={handleStart} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-black text-sm uppercase tracking-widest shadow-lg transition-all ${isCurrentLocked ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : `bg-gradient-to-r ${activeModeData.color} text-white hover:scale-105 hover:brightness-110`}`}>
                        {isCurrentLocked ? <><Lock size={16} /> Bloqueado</> : selectedModeId === 'pokedex' ? <><LogIn size={16} /> ENTRAR</> : <><Play fill="currentColor" size={16} /> INICIAR</>}
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* CARRUSEL INFERIOR */}
      <div className="absolute bottom-0 left-0 w-full pb-6 z-40 pointer-events-none flex justify-center items-end">
        <div className="pointer-events-auto pb-16 pr-4">
            <button onClick={goPrev} disabled={selectedIndex === 0} className={`p-2 rounded-full bg-slate-800/80 border border-slate-600 hover:bg-cyan-900 hover:border-cyan-400 transition-all ${selectedIndex === 0 ? 'opacity-0 cursor-default' : 'opacity-100'}`}><ChevronLeft size={24} /></button>
        </div>

        <div className="flex justify-center items-end gap-4 pointer-events-auto">
            {MODES.map((mode, index) => {
                if (index < selectedIndex - 1 || index > selectedIndex + 1) return null;
                
                // LÓGICA DE BLOQUEO PARA TARJETAS INDIVIDUALES
                const isLocked = 
                    (mode.id === 'gym' && isGymLocked) || 
                    (mode.id === 'elite' && isEliteLocked) || 
                    (mode.id === 'safari') || 
                    (mode.id === 'rocket' && isRocketLocked);

                return (
                    <GameModeCard
                        key={mode.id}
                        mode={mode}
                        index={index}
                        isActive={index === selectedIndex}
                        onClick={handleCardClick}
                        capturedCount={stats.capturedCount}
                        gymProgress={stats.gymProgress}
                        isLocked={isLocked}
                    />
                );
            })}
        </div>

        <div className="pointer-events-auto pb-16 pl-4">
            <button onClick={goNext} disabled={selectedIndex === MODES.length - 1} className={`p-2 rounded-full bg-slate-800/80 border border-slate-600 hover:bg-cyan-900 hover:border-cyan-400 transition-all ${selectedIndex === MODES.length - 1 ? 'opacity-0 cursor-default' : 'opacity-100'}`}><ChevronRight size={24} /></button>
        </div>
      </div>
    </div>
  );
};

export default GameModeSelection;