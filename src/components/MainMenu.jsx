import React, { useState } from 'react';
import { menuOptions, defaultContent } from './menuData';
import { 
  Lock, 
  Play,          // Nueva Partida
  Save,          // Continuar
  IdCard,        // Ficha
  Settings,      // Opciones
  HelpCircle,    // Ayuda
  ShoppingBag    // Tienda
} from 'lucide-react';

// --- MAPA DE ICONOS ---
const ICON_MAP = {
    new_game: Play,
    continue_game: Save,
    trainer_card: IdCard,
    options: Settings,
    help: HelpCircle,
    shop: ShoppingBag,
};

const MainMenu = ({ onNewGame, onContinueGame, onOpenTrainerCard, hasSaveData }) => {
    const [activeContent, setActiveContent] = useState(defaultContent);
    const [animateImg, setAnimateImg] = useState(false);

    const handleMouseEnter = (option) => {
        // Animación de cambio de imagen
        if (activeContent.id !== option.id) {
            setAnimateImg(true);
            setTimeout(() => setAnimateImg(false), 300);
        }
        // Actualizamos la info siempre (para ver qué es la opción aunque esté bloqueada)
        setActiveContent(option);
    };

    const handleMouseLeave = () => {
        setActiveContent(defaultContent);
    };

    return (
        <div className="w-screen h-screen bg-[#0f172a] text-white relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-white">
            
            {/* --- FONDOS GLOBALES (UNIFORMIDAD ALTA VISIBILIDAD) --- */}
            
            {/* 1. Textura Fibra de Carbono */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0"></div>
            
            {/* 2. Degradado Ambiental (Base oscura) */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-[#0f172a] to-slate-900 z-0 pointer-events-none"></div>

            {/* 3. MALLA TECNOLÓGICA (High Visibility) */}
            {/* Opacidad subida a 0.07 y colocada ENCIMA del degradado para que resalte como en la carga */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.07)_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none"></div>
            
            {/* 4. Luz lateral decorativa */}
            <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-cyan-900/10 to-transparent skew-x-[-12deg] z-0 pointer-events-none"></div>


            {/* --- CONTENEDOR PRINCIPAL --- */}
            <div className="relative z-10 flex w-full h-full">

                {/* --- IZQUIERDA: ILUSTRACIÓN --- */}
                <div className="flex-1 flex items-end justify-center relative">
                    {/* Luz ambiental detrás del Pokémon */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

                    <img 
                        src={activeContent.pokemonImage} 
                        alt="Pokémon"
                        className={`
                            h-[80vh] w-auto max-w-none object-contain transition-all duration-500 ease-out z-10
                            ${animateImg ? 'opacity-50 translate-x-5 blur-sm' : 'opacity-100 translate-x-0 blur-0'}
                        `}
                        style={{ 
                            maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                            filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))'
                        }}
                    />
                </div>

                {/* --- DERECHA: MENÚ --- */}
                <div className="flex-1 flex flex-col justify-center px-16 py-12 space-y-10">
                    
                    {/* TEXTOS */}
                    <div className="space-y-3 min-h-[180px]">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-0.5 w-12 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.3em] animate-fade-in">
                                {activeContent.modeTitle || 'SISTEMA'}
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-white drop-shadow-2xl leading-none animate-fade-in">
                            {activeContent.mainTitle}
                        </h1>

                        <div className="max-w-lg">
                            <p className="text-slate-400 text-sm leading-relaxed font-medium border-l-2 border-slate-700 pl-4 py-1 animate-fade-in">
                                {activeContent.subtitle}
                            </p>
                        </div>
                    </div>
                    
                    {/* GRID DE OPCIONES (Estilo Tech-Modules) */}
                    <div className="grid grid-cols-3 gap-5 w-full max-w-2xl">
                        {menuOptions.map((option) => {
                            const needsSaveData = ['continue_game', 'trainer_card'].includes(option.id);
                            const isDisabled = needsSaveData && !hasSaveData;
                            const isActive = activeContent.id === option.id;
                            const IconComponent = ICON_MAP[option.id] || HelpCircle;

                            let clickHandler = null;
                            if (option.id === 'new_game') clickHandler = onNewGame;
                            else if (option.id === 'continue_game') clickHandler = onContinueGame;
                            else if (option.id === 'trainer_card') clickHandler = onOpenTrainerCard;

                            return (
                                <button 
                                    key={option.id}
                                    disabled={isDisabled}
                                    onMouseEnter={() => handleMouseEnter(option)}
                                    onMouseLeave={handleMouseLeave}
                                    onClick={!isDisabled ? clickHandler : undefined}
                                    className={`
                                        group relative flex flex-col items-center justify-center h-32 rounded-lg transition-all duration-300 overflow-hidden
                                        ${isDisabled 
                                            ? 'bg-slate-900/30 border border-slate-800 opacity-50 cursor-not-allowed grayscale' 
                                            : isActive
                                                ? 'bg-slate-800/80 border border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)] -translate-y-1'
                                                : 'bg-slate-900/60 border border-slate-700 hover:bg-slate-800 hover:border-slate-500'
                                        }
                                    `}
                                >
                                    {/* Fondo activo con rejilla */}
                                    {!isDisabled && isActive && (
                                        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:10px_10px] opacity-50"></div>
                                    )}

                                    {/* Decoración de esquinas (Tech Corners) */}
                                    {!isDisabled && (
                                        <>
                                            <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 transition-colors ${isActive ? 'border-cyan-400' : 'border-slate-600'}`}></div>
                                            <div className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 transition-colors ${isActive ? 'border-cyan-400' : 'border-slate-600'}`}></div>
                                            <div className={`absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 transition-colors ${isActive ? 'border-cyan-400' : 'border-slate-600'}`}></div>
                                            <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 transition-colors ${isActive ? 'border-cyan-400' : 'border-slate-600'}`}></div>
                                        </>
                                    )}

                                    {/* Icono */}
                                    <div className={`relative z-10 mb-3 transition-all duration-300 ${isActive ? 'scale-110 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-slate-500 group-hover:text-slate-300'}`}>
                                        <IconComponent size={36} strokeWidth={isActive ? 2 : 1.5} />
                                    </div>

                                    {/* Texto */}
                                    <span className={`
                                        relative z-10 text-[10px] font-black uppercase tracking-[0.15em] transition-colors
                                        ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}
                                    `}>
                                        {option.label}
                                    </span>

                                    {/* Barra de carga inferior */}
                                    <div className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${isActive ? 'w-full bg-cyan-500' : 'w-0 bg-slate-600'}`}></div>

                                    {/* Candado si está bloqueado */}
                                    {isDisabled && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20 backdrop-blur-[1px]">
                                            <Lock size={20} className="text-slate-600" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="absolute bottom-6 right-10 flex items-center gap-2 opacity-50">
                        <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                            System Online // v0.5.0
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainMenu;