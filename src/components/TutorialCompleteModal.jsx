import React, { useEffect, useState } from 'react';
import { CheckCircle2, Sparkles, ChevronDown, Gift } from 'lucide-react';

const TutorialCompleteModal = ({ onClose, rewardPokemon }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 50),
      setTimeout(() => setStep(2), 400),
      setTimeout(() => setStep(3), 800),
      setTimeout(() => setStep(4), 1100),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleClose = () => {
    setStep(5);
    setTimeout(onClose, 500);
  };

  return (
    <div 
        onClick={handleClose}
        className={`
            fixed inset-0 z-[9999] flex items-center justify-center cursor-pointer overflow-hidden
            transition-all duration-700 ease-out font-sans
            ${step >= 1 ? 'bg-[#0f172a]/95 backdrop-blur-xl' : 'bg-transparent backdrop-blur-none'}
            ${step === 5 ? 'opacity-0' : 'opacity-100'}
        `}
    >
      {/* 1. FONDO */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0"></div>
         <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none"></div>
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.15)_0%,#0f172a_90%)] z-0"></div>
      </div>

      {/* 2. LÍNEA DEL HORIZONTE */}
      <div className="absolute top-1/2 left-0 w-full h-px transform -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center">
        <div className={`
            h-[2px] bg-gradient-to-r from-transparent via-green-500 to-transparent shadow-[0_0_30px_rgba(34,197,94,1)]
            transition-all duration-1000 cubic-bezier(0.22, 1, 0.36, 1)
            ${step >= 2 ? 'w-full opacity-100 scale-x-100' : 'w-0 opacity-0 scale-x-0'}
        `}></div>
      </div>

      {/* 3. CONTENIDO CENTRAL */}
      <div className="relative z-20 flex flex-col items-center w-full max-w-4xl px-4">
        
        {/* HEADER */}
        <div className={`flex items-center gap-3 mb-8 transition-all duration-700 ${step >= 3 ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}>
            <div className="w-1.5 h-1.5 bg-green-400 rotate-45 animate-pulse"></div>
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-[0.4em] drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]">
                CERTIFICACIÓN APROBADA
            </span>
            <div className="w-1.5 h-1.5 bg-green-400 rotate-45 animate-pulse"></div>
        </div>

        {/* NÚCLEO: CONTENIDO VARIABLE (SI HAY REGALO O NO) */}
        <div className={`
            flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-8
            transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1) 
            ${step >= 3 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
        `}>
            
            {/* ITEM 1: LICENCIA (SIEMPRE APARECE) */}
            <div className="flex flex-col items-center">
                <div className="relative w-40 h-40 flex items-center justify-center">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-[50px] animate-pulse"></div>
                    <div className="absolute inset-0 border border-slate-700 rounded-full scale-105"></div>
                    <div className="relative z-30 w-24 h-24 bg-[#020617] rounded-full flex items-center justify-center border-2 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                        <CheckCircle2 size={48} className="text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,1)]" />
                    </div>
                    <Sparkles className="absolute top-0 right-4 text-green-200 animate-bounce" size={20} />
                </div>
                <p className="text-green-400 font-mono text-[10px] tracking-widest mt-2 uppercase">Licencia de Kanto</p>
            </div>

            {/* ITEM 2: POKÉMON DE REGALO (CONDICIONAL) */}
            {rewardPokemon && (
                <>
                    {/* Separador Visual */}
                    <div className="h-px w-20 md:w-px md:h-20 bg-gradient-to-r md:bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>

                    <div className="flex flex-col items-center animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
                        <div className="relative w-40 h-40 flex items-center justify-center">
                            <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-[50px] animate-pulse"></div>
                            <div className="absolute inset-0 border border-yellow-500/30 rounded-full scale-105 border-dashed animate-[spin_10s_linear_infinite]"></div>
                            
                            <div className="relative z-30 w-full h-full flex items-center justify-center">
                                <img 
                                    src={`/assets/pokemon/normal/${rewardPokemon.id}.png`} 
                                    alt={rewardPokemon.name}
                                    className="w-32 h-32 object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.6)] animate-float"
                                />
                            </div>
                            
                            <div className="absolute -top-2 -right-2 bg-yellow-500 text-black p-1.5 rounded-full shadow-lg animate-bounce">
                                <Gift size={14} />
                            </div>
                        </div>
                        <div className="text-center mt-2">
                            <p className="text-yellow-400 font-black italic text-sm tracking-wide uppercase">{rewardPokemon.name}</p>
                            <p className="text-slate-400 text-[9px] uppercase tracking-widest">Regalo de Bienvenida</p>
                        </div>
                    </div>
                </>
            )}
        </div>

        {/* TEXTO */}
        <div className={`text-center transform transition-all duration-700 delay-100 relative ${step >= 4 ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-12'}`}>
            <h1 className="text-4xl md:text-6xl font-black italic text-white uppercase tracking-tighter drop-shadow-2xl mb-2">
                TUTORIAL <span className="text-green-500">COMPLETO</span>
            </h1>
            
            <p className="text-slate-300 text-xs font-medium mt-6 max-w-md mx-auto leading-relaxed border-t border-slate-700/50 pt-4">
                {rewardPokemon 
                    ? "¡El Profesor Oak ha visto potencial en ti! Acepta este compañero para iniciar tu viaje con ventaja."
                    : "Has aprendido todo lo necesario. El mapa de Kanto está abierto para ti. ¡Reúne las 8 medallas y alcanza la gloria!"
                }
            </p>
        </div>
      </div>

      {/* 4. FOOTER */}
      <div className={`absolute bottom-10 flex flex-col items-center gap-2 transition-all duration-1000 delay-500 ${step >= 4 ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-4'}`}>
         <span className="text-[9px] font-black text-green-500 uppercase tracking-[0.3em] animate-pulse">
            Click para finalizar
         </span>
         <ChevronDown size={14} className="text-green-500 animate-bounce" />
      </div>
    </div>
  );
};

export default TutorialCompleteModal;