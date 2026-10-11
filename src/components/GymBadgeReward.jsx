import React, { useEffect, useState } from 'react';
import { Hexagon, Sparkles } from 'lucide-react';

const GymBadgeReward = ({ badgeName, leaderName, badgeImage, onContinue }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div 
      onClick={onContinue}
      className={`fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl transition-all duration-700 cursor-pointer overflow-hidden ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* --- FONDO ATMOSFÉRICO --- */}
      <div className={`absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-y-1/2 scale-x-0 transition-transform duration-1000 delay-300 ease-out ${visible ? 'scale-x-100' : ''}`}></div>
      <div className={`absolute border border-white/5 rounded-full w-[600px] h-[600px] transition-all duration-1000 delay-100 ${visible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}></div>
      <div className={`absolute border border-white/5 rounded-full w-[800px] h-[800px] transition-all duration-1000 delay-200 ${visible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}></div>

      {/* --- CONTENIDO CENTRAL --- */}
      <div className="relative flex flex-col items-center z-10">
          
          {/* Header Pequeño */}
          <div className={`flex flex-col items-center mb-10 transition-all duration-700 delay-300 ${visible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
              <Hexagon size={32} className="text-yellow-500 mb-2 fill-yellow-500/20 animate-pulse" />
              <h2 className="text-xl font-medium text-yellow-100 tracking-wider drop-shadow-lg">Objeto Obtenido</h2>
              
              {/* Subtítulo con nombre del Líder */}
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-[0.2em] mt-1">
                  Recibiste de parte de <span className="text-yellow-500 font-bold">{leaderName}</span>
              </p>
          </div>

          {/* ÁREA DEL ÍTEM (CAJA + IMAGEN PEQUEÑA) */}
          <div className={`relative mb-10 transition-all duration-1000 delay-100 ${visible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
              
              {/* Resplandor trasero */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-500/10 blur-3xl rounded-full"></div>
              
              {/* LA CAJA / TARJETA (Restaurada) */}
              <div className="relative z-10 w-40 h-48 bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-600/50 rounded-lg shadow-2xl flex items-center justify-center backdrop-blur-md animate-float group hover:scale-105 transition-transform duration-500">
                  
                  {/* Borde interno decorativo */}
                  <div className="absolute inset-1 border border-white/5 rounded pointer-events-none"></div>

                  {/* Destello en esquina */}
                  <Sparkles className="absolute -top-4 -right-4 text-yellow-200 animate-spin-slow z-20" size={20} />
                  
                  {/* IMAGEN DE LA MEDALLA (Tamaño controlado) */}
                  <div className="relative z-10 p-4">
                      <img 
                        src={badgeImage} 
                        alt={badgeName}
                        // Aquí limitamos el tamaño para que no se pixelee (w-20/24 aprox)
                        className="w-24 h-24 object-contain drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] filter brightness-110"
                      />
                  </div>
              </div>

              {/* Destellos laterales (Líneas finas a los lados de la caja) */}
              <div className="absolute top-1/2 -left-16 w-12 h-px bg-gradient-to-r from-transparent to-white/30"></div>
              <div className="absolute top-1/2 -right-16 w-12 h-px bg-gradient-to-l from-transparent to-white/30"></div>
              <div className="absolute top-1/2 -left-20 w-1 h-1 bg-white/50 rounded-full"></div>
              <div className="absolute top-1/2 -right-20 w-1 h-1 bg-white/50 rounded-full"></div>
          </div>

          {/* NOMBRE DEL ÍTEM */}
          <div className={`text-center transition-all duration-700 delay-500 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="bg-gradient-to-r from-transparent via-slate-900/80 to-transparent px-12 py-3 border-y border-white/5">
                  <h1 className="text-3xl md:text-4xl font-black italic text-white tracking-widest uppercase drop-shadow-xl">
                      {badgeName}
                  </h1>
              </div>
              <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-yellow-500 to-transparent mt-[-1px]"></div>
          </div>
      </div>

      {/* FOOTER */}
      <div className={`absolute bottom-12 w-full text-center transition-opacity duration-1000 delay-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest animate-bounce">
              [ Click para cerrar ]
          </p>
      </div>

    </div>
  );
};

export default GymBadgeReward;