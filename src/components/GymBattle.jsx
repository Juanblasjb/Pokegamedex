import React, { useState, useEffect } from 'react';
import { Heart, Shield, Swords, Brain, Image as ImageIcon, CheckCircle, XCircle, ArrowLeft, GalleryHorizontal, MoveRightIcon, AlignRightIcon, TvIcon } from 'lucide-react';
import { GYM_DATA } from '../data/gymsData'; 
import GymStadiumPhase from './gym_phase/GymStadiumPhase';
import GymScenePhase from './gym_phase/GymScenePhase';
import GymQuizPhase from './gym_phase/GymQuizPhase';
import GymBattleResult from './GymBattleResult'; 
import GymBadgeReward from './GymBadgeReward';
import ProfessorOakOverlay from './ProfessorOakOverlay';
import TutorialCompleteModal from './TutorialCompleteModal';
// IMPORTANTE: Asegúrate de importar los datos de pokémon
import { POKEMON_DATA } from '../pokemonData'; 

const GymBattle = ({ gymId, userTeam, onVictory, onDefeat, onExit, userName = "ENTRENADOR", profileId }) => {
  const gymData = GYM_DATA.find(g => g.id === gymId);
  const [showBadgeReward, setShowBadgeReward] = useState(false);
  
  // ESTADO PARA EL PREMIO
  const [bonusPokemon, setBonusPokemon] = useState(null);
  
  // Estados para el tutorial
  const [showTutorialOverlay, setShowTutorialOverlay] = useState(false);
  const [currentTutorialScript, setCurrentTutorialScript] = useState([]);
  const [showTutorialComplete, setShowTutorialComplete] = useState(false);

  // --- 1. CONFIGURACIÓN DE PERSISTENCIA ---
  const uniqueId = profileId || userName.replace(/\s+/g, '_');
  const STORAGE_KEY = `pokegamedex_gym_progress_${uniqueId}`;

  const getSavedProgress = () => {
      try {
          const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
          return saved[gymId] || 0; 
      } catch (e) {
          return 0;
      }
  };

  // Helper para leer datos del perfil actual y saber si merece premio
  const getProfileData = () => {
      try {
          const profiles = JSON.parse(localStorage.getItem('pokemonQuizProfiles') || '[]');
          const currentProfile = profiles.find(p => p.id === profileId);
          
          // Leemos las capturas del archivo de guardado específico
          const saveData = JSON.parse(localStorage.getItem(`save_file_${profileId}`) || '{}');
          
          return { profile: currentProfile, captures: saveData };
      } catch (e) {
          console.error("Error leyendo perfil:", e);
          return { profile: null, captures: {} };
      }
  };

  const initialMinionIndex = getSavedProgress();
  const totalMinions = gymData && gymData.minions ? gymData.minions.length : 0;

  // --- 2. ESTADOS INICIALES ---
  const [currentMinionIndex, setCurrentMinionIndex] = useState(initialMinionIndex);
  
  const [currentStage, setCurrentStage] = useState(() => {
      if (initialMinionIndex >= totalMinions) return 'leader_intro';
      return 'minion_intro';
  });

  // Efecto Tutorial (Oak)
  useEffect(() => {
      if (gymData.isTutorial && gymData.tutorialScripts) {
          let script = null;

          if (currentStage === 'leader_intro') script = gymData.tutorialScripts.intro;
          else if (currentStage === 'phase_1') script = gymData.tutorialScripts.phase1;
          else if (currentStage === 'phase_2') script = gymData.tutorialScripts.phase2;
          else if (currentStage === 'phase_3') script = gymData.tutorialScripts.phase3;

          if (script) {
              setCurrentTutorialScript(script);
              setShowTutorialOverlay(true);
          }
      }
  }, [currentStage, gymData]);

  // Efecto Música
  useEffect(() => {
    let bgm = null;
    if (gymData.music) {
        bgm = new Audio(gymData.music);
        bgm.loop = true;
        bgm.volume = 0.3; 
        bgm.play().catch(e => console.warn("Autoplay bloqueado:", e));
    }
    return () => {
        if (bgm) {
            bgm.pause();
            bgm.currentTime = 0;
        }
    };
  }, [gymData]);

  const handleTutorialFinished = () => {
    setShowTutorialOverlay(false);
    if (currentStage === 'tutorial_victory_speech') {
        setShowTutorialComplete(true);
    }
  };
  
  const MAX_LIVES = 3; 
  const [userLives, setUserLives] = useState(MAX_LIVES);
  const [leaderLives, setLeaderLives] = useState(MAX_LIVES);
  const [leaderPhaseResults, setLeaderPhaseResults] = useState([null, null, null]); 
  const [resultData, setResultData] = useState(null);

  if (!gymData) return <div className="text-white">Error: Datos de gimnasio no encontrados ({gymId})</div>;

  const currentMinion = (gymData.minions && gymData.minions.length > 0) 
      ? (gymData.minions[currentMinionIndex] || gymData.minions[0]) 
      : null;

  // --- 3. LÓGICA MINIONS ---
  const handleMinionPhaseEnd = (victory, stats) => {
      if (!gymData.minions) return;

      const hasNext = currentMinionIndex + 1 < gymData.minions.length;
      
      if (victory) {
          const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
          saved[gymId] = currentMinionIndex + 1;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      }

      let msg = "";
      if(victory) msg = hasNext ? "Haz clic para avanzar al siguiente entrenador" : "Haz clic para avanzar al Líder de Gimnasio";
      else msg = "Haz clic para volver al menú y reintentar.";

      setResultData({
          result: victory ? 'victory' : 'defeat',
          mode: 'quiz',
          stats: { ...stats, money: victory ? 200 : 0 },
          message: msg,
          onContinue: () => {
              setResultData(null); 
              if (victory) {
                  if (hasNext) {
                      setCurrentMinionIndex(prev => prev + 1);
                      setCurrentStage('minion_intro');
                  } else {
                      setCurrentStage('leader_intro');
                  }
              } else {
                  onExit();
              }
          }
      });
  };

  // --- 4. LÓGICA LÍDER (MEJOR DE 3) ---
  const handlePhaseEnd = (playerWonPhase, phaseIndex, stats) => {
    const newResults = [...leaderPhaseResults];
    newResults[phaseIndex] = playerWonPhase; 
    setLeaderPhaseResults(newResults);

    let newUserLives = userLives;
    let newLeaderLives = leaderLives;
    
    if (playerWonPhase) newLeaderLives = Math.max(0, leaderLives - 1);
    else newUserLives = Math.max(0, userLives - 1);
    
    setLeaderLives(newLeaderLives);
    setUserLives(newUserLives);

    let modeType = 'quiz';
    if(phaseIndex === 1) modeType = 'stadium';
    if(phaseIndex === 2) modeType = 'scene';

    let msg = "";
    if (playerWonPhase) {
        msg = "¡Objetivo cumplido! Pasando a la siguiente fase.";
    } else {
        if (phaseIndex === 0) msg = "Insuficientes respuestas correctas. Fase fallida.";
        else if (phaseIndex === 1) msg = "Tu equipo ha sido derrotado en la arena.";
        else msg = "Análisis de imagen incorrecto.";
    }

    const isFinalPhase = phaseIndex === 2;

    setResultData({
        result: playerWonPhase ? 'victory' : 'defeat',
        mode: modeType,
        stats: { ...stats, money: playerWonPhase ? 1000 : 0 },
        message: msg,
        onContinue: () => {
            setResultData(null);
            
            if (isFinalPhase) {
                const totalWins = newResults.filter(r => r === true).length;
                
                if (totalWins >= 2) {
                    // === LÓGICA DE VICTORIA ===
                    if (gymData.isTutorial) {
                        
                        // 1. Obtener datos frescos del perfil
                        const { profile, captures } = getProfileData();
                        const gymProgress = profile ? (profile.gymProgress || 0) : 0;

                        // 2. ¿Es el primer gimnasio? (Progreso 0)
                        if (gymProgress === 0) {
                            
                            // 3. CORRECCIÓN DEL FILTRO DE RAREZA
                            // Buscamos coincidencia por TEXTO "Común" o por NÚMERO 1
                            const commonPokemon = POKEMON_DATA.filter(p => 
                                p.rarity === "Común" || p.rarity === 1
                            );
                            
                            // 4. Filtrar los que ya tiene capturados (id: true)
                            const availableRewards = commonPokemon.filter(p => !captures[p.id]);

                            if (availableRewards.length > 0) {
                                // 5. Elegir uno al azar
                                const randomReward = availableRewards[Math.floor(Math.random() * availableRewards.length)];
                                setBonusPokemon(randomReward);
                                console.log("Premio asignado:", randomReward.name); // Para depuración
                            } else {
                                console.log("No quedan Pokémon comunes por capturar.");
                            }
                        } else {
                            console.log("Usuario ya tiene progreso, no se da premio.");
                        }

                        // Iniciar discurso de victoria de Oak
                        setCurrentTutorialScript(gymData.tutorialScripts.victory);
                        setShowTutorialOverlay(true);
                        setCurrentStage('tutorial_victory_speech'); 

                    } else {
                        // Gimnasio Normal -> Medalla
                        setShowBadgeReward(true); 
                    }
                } else {
                    // Perdió
                    setCurrentStage('defeat'); 
                }
            } else {
                // Siguiente fase
                if (phaseIndex === 0) setCurrentStage('phase_2');
                else if (phaseIndex === 1) setCurrentStage('phase_3');
            }
        }
    });
  };

  const handleRewardClose = () => {
      setShowBadgeReward(false);
      setCurrentStage('victory'); 
  };

  const renderBossHUD = () => {
      // (Tu código de HUD se mantiene igual, omitido para no alargar)
      const userHealthPercent = (userLives / MAX_LIVES) * 100;
      const leaderHealthPercent = (leaderLives / MAX_LIVES) * 100;
      const phases = [{ icon: Brain }, { icon: Swords }, { icon: ImageIcon }];
      return (
        <div className="absolute top-0 left-0 w-full z-50 px-4 py-2 md:px-12 md:py-3 select-none pointer-events-none">
            <div className="relative w-full max-w-7xl mx-auto flex items-end justify-between gap-4">
                <div className="flex-1 flex flex-col items-start group">
                    <div className="flex justify-between w-full mb-1 pl-1">
                        <span className="text-cyan-400 font-black italic uppercase tracking-widest text-xs md:text-base drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">{userName}</span>
                        <span className="text-slate-400 font-mono text-[10px]">{Math.round(userHealthPercent)}%</span>
                    </div>
                    <div className="relative w-full h-2.5 bg-slate-800/80 border border-slate-600 transform -skew-x-[20deg] overflow-hidden shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                        <div className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-cyan-300 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(6,182,212,0.6)]" style={{ width: `${userHealthPercent}%` }}></div>
                    </div>
                </div>
                <div className="flex gap-2 md:gap-4 pb-0 mx-2 md:mx-6">
                    {phases.map((Phase, idx) => {
                        const result = leaderPhaseResults[idx];
                        const isActive = (currentStage === 'phase_1' && idx === 0) || (currentStage === 'phase_2' && idx === 1) || (currentStage === 'phase_3' && idx === 2);
                        let iconColor = "text-slate-600"; let borderColor = "border-slate-700 bg-slate-900/80"; let shadow = "";
                        if (result === true) { iconColor = "text-green-100"; borderColor = "border-green-500 bg-green-900/80"; shadow = "shadow-[0_0_15px_rgba(34,197,94,0.6)]"; }
                        else if (result === false) { iconColor = "text-red-100"; borderColor = "border-red-600 bg-red-900/80"; shadow = "shadow-[0_0_10px_rgba(220,38,38,0.5)]"; }
                        else if (isActive) { iconColor = "text-white animate-pulse"; borderColor = "border-white/50 bg-slate-800"; shadow = "shadow-[0_0_8px_rgba(255,255,255,0.3)]"; }
                        return (<div key={idx} className="flex flex-col items-center justify-end"><div className={`w-8 h-8 md:w-10 md:h-10 border-2 transform rotate-45 flex items-center justify-center transition-all duration-500 ${borderColor} ${shadow}`}><Phase.icon size={16} className={`transform -rotate-45 ${iconColor}`} /></div></div>);
                    })}
                </div>
                <div className="flex-1 flex flex-col items-end group">
                    <div className="flex justify-between w-full mb-1 pr-1 flex-row-reverse">
                        <span className="text-red-500 font-black italic uppercase tracking-widest text-xs md:text-base drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]">{gymData.leader}</span>
                        <span className="text-slate-400 font-mono text-[10px]">{Math.round(leaderHealthPercent)}%</span>
                    </div>
                    <div className="relative w-full h-2.5 bg-slate-800/80 border border-slate-600 transform skew-x-[20deg] overflow-hidden shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                         <div className="absolute right-0 h-full bg-gradient-to-l from-red-700 via-red-600 to-red-500 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(220,38,38,0.6)]" style={{ width: `${leaderHealthPercent}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const isBossBattle = ['phase_1', 'phase_2', 'phase_3'].includes(currentStage);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 text-white font-sans overflow-hidden flex flex-col">

      {/* --- 1. OAK OVERLAY --- */}
      {showTutorialOverlay && (
          <ProfessorOakOverlay 
              messages={currentTutorialScript} 
              onFinished={handleTutorialFinished}
          />
      )}

      {/* --- 2. MODAL FINAL TUTORIAL --- */}
      {showTutorialComplete && (
        <TutorialCompleteModal 
            // PASAMOS EL PREMIO AQUÍ
            rewardPokemon={bonusPokemon} 
            onClose={() => {
                setShowTutorialComplete(false);
                // IMPORTANTE: Pasamos el premio a App.js para que lo guarde
                onVictory(bonusPokemon); 
            }}
        />
      )}

      {/* --- 3. RESULTADOS DE FASE --- */}
      {resultData && !showTutorialOverlay && <GymBattleResult {...resultData} />}

      {/* --- 4. RECOMPENSA NORMAL --- */}
      {showBadgeReward && !showTutorialOverlay && (
          <GymBadgeReward 
              badgeName={`MEDALLA ${gymData.badge.includes('/') 
                  ? gymData.badge.split('/').pop().split('.')[0].toUpperCase() 
                  : gymData.badge.toUpperCase()}`
              }
              leaderName={gymData.leader}
              badgeImage={gymData.badge} 
              onContinue={handleRewardClose}
          />
      )}

      {/* Botones y Fondo */}
      {currentStage !== 'victory' && currentStage !== 'defeat' && !isBossBattle && !showTutorialOverlay && (
          <div className="absolute top-6 left-8 z-50 animate-fade-in-down">
            <button onClick={onExit} className="group flex items-center gap-3 px-5 py-2.5 bg-slate-900/90 hover:bg-red-900/80 text-slate-300 hover:text-white rounded-tl-xl rounded-br-xl border-l-4 border-slate-500 hover:border-red-500 shadow-lg backdrop-blur-md transition-all duration-300 hover:pl-4 hover:pr-6">
                <ArrowLeft size={16} className="text-slate-400 group-hover:text-white group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-black tracking-[0.2em] uppercase">RETIRADA</span>
            </button>
          </div>
      )}

      <div className="absolute inset-0 z-0 opacity-20 filter saturate-50 contrast-125"><img src={gymData.background} alt="Gym BG" className="w-full h-full object-cover" /></div>
      <div className={`absolute inset-0 z-0 transition-colors duration-1000 ${isBossBattle ? 'bg-gradient-to-b from-slate-900/95 via-red-950/20 to-slate-900/95' : 'bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-900/90'}`}></div>
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(15,23,42,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.5)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20"></div>

      {isBossBattle && !showTutorialOverlay && renderBossHUD()}

      <div className={`relative z-10 flex-1 flex items-center justify-center p-4 md:p-8 ${isBossBattle ? 'pt-16 md:pt-20' : ''}`}>
        
        {/* SÚBDITO INTRO */}
        {currentStage === 'minion_intro' && currentMinion && (
           <div className="w-full h-full flex items-center justify-center relative z-10 p-4">
              <div className="relative w-full max-w-5xl h-[600px]"> 
                  <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl border border-slate-600 rounded-[2rem] transform -skew-x-3 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
                      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-scan-vertical pointer-events-none"></div>
                  </div>
                  <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 items-center">
                      <div className="flex flex-col justify-center space-y-6 pl-12 md:pl-16 pr-4 z-20 animate-slide-in-left">
                          <div className="flex items-center gap-3">
                              <div className="flex space-x-1"><div className="w-1 h-4 bg-cyan-500 animate-pulse"></div><div className="w-1 h-4 bg-cyan-500/50"></div></div>
                              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.25em] font-bold">Amenaza Detectada</span>
                          </div>
                          <div className="relative">
                              <h2 className="text-5xl md:text-6xl font-black italic uppercase text-white tracking-tighter drop-shadow-2xl leading-[0.9]">
                                  <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">{currentMinion.name.split(' ')[0]}</span>
                                  <span className="block text-cyan-400/90">{currentMinion.name.split(' ').slice(1).join(' ')}</span>
                              </h2>
                          </div>
                          <div className="bg-black/50 border-l-4 border-cyan-500 p-5 rounded-r-xl backdrop-blur-sm max-w-md shadow-lg transform skew-x-[-3deg]">
                              <p className="text-sm text-slate-300 font-medium italic skew-x-[3deg]">
                                "{currentMinion.introQuote || "¡No dejaré que pases! Prepárate para luchar."}"
                              </p>
                              <div className="w-full h-px bg-slate-700 my-3 skew-x-[3deg]"></div>
                              <div className="flex gap-6 text-[9px] font-mono text-cyan-300 uppercase tracking-widest skew-x-[3deg]"><span>Clase: Entrenador</span><span>tier: D</span></div>
                          </div>
                          <div className="pt-4">
                            <button onClick={() => setCurrentStage('minion_fight')} className="group relative px-8 py-4 bg-gradient-to-r from-cyan-700 to-cyan-600 hover:from-cyan-600 hover:to-cyan-500 text-white font-black uppercase tracking-widest text-sm rounded-lg shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all hover:scale-[1.02] overflow-hidden border border-cyan-400/30">
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                                <span className="relative z-10 flex items-center gap-3">INICIAR COMBATE <Swords size={18} /></span>
                            </button>
                          </div>
                      </div>
                      <div className="relative h-full flex items-end justify-center z-20 animate-slide-in-right pb-0 md:pr-10">
                          <div className="absolute bottom-20 w-[300px] h-[300px] border-2 border-cyan-500/20 rounded-full animate-spin-slow"></div>
                          <div className="absolute bottom-20 w-[250px] h-[250px] border border-dashed border-cyan-500/30 rounded-full animate-reverse-spin"></div>
                          <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-cyan-500/10 to-transparent blur-2xl"></div>
                          <img src={currentMinion.image} alt={currentMinion.name} className="relative z-20 h-[90%] w-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] filter brightness-110 hover:scale-105 transition-transform duration-700 origin-bottom" />
                          <div className="absolute top-10 right-10 bg-black/60 border border-slate-600 px-3 py-2 rounded backdrop-blur-md flex flex-col items-end shadow-xl">
                              <span className="text-[8px] text-slate-400 uppercase font-bold tracking-widest mb-1">Amenaza</span>
                              <div className="flex gap-1">
                                {[...Array(5)].map((_,i) => (<div key={i} className={`w-1 h-3 rounded-full ${i < (currentMinion.threatLevel || 1) ? 'bg-red-500 animate-pulse' : 'bg-slate-800'}`}></div>))}
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
           </div>
        )}

        {/* PELEA SÚBDITO */}
        {currentStage === 'minion_fight' && (
            <div className="w-full max-w-2xl h-auto bg-slate-900/95 rounded-2xl border border-slate-600 overflow-hidden shadow-2xl backdrop-blur-sm">
                <GymQuizPhase 
                    title={`VS ${currentMinion.name}`}
                    questions={currentMinion.quiz}
                    requiredToWin={10} 
                    maxQuestions={15} 
                    onPhaseComplete={(victory, stats) => handleMinionPhaseEnd(victory, stats)} 
                />
            </div>
        )}

        {/* INTRO LÍDER */}
        {currentStage === 'leader_intro' && !showTutorialOverlay && (
           <div className="w-full h-full flex items-center justify-center relative z-10 p-4">
              <div className="relative w-full max-w-5xl h-[600px]"> 
                  <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-xl border border-red-800/60 rounded-[2rem] transform -skew-x-3 shadow-[0_0_60px_rgba(220,38,38,0.25)] overflow-hidden">
                      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(220,38,38,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.1)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-red-600/10 to-transparent animate-scan-vertical pointer-events-none"></div>
                  </div>
                  <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2">
                      <div className="flex flex-col justify-center h-full pl-12 md:pl-16 pr-4 z-20 animate-slide-in-left">
                          <div className="flex items-center gap-3 mb-2">
                              <div className="flex space-x-1"><div className="w-1 h-4 bg-red-600 animate-ping"></div><div className="w-1 h-4 bg-red-600"></div></div>
                              <span className="text-[10px] font-mono text-red-500 uppercase tracking-[0.25em] font-bold">ALERTA OMEGA // JEFE FINAL</span>
                          </div>
                          <div className="relative">
                              <h2 className="text-5xl md:text-6xl font-black italic uppercase text-white tracking-tighter drop-shadow-2xl leading-[0.9]">
                                  <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-red-200">LÍDER</span>
                                  <span className="block text-red-600 animate-glitch text-shadow-red">{gymData.leader}</span>
                              </h2>
                          </div>
                          <div className="bg-black/60 border-l-4 border-red-600 p-5 rounded-r-xl backdrop-blur-sm max-w-md shadow-lg transform skew-x-[-3deg] mt-6">
                              <p className="text-sm text-red-100 font-medium italic skew-x-[3deg]">
                                "{gymData.introQuote || "Has superado a mis súbditos, pero yo estoy a otro nivel. ¡Prepárate para la derrota!"}"
                              </p>
                              <div className="w-full h-px bg-red-900/50 my-3 skew-x-[3deg]"></div>
                              <div className="flex gap-6 text-[9px] font-mono text-red-400 uppercase tracking-widest skew-x-[3deg]"><span>Clase: LÍDER</span><span>Peligro: EXTREMO</span></div>
                          </div>
                          <div className="pt-6">
                            <button onClick={() => setCurrentStage('phase_1')} className="group relative px-8 py-4 bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 text-white font-black uppercase tracking-widest text-sm rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all hover:scale-[1.02] overflow-hidden border border-red-500/30">
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                                <span className="relative z-10 flex items-center gap-3">INICIAR TUTORIAL<TvIcon size={18} className="animate-pulse" /></span>
                            </button>
                          </div>
                      </div>
                      <div className="relative h-full flex items-end justify-center z-20 animate-slide-in-right pointer-events-none">
                          <div className="absolute bottom-20 w-[300px] h-[300px] border-2 border-red-600/20 rounded-full animate-spin-slow"></div>
                          <div className="absolute bottom-20 w-[250px] h-[250px] border border-dashed border-red-600/30 rounded-full animate-reverse-spin"></div>
                          <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-red-600/20 to-transparent blur-2xl"></div>
                          <img src={gymData.leaderImg} alt={gymData.leader} className="relative z-20 h-[90%] w-auto object-contain object-bottom drop-shadow-[0_10px_40px_rgba(220,38,38,0.5)] filter brightness-110 hover:scale-105 transition-transform duration-700" />
                          <div className="absolute top-10 right-10 bg-black/80 border border-red-900 px-3 py-2 rounded backdrop-blur-md flex flex-col items-end shadow-xl pointer-events-auto">
                              <span className="text-[8px] text-red-500 uppercase font-bold tracking-widest mb-1">Amenaza</span>
                              <div className="flex gap-1">
                                {[...Array(5)].map((_,i) => (<div key={i} className={`w-1 h-3 rounded-sm ${i < (gymData.threatLevel || 5) ? 'bg-red-600 animate-pulse shadow-[0_0_5px_red]' : 'bg-slate-800'}`}></div>))}
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
           </div>
        )}

       {/* FASE 1: QUIZ DEL LÍDER */}
        {currentStage === 'phase_1' && !showTutorialOverlay && (
             <div className="w-full max-w-2xl h-auto bg-slate-900/95 rounded-2xl border border-slate-500/50 overflow-hidden shadow-2xl backdrop-blur-sm mt-8 animate-slide-in-left">
                <GymQuizPhase 
                    title={gymData.id === 'pallet-town' ? "TEORÍA BÁSICA" : `DESAFÍO: ${gymData.leader}`}
                    questions={gymData.leaderPhase1}
                    requiredToWin={gymData.id === 'pallet-town' ? 2 : 16} 
                    maxQuestions={gymData.id === 'pallet-town' ? 3 : 25}
                    theme={gymData.id === 'pallet-town' ? "green" : "red"}
                    onPhaseComplete={(victory, stats) => handlePhaseEnd(victory, 0, stats)}
                />
             </div>
        )}

        {/* FASE 2: ESTADIO */}
        {currentStage === 'phase_2' && !showTutorialOverlay && (
             <div className="w-full max-w-5xl h-[500px] bg-slate-900/95 rounded-2xl border border-slate-500/30 overflow-hidden shadow-2xl backdrop-blur-sm mt-8 animate-zoom-in">
                <GymStadiumPhase 
                    userTeamIds={userTeam} 
                    leaderTeamIds={gymData.leaderTeam} 
                    userName={userName}
                    leaderName={gymData.leader}
                    onPhaseComplete={(victory, stats) => handlePhaseEnd(victory, 1, stats)}
                />
             </div>
        )}

        {/* FASE 3: ESCENA */}
        {currentStage === 'phase_3' && !showTutorialOverlay && (
             <div className="w-full max-w-7xl h-auto bg-slate-900/95 rounded-2xl border border-slate-500/30 overflow-hidden shadow-2xl backdrop-blur-sm mt-8 animate-slide-in-right">
                <GymScenePhase 
                    sceneData={gymData.scenePhase} 
                    onPhaseComplete={(victory, stats) => handlePhaseEnd(victory, 2, stats)}
                />
             </div>
        )}

        {/* VICTORIA */}
        {currentStage === 'victory' && (
            <div className="text-center animate-bounce-in flex flex-col items-center justify-center h-full">
                <CheckCircle size={100} className="text-green-500 mb-6 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
                <h1 className="text-6xl font-black italic text-white mb-2 uppercase tracking-tighter drop-shadow-lg">¡VICTORIA!</h1>
                <p className="text-xl text-green-400 mb-8 font-mono tracking-wide">
                    Has obtenido la Medalla <span className="text-white font-bold">
                        {gymData.badge.includes('/') ? gymData.badge.split('/').pop().split('.')[0].toUpperCase() : gymData.badge.toUpperCase()}
                    </span>.
                </p>
                <button onClick={onVictory} className="px-10 py-4 bg-green-600 hover:bg-green-500 text-white font-black uppercase tracking-widest rounded shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all transform hover:scale-105">
                    SALIR DEL GIMNASIO
                </button>
            </div>
        )}

        {/* DERROTA */}
        {currentStage === 'defeat' && (
            <div className="text-center animate-pulse">
                <XCircle size={100} className="text-red-500 mx-auto mb-4" />
                <h1 className="text-6xl font-black italic text-white mb-2">DERROTA</h1>
                <p className="text-xl text-red-400 mb-8">El Líder ha demostrado ser superior.</p>
                <button onClick={onDefeat} className="px-8 py-3 bg-slate-700 text-white font-bold rounded">Intentar de nuevo</button>
            </div>
        )}

      </div>
    </div>
  );
};

export default GymBattle;