import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lock, MapPin, Swords, Play, X, Check, AlertTriangle } from 'lucide-react';
import { GYM_DATA } from "../data/gymsData";
import { availableSkins } from './skins';

const GymSelection = ({ profile, capturedData, onBack, onEnterGym }) => {
  const [travelNodeId, setTravelNodeId] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  // --- 1. DATOS DEL USUARIO ---
  const currentProgress = profile.gymProgress || 0; 
  const playerSkin = availableSkins.find(s => s.id === profile.skin) || availableSkins[0];

  // [CORRECCIÓN CRÍTICA] Lógica de conteo compatible con Objetos { id: true }
  const safeCapturedCount = React.useMemo(() => {
    // 1. Si viene como OBJETO (formato TrainerCard) -> Contamos los 'true'
    if (capturedData && typeof capturedData === 'object' && !Array.isArray(capturedData)) {
        return Object.values(capturedData).filter(status => status === true).length;
    }

    // 2. Si viene como ARRAY (formato lista simple)
    if (Array.isArray(capturedData)) {
        return capturedData.length;
    }

    // 3. Fallback: Intentar leer desde el profile si la prop falló
    if (profile) {
        if (profile.captured && typeof profile.captured === 'object') {
             return Object.values(profile.captured).filter(status => status === true).length;
        }
        if (Array.isArray(profile.capturedPokemon)) return profile.capturedPokemon.length;
    }

    return 0;
  }, [capturedData, profile]);

  // --- 2. EFECTO INICIAL ---
  useEffect(() => {
    if (!travelNodeId) {
        const startNode = GYM_DATA[Math.min(currentProgress, GYM_DATA.length - 1)];
        setTravelNodeId(startNode.id);
        setSelectedNode(startNode);
    }
  }, [currentProgress, travelNodeId]);

  // --- 3. MOTOR DE REGLAS ---
  const checkUnlockStatus = (node) => {
    // [ELIMINADO] Ya no existe la excepción "if (!node.isGym)". 
    // Ahora Pueblo Paleta (Tutorial) cuenta como un nivel más que se debe superar.

    const nodeIndex = GYM_DATA.findIndex(n => n.id === node.id);
    
    // 1. ¿Ya ganaste este nivel? 
    // Si tu progreso es 1, ya ganaste el nivel 0. (1 > 0 es True)
    // Si tu progreso es 0, no has ganado el nivel 0. (0 > 0 es False)
    const isPassed = currentProgress > nodeIndex; 

    // 2. ¿Es el reto actual?
    // Si tu progreso es 0, tu reto actual es el índice 0 (Tutorial).
    // Si tu progreso es 1, tu reto actual es el índice 1 (Brock).
    const isCurrentChallenge = currentProgress === nodeIndex;
    
    // 3. ¿Bloqueado futuro?
    // Si el índice del nodo es mayor que tu progreso actual.
    const isLockedByProgression = nodeIndex > currentProgress;
    
    // 4. Regla de Capturas
    const minCaptures = node.minCaptures || 0;
    const hasEnoughCaptures = safeCapturedCount >= minCaptures;

    return {
        isPassed, 
        isCurrentChallenge,
        isLockedByProgression, 
        hasEnoughCaptures,
        minCaptures,
        // CONDICIÓN DE ENTRADA: 
        // a) Es el reto actual Y tienes las capturas.
        // b) Ya lo pasaste (puedes volver a entrar).
        canEnter: (isCurrentChallenge && hasEnoughCaptures) || isPassed
    };
  };

  const handleNodeClick = (node) => {
      const status = checkUnlockStatus(node);
      // Permitimos click si es el reto actual o pasado, o futuro cercano
      if (!status.isLockedByProgression || status.isCurrentChallenge) { 
          setTravelNodeId(node.id);
          setSelectedNode(node);
      }
  };

  const currentNodeObj = GYM_DATA.find(n => n.id === travelNodeId) || GYM_DATA[0];
  const selectedStatus = selectedNode ? checkUnlockStatus(selectedNode) : null;

  return (
    <div className="w-screen h-screen bg-[#0f172a] text-white relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* --- FONDOS --- */}
      <div className="absolute inset-0 bg-[#0f172a] z-0"></div>
      <div key={currentNodeObj.id} className="absolute inset-0 z-0 transition-opacity duration-1000 animate-fade-in">
          <img 
            src={currentNodeObj.background || '/assets/backgrounds/default_city.png'} 
            alt="Background" 
            className="w-full h-full object-cover opacity-30 grayscale mix-blend-screen"
          />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.08)_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/80 via-transparent to-[#0f172a] z-0"></div>

      {/* --- HEADER --- */}
      <div className="absolute top-6 left-8 z-50">
          <button onClick={onBack} className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-700 text-slate-200 hover:text-white px-5 py-2.5 rounded-tl-xl rounded-br-xl border-l-4 border-cyan-500 shadow-lg backdrop-blur-md text-xs font-bold tracking-widest uppercase transition-all transform hover:translate-x-1">
            <ArrowLeft size={16} /> Volver a Modos
          </button>
      </div>

      {/* --- TARJETA DE INFORMACIÓN --- */}
      <div className="absolute top-24 right-12 z-40 pointer-events-none">
          {selectedNode && selectedStatus && (
            <div className="w-80 pointer-events-auto animate-slide-in-right">
                
                <div className={`bg-slate-900 border ${!selectedStatus.canEnter && selectedStatus.isCurrentChallenge ? 'border-orange-500/50' : 'border-slate-600'} rounded-lg shadow-2xl overflow-hidden flex flex-col transition-colors duration-300`}>
                    
                    {/* Header Tarjeta */}
<div className="relative h-28 bg-slate-800 overflow-hidden border-b border-slate-700">
    {/* CAMBIO: Aceptamos isTutorial también */}
    {selectedNode.isGym || selectedNode.isTutorial ? (
        <>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent z-10"></div>
            <img 
                src={selectedNode.leaderPortrait || selectedNode.leaderImg} 
                alt={selectedNode.leader} 
                className={`absolute right-0 top-0 w-auto h-full object-cover object-top transition-all duration-500 ${selectedStatus.canEnter ? 'grayscale-0' : 'grayscale brightness-50'}`}
            />
            <div className="absolute bottom-2 left-4 z-20">
                <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter drop-shadow-lg leading-none">{selectedNode.leader}</h2>
                <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest">
                    {selectedNode.isTutorial ? 'Mentor Pokémon' : `Líder de ${selectedNode.type}`}
                </span>
            </div>
        </>
    ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-500">
            <MapPin size={28} className="text-cyan-500/50 mb-1" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Ubicación</span>
        </div>
    )}
</div>

                    {/* Cuerpo */}
                    <div className="p-5">
                        <div className="mb-4">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wide mb-2 border-l-2 border-cyan-500 pl-2">
                                {selectedNode.name}
                            </h3>
                            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                                {selectedNode.description}
                            </p>
                        </div>

                        {/* --- REQUISITOS (Solo Gyms) --- */}
                        {selectedNode.isGym && (
                            <div className="bg-slate-950/80 p-3 rounded border border-slate-800 mb-4 space-y-2">
                                <div className="flex justify-between items-center border-b border-slate-800 pb-1 mb-1">
                                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Protocolo de Acceso</span>
                                    {selectedStatus.canEnter ? 
                                        <span className="text-[9px] text-green-400 font-bold tracking-widest">AUTORIZADO</span> : 
                                        <span className="text-[9px] text-red-500 font-bold tracking-widest animate-pulse">DENEGADO</span>
                                    }
                                </div>

                                {/* Requisito 1: Medalla Previa (Solo si required > 0) */}
                                {selectedNode.required > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-slate-400 font-mono">1. Medalla Previa</span>
                                        {selectedStatus.isLockedByProgression ? (
                                            <Lock size={12} className="text-red-500" />
                                        ) : (
                                            <Check size={12} className="text-green-500" />
                                        )}
                                    </div>
                                )}

                                {/* Requisito 2: Capturas */}
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-slate-400 font-mono">
                                        {selectedNode.required > 0 ? '2.' : '1.'} Datos Pokédex
                                    </span>
                                    <span className={`text-[10px] font-mono font-bold ${selectedStatus.hasEnoughCaptures ? 'text-green-400' : 'text-orange-400'}`}>
                                        {safeCapturedCount}/{selectedStatus.minCaptures} REQ
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Botones de Acción */}
                        {(selectedNode.isGym || selectedNode.isTutorial) && selectedStatus.isCurrentChallenge && (
                            <div className="mt-2">
                                {selectedStatus.canEnter ? (
                                    <button 
                                    onClick={() => onEnterGym(selectedNode.id)}
                                    className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black italic uppercase tracking-widest text-sm rounded border-t border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 animate-pulse-slow"
                                >
                                    {selectedNode.isTutorial ? 'COMENZAR TUTORIAL' : 'INICIAR BATALLA'} <Play fill="currentColor" size={10} />
                                    </button>
                                ) : (
                                    <button 
                                        disabled
                                        className="w-full py-3 bg-slate-800/50 text-slate-500 border border-slate-700 font-black italic uppercase tracking-widest text-xs rounded cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {selectedStatus.hasEnoughCaptures ? <Lock size={12} /> : <AlertTriangle size={12} />}
                                        {selectedStatus.hasEnoughCaptures ? 'BLOQUEADO' : 'FALTAN DATOS'}
                                    </button>
                                )}
                            </div>
                        )}
                        
                        {/* Mensaje de completado */}
                        {selectedStatus.isPassed && (selectedNode.isGym || selectedNode.isTutorial) && (
                        <div className="w-full py-2 bg-green-900/20 border border-green-900/50 text-green-500 font-bold uppercase tracking-widest text-xs rounded flex items-center justify-center gap-2">
                        <Check size={14} /> {selectedNode.isTutorial ? 'TUTORIAL COMPLETADO' : 'GIMNASIO VENCIDO'}
                        </div>
                        )}
                    </div>
                </div>
            </div>
          )}
      </div>

      {/* --- MAPA LINEAL --- */}
      <div className="absolute bottom-16 left-0 w-full flex justify-center z-30 px-12">
         <div className="relative w-full max-w-[1200px] h-32 flex items-center">
            
            {/* LÍNEAS DE PROGRESO */}
            <div className="absolute top-1/2 left-[10%] right-[10%] h-1 bg-slate-800 -translate-y-1/2 rounded-full"></div>
            <div 
                className="absolute top-1/2 h-1 bg-cyan-500 -translate-y-1/2 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(34,211,238,0.6)]"
                style={{ left: '10%', width: `${Math.max(0, currentNodeObj.x - 10)}%` }}
            ></div>

            {/* AVATAR */}
            <div 
                className="absolute top-1/2 z-50 transition-all duration-1000 ease-in-out"
                style={{ left: `${currentNodeObj.x}%`, transform: 'translate(-50%, -110%)' }} 
            >
                <div className="flex flex-col items-center animate-bounce-small">
                    <div className="w-14 h-14 rounded-full border-2 border-white bg-slate-900 shadow-[0_0_25px_rgba(34,211,238,0.8)] overflow-hidden">
                        <img src={playerSkin.iconUrl} className="w-full h-full object-cover" alt="You" />
                    </div>
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white mt-1 drop-shadow-lg"></div>
                </div>
            </div>

            {/* NODOS */}
            {GYM_DATA.map((node) => {
                const status = checkUnlockStatus(node);
                const isSelected = selectedNode?.id === node.id;

                return (
                    <div key={node.id} className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 group" style={{ left: `${node.x}%` }}>
                        <button 
                            onClick={() => handleNodeClick(node)}
                            disabled={status.isLockedByProgression && !status.isCurrentChallenge}
                            className={`
                                w-10 h-10 rounded-full border-[3px] flex items-center justify-center transition-all duration-300 relative bg-slate-900
                                ${status.isPassed 
                                    ? 'border-blue-600 text-blue-600' 
                                    : status.isCurrentChallenge 
                                        ? (status.hasEnoughCaptures 
                                            ? 'border-cyan-400 text-cyan-400 animate-pulse shadow-[0_0_15px_cyan]' 
                                            : 'border-orange-500 text-orange-500') 
                                        : 'border-slate-700 text-slate-700' 
                                }
                                ${isSelected ? 'scale-125 ring-4 ring-slate-900 z-50' : ''}
                            `}
                        >
                            {!node.isGym ? <MapPin size={16} /> : 
                             status.isPassed ? <Check size={16} strokeWidth={3} /> : 
                             status.isCurrentChallenge && !status.hasEnoughCaptures ? <AlertTriangle size={14} /> : 
                             status.isLockedByProgression ? <Lock size={14} /> : 
                             <Swords size={16} />} 
                        </button>
                        
                        <div className={`absolute top-12 left-1/2 -translate-x-1/2 text-center w-32 transition-all duration-300 ${isSelected ? 'opacity-100 translate-y-0' : 'opacity-0 group-hover:opacity-100 translate-y-1'}`}>
                            <span className="text-[9px] font-black uppercase tracking-widest block text-slate-300">{node.name}</span>
                        </div>
                    </div>
                );
            })}
         </div>
      </div>
    </div>
  );
};

export default GymSelection;