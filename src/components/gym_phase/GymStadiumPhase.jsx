import React, { useState, useEffect, useMemo, useRef } from 'react';
import { POKEMON_DATA } from '../../pokemonData';
import { 
  Swords, Shield, Zap, Wind, Heart, Activity, 
  TabletsIcon, Crown, Crosshair
} from 'lucide-react';

// --- CONFIGURACIÓN DE IMÁGENES ---
const getPokemonImg = (id) => `/assets/pokemon/normal/${id}.png`;

// --- CONFIGURACIÓN DE STATS ---
const STATS_CONFIG = {
  hp: { label: 'SALUD', short: 'HP', icon: <Heart />, color: 'text-green-400', border: 'border-green-500', shadow: 'shadow-[0_0_15px_#4ade80]', bg: 'bg-green-500/10' },
  atk: { label: 'ATAQUE', short: 'ATK', icon: <Swords />, color: 'text-red-500', border: 'border-red-500', shadow: 'shadow-[0_0_15px_#ef4444]', bg: 'bg-red-500/10' },
  def: { label: 'DEFENSA', short: 'DEF', icon: <Shield />, color: 'text-blue-400', border: 'border-blue-500', shadow: 'shadow-[0_0_15px_#60a5fa]', bg: 'bg-blue-500/10' },
  spAtk: { label: 'AT. ESP', short: 'SPA', icon: <Zap />, color: 'text-yellow-400', border: 'border-yellow-500', shadow: 'shadow-[0_0_15px_#facc15]', bg: 'bg-yellow-500/10' },
  spDef: { label: 'DF. ESP', short: 'SPD', icon: <Activity />, color: 'text-purple-400', border: 'border-purple-500', shadow: 'shadow-[0_0_15px_#c084fc]', bg: 'bg-purple-500/10' },
  spd: { label: 'VELOCIDAD', short: 'VEL', icon: <Wind />, color: 'text-cyan-400', border: 'border-cyan-500', shadow: 'shadow-[0_0_15px_#22d3ee]', bg: 'bg-cyan-500/10' },
};

const STAT_KEYS = Object.keys(STATS_CONFIG);

const GymStadiumPhase = ({ userTeamIds, leaderTeamIds, onPhaseComplete, userName = "JUGADOR", leaderName = "RIVAL" }) => {
  // --- ESTADOS ---
  const [view, setView] = useState('selection'); 
  const [selectedIds, setSelectedIds] = useState([]); 
  
  const [currentRound, setCurrentRound] = useState(0);
  const [scores, setScores] = useState({ user: 0, leader: 0 });
  const [battleState, setBattleState] = useState('ready'); 
  
  const [currentStat, setCurrentStat] = useState('hp');
  const [condition, setCondition] = useState('higher'); 
  const [roundWinner, setRoundWinner] = useState(null); 

  const timeoutRef = useRef(null);

  // --- DATOS ---
  const userFullTeam = useMemo(() => 
    userTeamIds.map(id => POKEMON_DATA.find(p => p.id === id)).filter(Boolean), 
  [userTeamIds]);

  const leaderFullTeam = useMemo(() => 
    leaderTeamIds.map(id => POKEMON_DATA.find(p => p.id === id)).filter(Boolean), 
  [leaderTeamIds]);

  const userBattleTeam = useMemo(() => 
    selectedIds.map(id => userFullTeam.find(p => p.id === id)), 
  [selectedIds, userFullTeam]);

  // --- LÓGICA DE SELECCIÓN ---
  const handleToggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(pid => pid !== id));
    } else {
      if (selectedIds.length < 3) setSelectedIds(prev => [...prev, id]);
    }
  };

  const startBattle = () => {
    if (selectedIds.length === 3) setView('battle');
  };

  // --- LÓGICA DE BATALLA ---
  useEffect(() => {
    if (view === 'battle' && battleState === 'ready') {
      const timer = setTimeout(() => {
        setBattleState('spinning');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [view, battleState]);

  useEffect(() => {
    if (battleState === 'spinning') {
      let currentDelay = 50; 
      let stopLoop = false;
      const maxDelay = 600; 
      
      const spin = () => {
        if (stopLoop) return;

        const randomStatKey = STAT_KEYS[Math.floor(Math.random() * STAT_KEYS.length)];
        const randomCond = Math.random() > 0.5 ? 'higher' : 'lower';
        
        setCurrentStat(randomStatKey);
        setCondition(randomCond);

        currentDelay = Math.floor(currentDelay * 1.15);

        if (currentDelay > maxDelay) {
          stopLoop = true;
          resolveRound(randomStatKey, randomCond);
        } else {
          timeoutRef.current = setTimeout(spin, currentDelay);
        }
      };

      spin();
      return () => clearTimeout(timeoutRef.current);
    }
  }, [battleState]);

  const resolveRound = (finalStat, finalCond) => {
    const index = currentRound % 3;
    const userPoke = userBattleTeam[index];
    const leaderPoke = leaderFullTeam[index];

    const getStat = (poke, stat) => {
        if (!poke.stats) return 0;
        if (stat === 'atk') return poke.stats.attack || poke.stats.atk;
        if (stat === 'def') return poke.stats.defense || poke.stats.def;
        if (stat === 'spAtk') return poke.stats['special-attack'] || poke.stats.special_attack || poke.stats.spAtk;
        if (stat === 'spDef') return poke.stats['special-defense'] || poke.stats.special_defense || poke.stats.spDef;
        if (stat === 'spd') return poke.stats.speed || poke.stats.spd;
        return poke.stats[stat];
    };

    const userVal = getStat(userPoke, finalStat) || 0;
    const leaderVal = getStat(leaderPoke, finalStat) || 0;

    let winner = 'tie';
    if (finalCond === 'higher') {
      if (userVal > leaderVal) winner = 'user';
      else if (leaderVal > userVal) winner = 'leader';
    } else { 
      if (userVal < leaderVal) winner = 'user';
      else if (leaderVal < userVal) winner = 'leader';
    }

    setRoundWinner(winner);
    setBattleState('reveal');

    setTimeout(() => {
      setBattleState('scoring');
      if (winner === 'user') setScores(s => ({ ...s, user: s.user + 1 }));
      if (winner === 'leader') setScores(s => ({ ...s, leader: s.leader + 1 }));
    }, 2000); 
  };

  // --- MODIFICACIÓN CLAVE AQUÍ ---
  useEffect(() => {
    if (battleState === 'scoring') {
      const isGameOver = currentRound >= 2 && scores.user !== scores.leader;
      
      const timer = setTimeout(() => {
        if (isGameOver) {
          // 1. CALCULAMOS RESULTADO FINAL
          const userWon = scores.user > scores.leader;
          
          // 2. ENVIAMOS RESULTADOS DIRECTAMENTE AL PADRE (Sin cambiar vista interna)
          onPhaseComplete(userWon, { 
             userScore: scores.user, 
             rivalScore: scores.leader,
             battlesWon: scores.user,
             suddenDeath: currentRound > 2
          });

        } else {
          // CONTINUAR SIGUIENTE RONDA
          setRoundWinner(null);
          setCurrentRound(prev => prev + 1);
          setBattleState('ready');
        }
      }, 2000); // 2 segundos para ver que el marcador subió
      return () => clearTimeout(timer);
    }
  }, [battleState, scores, currentRound, onPhaseComplete]);


  // --- COMPONENTES VISUALES ---
  const BattleCard = ({ pokemon, isPlayer, winner, statValue, statInfo, isSpinning }) => {
      const isWinner = winner === (isPlayer ? 'user' : 'leader');
      const isLoser = winner && !isWinner && winner !== 'tie';
      const showNumber = !isSpinning && winner !== null;
      
      return (
          <div className={`
              relative w-full aspect-square md:aspect-[4/5] rounded-xl border-2 overflow-hidden transition-all duration-500
              ${isLoser ? 'grayscale opacity-60 scale-95 border-slate-700' : ''}
              ${isWinner ? `border-white shadow-[0_0_30px_rgba(255,255,255,0.3)] scale-105 z-10 bg-slate-800` : 'border-slate-700 bg-slate-900/60'}
          `}>
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(0deg,transparent_24%,rgba(6,182,212,0.1)_25%,rgba(6,182,212,0.1)_26%,transparent_27%,transparent_74%,rgba(6,182,212,0.1)_75%,rgba(6,182,212,0.1)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(6,182,212,0.1)_25%,rgba(6,182,212,0.1)_26%,transparent_27%,transparent_74%,rgba(6,182,212,0.1)_75%,rgba(6,182,212,0.1)_76%,transparent_77%,transparent)] bg-[size:30px_30px]"></div>
              
              <div className="absolute inset-0 flex items-center justify-center p-6">
                  <img 
                      src={getPokemonImg(pokemon.id)} 
                      alt={pokemon.name} 
                      className={`w-full h-full object-contain drop-shadow-2xl transition-all duration-500 ${isWinner ? 'scale-110 animate-float' : ''}`}
                  />
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">
                      {pokemon.name}
                  </h3>
                  
                  <div className={`mt-1 flex items-center justify-between border-t border-white/20 pt-2 h-10`}>
                      {showNumber ? (
                          <>
                            <span className="text-xs font-mono text-slate-400 animate-fade-in">{statInfo.label}</span>
                            <span className={`text-3xl font-mono font-bold ${statInfo.color} drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] animate-bounce-in`}>
                                {statValue}
                            </span>
                          </>
                      ) : (
                          <div className="flex items-center gap-2 opacity-50 w-full justify-end">
                              <span className="h-1 w-2 bg-slate-500 animate-pulse"></span>
                              <span className="h-1 w-2 bg-slate-500 animate-pulse delay-75"></span>
                              <span className="h-1 w-2 bg-slate-500 animate-pulse delay-150"></span>
                          </div>
                      )}
                  </div>
              </div>

              {isWinner && (
                  <div className="absolute top-3 right-3 z-20">
                      <Crown size={24} className="text-yellow-400 animate-bounce" fill="currentColor" />
                  </div>
              )}
          </div>
      );
  };


  // --- RENDERIZADO PRINCIPAL ---

  // 1. SELECCIÓN DE EQUIPO (VIEW: 'selection')
  if (view === 'selection') {
    return (
      <div className="w-full h-full flex flex-col p-4 animate-fade-in relative bg-[#0a0f1e] rounded-xl border border-slate-700 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

        <div className="w-full flex flex-col items-center justify-center mb-4 shrink-0 relative z-10">
            <h2 className="text-xl font-black italic uppercase text-cyan-400 tracking-tighter flex items-center gap-2 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                <TabletsIcon size={24} /> TU EQUIPO
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1 tracking-widest">SELECCIONA 3 POKÉMON PARA EL COMBATE</p>
        </div>
        
        <div className="flex-1 flex items-center justify-center w-full relative z-10">
            <div className="grid grid-cols-3 gap-4 w-full max-w-3xl">
                {userFullTeam.map((poke) => {
                    const isSelected = selectedIds.includes(poke.id);
                    return (
                    <button
                        key={poke.id}
                        onClick={() => handleToggleSelect(poke.id)}
                        className={`relative flex flex-col items-center justify-between rounded-xl border-2 transition-all duration-300 overflow-hidden h-36 group ${isSelected ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)] scale-105' : 'bg-slate-900/60 border-slate-700 hover:border-slate-500 hover:bg-slate-800'}`}
                    >
                        {isSelected && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-cyan-500 rounded flex items-center justify-center text-xs font-black text-black shadow-lg z-20">
                                {selectedIds.indexOf(poke.id) + 1}
                            </div>
                        )}
                        <div className="flex-1 w-full flex items-center justify-center p-2 z-10">
                            <img src={getPokemonImg(poke.id)} alt={poke.name} className={`w-20 h-20 object-contain drop-shadow-xl transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110 grayscale group-hover:grayscale-0'}`} />
                        </div>
                        <div className={`w-full py-1.5 flex items-center justify-center border-t backdrop-blur-sm z-10 ${isSelected ? 'bg-cyan-900/80 border-cyan-500/30' : 'bg-slate-950/80 border-white/5'}`}>
                            <span className={`text-[10px] font-black uppercase tracking-wider ${isSelected ? 'text-cyan-300' : 'text-slate-500'}`}>{poke.name}</span>
                        </div>
                    </button>
                    )
                })}
            </div>
        </div>

        <div className="w-full flex justify-center mt-4 shrink-0 relative z-50">
            <button onClick={startBattle} disabled={selectedIds.length !== 3} className={`flex items-center gap-3 px-10 py-3 rounded-none font-black uppercase tracking-[0.25em] text-xs transition-all shadow-xl ${selectedIds.length === 3 ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-cyan-400' : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-50'}`} style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)' }}>
                {selectedIds.length === 3 ? 'CONFIRMAR SELECCIÓN' : `SELECCIONANDO...`}
            </button>
        </div>
      </div>
    );
  }

  // (BLOQUE DE VIEW === 'RESULT' ELIMINADO COMPLETAMENTE)

  // 2. BATALLA (VIEW: 'battle')
  const activeUserPoke = userBattleTeam[currentRound % 3];
  const activeLeaderPoke = leaderFullTeam[currentRound % 3];
  const statInfo = STATS_CONFIG[currentStat];
  const isRevealed = battleState === 'reveal' || battleState === 'scoring';
  const isSpinning = battleState === 'spinning';

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden bg-[#0f172a] rounded-xl border border-slate-700 shadow-2xl">
        
        {/* FONDO DECORATIVO */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50 z-0"></div>

        {/* HEADER MARCADOR */}
        <div className="relative z-20 h-16 flex justify-between items-center px-8 border-b border-slate-700/50 bg-black/40 backdrop-blur-md">
            {/* MARCADOR IZQUIERDA */}
            <div className="flex flex-col items-start">
                <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-1">{userName}</span>
                <div className="flex gap-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className={`h-2 w-8 skew-x-[-12deg] ${i < scores.user ? 'bg-cyan-400 shadow-[0_0_10px_cyan]' : 'bg-slate-800'}`}></div>
                    ))}
                </div>
            </div>

            {/* CENTRO: RONDA */}
            <div className="flex flex-col items-center">
                <div className="px-4 py-1 bg-slate-800/80 rounded-full border border-slate-600 text-[10px] font-mono text-white tracking-[0.2em] mb-1">
                    ROUND {currentRound + 1}/3
                </div>
                {currentRound >= 3 && <span className="text-[9px] font-bold text-red-500 animate-pulse tracking-widest">MUERTE SÚBITA</span>}
            </div>

            {/* MARCADOR DERECHA */}
            <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1">{leaderName}</span>
                <div className="flex gap-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className={`h-2 w-8 skew-x-[12deg] ${i < scores.leader ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-slate-800'}`}></div>
                    ))}
                </div>
            </div>
        </div>

        {/* ARENA DE BATALLA */}
        <div className="flex-1 relative z-10 flex items-center justify-between px-4 md:px-12 pb-4">
            
            {/* LADO JUGADOR */}
            <div className="w-1/3 max-w-[200px] animate-slide-in-left">
                <BattleCard 
                    pokemon={activeUserPoke} 
                    isPlayer={true} 
                    winner={roundWinner}
                    statValue={activeUserPoke.stats[currentStat]}
                    statInfo={statInfo}
                    isSpinning={isSpinning}
                />
            </div>

            {/* NÚCLEO CENTRAL */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-30">
                <div className="relative w-48 h-48 flex items-center justify-center">
                    <div className={`absolute inset-0 border-[3px] border-dashed rounded-full ${isRevealed ? statInfo.border : 'border-slate-600'} transition-colors duration-300 ${isSpinning ? 'animate-spin' : ''}`}></div>
                    <div className={`absolute inset-4 border border-slate-700/50 rounded-full ${isSpinning ? 'animate-reverse-spin' : ''}`}></div>
                    
                    <div className="flex flex-col items-center gap-2 z-10">
                        <div className={`
                            w-20 h-20 flex items-center justify-center relative transition-all duration-300
                            ${isSpinning ? 'opacity-50 scale-90' : 'opacity-100 scale-110'}
                        `} style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                            <div className={`absolute inset-0 ${isSpinning ? 'bg-slate-800' : statInfo.bg}`}></div>
                            <div className={`relative z-10 transform scale-150 ${isRevealed ? statInfo.color : 'text-slate-400'}`}>
                                {statInfo.icon}
                            </div>
                        </div>

                        <div className={`text-2xl font-black italic uppercase tracking-tighter drop-shadow-md ${isRevealed ? statInfo.color : 'text-slate-500'}`}>
                            {statInfo.short}
                        </div>
                    </div>

                    {isRevealed && <div className={`absolute inset-0 ${statInfo.color.replace('text-', 'bg-')}/10 blur-3xl rounded-full`}></div>}
                </div>

                <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-black/60 rounded border border-white/10 backdrop-blur-sm shadow-lg">
                    <Crosshair size={14} className={condition === 'higher' ? 'text-green-400' : 'text-orange-400'} />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-300">
                        OBJETIVO: <span className={condition === 'higher' ? 'text-green-400' : 'text-orange-400'}>{condition === 'higher' ? 'MAYOR' : 'MENOR'}</span>
                    </span>
                </div>

                {/* Mensaje de Resultado (Ronda Individual) */}
                {isRevealed && (
                    <div className={`absolute top-[100%] mt-4 whitespace-nowrap px-8 py-3 bg-[#0a0a0a] text-white font-black italic uppercase tracking-widest border-l-4 ${roundWinner === 'user' ? 'border-green-500' : (roundWinner === 'leader' ? 'border-red-500' : 'border-slate-500')} shadow-2xl animate-bounce-in z-50 transform skew-x-[-10deg]`}>
                        <span className="skew-x-[10deg] inline-block">
                            {roundWinner === 'tie' ? 'EMPATE TÉCNICO' : (roundWinner === 'user' ? '¡TÚ GANAS!' : '¡RIVAL GANA!')}
                        </span>
                    </div>
                )}
            </div>

            {/* LADO RIVAL */}
            <div className="w-1/3 max-w-[200px] animate-slide-in-right">
                <BattleCard 
                    pokemon={activeLeaderPoke} 
                    isPlayer={false} 
                    winner={roundWinner}
                    statValue={activeLeaderPoke.stats[currentStat]}
                    statInfo={statInfo}
                    isSpinning={isSpinning}
                />
            </div>

        </div>
    </div>
  );
};

export default GymStadiumPhase;