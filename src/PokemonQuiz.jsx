import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { X, Award, ArrowLeft, Filter, Search, BarChart2, Move } from 'lucide-react';
import ShinyAnimation from './ShinyAnimation';
import { POKEMON_DATA } from './pokemonData';
import { TYPES, TYPE_ICONS, RARITY_CAPTURE_RATES, RARITY_STARS } from './constants';
import SpecialEventModal from './components/SpecialEventModal'; // <--- IMPORTACIÓN NUEVA

// -----------------------------------------------------------------------------
// 1. COMPONENTE: TARJETA DE POKEMON
// -----------------------------------------------------------------------------
const PokemonCard = React.memo(({ pokemon, status, onClick }) => {
  const isCaptured = status === true;
  const isUnlocked = status === 'unlocked';
  const showContent = isCaptured || isUnlocked;

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
           <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.8)]"></div>
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
  handleShinyToggle, closeModal, quizMode, showResult, 
  activeTab, setActiveTab, currentQuestion, quizQuestions, 
  selectedAnswerIndex, isTransitioning, handleAnswer, score, captureAttempt,
  inBonusRound
}) => {
    
  if (!selectedPokemon) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-6 backdrop-blur-sm animate-fade-in">
        <div className={`bg-[#0f172a] rounded-2xl w-full max-w-5xl h-auto min-h-[600px] max-h-[95vh] border flex overflow-hidden shadow-2xl relative transition-colors duration-300 ${inBonusRound ? 'border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.2)]' : 'border-slate-600'}`}>
            
            <div className="flex w-full">
                {/* IZQUIERDA */}
                <div className="w-5/12 bg-slate-900/50 border-r border-slate-700 relative flex flex-col items-center justify-center p-8">
                    <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(6,182,212,0.05)_25%,rgba(6,182,212,0.05)_26%,transparent_27%,transparent_74%,rgba(6,182,212,0.05)_75%,rgba(6,182,212,0.05)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(6,182,212,0.05)_25%,rgba(6,182,212,0.05)_26%,transparent_27%,transparent_74%,rgba(6,182,212,0.05)_75%,rgba(6,182,212,0.05)_76%,transparent_77%,transparent)] bg-[size:40px_40px]"></div>
                    
                    {(capturedStatus === true || capturedStatus === 'unlocked') && (
                        <div className="absolute top-6 left-6 z-30 flex gap-3">
                            <button 
                                onClick={() => handleShinyToggle(false)} 
                                className={`w-10 h-10 rounded-lg font-black text-sm flex items-center justify-center transition-colors shadow-lg border-2 ${!isShiny ? 'bg-slate-700 border-slate-500 text-slate-300' : 'bg-slate-900/50 border-slate-700 text-slate-500 hover:text-white hover:border-slate-500'}`}
                                title="Ver Normal"
                            >
                                N
                            </button>

                            <button 
                                onClick={() => handleShinyToggle(true)} 
                                className={`w-10 h-10 rounded-lg font-black text-sm flex items-center justify-center transition-colors shadow-lg border-2 ${isShiny ? 'bg-yellow-500 border-yellow-300 text-yellow-900 shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-slate-900/50 border-slate-700 text-slate-500 hover:text-yellow-400 hover:border-yellow-600'}`}
                                title="Ver Shiny"
                            >
                                S
                            </button>
                        </div>
                    )}

                    <div className="relative w-[80%] aspect-square flex items-center justify-center z-10">
                        {playShinyAnim && <ShinyAnimation />}

                        <img 
                            src={
                            (capturedStatus === true || capturedStatus === 'unlocked') 
                        ? (isShiny 
                        ? `/assets/pokemon/shiny/${selectedPokemon.id}.png` 
                        : `/assets/pokemon/normal/${selectedPokemon.id}.png`)
                        : `/assets/Pokedex_silueta/${selectedPokemon.id}.png`
                        }
                        alt={selectedPokemon.name} 
                        className={`
                        w-full h-full object-contain z-10 animate-float
                        ${(capturedStatus === true || capturedStatus === 'unlocked') ? 'drop-shadow-2xl' : 'opacity-50 brightness-0 invert'} 
                        `}
                        />
                    </div>

                    <div className="mt-4 text-center z-10">
                        <h2 className={`text-4xl font-black italic uppercase tracking-tighter mb-1 ${inBonusRound ? 'text-yellow-400 animate-pulse' : 'text-white'}`}>
                            {(capturedStatus === true || capturedStatus === 'unlocked') ? selectedPokemon.name : '???'}
                        </h2>
                        
                        {(capturedStatus === true || capturedStatus === 'unlocked') && (
                            <>
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
                            </>
                        )}
                    </div>
                </div>

                {/* DERECHA */}
                <div className="w-7/12 bg-[#0f172a] p-8 flex flex-col">
                    
                    {/* TOOLBAR */}
                    <div className="flex justify-end items-center gap-3 mb-6 flex-shrink-0">
                        {!quizMode && !showResult && (
                            <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                                <button 
                                    onClick={() => setActiveTab('Estadísticas')} 
                                    className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${activeTab === 'Estadísticas' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                                >
                                    <BarChart2 size={12} /> Estadísticas
                                </button>
                                <button 
                                    onClick={() => setActiveTab('Movimientos')} 
                                    className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${activeTab === 'Movimientos' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                                >
                                    <Move size={12} /> Movimientos
                                </button>
                            </div>
                        )}

                        <button 
                            onClick={closeModal} 
                            className="p-1.5 bg-red-900/20 hover:bg-red-900/50 border border-red-900/50 hover:border-red-500 text-red-400 hover:text-red-200 rounded-lg transition-colors"
                            title="Cerrar"
                        >
                            <X size={20} />
                        </button>
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

                                <div className="grid grid-cols-1 gap-4 pb-2">
                                    {quizQuestions[currentQuestion]?.options.map((option, idx) => (
                                        <QuizOption 
                                            key={idx}
                                            index={idx}
                                            option={option}
                                            selectedAnswerIndex={selectedAnswerIndex}
                                            correctIndex={quizQuestions[currentQuestion].correct}
                                            isTransitioning={isTransitioning}
                                            onAnswer={handleAnswer}
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
                                                {captureAttempt.success ? '¡CAPTURA EXITOSA!' : '¡EL POKÉMON ESCAPÓ!'}
                                            </h3>
                                            <p className="text-sm text-slate-300">
                                                {captureAttempt.success 
                                                    ? `${selectedPokemon.name} ha sido registrado en la base de datos.` 
                                                    : `Probabilidad de éxito fue del ${(captureAttempt.probability * 100).toFixed(0)}%. Inténtalo de nuevo.`}
                                            </p>
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
                                
                                <button onClick={closeModal} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-600 font-bold tracking-wider uppercase transition-colors">
                                    Cerrar
                                </button>
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
                                            {Object.entries(selectedPokemon.stats).map(([key, value]) => (
                                                <div key={key} className="flex justify-between items-center p-2 rounded bg-slate-800/30 border border-slate-700/50">
                                                    <span className="text-xs font-mono text-slate-500 uppercase">{key}</span>
                                                    <span className="text-sm font-bold text-white">{value}</span>
                                                </div>
                                            ))}
                                        </div>
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
// 4. COMPONENTE PRINCIPAL (ACTUALIZADO)
// -----------------------------------------------------------------------------
export default function PokemonQuiz({ onGoBack, onGameCapture }) {
  const [captured, setCaptured] = useState(() => {
    const savedData = localStorage.getItem('pokemonQuizSaveData');
    return savedData ? JSON.parse(savedData) : {};
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
  const [showSpecialEvent, setShowSpecialEvent] = useState(false);

  // --- CAMBIO 1: FILTRADO DE MEW ---
  // Filtramos para que Mew (151) solo aparezca si está desbloqueado
  const filteredPokemon = useMemo(() => {
    const baseList = POKEMON_DATA.filter(p => {
        if (p.id === 151) {
            return captured[151] === true || captured[151] === 'unlocked';
        }
        return true; // Muestra del 1 al 150 siempre
    });

    return selectedType === "Todos"
      ? baseList
      : baseList.filter(p => p.type.includes(selectedType));
  }, [selectedType, captured]);

  const capturedCount = Object.values(captured).filter(status => status === true).length;
  const totalPokemon = 150;

  useEffect(() => {
    localStorage.setItem('pokemonQuizSaveData', JSON.stringify(captured));
  }, [captured]);

  // --- EFECTO DE BONUS ---
  useEffect(() => {
    if (inBonusRound && selectedPokemon && selectedPokemon.bonusQuestion) {
        const bonusQ = shuffleOptions(selectedPokemon.bonusQuestion);
        setQuizQuestions(prev => [...prev, bonusQ]);
        setTimeout(() => {
            setCurrentQuestion(prev => prev + 1);
            setIsTransitioning(false);
        }, 100);
    }
  }, [inBonusRound, selectedPokemon]);

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
  
  const handlePokemonClick = useCallback((pokemon) => {
    if (captured[pokemon.id] === true) {
      setSelectedPokemon(pokemon);
      setActiveTab('Estadísticas');
      setIsShiny(false);
    } else {
      setSelectedPokemon(pokemon);
      setQuizMode(true);
      setCurrentQuestion(0);
      setScore(0);
      setShowResult(false);
      setCaptureAttempt(null);
      setInBonusRound(false);
      const randomQuestions = selectRandomQuestions(pokemon.quiz);
      const questionsWithShuffledOptions = randomQuestions.map(q => shuffleOptions(q));
      setQuizQuestions(questionsWithShuffledOptions);
      setIsTransitioning(false);
      setSelectedAnswerIndex(null);
    }
  }, [captured]);

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

  // --- CAMBIO 2: LÓGICA DE CAPTURA + NOTIFICACIÓN ---
  const attemptCapture = (finalScore) => {
    let success = false;
    let probability = 0;

    if (finalScore >= quizQuestions.length) {
      success = true;
      probability = 1.0;
    } else {
      const baseCaptureRate = RARITY_CAPTURE_RATES[selectedPokemon.rarity];
      const random = Math.random();
      success = random < baseCaptureRate;
      probability = baseCaptureRate;
    }
    
    setCaptureAttempt({ success, probability });

    if (success) {
      // Guardado en estado
      const newCapturedState = { ...captured, [selectedPokemon.id]: true };
      setCaptured(newCapturedState);
      
      // GUARDADO SÍNCRONO EN DISCO (Crucial para que App.jsx lea lo correcto)
      localStorage.setItem('pokemonQuizSaveData', JSON.stringify(newCapturedState));
      
      const trulyCapturedCount = Object.values(newCapturedState).filter(status => status === true).length;
      
      // NOTIFICACIÓN AL PADRE (Mensaje de 5 Pokémon)
      if (onGameCapture) {
          onGameCapture(trulyCapturedCount);
      }

      // NOTIFICACIÓN DE MEW (Mensaje de 150 Pokémon)
      // Si tenemos 150 o más y Mew (151) no existe en la lista...
      if (trulyCapturedCount >= 150 && !newCapturedState[151]) {
        setTimeout(() => {
          setShowSpecialEvent(true); 
        }, 2000);
      }
    }
  };

  // --- CAMBIO 3: HANDLER PARA DESBLOQUEAR MEW ---
  const handleWinSpecialEvent = () => {
    // Lo marcamos como 'unlocked' para que aparezca en la grilla (en gris)
    const unlockedState = { ...captured, 151: 'unlocked' };
    setCaptured(unlockedState);
    localStorage.setItem('pokemonQuizSaveData', JSON.stringify(unlockedState));
    setShowSpecialEvent(false);
  };

  const handleAnswer = useCallback((selectedIndex) => {
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
        }
    }, 1000);
  }, [currentQuestion, isTransitioning, quizQuestions, score, selectedPokemon, inBonusRound]);

  const closeModal = useCallback(() => {
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
  }, []);

  return (
    <>
      <style>{`
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
        body, html { overflow-x: hidden; width: 100%; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="min-h-screen w-full bg-[#0f172a] text-white relative font-sans overflow-hidden flex flex-col">
        
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
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Progreso de Captura</span>
                  <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-mono font-bold text-cyan-400">{capturedCount}</span>
                      <span className="text-sm text-slate-600">/ {totalPokemon}</span>
                  </div>
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
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                currentQuestion={currentQuestion}
                quizQuestions={quizQuestions}
                selectedAnswerIndex={selectedAnswerIndex}
                isTransitioning={isTransitioning}
                handleAnswer={handleAnswer}
                score={score}
                captureAttempt={captureAttempt}
                inBonusRound={inBonusRound}
            />
        )}

        {/* MODAL ESPECIAL (Integrado) */}
        {showSpecialEvent && (
          <SpecialEventModal onConfirm={handleWinSpecialEvent} />
        )}
      </div>
    </>
  );
}