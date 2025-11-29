import React, { useEffect, useState } from 'react';
import { Skull, Zap, ChevronDown, LockOpen, AlertTriangle } from 'lucide-react';

const UnlockRocketModal = ({ onClose }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // SECUENCIA CINEMATOGRÁFICA
    const timers = [
      setTimeout(() => setStep(1), 50),   // Fondo
      setTimeout(() => setStep(2), 400),  // Horizonte rojo
      setTimeout(() => setStep(3), 800),  // Explosión icono
      setTimeout(() => setStep(4), 1100), // Texto
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleClose = () => {
    setStep(5); // Salida
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
      {/* --- 1. FONDO (ADAPTADO AL TEAM ROCKET: ROJO/OSCURO) --- */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
         {/* Textura Carbono */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0"></div>
         
         {/* Malla Tecnológica Roja */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.07)_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none"></div>
         
         {/* Vignette Roja Intensa */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.1)_0%,#0f172a_90%)] z-0"></div>
      </div>

      {/* --- 2. LÍNEA DEL HORIZONTE (ROJA) --- */}
      <div className="absolute top-1/2 left-0 w-full h-px transform -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center">
        {/* Línea principal roja */}
        <div className={`
            h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent shadow-[0_0_30px_rgba(239,68,68,1)]
            transition-all duration-1000 cubic-bezier(0.22, 1, 0.36, 1)
            ${step >= 2 ? 'w-full opacity-100 scale-x-100' : 'w-0 opacity-0 scale-x-0'}
        `}></div>
        
        {/* Flash rojo central */}
        <div className={`absolute w-40 h-1 bg-red-400 blur-md rounded-full transition-all duration-500 ${step === 2 ? 'opacity-100 scale-150' : 'opacity-0 scale-0'}`}></div>
      </div>

      {/* --- 3. CONTENIDO CENTRAL --- */}
      <div className="relative z-20 flex flex-col items-center">
        
        {/* HEADER: WARNING */}
        <div className={`
            flex items-center gap-3 mb-10 transition-all duration-700
            ${step >= 3 ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}
        `}>
            <AlertTriangle size={14} className="text-red-500 animate-pulse" />
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.4em] drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                ALERTA DE INTRUSIÓN
            </span>
            <AlertTriangle size={14} className="text-red-500 animate-pulse" />
        </div>

        {/* NÚCLEO: ICONO ROCKET */}
        <div className={`
            relative w-64 h-64 flex items-center justify-center mb-8
            transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)
            ${step >= 3 ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 rotate-90'}
        `}>
            {/* Iluminación Volumétrica Violeta/Roja */}
            <div className="absolute inset-0 bg-red-600/20 rounded-full blur-[70px] animate-pulse"></div>

            {/* Anillos Estáticos */}
            <div className="absolute inset-0 border border-slate-700 rounded-full scale-105"></div>
            
            {/* Anillo Giratorio Rápido (Rojo) */}
            <div className="absolute inset-4 border-2 border-dashed border-red-600/50 rounded-full animate-[spin_8s_linear_infinite]"></div>
            
            {/* Anillo Giratorio Reverso (Violeta) */}
            <div className="absolute inset-8 border-t-4 border-b-4 border-purple-600/50 rounded-full animate-[spin_4s_linear_infinite_reverse] shadow-[0_0_15px_rgba(147,51,234,0.4)]"></div>

            {/* CONTENEDOR ICONO "R" */}
            <div className="relative z-30 w-32 h-32 bg-black rounded-full flex items-center justify-center border-2 border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.4)]">
                {/* R Estilizada (Simulada con texto, o puedes usar un SVG si tienes) */}
                <span className="text-7xl font-black italic text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,1)] pr-2">R</span>
                
                {/* Badge flotante "Open" */}
                <div className="absolute -bottom-5 bg-black border border-red-500 rounded-full p-2 text-red-500 shadow-[0_0_15px_red]">
                    <Skull size={16} />
                </div>
            </div>

            {/* Rayos (Zap) */}
            <Zap className="absolute -top-4 -right-4 text-purple-400 animate-bounce" size={28} fill="currentColor" />
            <Zap className="absolute bottom-4 -left-6 text-red-400 animate-pulse delay-100" size={20} fill="currentColor" />
        </div>

        {/* TEXTO IMPACTANTE */}
        <div className={`
            text-center transform transition-all duration-700 delay-100 relative
            ${step >= 4 ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-12'}
        `}>
            {/* Título Principal */}
            <h1 className="text-6xl md:text-7xl font-black italic text-white uppercase tracking-tighter drop-shadow-2xl mb-2 relative z-10 leading-[0.9]">
                TEAM <span className="text-red-600">ROCKET</span>
            </h1>
            
            {/* Efecto Fantasma */}
            <h1 className="absolute top-0 left-0 w-full text-6xl md:text-7xl font-black italic text-red-600/40 uppercase tracking-tighter blur-md -z-10 leading-[0.9] animate-pulse">
                TEAM ROCKET
            </h1>

            {/* Subtítulo Decorado */}
            <div className="flex items-center justify-center gap-4 mt-6">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-500"></div>
                <p className="text-red-100 font-mono text-xs md:text-sm font-bold tracking-[0.25em] uppercase text-shadow bg-red-900/30 px-3 py-1 rounded border border-red-500/30">
                    Amenaza Detectada
                </p>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-purple-500"></div>
            </div>

            {/* Descripción */}
            <p className="text-slate-300 text-xs font-medium mt-6 max-w-sm mx-auto leading-relaxed border-t border-red-900/50 pt-4 px-4">
                Has llamado la atención con tus 15 capturas. Una organización criminal ha comenzado a moverse por Kanto. ¡Ten cuidado!
            </p>
        </div>

      </div>

      {/* --- 4. FOOTER --- */}
      <div className={`
         absolute bottom-10 flex flex-col items-center gap-2
         transition-all duration-1000 delay-500
         ${step >= 4 ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-4'}
      `}>
         <span className="text-[9px] font-black text-red-500 uppercase tracking-[0.3em] animate-pulse">
            Click para continuar
         </span>
         <ChevronDown size={14} className="text-red-500 animate-bounce" />
      </div>

    </div>
  );
};

export default UnlockRocketModal;