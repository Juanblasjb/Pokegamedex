import React, { useState, useEffect } from 'react';
import { ArrowLeft, Menu, Trophy, Map, BookOpen, Play, Lock, ChevronLeft, ChevronRight, Leaf, Shield, LogIn } from 'lucide-react';

// --- CONFIGURACIÓN DE IMÁGENES ---
const ILLUSTRATIONS = {
  pokedex: [
    'assets/pokemon/normal/123.png',
    'assets/pokemon/normal/124.png',
    'assets/pokemon/normal/125.png',
    'assets/pokemon/normal/126.png',
    'assets/pokemon/normal/127.png',
  ],
  gym: [
    '/assets/gym_leaders/misty_full_art.png',
    '/assets/gym_leaders/brock_full_art.png',
    '/assets/gym_leaders/surge_full_art.png',
  ],
  elite: [
    '/assets/gym_leaders/lorelei_full_art.png',
    '/assets/gym_leaders/bruno_full_art.png',
    '/assets/gym_leaders/agatha_full_art.png',
    '/assets/gym_leaders/lance_full_art.png',
    '/assets/gym_leaders/blue_full_art.png',
  ],
  safari: ['https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/115.png'],
  rocket: ['https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png']
};

// --- CONFIGURACIÓN DE MODOS ---
const MODES = [
  {
    id: 'pokedex',
    title: 'MODO POKÉDEX',
    subtitle: 'El desafío clásico',
    desc: 'Completa la enciclopedia definitiva. Captura a los 150 Pokémon de Kanto.',
    icon: <BookOpen size={20} />,
    color: 'from-blue-500 to-cyan-500',
    rules: ["Responde para capturar.", "Completa los 150.", "Abre nuevas zonas."],
    // Asegúrate de poner aquí la ruta a tu imagen de tarjeta
    cardImage: 'assets/Pokedex_silueta/5.png', 
  },
  {
    id: 'gym',
    title: 'GIMNASIOS',
    subtitle: 'Camino a la Liga',
    desc: 'Enfréntate a los 8 Líderes. Demuestra tu conocimiento sobre tipos.',
    icon: <Map size={20} />,
    color: 'from-orange-500 to-red-500',
    rules: ["Desbloqueo: 5 Capturas.", "Reto Brock: 10 Capturas.", "Gana Medallas."],
    cardImage: '/assets/cards/mode_gym.png',
  },
  {
    id: 'elite',
    title: 'ALTO MANDO',
    subtitle: 'La prueba final',
    desc: 'Derrota a la Élite 4 y al Campeón para convertirte en Leyenda.',
    icon: <Trophy size={20} />,
    color: 'from-purple-600 to-indigo-600',
    rules: ["Req: 8 Medallas + 90 Capturas.", "Lore avanzado.", "Encuentro con Mewtwo."],
    cardImage: '/assets/cards/mode_elite.png',
  },
  {
    id: 'safari',
    title: 'ZONA SAFARI',
    subtitle: 'Captura Rápida',
    desc: 'Un modo contrarreloj donde debes capturar Pokémon raros antes de que huyan.',
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
    color: 'from-gray-600 to-slate-800',
    rules: ["Batallas dobles.", "Robo de objetos.", "Historia oscura."]
  }
];

const GameModeSelection = ({ profile, capturedData, onStartMode, onBack, onGoToMenu }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentIllustration, setCurrentIllustration] = useState(ILLUSTRATIONS.pokedex[0]);
  const [animateImg, setAnimateImg] = useState(false);

  const capturedCount = capturedData ? (Array.isArray(capturedData) ? capturedData.length : Object.values(capturedData).filter(x=>x === true).length) : 0;
  const gymProgress = profile.gymProgress || 0; 
  const eliteProgress = profile.eliteProgress || 0;

  const activeModeData = MODES[selectedIndex];
  const selectedModeId = activeModeData.id;

  const isGymLocked = capturedCount < 5; 
  const isEliteLocked = capturedCount < 80 || gymProgress < 8; 
  const isSafariLocked = true; 
  const isRocketLocked = true;

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
    if (selectedModeId === 'gym' && isGymLocked) return;
    if (selectedModeId === 'elite' && isEliteLocked) return;
    if (selectedModeId === 'safari' && isSafariLocked) return;
    if (selectedModeId === 'rocket' && isRocketLocked) return;

    if (selectedModeId === 'pokedex') {
        onStartMode('pokedex_difficulty_select'); 
    } else {
        onStartMode(selectedModeId);
    }
  };

  const goNext = () => {
    if (selectedIndex < MODES.length - 1) setSelectedIndex(prev => prev + 1);
  };
  
  const goPrev = () => {
    if (selectedIndex > 0) setSelectedIndex(prev => prev - 1);
  };

  const isCurrentLocked = 
    (selectedModeId === 'gym' && isGymLocked) || 
    (selectedModeId === 'elite' && isEliteLocked) ||
    (selectedModeId === 'safari' && isSafariLocked) ||
    (selectedModeId === 'rocket' && isRocketLocked);

  return (
    <div className="w-screen h-screen bg-[#0f172a] text-white relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* 1. FONDOS */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.10)_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none"></div>
      <div className={`absolute inset-0 bg-gradient-to-br ${activeModeData.id === 'pokedex' ? 'from-blue-900/40' : activeModeData.id === 'gym' ? 'from-green-900/40' : 'from-purple-900/40' } to-slate-900 z-0 transition-colors duration-700`}></div>
      <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-white/5 to-transparent skew-x-[-12deg] z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-10 pointer-events-none"></div>

      {/* 2. ILUSTRACIÓN */}
      <div className={`absolute inset-0 flex items-center justify-center z-0 transition-all duration-500 transform ${animateImg ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'}`}>
         <img 
            src={currentIllustration} 
            alt="Illustration" 
            className="h-[90%] w-auto max-w-none object-contain drop-shadow-xl filter brightness-110 mt-4"
            style={{ 
                maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)' 
            }}
            onError={(e) => e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'}
         />
      </div>

      {/* 3. HEADER */}
      <div className="absolute top-6 left-0 w-full px-8 z-50 flex justify-between pointer-events-none">
        <button onClick={onBack} className="pointer-events-auto flex items-center gap-2 bg-slate-900/80 hover:bg-slate-700 text-slate-200 hover:text-white px-5 py-2.5 rounded-tl-xl rounded-br-xl border-l-4 border-cyan-500 shadow-lg backdrop-blur-md text-xs font-bold tracking-widest uppercase transition-all transform hover:translate-x-1">
            <ArrowLeft size={16} /> VOLVER
        </button>
        <button onClick={onGoToMenu} className="pointer-events-auto flex items-center gap-2 bg-slate-900/80 hover:bg-slate-700 text-slate-200 hover:text-white px-5 py-2.5 rounded-tr-xl rounded-bl-xl border-r-4 border-yellow-500 shadow-lg backdrop-blur-md text-xs font-bold tracking-widest uppercase transition-all transform hover:-translate-x-1">
            MENÚ <Menu size={16} />
        </button>
      </div>

      {/* 4. INFO CENTRAL */}
      <div className="absolute top-20 bottom-40 left-0 right-0 flex items-center justify-between px-8 md:px-16 z-20 pointer-events-none">
        <div className="max-w-sm space-y-3 pointer-events-auto">
            <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-black tracking-[0.2em] bg-gradient-to-r ${activeModeData.color} text-white mb-1`}>MODO SELECCIONADO</div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase drop-shadow-xl leading-none">{activeModeData.title}</h1>
            <h2 className="text-lg text-cyan-300 font-light uppercase tracking-widest border-b border-white/20 pb-1 mb-2 w-fit">{activeModeData.subtitle}</h2>
            <p className="text-slate-300 text-xs leading-relaxed bg-black/50 p-3 rounded-lg border-l-2 border-white/50 backdrop-blur-sm max-w-xs">{activeModeData.desc}</p>
        </div>

        <div className="max-w-xs space-y-2 pointer-events-auto text-right">
            <div className="flex items-center justify-end gap-2 mb-2">
                <div className="h-0.5 w-8 bg-white/50"></div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Misión</span>
            </div>
            <div className="bg-slate-900/70 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl space-y-3 transform skew-x-[-5deg]">
                <ul className="space-y-2 skew-x-[5deg]">
                    {activeModeData.rules.map((rule, idx) => (
                        <li key={idx} className="flex items-start justify-end gap-2 text-xs text-slate-300">
                            <span className="text-right">{rule}</span>
                            <span className={`mt-1 w-1 h-1 rounded-full bg-gradient-to-br ${activeModeData.color}`}></span>
                        </li>
                    ))}
                </ul>
                <div className="pt-2 flex justify-end skew-x-[5deg]">
                    <button 
                        onClick={handleStart}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-black text-sm uppercase tracking-widest shadow-lg transition-all ${isCurrentLocked ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : `bg-gradient-to-r ${activeModeData.color} text-white hover:scale-105 hover:brightness-110`}`}
                    >
                        {isCurrentLocked ? <><Lock size={16} /> Bloqueado</> : selectedModeId === 'pokedex' ? <><LogIn size={16} /> ENTRAR</> : <><Play fill="currentColor" size={16} /> INICIAR</>}
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* 5. CARRUSEL INFERIOR (TARJETAS CORREGIDAS) */}
      <div className="absolute bottom-0 left-0 w-full pb-6 z-40 pointer-events-none flex justify-center items-end">
        <div className="pointer-events-auto pb-16 pr-4">
            <button onClick={goPrev} disabled={selectedIndex === 0} className={`p-2 rounded-full bg-slate-800/80 border border-slate-600 hover:bg-cyan-900 hover:border-cyan-400 transition-all ${selectedIndex === 0 ? 'opacity-0 cursor-default' : 'opacity-100'}`}><ChevronLeft size={24} /></button>
        </div>

        <div className="flex justify-center items-end gap-4 pointer-events-auto">
            {MODES.map((mode, index) => {
    if (index < selectedIndex - 1 || index > selectedIndex + 1) return null;
    const isActive = index === selectedIndex;
    
    // Colores dinámicos según el modo
    const themeColor = mode.id === 'hard' || mode.id === 'gym' ? 'red' : 'cyan';
    const glowColor = themeColor === 'red' ? 'rgba(239,68,68,0.5)' : 'rgba(34,211,238,0.5)';
    const borderColor = themeColor === 'red' ? 'border-red-500' : 'border-cyan-400';

    // Variables de datos (Asegúrate de tenerlas definidas arriba en el componente)
    let progressText = "";
    let isLocked = false;
    // ... (Tu lógica de progressText aquí) ...

    return (
        <div 
            key={mode.id}
            onClick={() => setSelectedIndex(index)}
            className={`
                relative group cursor-pointer transition-all duration-500 ease-out
                ${isActive ? 'w-48 h-64 -translate-y-4 z-10' : 'w-36 h-48 translate-y-2 opacity-40 hover:opacity-80 hover:-translate-y-0 z-0'}
            `}
        >
            {/* --- CONTENEDOR PRINCIPAL (GLASSMORFIMO TECH) --- */}
            <div className={`
                absolute inset-0 bg-[#020617] overflow-hidden transform skew-x-[-10deg] border-2 transition-all duration-300
                ${isActive 
                    ? `${borderColor} shadow-[0_0_30px_${glowColor}]` 
                    : 'border-slate-700 grayscale'}
            `}>
                
                {/* 1. FONDO CON GRID EN MOVIMIENTO (Solo visible si activo) */}
                <div className={`absolute inset-0 opacity-20 pointer-events-none ${isActive ? 'animate-[grid-move_3s_linear_infinite]' : ''}`}
                     style={{ 
                         backgroundImage: `radial-gradient(${themeColor === 'red' ? '#ef4444' : '#22d3ee'} 1px, transparent 1px)`,
                         backgroundSize: '20px 20px'
                     }}
                ></div>

                {/* 2. IMAGEN "HOLOGRÁFICA" (Fusión con el fondo) */}
                {/* 1. NÚCLEO TECH (SIN IMÁGENES, PURO CSS) */}
<div className="absolute inset-0 bg-[#020617] flex items-center justify-center overflow-hidden">
    
    {/* A. Fondo Radial Sutil */}
    <div className={`absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,${themeColor === 'red' ? 'rgba(220,38,38,0.3)' : 'rgba(34,211,238,0.2)'}_0%,transparent_70%)]`}></div>

    {/* B. Anillos Decorativos (Giratorios) */}
    <div className={`absolute w-[140%] aspect-square border border-dashed rounded-full opacity-20 animate-[spin_10s_linear_infinite] ${isActive ? (themeColor === 'red' ? 'border-red-500' : 'border-cyan-500') : 'border-slate-700'}`}></div>
    <div className={`absolute w-[110%] aspect-square border border-dotted rounded-full opacity-20 animate-[spin_15s_linear_infinite_reverse] ${isActive ? (themeColor === 'red' ? 'border-red-500' : 'border-cyan-500') : 'border-slate-700'}`}></div>

    {/* C. EL ICONO CENTRAL (GIGANTE Y GLOW) */}
    <div className="relative z-10 flex items-center justify-center">
        {/* Resplandor detrás del icono */}
        <div className={`absolute inset-0 blur-2xl opacity-50 transform scale-150 ${isActive ? (themeColor === 'red' ? 'bg-red-500' : 'bg-cyan-500') : 'bg-transparent'}`}></div>
        
        {/* El Icono Vectorial */}
        <div className={`
            transform transition-all duration-500
            ${isActive 
                ? `scale-[3] ${themeColor === 'red' ? 'text-red-500 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]' : 'text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]'}` 
                : 'scale-[2] text-slate-700'
            }
        `}>
            {mode.icon}
        </div>
    </div>

    {/* D. Decoración de Ruido de Fondo (Grid Hexagonal opcional si quieres) */}
    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

    {/* --- EFECTOS DE CAPA (LOS MISMOS DE ANTES) --- */}
    
    {/* Oscurecimiento inferior */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>

    {/* Scanlines (Esenciales para el look) */}
    <div className="absolute inset-0 bg-[linear-gradient(transparent_2px,rgba(0,0,0,0.8)_3px)] bg-[size:100%_4px] pointer-events-none z-20"></div>

    {/* Datos Técnicos */}
    {isActive && (
        <div className="absolute top-2 right-2 flex flex-col items-end opacity-70 z-20 skew-x-[10deg]">
            <span className={`text-[6px] font-mono font-bold leading-none ${themeColor === 'red' ? 'text-red-400' : 'text-cyan-400'}`}>
                SYS_MOD: {mode.id.toUpperCase()}
            </span>
            <span className="text-[6px] font-mono text-white/50 leading-none mt-0.5">
                CORE_TEMP: {Math.floor(Math.random() * 50 + 30)}°C
            </span>
        </div>
    )}
</div>

                {/* 5. OVERLAY DE BLOQUEO (Diseño "Access Denied") */}
                {isLocked && (
                    <div className="absolute inset-0 bg-black/80 z-30 flex flex-col items-center justify-center backdrop-blur-[2px]">
                        <div className="transform skew-x-[10deg] border border-slate-600 bg-slate-900/90 p-2 rounded flex flex-col items-center">
                            <Lock size={20} className="text-slate-500 mb-1" />
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Acceso Denegado</span>
                        </div>
                        {/* Patrón de rayas diagonales */}
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.5)_10px,rgba(0,0,0,0.5)_20px)] opacity-50 pointer-events-none"></div>
                    </div>
                )}

                {/* 6. CONTENIDO INFERIOR (Títulos) */}
                <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col items-center z-20 skew-x-[10deg]">
                    <h3 className={`text-sm font-black uppercase tracking-tighter leading-none mb-2 text-center transition-colors ${isActive ? 'text-white drop-shadow-lg' : 'text-slate-500'}`}>
                        {mode.title}
                    </h3>
                    
                    {/* Barra de Progreso Tech */}
                    {!isLocked && (
                        <div className="w-full flex flex-col gap-1">
                            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                                <div 
                                    className={`h-full ${themeColor === 'red' ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-cyan-400 shadow-[0_0_10px_cyan]'}`} 
                                    style={{ width: mode.id === 'pokedex' ? `${(capturedCount/150)*100}%` : mode.id === 'gym' ? `${(gymProgress/8)*100}%` : '0%' }} 
                                ></div>
                            </div>
                            {isActive && progressText && (
                                <div className="flex justify-between w-full">
                                    <span className="text-[8px] font-mono text-slate-400">DATA</span>
                                    <span className={`text-[8px] font-mono font-bold ${themeColor === 'red' ? 'text-red-400' : 'text-cyan-400'}`}>
                                        {progressText}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Triángulo indicador flotante */}
            {isActive && (
                <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 animate-bounce`}>
                    <div className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] ${themeColor === 'red' ? 'border-b-red-500' : 'border-b-cyan-400'}`}></div>
                </div>
            )}
        </div>
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