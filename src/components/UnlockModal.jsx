import React, { useEffect, useState } from 'react';
import { Map, Sparkles, ChevronDown, Unlock } from 'lucide-react';

const UnlockModal = ({ onClose }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // SECUENCIA CINEMATOGRÁFICA
    // Tiempos ajustados para dar peso a cada elemento
    const timers = [
      setTimeout(() => setStep(1), 50),   // Fondo entra
      setTimeout(() => setStep(2), 400),  // Línea horizonte se expande
      setTimeout(() => setStep(3), 800),  // Icono explota
      setTimeout(() => setStep(4), 1100), // Texto impacta
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleClose = () => {
    setStep(5); // Estado de salida (Fade out)
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
      {/* --- 1. FONDO (ADAPTADO A TU DESIGN SYSTEM) --- */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
         {/* A. Fibra de Carbono (Tu textura base) */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0"></div>
         
         {/* B. Malla Tecnológica (Copiada de tu CharacterCreation) */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.07)_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none"></div>
         
         {/* C. Vignette Radial (Foco dramático al centro) */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0f172a_90%)] z-0"></div>
      </div>

      {/* --- 2. LÍNEA DEL HORIZONTE (Horizontal Lens Flare) --- */}
      <div className="absolute top-1/2 left-0 w-full h-px transform -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center">
        {/* Línea principal cyan */}
        <div className={`
            h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(34,211,238,0.9)]
            transition-all duration-1000 cubic-bezier(0.22, 1, 0.36, 1)
            ${step >= 2 ? 'w-full opacity-100 scale-x-100' : 'w-0 opacity-0 scale-x-0'}
        `}></div>
        
        {/* Flash blanco en el centro al expandirse */}
        <div className={`absolute w-32 h-1 bg-white blur-sm rounded-full transition-all duration-500 ${step === 2 ? 'opacity-100 scale-150' : 'opacity-0 scale-0'}`}></div>
      </div>

      {/* --- 3. CONTENIDO CENTRAL --- */}
      <div className="relative z-20 flex flex-col items-center">
        
        {/* HEADER: SYSTEM ALERT */}
        <div className={`
            flex items-center gap-3 mb-10 transition-all duration-700
            ${step >= 3 ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}
        `}>
            <div className="w-1.5 h-1.5 bg-cyan-400 rotate-45 animate-pulse"></div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.4em] drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
                Nuevo Logro Desbloqueado
            </span>
            <div className="w-1.5 h-1.5 bg-cyan-400 rotate-45 animate-pulse"></div>
        </div>

        {/* NÚCLEO: ICONO Y ANILLOS */}
        <div className={`
            relative w-60 h-60 flex items-center justify-center mb-10
            transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)
            ${step >= 3 ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 rotate-90'}
        `}>
            {/* Iluminación Volumétrica (Tu estilo) - Color Naranja para Gym */}
            <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-[60px] animate-pulse"></div>

            {/* Anillos Estáticos */}
            <div className="absolute inset-0 border border-slate-600/50 rounded-full scale-105"></div>
            
            {/* Anillo Giratorio Lento (Cyan - Sistema) */}
            <div className="absolute inset-2 border-[1px] border-dashed border-cyan-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
            
            {/* Anillo Giratorio Rápido Reverso (Naranja - Gym) */}
            <div className="absolute inset-6 border-t-2 border-b-2 border-orange-500/80 rounded-full animate-[spin_3s_linear_infinite_reverse] shadow-[0_0_15px_rgba(249,115,22,0.4)]"></div>

            {/* CONTENEDOR ICONO */}
            <div className="relative z-30 w-28 h-28 bg-[#0f172a] rounded-full flex items-center justify-center border border-orange-500/40 shadow-[0_0_40px_rgba(249,115,22,0.25)]">
                <Map size={56} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" strokeWidth={1.5} />
                
                {/* Badge flotante "Unlock" */}
                <div className="absolute -bottom-4 bg-[#0f172a] border border-cyan-400 rounded-full p-2 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                    <Unlock size={14} />
                </div>
            </div>

            {/* Destellos (Sparkles) */}
            <Sparkles className="absolute -top-2 right-0 text-cyan-200 animate-bounce" size={24} />
            <Sparkles className="absolute bottom-4 -left-4 text-orange-200 animate-pulse delay-75" size={18} />
        </div>

        {/* TEXTO IMPACTANTE (Tu tipografía exacta) */}
        <div className={`
            text-center transform transition-all duration-700 delay-100 relative
            ${step >= 4 ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-12'}
        `}>
            {/* Título Principal */}
            {/* Usamos font-black italic uppercase como en CharacterCreation */}
            <h1 className="text-6xl md:text-7xl font-black italic text-white uppercase tracking-tighter drop-shadow-2xl mb-2 relative z-10 leading-[0.9]">
                GIMNASIOS
            </h1>
            
            {/* Efecto "Fantasma" detrás del texto para efecto neón */}
            <h1 className="absolute top-0 left-0 w-full text-6xl md:text-7xl font-black italic text-orange-500/30 uppercase tracking-tighter blur-md -z-10 leading-[0.9]">
                GIMNASIOS
            </h1>

            {/* Subtítulo Decorado */}
            <div className="flex items-center justify-center gap-4 mt-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-orange-500"></div>
                <p className="text-orange-100 font-mono text-xs md:text-sm font-bold tracking-[0.25em] uppercase text-shadow">
                    Modo Habilitado
                </p>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-orange-500"></div>
            </div>

            {/* Descripción */}
            <p className="text-slate-400 text-xs font-medium mt-6 max-w-sm mx-auto leading-relaxed border-t border-slate-700/50 pt-4 px-4">
                Has capturado 5 Pokémon. El acceso a la Liga Pokémon ha sido autorizado. Viaja por Kanto y desafía a los líderes.
            </p>
        </div>

      </div>

      {/* --- 4. FOOTER --- */}
      <div className={`
         absolute bottom-10 flex flex-col items-center gap-2
         transition-all duration-1000 delay-500
         ${step >= 4 ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-4'}
      `}>
         <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">
            Click para continuar
         </span>
         <ChevronDown size={14} className="text-slate-500 animate-bounce" />
      </div>

    </div>
  );
};

export default UnlockModal;