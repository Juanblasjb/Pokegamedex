import React, { useEffect, useState } from 'react';
import { Fingerprint, AlertTriangle, ChevronRight, Radio } from 'lucide-react';

const SpecialEventModal = ({ onConfirm }) => {
  const [stage, setStage] = useState('init');

  useEffect(() => {
    const t1 = setTimeout(() => setStage('expanding'), 100);
    const t2 = setTimeout(() => setStage('content'), 400);
    const t3 = setTimeout(() => setStage('stable'), 800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md cursor-auto overflow-hidden">
      
      {/* --- AMBIENTE ROJO/MISTERIOSO --- */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_center,purple_0%,transparent_70%)] z-0"></div>
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] z-0"></div>

      <div className={`relative z-10 w-full max-w-xl transform transition-all duration-700 ease-out ${stage === 'init' ? 'scale-y-0 opacity-0' : 'scale-y-100 opacity-100'}`}>
          
          {/* LÍNEAS DE ENERGÍA (Púrpuras/Rosas para Mew) */}
          <div className={`absolute -top-8 left-0 w-full h-px bg-fuchsia-500 shadow-[0_0_20px_fuchsia] transition-all duration-1000 ${stage === 'stable' ? 'scale-x-100' : 'scale-x-0'}`}></div>
          <div className={`absolute -bottom-8 left-0 w-full h-px bg-fuchsia-500 shadow-[0_0_20px_fuchsia] transition-all duration-1000 ${stage === 'stable' ? 'scale-x-100' : 'scale-x-0'}`}></div>

          <div className="relative bg-[#0f172a] border-y border-fuchsia-500/30 p-10 flex flex-col items-center shadow-[0_0_80px_rgba(217,70,239,0.2)]">
              
              {/* CONTENIDO */}
              <div className={`flex flex-col items-center transition-all duration-500 ${stage === 'content' || stage === 'stable' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  
                  {/* ICONO / SILUETA */}
                  <div className="relative mb-8">
                      <div className="absolute inset-0 bg-fuchsia-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                      <div className="w-32 h-32 flex items-center justify-center relative z-10">
                          {/* SILUETA DE MEW (Asegúrate de tener la imagen 151.png) */}
                          <img 
                            src="/assets/Pokedex_silueta/151.png" 
                            alt="Mystery" 
                            className="w-full h-full object-contain brightness-0 invert drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                          />
                      </div>
                      {/* Decoración de alerta */}
                      <div className="absolute -top-4 -right-4 text-fuchsia-400 animate-bounce">
                          <AlertTriangle size={24} />
                      </div>
                  </div>

                  {/* TEXTO DE SISTEMA */}
                  <div className="flex items-center gap-2 mb-4">
                      <Radio size={14} className="text-fuchsia-400 animate-ping" />
                      <span className="text-fuchsia-300 font-mono text-[10px] uppercase tracking-[0.3em] font-bold">
                          Señal Desconocida Detectada
                      </span>
                  </div>

                  {/* TÍTULO */}
                  <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter drop-shadow-2xl mb-4 text-center">
                      ¿NUEVO POKÉMON?
                  </h1>

                  <p className="text-slate-400 font-medium text-xs max-w-md text-center leading-relaxed mb-8 font-mono border-t border-fuchsia-900/50 pt-4">
                      El escáner ha captado una firma genética que coincide con el ancestro de todos los Pokémon.
                      <br/>
                      <span className="text-fuchsia-400 block mt-2">Ubicación: Base de Datos Global.</span>
                  </p>

                  {/* BOTÓN ACCIÓN */}
                  <button 
                    onClick={onConfirm}
                    className="group flex items-center gap-3 px-8 py-3 bg-fuchsia-900/30 hover:bg-fuchsia-600 border border-fuchsia-500/50 hover:border-fuchsia-400 rounded transition-all duration-300 shadow-[0_0_20px_rgba(217,70,239,0.1)] hover:shadow-[0_0_30px_rgba(217,70,239,0.4)]"
                  >
                      <Fingerprint size={16} className="text-fuchsia-200" />
                      <span className="text-xs font-black text-white uppercase tracking-widest">
                          INVESTIGAR SEÑAL
                      </span>
                      <ChevronRight size={16} className="text-fuchsia-200 group-hover:translate-x-1 transition-transform" />
                  </button>

              </div>
          </div>
      </div>
    </div>
  );
};

export default SpecialEventModal;