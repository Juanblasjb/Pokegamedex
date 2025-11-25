import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Skull, Play, ChevronLeft, ChevronRight } from 'lucide-react';

// --- CONFIGURACIÓN DE ILUSTRACIONES ---
const ILLUSTRATIONS = {
  normal: 'assets/pokemon/normal/25.png',
  hard: 'assets/pokemon/normal/150.png',
};

// --- CONFIGURACIÓN DE MODOS ---
const MODES = [
  {
    id: 'normal',
    title: 'ESTÁNDAR',
    subtitle: 'Entrenamiento Básico',
    desc: 'El desafío clásico. Captura Pokémon sin presión de tiempo. Ideal para recolectar datos y completar la Pokédex.',
    icon: <BookOpen size={20} />, 
    color: 'from-blue-500 to-cyan-500',
    rules: ["Sin límite de tiempo.", "Intentos ilimitados.", "Captura segura."],
  },
  {
    id: 'hard',
    title: 'HARDCORE',
    subtitle: 'Muerte Súbita',
    desc: 'Desafío de alto riesgo. Cuentas con 3 vidas y un cronómetro. Si fallas, pierdes la oportunidad de captura.',
    icon: <Skull size={20} />, 
    color: 'from-red-600 to-orange-600',
    rules: ["3 Vidas (Escudos).", "Cronómetro activo.", "Mayor Recompensa."],
  }
];

// ACEPTAMOS LA NUEVA PROP hardCapturedData
const PokedexModeSelection = ({ onBack, onSelectMode, capturedData, hardCapturedData }) => {
  const [selectedIndex, setSelectedIndex] = useState(0); 
  const [currentIllustration, setCurrentIllustration] = useState(ILLUSTRATIONS.normal);
  const [animateImg, setAnimateImg] = useState(false);

  const activeModeData = MODES[selectedIndex];
  
  // FUNCIÓN HELPER PARA CONTAR (Se usa individualmente para cada tarjeta)
  const getCount = (data) => {
      if (!data) return 0;
      return Array.isArray(data) ? data.length : Object.values(data).filter(x => x === true).length;
  };

  const totalPokemon = 150;

  useEffect(() => {
    setAnimateImg(true);
    const timeout = setTimeout(() => {
      setCurrentIllustration(ILLUSTRATIONS[activeModeData.id]);
      setAnimateImg(false);
    }, 200); 
    return () => clearTimeout(timeout);
  }, [selectedIndex, activeModeData.id]);

  const goNext = () => {
    if (selectedIndex < MODES.length - 1) setSelectedIndex(prev => prev + 1);
  };
  
  const goPrev = () => {
    if (selectedIndex > 0) setSelectedIndex(prev => prev - 1);
  };

  const handleStart = () => {
      onSelectMode(activeModeData.id);
  };

  return (
    <div className="w-screen h-screen bg-[#0f172a] text-white relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-white">
      
      <style>{`
        @keyframes scan-vertical {
          0% { top: -10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
        @keyframes grid-move {
          0% { background-position: 0 0; }
          100% { background-position: 20px 20px; }
        }
      `}</style>

      {/* 1. FONDOS GLOBALES */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.10)_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none"></div>
      <div className={`absolute inset-0 bg-gradient-to-br transition-colors duration-700 z-0 ${activeModeData.id === 'normal' ? 'from-blue-900/40' : 'from-red-900/40'} to-slate-900`}></div>
      <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-white/5 to-transparent skew-x-[-12deg] z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-10 pointer-events-none"></div>

      {/* 2. ILUSTRACIÓN CENTRAL */}
      <div className={`absolute inset-0 flex items-center justify-center z-0 transition-all duration-500 transform ${animateImg ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'}`}>
         <div className={`absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-10 transition-colors duration-700 ${activeModeData.id === 'hard' ? 'bg-red-600' : 'bg-cyan-500'}`}></div>
         <img src={currentIllustration} alt="Illustration" className="h-[90%] w-auto max-w-none object-contain drop-shadow-xl filter brightness-110 mt-4" style={{ maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)' }} onError={(e) => e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'}/>
      </div>

      {/* 3. HEADER */}
      <div className="absolute top-6 left-0 w-full px-8 z-50 flex justify-between pointer-events-none">
        <button onClick={onBack} className="pointer-events-auto flex items-center gap-2 bg-slate-900/80 hover:bg-slate-700 text-slate-200 hover:text-white px-5 py-2.5 rounded-tl-xl rounded-br-xl border-l-4 border-cyan-500 shadow-lg backdrop-blur-md text-xs font-bold tracking-widest uppercase transition-all transform hover:translate-x-1">
            <ArrowLeft size={16} /> VOLVER
        </button>
      </div>

      {/* 4. INFO CENTRAL */}
      <div className="absolute top-20 bottom-40 left-0 right-0 flex items-center justify-between px-8 md:px-16 z-20 pointer-events-none">
        <div className="max-w-sm space-y-3 pointer-events-auto">
            <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-black tracking-[0.2em] bg-gradient-to-r ${activeModeData.color} text-white mb-1`}>MODO SELECCIONADO</div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase drop-shadow-xl leading-none">{activeModeData.title}</h1>
            <h2 className={`text-lg font-light uppercase tracking-widest border-b border-white/20 pb-1 mb-2 w-fit transition-colors duration-300 ${activeModeData.id === 'hard' ? 'text-red-400' : 'text-cyan-300'}`}>{activeModeData.subtitle}</h2>
            <p className="text-slate-300 text-xs leading-relaxed bg-black/50 p-3 rounded-lg border-l-2 border-white/50 backdrop-blur-sm max-w-xs">{activeModeData.desc}</p>
        </div>

        <div className="max-w-xs space-y-2 pointer-events-auto text-right">
            <div className="flex items-center justify-end gap-2 mb-2">
                <div className="h-0.5 w-8 bg-white/50"></div>
                <span className={`text-xs font-bold uppercase tracking-widest ${activeModeData.id === 'hard' ? 'text-red-400' : 'text-cyan-400'}`}>Condiciones</span>
            </div>
            <div className={`bg-slate-900/70 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl space-y-3 transform skew-x-[-5deg] transition-all duration-300 ${activeModeData.id === 'hard' ? 'border-red-900/50 shadow-red-900/20' : 'border-cyan-900/50 shadow-cyan-900/20'}`}>
                <ul className="space-y-2 skew-x-[5deg]">
                    {activeModeData.rules.map((rule, idx) => (
                        <li key={idx} className="flex items-start justify-end gap-2 text-xs text-slate-300">
                            <span className="text-right">{rule}</span>
                            <span className={`mt-1 w-1 h-1 rounded-full bg-gradient-to-br ${activeModeData.id === 'hard' ? 'from-red-500 to-orange-500' : 'from-blue-500 to-cyan-500'}`}></span>
                        </li>
                    ))}
                </ul>
                <div className="pt-2 flex justify-end skew-x-[5deg]">
                    <button 
                        onClick={handleStart}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-black text-sm uppercase tracking-widest shadow-lg transition-all transform hover:scale-105 hover:skew-x-[-5deg] bg-gradient-to-r ${activeModeData.color} text-white`}
                    >
                        {activeModeData.id === 'hard' ? <><Play fill="currentColor" size={16} /> INICIAR</> : <><Play fill="currentColor" size={16} /> INICIAR</>}
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* 5. CARRUSEL INFERIOR */}
      <div className="absolute bottom-0 left-0 w-full pb-6 z-40 pointer-events-none flex justify-center items-end">
        
        <div className="pointer-events-auto pb-16 pr-4">
            <button onClick={goPrev} disabled={selectedIndex === 0} className={`p-2 rounded-full bg-slate-800/80 border border-slate-600 transition-all ${selectedIndex === 0 ? 'opacity-0 cursor-default' : 'opacity-100 hover:bg-cyan-900 hover:border-cyan-400'}`}><ChevronLeft size={24} /></button>
        </div>

        <div className="flex justify-center items-end gap-4 pointer-events-auto">
            {MODES.map((mode, index) => {
                if (index < selectedIndex - 1 || index > selectedIndex + 1) return null;
                const isActive = index === selectedIndex;
                
                const themeColor = mode.id === 'hard' ? 'red' : 'cyan';
                const glowColor = themeColor === 'red' ? 'rgba(239,68,68,0.5)' : 'rgba(34,211,238,0.5)';
                const borderColor = themeColor === 'red' ? 'border-red-500' : 'border-cyan-400';

                // --- LÓGICA DE CONTEO ESPECÍFICA POR TARJETA ---
                // Aquí decidimos qué datos mostrar
                const currentCount = mode.id === 'hard' ? getCount(hardCapturedData) : getCount(capturedData);
                const progressPercent = (currentCount / totalPokemon) * 100;

                return (
                    <div 
                        key={mode.id}
                        onClick={() => setSelectedIndex(index)}
                        className={`
                            relative group cursor-pointer transition-all duration-500 ease-out
                            ${isActive ? 'w-48 h-64 -translate-y-4 z-10' : 'w-36 h-48 translate-y-2 opacity-40 hover:opacity-80 hover:-translate-y-0 z-0'}
                        `}
                    >
                        {/* CONTENEDOR TECH CORE */}
                        <div className={`
                            absolute inset-0 bg-[#020617] overflow-hidden transform skew-x-[-10deg] border-2 transition-all duration-300
                            ${isActive 
                                ? `${borderColor} shadow-[0_0_30px_${glowColor}]` 
                                : 'border-slate-700 grayscale'}
                        `}>
                            
                            {/* NÚCLEO CENTRAL */}
                            <div className="absolute inset-0 bg-[#020617] flex items-center justify-center overflow-hidden">
                                <div className={`absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,${themeColor === 'red' ? 'rgba(220,38,38,0.3)' : 'rgba(34,211,238,0.2)'}_0%,transparent_70%)]`}></div>
                                <div className={`absolute w-[140%] aspect-square border border-dashed rounded-full opacity-20 animate-[spin_10s_linear_infinite] ${isActive ? (themeColor === 'red' ? 'border-red-500' : 'border-cyan-500') : 'border-slate-700'}`}></div>
                                <div className={`absolute w-[110%] aspect-square border border-dotted rounded-full opacity-20 animate-[spin_15s_linear_infinite_reverse] ${isActive ? (themeColor === 'red' ? 'border-red-500' : 'border-cyan-500') : 'border-slate-700'}`}></div>

                                <div className="relative z-10 flex items-center justify-center">
                                    <div className={`absolute inset-0 blur-2xl opacity-50 transform scale-150 ${isActive ? (themeColor === 'red' ? 'bg-red-500' : 'bg-cyan-500') : 'bg-transparent'}`}></div>
                                    <div className={`transform transition-all duration-500 ${isActive ? `scale-[3] ${themeColor === 'red' ? 'text-red-500 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]' : 'text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]'}` : 'scale-[2] text-slate-700'}`}>
                                        {mode.icon}
                                    </div>
                                </div>
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                            </div>

                            {/* SCAN LÁSER */}
                            {isActive && (
                                <div className={`absolute left-0 w-full h-[20%] bg-gradient-to-b from-transparent via-${themeColor}-400/30 to-transparent blur-md pointer-events-none`} style={{ animation: 'scan-vertical 2.5s linear infinite' }}>
                                    <div className={`w-full h-[1px] bg-${themeColor}-400 shadow-[0_0_10px_${themeColor}]`}></div>
                                </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_2px,rgba(0,0,0,0.8)_3px)] bg-[size:100%_4px] pointer-events-none z-20"></div>

                            {/* ESQUINAS */}
                            <div className="absolute top-0 left-0 w-full h-full p-2 pointer-events-none z-20">
                                <div className={`absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 ${isActive ? `border-${themeColor}-500` : 'border-slate-600'}`}></div>
                                <div className={`absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 ${isActive ? `border-${themeColor}-500` : 'border-slate-600'}`}></div>
                                
                                {isActive && (
                                    <div className="absolute top-2 right-2 flex flex-col items-end">
                                        <span className={`text-[6px] font-mono font-bold uppercase tracking-widest ${themeColor === 'red' ? 'text-red-400' : 'text-cyan-400'}`}>ONLINE</span>
                                    </div>
                                )}
                            </div>

                            {/* TEXTO Y BARRA DE PROGRESO (AQUÍ SE MUESTRA EL DATO) */}
                            <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col items-center z-30 skew-x-[10deg]">
                                <h3 className={`text-sm font-black uppercase tracking-tighter leading-none mb-2 text-center transition-colors ${isActive ? 'text-white drop-shadow-lg' : 'text-slate-500'}`}>
                                    {mode.title}
                                </h3>
                                
                                <div className="w-full flex flex-col gap-1">
                                    {/* Barra */}
                                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                                        <div 
                                            className={`h-full ${themeColor === 'red' ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-cyan-400 shadow-[0_0_10px_cyan]'}`} 
                                            style={{ width: `${progressPercent}%` }} 
                                        ></div>
                                    </div>
                                    
                                    {/* Texto de Progreso INDEPENDIENTE */}
                                    {isActive && (
                                        <div className="flex justify-between w-full items-end">
                                            <span className="text-[6px] font-mono text-slate-400">DATA</span>
                                            <span className={`text-[8px] font-mono font-bold ${themeColor === 'red' ? 'text-red-400' : 'text-cyan-400'}`}>
                                                {currentCount} / {totalPokemon}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
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
            <button onClick={goNext} disabled={selectedIndex === MODES.length - 1} className={`p-2 rounded-full bg-slate-800/80 border border-slate-600 transition-all ${selectedIndex === MODES.length - 1 ? 'opacity-0 cursor-default' : 'opacity-100 hover:bg-cyan-900 hover:border-cyan-400'}`}><ChevronRight size={24} /></button>
        </div>
      </div>
    </div>
  );
};

export default PokedexModeSelection;