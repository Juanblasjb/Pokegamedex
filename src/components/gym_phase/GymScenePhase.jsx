import React, { useState, useEffect } from 'react';
import { Film, CheckCircle, XCircle, Aperture, Activity, Play } from 'lucide-react';

// Función auxiliar para mezclar arrays (Fisher-Yates simplificado)
const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
};

const GymScenePhase = ({ sceneData, onPhaseComplete }) => {
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // --- ESTADOS PARA LA ALEATORIEDAD ---
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [correctIndex, setCorrectIndex] = useState(-1);
  const [isDataReady, setIsDataReady] = useState(false);

  // 1. Precarga de imagen y 2. Aleatorización de respuestas
  useEffect(() => {
    // A. Cargar imagen
    const img = new Image();
    img.src = sceneData.image;
    img.onload = () => setImageLoaded(true);

    // B. Aleatorizar opciones
    if (sceneData && sceneData.options) {
        // 1. Identificamos el TEXTO de la respuesta correcta original
        const correctOptionText = sceneData.options[sceneData.correct];
        
        // 2. Mezclamos las opciones
        const mixedOptions = shuffleArray(sceneData.options);
        
        // 3. Encontramos dónde quedó la respuesta correcta en el nuevo array
        const newCorrectIndex = mixedOptions.indexOf(correctOptionText);

        setShuffledOptions(mixedOptions);
        setCorrectIndex(newCorrectIndex);
        setIsDataReady(true);
    }
  }, [sceneData]);

  const handleOptionClick = (index) => {
    if (hasAnswered) return; 

    setHasAnswered(true);
    setSelectedOption(index);

    // CAMBIO: Comparamos con el nuevo índice aleatorio
    const isCorrect = index === correctIndex;

    // Esperar 2 segundos y enviar datos completos al padre
    setTimeout(() => {
        onPhaseComplete(isCorrect, { 
            correct: isCorrect ? 1 : 0, 
            total: 1 
        });
    }, 2000);
  };

  // Si los datos aún no se han mezclado, no mostramos nada para evitar saltos visuales
  if (!isDataReady) return null;

  return (
    <div className="w-full max-w-full mx-auto h-[550px] flex flex-col md:flex-row bg-[#0b1221] rounded-2xl border border-slate-700 overflow-hidden shadow-2xl relative animate-fade-in">
      
      {/* --- COLUMNA IZQUIERDA: MONITOR DE VIDEO (55%) --- */}
      <div className="w-full md:w-[55%] relative bg-black border-b md:border-b-0 md:border-r border-slate-700 overflow-hidden group">
          
          {/* Grid decorativo de fondo */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:30px_30px] opacity-50"></div>

          {/* Estado de carga */}
          {!imageLoaded && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-cyan-500 z-10">
                 <Aperture size={40} className="animate-spin mb-2" />
                 <span className="text-xs font-mono uppercase tracking-widest">Decodificando señal...</span>
             </div>
          )}

          {/* IMAGEN PRINCIPAL */}
          <div className="relative w-full h-full p-0 flex items-center justify-center bg-black">
             <img 
               src={sceneData.image} 
               alt="Scene Analysis" 
               className={`
                  w-full h-full object-contain transition-all duration-700 relative z-10
                  ${imageLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-lg scale-95'}
                  ${hasAnswered ? 'grayscale brightness-50' : 'drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]'} 
               `}
             />
          </div>

          {/* OVERLAYS TÉCNICOS DE CÁMARA */}
          <div className="absolute top-10 left-12 z-20 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-mono text-red-500 tracking-widest">LIVE FEED • CAM-04</span>
          </div>
          <div className="absolute top-10 right-12 z-20 bg-red-900/30 border border-red-500/30 px-2 py-1 rounded text-[9px] font-mono text-red-400">
              REC 00:04:20
          </div>
          
          {/* Esquinas del visor */}
          <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-slate-500/50"></div>
          <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-slate-500/50"></div>
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-slate-500/50"></div>
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-slate-500/50"></div>

          {/* Efecto de Scanline (Láser de barrido) */}
          {!hasAnswered && (
             <div className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none opacity-30">
                 <div className="w-full h-1 bg-cyan-400 shadow-[0_0_20px_cyan] animate-scan-beam"></div>
             </div>
          )}

          {/* RESULTADO SOBREPUESTO (Solo visible al responder) */}
          {hasAnswered && (
             <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
                 {/* CAMBIO: Usamos correctIndex en lugar de sceneData.correct */}
                 {selectedOption === correctIndex ? (
                     <div className="flex flex-col items-center animate-bounce-in">
                         <CheckCircle size={80} className="text-green-500 drop-shadow-[0_0_25px_rgba(34,197,94,0.8)] mb-4" />
                         <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter drop-shadow-lg">CORRECTO</h2>
                         <span className="text-green-400 font-mono text-sm tracking-widest mt-2 border-t border-green-500/50 pt-2">ANÁLISIS CONFIRMADO</span>
                     </div>
                 ) : (
                     <div className="flex flex-col items-center animate-bounce-in">
                         <XCircle size={80} className="text-red-500 drop-shadow-[0_0_25px_rgba(239,68,68,0.8)] mb-4" />
                         <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter drop-shadow-lg">ERROR</h2>
                         <span className="text-red-400 font-mono text-sm tracking-widest mt-2 border-t border-red-500/50 pt-2">DATOS INCORRECTOS</span>
                     </div>
                 )}
             </div>
          )}
      </div>

      {/* --- COLUMNA DERECHA: CONSOLA DE PREGUNTAS (45%) --- */}
      <div className="w-full md:w-[45%] flex flex-col p-8 bg-[#0f172a] relative z-10">
          
          {/* Header de la consola */}
          <div className="mb-6 border-b border-slate-700 pb-4">
              <div className="flex items-center gap-3 mb-2">
                  <Film className="text-cyan-500" size={20} />
                  <h3 className="text-lg font-black italic uppercase text-white tracking-wider">
                      ANÁLISIS DE ESCENA
                  </h3>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-xs font-mono uppercase">
                  <Activity size={12} className="text-cyan-500 animate-pulse" />
                  <span>Esperando Input del Usuario...</span>
              </div>
          </div>

          {/* Pregunta */}
          <div className="mb-6 flex-grow">
              <p className="text-xl md:text-xl font-bold text-slate-200 leading-snug drop-shadow-md">
                  {sceneData.question}
              </p>
          </div>

          {/* Opciones (Lista Vertical - CAMBIO: Usamos shuffledOptions) */}
          <div className="space-y-3">
              {shuffledOptions.map((option, idx) => {
                  let btnStyle = "bg-slate-800/50 border-slate-600 text-slate-400 hover:bg-slate-800 hover:border-cyan-500 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]";
                  let icon = <div className="w-2 h-2 bg-slate-500 rounded-full"></div>;
                  
                  if (hasAnswered) {
                      // CAMBIO: Comparamos con correctIndex
                      if (idx === correctIndex) {
                          btnStyle = "bg-green-900/30 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]";
                          icon = <Play size={10} className="text-green-400 fill-current" />;
                      } else if (idx === selectedOption) {
                          btnStyle = "bg-red-900/30 border-red-500 text-red-200";
                          icon = <XCircle size={14} className="text-red-500" />;
                      } else {
                          btnStyle = "opacity-30 border-slate-800 grayscale cursor-not-allowed";
                      }
                  } else if (selectedOption === idx) {
                       btnStyle = "bg-cyan-600 border-cyan-400 text-white";
                  }

                  return (
                      <button
                          key={idx}
                          onClick={() => handleOptionClick(idx)}
                          disabled={hasAnswered}
                          className={`
                              w-full p-4 rounded-lg border flex items-center gap-4 text-left transition-all duration-300 group
                              ${btnStyle}
                          `}
                      >
                          <div className={`
                              flex-shrink-0 w-8 h-8 rounded border flex items-center justify-center font-mono text-xs font-bold transition-colors
                              ${hasAnswered && idx === correctIndex ? 'bg-green-500 border-green-400 text-black' : 'bg-slate-900 border-slate-700 text-slate-500 group-hover:border-cyan-500 group-hover:text-cyan-400'}
                          `}>
                              {String.fromCharCode(65 + idx)}
                          </div>
                          <span className="font-bold text-sm uppercase tracking-wide flex-1">{option}</span>
                          
                          {/* Indicador visual de estado */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                             {icon}
                          </div>
                      </button>
                  );
              })}
          </div>

          {/* Decoración inferior */}
          <div className="mt-6 flex justify-between items-center opacity-30">
               <div className="h-1 w-1/3 bg-slate-700 rounded-full"></div>
               <div className="flex gap-1">
                   <div className="w-1 h-1 bg-cyan-500 rounded-full"></div>
                   <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                   <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
               </div>
          </div>
      </div>
    </div>
  );
};

export default GymScenePhase;