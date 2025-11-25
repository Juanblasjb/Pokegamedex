import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ isActive }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("INICIALIZANDO SISTEMA...");

  // Estado para generar partículas aleatorias
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isActive) {
      // 1. Lógica de Barra de Progreso
      setProgress(0);
      const totalDuration = 3500; 
      const intervalTime = 30;
      const increment = 100 / (totalDuration / intervalTime);

      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + increment;
          
          if (newProgress < 30) setLoadingText("CARGANDO MÓDULOS KANTO...");
          else if (newProgress < 60) setLoadingText("SINCRONIZANDO BASE DE DATOS...");
          else if (newProgress < 90) setLoadingText("ESTABILIZANDO ENERGÍA PSI...");
          else setLoadingText("SISTEMA LISTO...");

          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return newProgress;
        });
      }, intervalTime);

      // 2. Lógica de Partículas (Efecto manos)
      const particleInterval = setInterval(() => {
        const id = Date.now();
        const angle = Math.random() * 360;
        const distance = Math.random() * 40 + 20; // Distancia de viaje
        const tx = Math.cos(angle * (Math.PI / 180)) * distance;
        const ty = Math.sin(angle * (Math.PI / 180)) * distance;
        
        setParticles(prev => [...prev.slice(-10), { id, tx, ty }]); // Mantenemos pocas partículas
      }, 200);

      return () => {
        clearInterval(progressInterval);
        clearInterval(particleInterval);
      };
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white overflow-hidden font-sans cursor-wait">
      
      {/* --- FONDOS --- */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#0f172a]/50 to-purple-900/20 z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px] z-0"></div>

      {/* --- CONTENIDO CENTRAL --- */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        
        {/* MEWTWO EN CÁMARA DE CONTENCIÓN */}
        <div className="relative w-80 h-80 mb-8 flex items-center justify-center">
            
            {/* 1. Anillos Tecnológicos (Contención) */}
            <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full animate-spin-slow border-t-transparent border-l-transparent"></div>
            <div className="absolute inset-6 border border-purple-500/20 rounded-full animate-reverse-spin border-b-transparent"></div>
            <div className="absolute inset-0 bg-purple-500/5 rounded-full blur-2xl animate-pulse"></div>

            {/* 2. Imagen Mewtwo */}
            <div className="relative w-64 h-64 flex items-center justify-center animate-float">
                <img 
                  src="/assets/mewtwo.png" 
                  alt="Mewtwo"
                  className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(168,85,247,0.4)] z-10"
                />

                {/* --- ANIMACIÓN 2: PODER EN MANOS (Relativo a la imagen) --- */}
                {/* Ajusta bottom/left para que quede entre sus manos */}
                <div className="absolute top-[35%] left-[70%] transform -translate-x-1/2 w-12 h-12 z-20 flex items-center justify-center">
                    
                    {/* Núcleo de energía */}
                    <div className="w-6 h-6 bg-white rounded-full blur-md animate-pulse-core absolute z-10"></div>
                    <div className="w-10 h-10 bg-purple-600 rounded-full blur-xl opacity-60 animate-pulse absolute"></div>
                    
                    {/* Partículas dinámicas */}
                    {particles.map(p => (
                        <div 
                            key={p.id}
                            className="particle w-1 h-1 bg-cyan-300 absolute top-1/2 left-1/2"
                            style={{
                                '--tx': `${p.tx}px`,
                                '--ty': `${p.ty}px`,
                                animation: 'spark-float 1s ease-out forwards'
                            }}
                        ></div>
                    ))}
                    
                    {/* Rayos estáticos girando */}
                    <div className="absolute inset-[-20px] border-2 border-transparent border-t-cyan-400/50 rounded-full animate-spin duration-700"></div>
                </div>
            </div>
        </div>

        {/* --- UI DE CARGA (TEXTO Y BARRA) --- */}
        <div className="w-full space-y-2 px-8">
            <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-cyan-400 tracking-[0.2em] animate-pulse">
                    {loadingText}
                </span>
                <span className="text-xl font-mono font-black text-white">
                    {Math.round(progress)}%
                </span>
            </div>

            {/* Barra */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700 relative">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:4px_4px] opacity-20"></div>
                <div 
                    className="h-full bg-gradient-to-r from-purple-600 via-cyan-500 to-white transition-all duration-75 ease-out relative"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                </div>
            </div>

            <div className="flex justify-between text-[9px] text-slate-500 font-mono uppercase mt-1">
                <span>Psychic Link: STABLE</span>
                <span>Memory: 128K OK</span>
            </div>
        </div>

      </div>

      <div className="absolute bottom-8 text-center opacity-30">
         <p className="text-[10px] font-mono tracking-widest">SILPH CO. SYSTEMS v.0.5.0</p>
      </div>

    </div>
  );
};

export default LoadingScreen;