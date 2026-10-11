import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { X, Award, ArrowLeft, Filter, Search, BarChart2, Move } from 'lucide-react';
import ShinyAnimation from './ShinyAnimation';
<<<<<<< HEAD
import { TYPES, TYPE_ICONS, RARITY_CAPTURE_RATES, RARITY_STARS } from './constants';
import SpecialEventModal from './components/SpecialEventModal';
import CurrencyAmount from './components/CurrencyAmount';
import { POKEMON_LIST } from './pokemonList';
import {
  countOwnedPokemon,
  countRegisteredSpecies,
  getCaptureRecord,
  getDisplayStats,
  getSpeciesDetails,
  isSpeciesRegistered,
  normalizeSaveData,
  registerCapture,
  registerSpecialUnlock,
  releasePokemon,
} from './utils/captureSystem';
import { consumeInventoryItem, getRetryBallId, resolveCaptureAttempt, SHOP_ITEMS } from './utils/trainerProgress';
=======
import { POKEMON_DATA } from './pokemonData'; // Nota: Solo se usa para tipos/constantes, la carga pesada es dinámica
import { TYPES, TYPE_ICONS, RARITY_CAPTURE_RATES, RARITY_STARS } from './constants';
import SpecialEventModal from './components/SpecialEventModal';
import { POKEMON_LIST } from './pokemonList';
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1

// -----------------------------------------------------------------------------
// 1. COMPONENTE: TARJETA DE POKEMON
// -----------------------------------------------------------------------------
const PokemonCard = React.memo(({ pokemon, status, onClick }) => {
<<<<<<< HEAD
  const record = getCaptureRecord({ [pokemon.id]: status }, pokemon.id);
  const showContent = record.registered;
=======
  const isCaptured = status === true;
  const isUnlocked = status === 'unlocked';
  const showContent = isCaptured || isUnlocked;
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1

  return (
    <div 
      onClick={() => onClick(pokemon)} 
      className={`
          group relative aspect-square rounded-xl border-2 overflow-hidden cursor-pointer transition-colors duration-300
          ${showContent 
              ? 'bg-slate-800/60 border-slate-700 hover:border-cyan-500 hover:bg-slate-800 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
              : 'bg-slate-900/40 border-slate-800 hover:border-slate-600'}
      `}
    >
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4b5563_1px,transparent_1px)] [background-size:8px_8px]"></div>

      <div className="absolute top-2 left-2 text-[9px] font-mono text-slate-600 z-10">
          #{String(pokemon.id).padStart(3, '0')}
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-4 z-0">
        {showContent ? (
          <img 
              loading="lazy"
              src={`/assets/pokemon/normal/${pokemon.id}.png`} 
              alt={pokemon.name} 
              className="w-full h-full object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
               <img 
                  loading="lazy"
                  src={`/assets/Pokedex_silueta/${pokemon.id}.png`} 
                  alt="???" 
                  className="w-full h-full object-contain opacity-30 grayscale brightness-50" 
               />
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/90 to-transparent flex items-end justify-center pb-2">
          <p className={`text-[10px] font-bold uppercase tracking-widest ${showContent ? 'text-white' : 'text-slate-600'}`}>
              {showContent ? pokemon.name : '???'}
          </p>
      </div>

      {!showContent && (
          <div className="absolute inset-0 flex items-center justify-center bg-cyan-900/20 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
              <span className="bg-cyan-500 text-black text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-lg">
                  SCAN
              </span>
          </div>
      )}
      
      {showContent && (
<<<<<<< HEAD
           <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${record.owned ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]' : 'bg-orange-400 shadow-[0_0_5px_rgba(251,146,60,0.8)]'}`}></div>
      )}

      {showContent && !record.owned && (
          <div className="absolute top-2 right-6 text-[8px] font-black text-orange-300 uppercase tracking-widest">
              Libre
          </div>
=======
           <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.8)]"></div>
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
      )}
    </div>
  );
});

// -----------------------------------------------------------------------------
// 2. COMPONENTE: BOTÓN DE RESPUESTA
// -----------------------------------------------------------------------------
const QuizOption = React.memo(({ option, index, selectedAnswerIndex, isTransitioning, correctIndex, onAnswer }) => {
    const isSelected = selectedAnswerIndex === index;
    const isCorrect = correctIndex === index;

    let style = "border-slate-700 text-slate-300 hover:border-cyan-500 hover:text-white hover:bg-slate-800";
    
    if (isTransitioning) {
        if (isSelected && !isCorrect) style = "border-red-500 bg-red-900/20 text-red-200";
        else if (isCorrect) style = "border-green-500 bg-green-900/20 text-green-200";
        else style = "border-slate-800 text-slate-600 opacity-50";
    } else if (isSelected) {
        style = "border-cyan-500 bg-cyan-900/20 text-cyan-200";
    }

    return (
        <button 
            onClick={() => onAnswer(index)}
            disabled={isTransitioning}
            className={`w-full p-4 rounded-lg border-2 text-left font-bold transition-colors duration-150 ease-out ${style}`}
        >
            {option}
        </button>
    );
});

// -----------------------------------------------------------------------------
// 3. COMPONENTE: MODAL PRINCIPAL
// -----------------------------------------------------------------------------
const QuizModal = React.memo(({ 
  selectedPokemon, capturedStatus, isShiny, playShinyAnim, 
<<<<<<< HEAD
  handleShinyToggle, closeModal, quizMode, showResult, startQuiz, handleReleasePokemon,
  activeTab, setActiveTab, currentQuestion, quizQuestions, 
  selectedAnswerIndex, isTransitioning, handleAnswer, score, captureAttempt, profile, retryCapture, hiddenOptions, onUseQuizAid,
  inBonusRound, isScanning 
}) => {
=======
  handleShinyToggle, closeModal, quizMode, showResult, 
  activeTab, setActiveTab, currentQuestion, quizQuestions, 
  selectedAnswerIndex, isTransitioning, handleAnswer, score, captureAttempt,
  inBonusRound, isScanning 
}) => {
    
  if (!selectedPokemon) return null;

  const showFullColor = (capturedStatus === true || capturedStatus === 'unlocked') && !isScanning;
  
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
  const [triggerReveal, setTriggerReveal] = useState(false);
  const prevScanningRef = useRef(isScanning);

  useEffect(() => {
      if (prevScanningRef.current === true && isScanning === false) {
          setTriggerReveal(true);
      }
      prevScanningRef.current = isScanning;
  }, [isScanning]);

<<<<<<< HEAD
  if (!selectedPokemon) return null;

  const captureRecord = getCaptureRecord({ [selectedPokemon.id]: capturedStatus }, selectedPokemon.id);
  const showFullColor = captureRecord.registered && !isScanning;
  const ownedSpecimen = captureRecord.owned ? captureRecord.specimen : null;
  const speciesDetails = getSpeciesDetails(selectedPokemon);
  const displayStats = getDisplayStats(selectedPokemon, captureRecord);
  const displayedImageIsShiny = ownedSpecimen?.isShiny || isShiny;
  const retryBallId = getRetryBallId(selectedPokemon);
  const retryBall = SHOP_ITEMS.find(item => item.id === retryBallId);
  const retryBallQuantity = profile?.inventory?.[retryBallId] || 0;

=======
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
  let imageAnimationClass = "animate-float";
  
  if (isScanning) {
      imageAnimationClass = "animate-evolution-in"; 
  } else if (triggerReveal) {
      imageAnimationClass = "animate-evolution-out";
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-6 backdrop-blur-sm animate-fade-in">
        <div className={`bg-[#0f172a] rounded-2xl w-full max-w-5xl h-auto min-h-[600px] max-h-[95vh] border flex overflow-hidden shadow-2xl relative transition-colors duration-300 ${inBonusRound ? 'border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.2)]' : 'border-slate-600'}`}>
            
            <div className="flex w-full">
                {/* IZQUIERDA - VISUALIZADOR */}
                <div className="w-5/12 bg-slate-900/50 border-r border-slate-700 relative flex flex-col items-center justify-center p-8 overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(6,182,212,0.05)_25%,rgba(6,182,212,0.05)_26%,transparent_27%,transparent_74%,rgba(6,182,212,0.05)_75%,rgba(6,182,212,0.05)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(6,182,212,0.05)_25%,rgba(6,182,212,0.05)_26%,transparent_27%,transparent_74%,rgba(6,182,212,0.05)_75%,rgba(6,182,212,0.05)_76%,transparent_77%,transparent)] bg-[size:40px_40px]"></div>
                    
                    {/* BOTONES SHINY */}
                    {showFullColor && (
                        <div className="absolute top-6 left-6 z-30 flex gap-3 animate-fade-in">
                            <button onClick={() => handleShinyToggle(false)} className={`w-10 h-10 rounded-lg font-black text-sm flex items-center justify-center transition-colors shadow-lg border-2 ${!isShiny ? 'bg-slate-700 border-slate-500 text-slate-300' : 'bg-slate-900/50 border-slate-700 text-slate-500 hover:text-white hover:border-slate-500'}`} title="Ver Normal">N</button>
                            <button onClick={() => handleShinyToggle(true)} className={`w-10 h-10 rounded-lg font-black text-sm flex items-center justify-center transition-colors shadow-lg border-2 ${isShiny ? 'bg-yellow-500 border-yellow-300 text-yellow-900 shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-slate-900/50 border-slate-700 text-slate-500 hover:text-yellow-400 hover:border-yellow-600'}`} title="Ver Shiny">S</button>
                        </div>
                    )}

                    <div className="relative w-[70%] aspect-square flex items-center justify-center z-10 mt-2"> 
                        {playShinyAnim && <ShinyAnimation />}

                        <img 
                            src={
                                showFullColor
<<<<<<< HEAD
                                    ? (displayedImageIsShiny ? `/assets/pokemon/shiny/${selectedPokemon.id}.png` : `/assets/pokemon/normal/${selectedPokemon.id}.png`)
=======
                                    ? (isShiny ? `/assets/pokemon/shiny/${selectedPokemon.id}.png` : `/assets/pokemon/normal/${selectedPokemon.id}.png`)
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
                                    : `/assets/Pokedex_silueta/${selectedPokemon.id}.png` 
                            }
                            alt={selectedPokemon.name} 
                            className={`
                                w-full h-full object-contain z-10 
                                ${imageAnimationClass}
                                ${!showFullColor && !isScanning ? 'opacity-50 brightness-0 invert' : ''} 
                            `}
                        />
                        
                        {/* --- CAPA DE ESCANEO --- */}
                        {isScanning && (
                            <div className="absolute inset-[-15%] z-20 pointer-events-none">
                                <div className="absolute left-0 right-0 h-[3px] bg-cyan-400 shadow-[0_0_25px_rgba(34,211,238,1)] animate-scan-beam"></div>
                                <div className="absolute inset-0 scan-grid-overlay opacity-40 animate-pulse"></div>
                                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400 drop-shadow-[0_0_5px_cyan]"></div>
                                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400 drop-shadow-[0_0_5px_cyan]"></div>
                                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400 drop-shadow-[0_0_5px_cyan]"></div>
                                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400 drop-shadow-[0_0_5px_cyan]"></div>
                                <div className="absolute bottom-2 left-0 right-0 text-center">
                                    <span className="bg-black/90 px-3 py-1 rounded text-[8px] font-mono font-bold text-cyan-400 border border-cyan-500/50 animate-pulse tracking-widest shadow-lg backdrop-blur-sm">
                                        SYNCING DNA...
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-12 text-center z-10 relative w-full"> 
                        <h2 className={`text-4xl font-black italic uppercase tracking-tighter mb-2 transition-all duration-300 ${inBonusRound ? 'text-yellow-400 animate-pulse' : 'text-white'}`}>
                            {showFullColor ? selectedPokemon.name : '???'}
                        </h2>
                        
                        {showFullColor ? (
                            <div className="animate-fade-in-up">
<<<<<<< HEAD
                                <div className={`inline-flex items-center justify-center px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest mb-3 ${captureRecord.owned ? 'bg-green-900/30 border-green-500 text-green-300' : 'bg-orange-900/30 border-orange-500 text-orange-300'}`}>
                                    {captureRecord.owned ? 'Capturado' : 'Liberado'}
                                </div>
=======
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
                                <div className="flex justify-center gap-2 mb-4">
                                    {selectedPokemon.type.map(t => (
                                        <span key={t} className="text-[10px] font-bold px-2 py-1 bg-slate-800 text-cyan-400 border border-slate-600 rounded uppercase tracking-wider">{t}</span>
                                    ))}
                                </div>
                                <div className="flex justify-center gap-1">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className={`w-2 h-2 rounded-full ${i < RARITY_STARS[selectedPokemon.rarity] ? 'bg-cyan-400' : 'bg-slate-700'}`}></div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                             <div className="h-10"></div>
                        )}
                    </div>
                </div>

                {/* DERECHA */}
                <div className="w-7/12 bg-[#0f172a] p-8 flex flex-col">
                    <div className="flex justify-end items-center gap-3 mb-6 flex-shrink-0">
                        {!quizMode && !showResult && (
                            <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                                <button onClick={() => setActiveTab('Estadísticas')} className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${activeTab === 'Estadísticas' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>
                                    <BarChart2 size={12} /> Estadísticas
                                </button>
                                <button onClick={() => setActiveTab('Movimientos')} className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${activeTab === 'Movimientos' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>
                                    <Move size={12} /> Movimientos
                                </button>
                            </div>
                        )}

<<<<<<< HEAD
                        {(!quizMode || showResult) && <button 
                            onClick={closeModal} 
                            disabled={isScanning}
                            aria-label="Cerrar"
                            className={`p-1.5 rounded-lg transition-colors border ${isScanning ? 'opacity-30 cursor-not-allowed bg-slate-800 border-slate-700 text-slate-500' : 'bg-red-900/20 hover:bg-red-900/50 border-red-900/50 hover:border-red-500 text-red-400 hover:text-red-200'}`}
                        >
                            <X size={20} />
                        </button>}
=======
                        <button 
                            onClick={closeModal} 
                            disabled={isScanning}
                            className={`p-1.5 rounded-lg transition-colors border ${isScanning ? 'opacity-30 cursor-not-allowed bg-slate-800 border-slate-700 text-slate-500' : 'bg-red-900/20 hover:bg-red-900/50 border-red-900/50 hover:border-red-500 text-red-400 hover:text-red-200'}`}
                        >
                            <X size={20} />
                        </button>
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
                    </div>
                    
                    <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
                        {/* MODO QUIZ */}
                        {quizMode && !showResult && (
                            <div className="flex flex-col justify-center min-h-full">
                                <div className="mb-8">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className={`text-xs font-bold uppercase tracking-widest ${inBonusRound ? 'text-yellow-400' : 'text-cyan-500'}`}>
                                            {inBonusRound ? '¡RONDA DE BONUS!' : 'Secuencia de Análisis'}
                                        </span>
                                        <span className="text-xs font-mono text-slate-400">{currentQuestion + 1} / {quizQuestions.length}</span>
                                    </div>
                                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div className={`h-full transition-all duration-500 ${inBonusRound ? 'bg-yellow-500' : 'bg-cyan-500'}`} style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}></div>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-8 leading-tight">{quizQuestions[currentQuestion]?.question}</h3>
<<<<<<< HEAD
                                <div className="mb-4 grid grid-cols-3 gap-2" aria-label="Ayudas del Quiz">
                                    {[
                                      ['repel', 'Repelente'], ['super-repel', 'Superrepelente'], ['max-repel', 'Rep. Máximo'],
                                    ].map(([id, label]) => <button key={id} type="button" disabled={isTransitioning || (profile?.inventory?.[id] || 0) <= 0} onClick={() => onUseQuizAid(id)} className="min-h-11 border border-slate-700 bg-slate-900/70 px-2 text-[10px] font-black uppercase text-cyan-300 disabled:cursor-not-allowed disabled:opacity-35">
                                      {label} · {profile?.inventory?.[id] || 0}
                                    </button>)}
                                </div>
                                <div className="grid grid-cols-1 gap-4 pb-2">
                                    {quizQuestions[currentQuestion]?.options.map((option, idx) => !hiddenOptions.includes(idx) && (
=======
                                <div className="grid grid-cols-1 gap-4 pb-2">
                                    {quizQuestions[currentQuestion]?.options.map((option, idx) => (
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
                                        <QuizOption 
                                            key={idx} index={idx} option={option}
                                            selectedAnswerIndex={selectedAnswerIndex}
                                            correctIndex={quizQuestions[currentQuestion].correct}
                                            isTransitioning={isTransitioning} onAnswer={handleAnswer}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* MODO RESULTADO */}
                        {showResult && (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center border-4 border-slate-700">
                                    <span className="text-4xl">{score >= 10 ? '🎉' : '❌'}</span>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black italic text-white uppercase tracking-tight mb-2">Análisis Completado</h2>
                                    <p className="text-cyan-400 font-mono text-xl">Sincronización: {((score / quizQuestions.length) * 100).toFixed(0)}%</p>
                                </div>
                                
                                {score >= 10 ? (
                                    captureAttempt ? (
                                        <div className={`p-6 rounded-xl border ${captureAttempt.success ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
                                            <h3 className={`text-xl font-bold mb-2 ${captureAttempt.success ? 'text-green-400' : 'text-red-400'}`}>
                                                {isScanning ? 'PROCESANDO ADN...' : (captureAttempt.success ? '¡CAPTURA EXITOSA!' : '¡EL POKÉMON ESCAPÓ!')}
                                            </h3>
                                            <p className="text-sm text-slate-300">
                                                {isScanning 
                                                    ? "Desencriptando firma genética..." 
                                                    : (captureAttempt.success 
<<<<<<< HEAD
                                                        ? `${selectedPokemon.name} ${captureRecord.captures > 1 ? 'ha sido recapturado como nuevo ejemplar.' : 'ha sido registrado en la base de datos.'}` 
                                                        : `Probabilidad de éxito fue del ${(captureAttempt.probability * 100).toFixed(0)}%. Inténtalo de nuevo.`)
                                                }
                                            </p>
                                            {captureAttempt.rewards && <div className="mt-3 flex justify-center gap-4 font-mono text-sm text-amber-300">
                                                <span>+{captureAttempt.rewards.experience.toLocaleString('es-CL')} EXP</span>
                                                <CurrencyAmount amount={captureAttempt.rewards.money} prefix="+" />
                                            </div>}
                                            {!captureAttempt.success && <button type="button" disabled={retryBallQuantity <= 0} onClick={retryCapture} className="mt-4 min-h-11 w-full rounded border border-cyan-500 bg-cyan-950/70 px-4 text-xs font-black uppercase tracking-wider text-cyan-100 disabled:cursor-not-allowed disabled:opacity-40">
                                                {retryBallQuantity > 0 ? `Reintentar con ${retryBall?.name} · ${retryBallQuantity}` : `Sin ${retryBall?.name || 'Ball'} disponibles`}
                                            </button>}
=======
                                                        ? `${selectedPokemon.name} ha sido registrado en la base de datos.` 
                                                        : `Probabilidad de éxito fue del ${(captureAttempt.probability * 100).toFixed(0)}%. Inténtalo de nuevo.`)
                                                }
                                            </p>
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
                                        </div>
                                    ) : (
                                        <p className="text-slate-400 animate-pulse">Iniciando protocolo de captura...</p>
                                    )
                                ) : (
                                    <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
                                        <p className="text-slate-300">Datos insuficientes para iniciar captura.</p>
                                        <p className="text-sm text-slate-500 mt-1">Se requieren al menos 10 respuestas correctas.</p>
                                    </div>
                                )}
                                
                                {!isScanning && (
                                    <button onClick={closeModal} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-600 font-bold tracking-wider uppercase transition-colors">
                                        Cerrar
                                    </button>
                                )}
                            </div>
                        )}

                        {/* MODO DATOS */}
                        {!quizMode && !showResult && (
                            <div className="space-y-6">
                                {activeTab === 'Estadísticas' ? (
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                                            <h4 className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-2">Descripción</h4>
                                            <p className="text-sm text-slate-300 leading-relaxed">{selectedPokemon.description}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
<<<<<<< HEAD
                                            {[
                                                ['N.º Pokédex', `#${speciesDetails.pokedexNumber}`],
                                                ['Nombre', selectedPokemon.name],
                                                ['Categoría', speciesDetails.category],
                                                ['Altura', selectedPokemon.height || 'No registrada'],
                                                ['Peso', selectedPokemon.weight || 'No registrado'],
                                                ['Habilidad', speciesDetails.ability],
                                                ['Sexo', ownedSpecimen?.gender || 'Variable'],
                                                ['Hábitat', speciesDetails.habitat],
                                                ['Ratio captura', speciesDetails.captureRate],
                                                ['Naturaleza', ownedSpecimen?.nature || 'Sin ejemplar'],
                                                ['Shiny', ownedSpecimen?.isShiny ? 'Sí' : 'No'],
                                                ['Capturas', captureRecord.captures || 0],
                                            ].map(([key, value]) => (
=======
                                            {Object.entries(selectedPokemon.stats).map(([key, value]) => (
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
                                                <div key={key} className="flex justify-between items-center p-2 rounded bg-slate-800/30 border border-slate-700/50">
                                                    <span className="text-xs font-mono text-slate-500 uppercase">{key}</span>
                                                    <span className="text-sm font-bold text-white">{value}</span>
                                                </div>
                                            ))}
                                        </div>
<<<<<<< HEAD
                                        <div className="grid grid-cols-2 gap-3">
                                            {Object.entries(displayStats.stats || {}).map(([key, value]) => (
                                                <div key={key} className="flex justify-between items-center p-2 rounded bg-slate-800/30 border border-slate-700/50">
                                                    <span className="text-xs font-mono text-slate-500 uppercase">{displayStats.labels[key] || key}</span>
                                                    <span className="text-sm font-bold text-white">{value}</span>
                                                </div>
                                            ))}
                                            <div className="flex justify-between items-center p-2 rounded bg-cyan-900/20 border border-cyan-500/30">
                                                <span className="text-xs font-mono text-cyan-500 uppercase">Total</span>
                                                <span className="text-sm font-bold text-cyan-200">{displayStats.total}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {captureRecord.owned ? (
                                                <button onClick={() => handleReleasePokemon(selectedPokemon.id)} className="px-5 py-3 bg-orange-900/30 hover:bg-orange-800/50 text-orange-200 rounded-lg border border-orange-500/50 font-bold tracking-wider uppercase transition-colors">
                                                    Liberar ejemplar
                                                </button>
                                            ) : (
                                                <button onClick={startQuiz} className="px-5 py-3 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg border border-cyan-400/50 font-bold tracking-wider uppercase transition-colors">
                                                    Recapturar con Quiz
                                                </button>
                                            )}
                                        </div>
=======
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                        {selectedPokemon.moves && selectedPokemon.moves.map((move, i) => (
                                            <div key={i} className="p-2 rounded bg-slate-800/30 border border-slate-700/50 text-xs text-slate-300 font-medium">
                                                {move}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
});

// -----------------------------------------------------------------------------
// 4. COMPONENTE PRINCIPAL
// -----------------------------------------------------------------------------
<<<<<<< HEAD
export default function PokemonQuiz({ onGoBack, onGameCapture, initialCapturedData, profile, onProfileUpdate, onAlert }) {
  const [captured, setCaptured] = useState(() => {
    return normalizeSaveData(initialCapturedData || {});
=======
export default function PokemonQuiz({ onGoBack, onGameCapture, initialCapturedData, profile, onAlert }) {
  const [captured, setCaptured] = useState(() => {
    return initialCapturedData || {};
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
  });
  const [selectedType, setSelectedType] = useState("Todos");
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [captureAttempt, setCaptureAttempt] = useState(null);
  const [isShiny, setIsShiny] = useState(false);
  const [playShinyAnim, setPlayShinyAnim] = useState(false);
  const [activeTab, setActiveTab] = useState('Estadísticas');
  const [inBonusRound, setInBonusRound] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
<<<<<<< HEAD
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [showSpecialEvent, setShowSpecialEvent] = useState(false);
  const [, setIsLoadingDetails] = useState(false);
=======
  const [showSpecialEvent, setShowSpecialEvent] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1

  // --- ESTADO Y REF PARA EL ESCANEO ---
  const [isScanning, setIsScanning] = useState(false);

  const filteredPokemon = useMemo(() => {
    const baseList = POKEMON_LIST.filter(p => {
        // El 151 (Mew) sigue oculto hasta el evento especial
        if (p.id === 151) {
<<<<<<< HEAD
            return isSpeciesRegistered(captured, 151);
=======
            return captured[151] === true || captured[151] === 'unlocked';
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
        }
        // El 150 (Mewtwo) SIEMPRE se muestra (para generar curiosidad), 
        // el bloqueo es al hacer click.
        return true; 
    });

    return selectedType === "Todos"
      ? baseList
      : baseList.filter(p => p.type.includes(selectedType));
  }, [selectedType, captured]);

<<<<<<< HEAD
  const capturedCount = countRegisteredSpecies(captured);
  const ownedCount = countOwnedPokemon(captured);
=======
  const capturedCount = Object.values(captured).filter(status => status === true).length;
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
  const totalPokemon = 150;

  useEffect(() => {
    localStorage.setItem('pokemonQuizSaveData', JSON.stringify(captured));
  }, [captured]);

  // --- LOGICA DE PREGUNTAS (RESTAURADA) ---
  const selectRandomQuestions = (allQuestions) => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 15);
  };

  const shuffleOptions = (question) => {
    if (!question || !question.options) return { options: [], correct: 0 };
    const correctAnswer = question.options[question.correct];
    const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);
    const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);
    return { ...question, options: shuffledOptions, correct: newCorrectIndex };
  };

  useEffect(() => {
    if (inBonusRound && selectedPokemon && selectedPokemon.bonusQuestion) {
        const bonusQ = shuffleOptions(selectedPokemon.bonusQuestion);
        setQuizQuestions(prev => [...prev, bonusQ]);
        setTimeout(() => {
            setCurrentQuestion(prev => prev + 1);
            setIsTransitioning(false);
<<<<<<< HEAD
            setHiddenOptions([]);
=======
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
        }, 100);
    }
  }, [inBonusRound, selectedPokemon]);
  
<<<<<<< HEAD
  const startPokemonQuiz = useCallback((fullData) => {
    setSelectedPokemon(fullData);
    setQuizMode(true);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setCaptureAttempt(null);
    setInBonusRound(false);

    const randomQuestions = selectRandomQuestions(fullData.quiz);
    const questionsWithShuffledOptions = randomQuestions.map(q => shuffleOptions(q));
    setQuizQuestions(questionsWithShuffledOptions);

    setIsTransitioning(false);
    setSelectedAnswerIndex(null);
    setHiddenOptions([]);
    setIsScanning(false);
  }, []);

  const handlePokemonClick = useCallback(async (pokemonLite) => {
    setIsLoadingDetails(true);

    if ([138, 139, 140, 141, 142].includes(pokemonLite.id) && !profile?.fossilQuizUnlocked) {
        onAlert?.(
            "ACCESO DENEGADO",
            "Los datos fósiles permanecen cifrados. Supera la operación del Team Rocket en Monte Luna y elige un fósil.",
            "error"
        );
        setIsLoadingDetails(false);
        return;
    }

    const rocketLegendaryNodes = { 144: 'Islas Espuma', 145: 'Central Energía', 146: 'Ciudad Verde' };
    if (rocketLegendaryNodes[pokemonLite.id] && !getCaptureRecord(captured, pokemonLite.id).specialUnlock && !isSpeciesRegistered(captured, pokemonLite.id)) {
        onAlert?.(
            "ACCESO DENEGADO",
            `La señal legendaria está protegida. Supera la operación del Team Rocket en ${rocketLegendaryNodes[pokemonLite.id]}.`,
            "error"
        );
        setIsLoadingDetails(false);
        return;
    }

    // --- LÓGICA DE BLOQUEO DE MEWTWO (ID 150) ---
    if (pokemonLite.id === 150) {
        const isChampion = profile && profile.eliteProgress >= 5;
=======
  const handlePokemonClick = useCallback(async (pokemonLite) => {
    setIsLoadingDetails(true);

    // --- LÓGICA DE BLOQUEO DE MEWTWO (ID 150) ---
    if (pokemonLite.id === 150) {
        // Asumimos que si eliteProgress > 0 (o la condición que definas para ganar la liga), es campeón.
        const isChampion = profile && profile.eliteProgress > 0; 
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1

        if (!isChampion) {
            // USAMOS LA ALERTA PERSONALIZADA
            if (onAlert) {
                onAlert(
                    "ACCESO DENEGADO", 
                    "Señal psíquica demasiado fuerte.\nNivel de autorización insuficiente.\n\nRequisito: DERROTAR AL ALTO MANDO.", 
                    "error"
                );
            } else {
                alert("🔒 ACCESO DENEGADO: NIVEL DE CAMPEÓN REQUERIDO");
            }
            setIsLoadingDetails(false);
            return; // Detiene la carga
        }
    }
    // ---------------------------------------------

    try {
        const module = await import('./pokemonData'); 
        const fullData = module.POKEMON_DATA.find(p => p.id === pokemonLite.id);

        if (!fullData) {
            console.error("Error: Datos no encontrados para", pokemonLite.name);
            setIsLoadingDetails(false);
            return;
        }

<<<<<<< HEAD
        const record = getCaptureRecord(captured, pokemonLite.id);

        if (record.registered) {
            setSelectedPokemon(fullData);
            setQuizMode(false);
            setShowResult(false);
            setActiveTab('Estadísticas');
            setIsShiny(false);
        } else {
            startPokemonQuiz(fullData);
=======
        if (captured[pokemonLite.id] === true) {
            setSelectedPokemon(fullData);
            setActiveTab('Estadísticas');
            setIsShiny(false);
        } else {
            setSelectedPokemon(fullData);
            setQuizMode(true);
            setCurrentQuestion(0);
            setScore(0);
            setShowResult(false);
            setCaptureAttempt(null);
            setInBonusRound(false);
            
            const randomQuestions = selectRandomQuestions(fullData.quiz);
            const questionsWithShuffledOptions = randomQuestions.map(q => shuffleOptions(q));
            setQuizQuestions(questionsWithShuffledOptions);
            
            setIsTransitioning(false);
            setSelectedAnswerIndex(null);
            setIsScanning(false);
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
        }
    } catch (error) {
        console.error("Error cargando los datos del Pokémon:", error);
    } finally {
        setIsLoadingDetails(false);
    }
<<<<<<< HEAD
  }, [captured, profile, onAlert, startPokemonQuiz]); // Agregamos profile y onAlert a dependencias
=======
  }, [captured, profile, onAlert]); // Agregamos profile y onAlert a dependencias
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1

  const handleShinyToggle = useCallback((shinyState) => {
    setIsShiny(prev => {
        if (prev === shinyState) return prev;
        return shinyState;
    });
    if (shinyState) {
        setPlayShinyAnim(true);
        setTimeout(() => setPlayShinyAnim(false), 2000);
    }
  }, []);

  // --- LÓGICA DE CAPTURA ACTUALIZADA ---
<<<<<<< HEAD
  const attemptCapture = (finalScore, rewardProfile = profile) => {
=======
  const attemptCapture = (finalScore) => {
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
    let success = false;
    let probability = 0;

    if (finalScore >= quizQuestions.length) {
      success = true;
      probability = 1.0;
    } else {
      const baseCaptureRate = RARITY_CAPTURE_RATES[selectedPokemon.rarity];
      success = Math.random() < baseCaptureRate;
      probability = baseCaptureRate;
    }
    
    setCaptureAttempt({ success, probability });

<<<<<<< HEAD
    if (!success && rewardProfile && onProfileUpdate) {
      onProfileUpdate(resolveCaptureAttempt(rewardProfile, selectedPokemon, { success: false }).profile);
    }

=======
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
    if (success) {
      // 1. INICIAR ESCANEO VISUAL
      setIsScanning(true);

      // 2. REPRODUCIR SONIDO
      const sfx = new Audio('/assets/sounds/scan_sfx.mp3');
      sfx.volume = 1.0;
      sfx.play().catch(err => {
          console.warn("El navegador bloqueó el sonido o no encontró el archivo:", err);
      });

      // 3. PRE-CARGAR IMAGEN A COLOR
      const img = new Image();
      img.src = `/assets/pokemon/normal/${selectedPokemon.id}.png`;

      // 4. ESPERAR ANIMACIÓN (2.5 segundos)
      setTimeout(() => {
<<<<<<< HEAD
          const newCapturedState = registerCapture(captured, selectedPokemon);
          setCaptured(newCapturedState);

          const specimen = getCaptureRecord(newCapturedState, selectedPokemon.id).specimen;
          if (rewardProfile && onProfileUpdate) {
            const resolution = resolveCaptureAttempt(rewardProfile, selectedPokemon, {
              success: true,
              isShiny: Boolean(specimen?.isShiny),
              perfect: finalScore === quizQuestions.length,
            });
            onProfileUpdate(resolution.profile);
            setCaptureAttempt(current => ({ ...current, rewards: resolution.rewards }));
          }
          
          localStorage.setItem('pokemonQuizSaveData', JSON.stringify(newCapturedState));
          
          const trulyCapturedCount = countRegisteredSpecies(newCapturedState);
          
          if (onGameCapture) onGameCapture(trulyCapturedCount);

          if (trulyCapturedCount >= 150 && !isSpeciesRegistered(newCapturedState, 151)) {
=======
          const newCapturedState = { ...captured, [selectedPokemon.id]: true };
          setCaptured(newCapturedState);
          
          localStorage.setItem('pokemonQuizSaveData', JSON.stringify(newCapturedState));
          
          const trulyCapturedCount = Object.values(newCapturedState).filter(status => status === true).length;
          
          if (onGameCapture) onGameCapture(trulyCapturedCount);

          if (trulyCapturedCount >= 150 && !newCapturedState[151]) {
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
            setTimeout(() => {
              setShowSpecialEvent(true); 
            }, 2000);
          }

          setIsScanning(false);
      }, 2500);
    }
  };

<<<<<<< HEAD
  const retryCapture = () => {
    const ballId = getRetryBallId(selectedPokemon);
    const profileWithBallConsumed = consumeInventoryItem(profile, ballId);
    if (profileWithBallConsumed === profile) return;
    attemptCapture(score, profileWithBallConsumed);
  };

  const handleQuizAid = (itemId) => {
    if (isTransitioning || !quizQuestions[currentQuestion]) return;
    const updatedProfile = consumeInventoryItem(profile, itemId);
    if (updatedProfile === profile) return;
    onProfileUpdate?.(updatedProfile);
    const question = quizQuestions[currentQuestion];
    if (itemId === 'max-repel') {
      handleAnswer(question.correct);
      return;
    }
    const count = itemId === 'super-repel' ? 2 : 1;
    const incorrect = question.options.map((_, index) => index).filter(index => index !== question.correct && !hiddenOptions.includes(index));
    setHiddenOptions(previous => [...previous, ...incorrect.slice(0, count)]);
  };

  const handleWinSpecialEvent = () => {
    const unlockedState = registerSpecialUnlock(captured, 151);
=======
  const handleWinSpecialEvent = () => {
    const unlockedState = { ...captured, 151: 'unlocked' };
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
    setCaptured(unlockedState);
    localStorage.setItem('pokemonQuizSaveData', JSON.stringify(unlockedState));
    setShowSpecialEvent(false);
  };

<<<<<<< HEAD
  const handleReleasePokemon = useCallback((pokemonId) => {
    const releasedState = releasePokemon(captured, pokemonId);
    setCaptured(releasedState);
    localStorage.setItem('pokemonQuizSaveData', JSON.stringify(releasedState));
    if (onAlert) {
      onAlert(
        "EJEMPLAR LIBERADO",
        "La especie permanece registrada en la Pokédex.\nPuedes volver a superar el Quiz para capturar un nuevo ejemplar.",
        "info"
      );
    }
  }, [captured, onAlert]);

  const handleAnswer = (selectedIndex) => {
=======
  const handleAnswer = useCallback((selectedIndex) => {
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
    if (isTransitioning) return;

    setIsTransitioning(true);
    setSelectedAnswerIndex(selectedIndex);

    const isCorrect = selectedIndex === quizQuestions[currentQuestion].correct;
    
    if (isCorrect) {
        setScore(prevScore => prevScore + 1);
    }

    setTimeout(() => {
        const isLastQuestion = currentQuestion === quizQuestions.length - 1;

        if (isLastQuestion) {
            const finalScore = score + (isCorrect ? 1 : 0);
            setScore(finalScore);

            if (finalScore === 9 && selectedPokemon.bonusQuestion && !inBonusRound) {
                setInBonusRound(true);
                setSelectedAnswerIndex(null); 
            } else {
                setShowResult(true);
                if (finalScore >= 10) {
                    attemptCapture(finalScore);
                }
            }
        } else {
            setCurrentQuestion(prev => prev + 1);
            setIsTransitioning(false);
            setSelectedAnswerIndex(null);
<<<<<<< HEAD
            setHiddenOptions([]);
        }
    }, 1000);
  };
=======
        }
    }, 1000);
  }, [currentQuestion, isTransitioning, quizQuestions, score, selectedPokemon, inBonusRound]);
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1

  const closeModal = useCallback(() => {
    // Bloquear cierre si está escaneando para no interrumpir la lógica
    if (isScanning) return; 

    setSelectedPokemon(null);
    setQuizMode(false);
    setShowResult(false);
    setCaptureAttempt(null);
    setScore(0);
    setIsShiny(false);
    setActiveTab('Estadísticas');
    setInBonusRound(false);
    setIsTransitioning(false);
    setSelectedAnswerIndex(null);
    setIsScanning(false);
  }, [isScanning]);

  return (
    <>
      <style>{`
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
        body, html { overflow-x: hidden; width: 100%; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

<<<<<<< HEAD
      <div className="aaa-pokedex-screen min-h-screen w-full bg-[#0f172a] text-white relative font-sans overflow-hidden flex flex-col">
=======
      <div className="min-h-screen w-full bg-[#0f172a] text-white relative font-sans overflow-hidden flex flex-col">
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
        
        {/* FONDOS */}
        <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0 pointer-events-none"></div>
        <div className="fixed inset-0 bg-gradient-to-br from-[#0f172a] via-[#172554] to-[#0f172a] z-0 pointer-events-none"></div>

        {/* HEADER */}
        <div className="relative z-10 flex items-center justify-between px-8 py-6 bg-slate-900/90 border-b border-slate-700 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <button 
              onClick={onGoBack} 
              className="group p-2 rounded-lg bg-slate-800 border border-slate-600 hover:border-cyan-500 hover:bg-slate-700 hover:shadow-[0_0_10px_rgba(34,211,238,0.3)] transition-all"
              title="Salir al menú"
            >
               <ArrowLeft size={24} className="text-slate-400 group-hover:text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter text-white drop-shadow-lg">
                  POKÉDEX <span className="text-cyan-400">KANTO</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em]">Base de Datos Global</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
               <div className="flex flex-col items-end">
<<<<<<< HEAD
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Especies Registradas</span>
=======
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Progreso de Captura</span>
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
                  <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-mono font-bold text-cyan-400">{capturedCount}</span>
                      <span className="text-sm text-slate-600">/ {totalPokemon}</span>
                  </div>
<<<<<<< HEAD
                  <span className="text-[9px] font-mono uppercase text-slate-500">{ownedCount} en posesión</span>
=======
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
               </div>
               <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center shadow-inner">
                  <Award className={`w-6 h-6 ${capturedCount === totalPokemon ? 'text-yellow-400 animate-pulse' : 'text-slate-600'}`} />
               </div>
          </div>
        </div>

        {/* CUERPO PRINCIPAL */}
        <div className="relative z-10 flex flex-1 overflow-hidden">
          
          {/* SIDEBAR IZQUIERDA */}
          <div className="w-64 bg-slate-900/80 border-r border-slate-700 flex flex-col overflow-y-auto no-scrollbar backdrop-blur-sm">
            <div className="p-4 border-b border-slate-700/50">
               <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Filter size={14} />
                  <span className="text-xs font-bold uppercase tracking-wider">Filtrar por Tipo</span>
               </div>
            </div>
            
            <div className="flex-1 p-2 space-y-1">
              {TYPES.map(type => {
                  const isSelected = selectedType === type;
                  return (
                      <button 
                          key={type} 
                          onClick={() => setSelectedType(type)} 
                          className={`
                              w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 border-l-2
                              ${isSelected 
                                  ? 'bg-cyan-900/20 border-cyan-400 text-white shadow-[inset_0_0_20px_rgba(34,211,238,0.1)]' 
                                  : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
                          `}
                      >
                          <img 
                              src={TYPE_ICONS[type]} 
                              alt={type} 
                              className={`w-5 h-5 object-contain ${isSelected ? 'opacity-100' : 'opacity-50 grayscale'}`} 
                          />
                          <span className="text-sm font-bold tracking-wide uppercase">{type}</span>
                      </button>
                  )
              })}
            </div>
          </div>

          {/* GRID DERECHA */}
          <div className="flex-1 bg-[#0f172a]/50 p-6 overflow-y-auto no-scrollbar">
            {filteredPokemon.length > 0 ? (
              <div className="grid grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredPokemon.map(pokemon => (
                  <PokemonCard 
                    key={pokemon.id}
                    pokemon={pokemon}
                    status={captured[pokemon.id]}
                    onClick={handlePokemonClick}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50">
                  <Search size={64} className="mb-4" />
                  <p className="text-xl font-light uppercase tracking-widest">Sin datos</p>
              </div>
            )}
          </div>
        </div>

        {/* MODAL PRINCIPAL */}
        {selectedPokemon && (
            <QuizModal 
                selectedPokemon={selectedPokemon}
                capturedStatus={captured[selectedPokemon.id]}
                isShiny={isShiny}
                playShinyAnim={playShinyAnim}
                handleShinyToggle={handleShinyToggle}
                closeModal={closeModal}
                quizMode={quizMode}
                showResult={showResult}
<<<<<<< HEAD
                startQuiz={() => startPokemonQuiz(selectedPokemon)}
                handleReleasePokemon={handleReleasePokemon}
=======
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                currentQuestion={currentQuestion}
                quizQuestions={quizQuestions}
                selectedAnswerIndex={selectedAnswerIndex}
                isTransitioning={isTransitioning}
                handleAnswer={handleAnswer}
                score={score}
                captureAttempt={captureAttempt}
<<<<<<< HEAD
                profile={profile}
                retryCapture={retryCapture}
                hiddenOptions={hiddenOptions}
                onUseQuizAid={handleQuizAid}
=======
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
                inBonusRound={inBonusRound}
                isScanning={isScanning}
            />
        )}

        {/* MODAL ESPECIAL (Integrado) */}
        {showSpecialEvent && (
          <SpecialEventModal onConfirm={handleWinSpecialEvent} />
        )}
      </div>
    </>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
