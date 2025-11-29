import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, BookOpen, Skull, Play, ChevronLeft, ChevronRight } from 'lucide-react';

// --- CONFIGURACIÓN ---
const ILLUSTRATIONS = {
  normal: 'assets/pokemon/normal/25.png',
  hard: 'assets/pokemon/normal/150.png',
};

const MODES = [
  {
    id: 'normal',
    title: 'ESTÁNDAR',
    subtitle: 'Entrenamiento Básico',
    desc: 'El desafío clásico. Captura Pokémon sin presión de tiempo.',
    icon: <BookOpen size={20} />, 
    color: 'from-blue-500 to-cyan-500',
    rules: ["Sin límite de tiempo.", "Intentos ilimitados.", "Captura segura."],
  },
  {
    id: 'hard',
    title: 'HARDCORE',
    subtitle: 'Muerte Súbita',
    desc: 'Desafío de alto riesgo. Cuentas con 3 vidas y un cronómetro.',
    icon: <Skull size={20} />, 
    color: 'from-red-600 to-orange-600',
    rules: ["3 Vidas (Escudos).", "Cronómetro activo.", "Mayor Recompensa."],
  }
];

// --- TARJETA OPTIMIZADA INTERNA ---
const PokedexModeCard = React.memo(({ mode, isActive, index, onClick, currentCount, totalPokemon }) => {
    const themeColor = mode.id === 'hard' ? 'red' : 'cyan';
    const glowColor = themeColor === 'red' ? 'rgba(239,68,68,0.5)' : 'rgba(34,211,238,0.5)';
    const borderColor = themeColor === 'red' ? 'border-red-500' : 'border-cyan-400';
    const progressPercent = (currentCount / totalPokemon) * 100;

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
                <div className="absolute inset-0 bg-[#020617] flex items-center justify-center overflow-hidden">
                    {isActive && (
                         <div className={`absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,${themeColor === 'red' ? 'rgba(220,38,38,0.3)' : 'rgba(34,211,238,0.2)'}_0%,transparent_70%)]`}></div>
                    )}
                    <div className="relative z-10 flex items-center justify-center">
                        {isActive && (
                             <div className={`absolute inset-0 blur-2xl opacity-50 transform scale-150 ${themeColor === 'red' ? 'bg-red-500' : 'bg-cyan-500'}`}></div>
                        )}
                        <div className={`transform transition-all duration-500 ${isActive ? `scale-[3] ${themeColor === 'red' ? 'text-red-500' : 'text-cyan-400'}` : 'scale-[2] text-slate-700'}`}>
                            {mode.icon}
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col items-center z-30 skew-x-[10deg]">
                    <h3 className={`text-sm font-black uppercase tracking-tighter leading-none mb-2 text-center transition-colors ${isActive ? 'text-white drop-shadow-lg' : 'text-slate-500'}`}>
                        {mode.title}
                    </h3>
                    <div className="w-full flex flex-col gap-1">
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                            <div className={`h-full ${themeColor === 'red' ? 'bg-red-500' : 'bg-cyan-400'}`} style={{ width: `${progressPercent}%` }}></div>
                        </div>
                        {isActive && (
                            <div className="flex justify-between w-full items-end"><span className="text-[6px] font-mono text-slate-400">DATA</span><span className={`text-[8px] font-mono font-bold ${themeColor === 'red' ? 'text-red-400' : 'text-cyan-400'}`}>{currentCount} / {totalPokemon}</span></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

// --- COMPONENTE PRINCIPAL ---
const PokedexModeSelection = ({ onBack, onSelectMode, capturedData, hardCapturedData }) => {
  const [selectedIndex, setSelectedIndex] = useState(0); 
  const [currentIllustration, setCurrentIllustration] = useState(ILLUSTRATIONS.normal);
  const [animateImg, setAnimateImg] = useState(false);

  const activeModeData = MODES[selectedIndex];
  
  const getCount = useCallback((data) => {
      if (!data) return 0;
      return Array.isArray(data) ? data.length : Object.values(data).filter(x => x === true).length;
  }, []);

  useEffect(() => {
    setAnimateImg(true);
    const timeout = setTimeout(() => {
      setCurrentIllustration(ILLUSTRATIONS[activeModeData.id]);
      setAnimateImg(false);
    }, 200); 
    return () => clearTimeout(timeout);
  }, [selectedIndex, activeModeData.id]);

  const goNext = () => setSelectedIndex(prev => Math.min(prev + 1, MODES.length - 1));
  const goPrev = () => setSelectedIndex(prev => Math.max(prev - 1, 0));
  const handleStart = () => onSelectMode(activeModeData.id);
  const handleCardClick = useCallback((index) => setSelectedIndex(index), []);

  return (
    <div className="w-screen h-screen bg-[#0f172a] text-white relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-white">
      {/* FONDOS */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.10)_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none"></div>
      <div className={`absolute inset-0 bg-gradient-to-br transition-colors duration-700 z-0 ${activeModeData.id === 'normal' ? 'from-blue-900/40' : 'from-red-900/40'} to-slate-900`}></div>
      
      {/* ILUSTRACIÓN */}
      <div className={`absolute inset-0 flex items-center justify-center z-0 transition-all duration-500 transform ${animateImg ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'}`}>
         <img src={currentIllustration} alt="Illustration" className="h-[90%] w-auto max-w-none object-contain drop-shadow-xl filter brightness-110 mt-4" style={{ maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)' }} />
      </div>

      {/* HEADER */}
      <div className="absolute top-6 left-0 w-full px-8 z-50 flex justify-between pointer-events-none">
        <button onClick={onBack} className="pointer-events-auto flex items-center gap-2 bg-slate-900/80 hover:bg-slate-700 text-slate-200 hover:text-white px-5 py-2.5 rounded-tl-xl rounded-br-xl border-l-4 border-cyan-500 shadow-lg backdrop-blur-md text-xs font-bold tracking-widest uppercase transition-all transform hover:translate-x-1">
            <ArrowLeft size={16} /> VOLVER
        </button>
      </div>

      {/* INFO CENTRAL */}
      <div className="absolute top-20 bottom-40 left-0 right-0 flex items-center justify-between px-8 md:px-16 z-20 pointer-events-none">
        <div className="max-w-sm space-y-3 pointer-events-auto">
            <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-black tracking-[0.2em] bg-gradient-to-r ${activeModeData.color} text-white mb-1`}>MODO SELECCIONADO</div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase drop-shadow-xl leading-none">{activeModeData.title}</h1>
            <h2 className={`text-lg font-light uppercase tracking-widest border-b border-white/20 pb-1 mb-2 w-fit transition-colors duration-300 ${activeModeData.id === 'hard' ? 'text-red-400' : 'text-cyan-300'}`}>{activeModeData.subtitle}</h2>
            <p className="text-slate-300 text-xs leading-relaxed bg-black/50 p-3 rounded-lg border-l-2 border-white/50 backdrop-blur-sm max-w-xs">{activeModeData.desc}</p>
        </div>

        <div className="max-w-xs space-y-2 pointer-events-auto text-right">
            <div className={`bg-slate-900/70 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl space-y-3 transform skew-x-[-5deg] transition-all duration-300 ${activeModeData.id === 'hard' ? 'border-red-900/50 shadow-red-900/20' : 'border-cyan-900/50 shadow-cyan-900/20'}`}>
                <ul className="space-y-2 skew-x-[5deg]">
                    {activeModeData.rules.map((rule, idx) => (
                        <li key={idx} className="flex items-start justify-end gap-2 text-xs text-slate-300"><span className="text-right">{rule}</span><span className={`mt-1 w-1 h-1 rounded-full bg-gradient-to-br ${activeModeData.id === 'hard' ? 'from-red-500 to-orange-500' : 'from-blue-500 to-cyan-500'}`}></span></li>
                    ))}
                </ul>
                <div className="pt-2 flex justify-end skew-x-[5deg]">
                    <button onClick={handleStart} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-black text-sm uppercase tracking-widest shadow-lg transition-all transform hover:scale-105 hover:skew-x-[-5deg] bg-gradient-to-r ${activeModeData.color} text-white`}>
                        {activeModeData.id === 'hard' ? <><Play fill="currentColor" size={16} /> INICIAR</> : <><Play fill="currentColor" size={16} /> INICIAR</>}
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* CARRUSEL INFERIOR */}
      <div className="absolute bottom-0 left-0 w-full pb-6 z-40 pointer-events-none flex justify-center items-end">
        <div className="pointer-events-auto pb-16 pr-4">
            <button onClick={goPrev} disabled={selectedIndex === 0} className={`p-2 rounded-full bg-slate-800/80 border border-slate-600 transition-all ${selectedIndex === 0 ? 'opacity-0 cursor-default' : 'opacity-100 hover:bg-cyan-900 hover:border-cyan-400'}`}><ChevronLeft size={24} /></button>
        </div>

        <div className="flex justify-center items-end gap-4 pointer-events-auto">
            {MODES.map((mode, index) => {
                if (index < selectedIndex - 1 || index > selectedIndex + 1) return null;
                const currentCount = mode.id === 'hard' ? getCount(hardCapturedData) : getCount(capturedData);

                return (
                    <PokedexModeCard 
                        key={mode.id}
                        mode={mode}
                        index={index}
                        isActive={index === selectedIndex}
                        onClick={handleCardClick}
                        currentCount={currentCount}
                        totalPokemon={150}
                    />
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