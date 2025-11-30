import React, { useState, useEffect } from 'react';
import { availableSkins } from './skins';
import { POKEMON_DATA } from '../pokemonData'; 
import { Clock, Map, Wallet, BookOpen, RefreshCw, X, ArrowLeft, Star } from 'lucide-react';

const GYM_LEADERS = [
  { id: 'brock', name: 'Brock', badge: 'Roca', img: '/assets/badges/roca.png', order: 2 },
  { id: 'misty', name: 'Misty', badge: 'Cascada', img: '/assets/badges/cascada.png', order: 3 },
  { id: 'surge', name: 'Lt. Surge', badge: 'Trueno', img: '/assets/badges/trueno.png', order: 4 },
  { id: 'erika', name: 'Erika', badgeName: 'Arcoíris', img: '/assets/badges/arcoiris.png', order: 5 },
  { id: 'koga', name: 'Koga', badge: 'Alma', img: '/assets/badges/alma.png', order: 6 },
  { id: 'sabrina', name: 'Sabrina', badge: 'Pantano', img: '/assets/badges/pantano.png', order: 7 },
  { id: 'blaine', name: 'Blaine', badge: 'Volcán', img: '/assets/badges/volcan.png', order: 8 },
  { id: 'giovanni', name: 'Giovanni', badge: 'Tierra', img: '/assets/badges/tierra.png', order: 9 },
];

// 1. Recibimos 'onAlert' en las props
const TrainerCard = ({ profile, capturedData, onGoBack, onProfileUpdate, onAlert }) => {
  const [currentTeam, setCurrentTeam] = useState(Array.isArray(profile.team) ? profile.team : []);
  const [activeView, setActiveView] = useState('info'); 
  const [showSelector, setShowSelector] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const trainerSkin = availableSkins.find(s => s.id === profile.skin) || availableSkins[0];
  
  const safeCapturedData = capturedData || {};
  const capturedCount = Object.values(safeCapturedData).filter(status => status === true).length;
  
  const gymProgress = profile.gymProgress || 0;

  const money = 0; 
  const startDate = new Date(profile.startDate || Date.now()).toLocaleDateString();

  const myPokemonList = POKEMON_DATA.filter(p => safeCapturedData[p.id] === true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleTeamMember = (pokeId) => {
    let newTeam = [...currentTeam];

    if (newTeam.includes(pokeId)) {
      newTeam = newTeam.filter(id => id !== pokeId);
    } else {
      if (newTeam.length >= 6) {
        // 2. REEMPLAZO: Usamos onAlert en lugar de alert()
        if (onAlert) {
            onAlert(
                "CAPACIDAD MÁXIMA", 
                "Tu equipo ya tiene 6 Pokémon.\n\nHaz clic en uno de los miembros actuales para quitarlo antes de añadir uno nuevo.", 
                "warning"
            );
        } else {
            // Fallback por si la prop no llega (seguridad)
            alert("Tu equipo está lleno.");
        }
        return;
      }
      newTeam.push(pokeId);
    }

    setCurrentTeam(newTeam);
    if (onProfileUpdate) {
        onProfileUpdate({ ...profile, team: newTeam });
    }
  };

  const getPlayTime = () => {
    const totalMilliseconds = profile.playTime || 0;
    const totalMinutes = Math.floor(totalMilliseconds / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const StatChip = ({ icon, label, value }) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-2 flex flex-col justify-center items-start relative overflow-hidden group hover:border-slate-500 transition-colors">
        <div className="absolute top-1 right-1 opacity-20 text-cyan-400">{icon}</div>
        <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">{label}</span>
        <span className="text-lg font-mono font-bold text-white truncate w-full">{value}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0f172a] text-white z-50 font-sans">
      
      {/* FONDOS FIJOS */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-[#0f172a] to-slate-900 z-0 pointer-events-none"></div>

      {/* --- CONTENEDOR TARJETA --- */}
      <div className="relative z-10 w-full max-w-6xl h-[85vh] flex rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-slate-700 bg-slate-900/90 backdrop-blur-md">
        
        {/* --- LADO IZQUIERDO: ENTRENADOR --- */}
        <div className="w-5/12 h-full relative flex items-end justify-center overflow-hidden border-r border-slate-700">
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/30 to-transparent"></div>
            <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(6,182,212,0.05)_25%,rgba(6,182,212,0.05)_26%,transparent_27%,transparent_74%,rgba(6,182,212,0.05)_75%,rgba(6,182,212,0.05)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(6,182,212,0.05)_25%,rgba(6,182,212,0.05)_26%,transparent_27%,transparent_74%,rgba(6,182,212,0.05)_75%,rgba(6,182,212,0.05)_76%,transparent_77%,transparent)] bg-[size:50px_50px]"></div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent z-10"></div>
            
            <img 
                src={trainerSkin.imageUrl} 
                alt={trainerSkin.name} 
                className="h-[95%] w-auto object-contain object-bottom relative z-0 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            />

            <div className="absolute bottom-10 left-8 z-20 flex flex-col items-start gap-1">
                <h2 className="text-5xl font-black italic uppercase text-white drop-shadow-xl tracking-tighter leading-none">
                    {profile.name}
                </h2>
                
                <div className="flex items-center gap-3 mt-2 pl-1">
                    <div className="h-0.5 w-8 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                    <p className="text-cyan-400 font-mono text-sm tracking-[0.2em] font-bold bg-slate-950/90 px-3 py-1 rounded border border-slate-700 shadow-lg">
                        ID {String(profile.id).slice(-5)}
                    </p>
                </div>
            </div>
        </div>

        {/* --- LADO DERECHO: INTERFAZ --- */}
        <div className="w-7/12 h-full p-8 flex flex-col bg-slate-900/50">
            
            <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                <div>
                    <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-[0.2em] mb-1">
                        FICHA DE ENTRENADOR
                    </h3>
                    <h1 className="text-3xl font-black italic tracking-tight text-white">
                        {activeView === 'info' ? 'ESTADÍSTICAS' : 'EQUIPO ACTIVO'}
                    </h1>
                </div>
                
                <button 
                    onClick={() => setActiveView(activeView === 'info' ? 'team' : 'info')}
                    className="group flex items-center gap-3 px-6 py-2.5 bg-slate-800/50 hover:bg-cyan-900/20 border-r-4 border-cyan-500 rounded-tl-xl rounded-bl-sm transition-all duration-300 hover:skew-x-[-10deg] shadow-lg"
                >
                    <RefreshCw size={18} className={`text-cyan-400 transition-transform duration-500 ${activeView === 'team' ? 'rotate-180' : ''}`} />
                    <span className="text-xs font-black italic uppercase tracking-widest text-slate-200 group-hover:text-white">
                        {activeView === 'info' ? 'Ver Equipo' : 'Ver Datos'}
                    </span>
                </button>
            </div>

            {/* --- VISTA 1: DATOS Y MEDALLAS --- */}
            {activeView === 'info' && (
                <div className="flex-1 flex flex-col min-h-0 animate-fade-in gap-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <StatChip icon={<BookOpen size={24} />} label="Pokédex" value={`${capturedCount} / 150`} />
                        <StatChip icon={<Wallet size={24} />} label="Dinero" value={`₽ ${money}`} />
                        <StatChip icon={<Clock size={24} />} label="Tiempo" value={getPlayTime()} />
                        <StatChip icon={<Map size={24} />} label="Inicio" value={startDate} />
                    </div>

                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1 h-4 bg-cyan-500 rounded-full"></div>
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Medallas de Kanto</h3>
                        </div>
                        
                        <div className="flex-1 bg-black/20 rounded-xl p-4 border border-slate-700/50 overflow-hidden relative">
                            <div className="grid grid-cols-4 grid-rows-2 gap-3 h-full w-full">
                                {GYM_LEADERS.map((leader) => {
                                    const isUnlocked = gymProgress >= leader.order;
                                    return (
                                        <div key={leader.id} className="relative w-full h-full bg-slate-800/80 rounded-lg overflow-hidden border border-slate-700 group">
                                            <img 
                                                src={`/assets/gym_leaders/${leader.id}.png`} 
                                                alt={leader.name} 
                                                className={`w-full h-full object-cover transition-all duration-500 ${isUnlocked ? 'grayscale-0 opacity-100' : 'grayscale opacity-10'}`} 
                                            />
                                            
                                            <div className="absolute bottom-0 right-0 w-9 h-9 bg-[#0f172a] rounded-tl-lg border-t border-l border-slate-600 flex items-center justify-center">
                                                 {isUnlocked ? (
                                                     <img src={leader.img} alt={leader.badge} className="w-6 h-6 object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] animate-pulse-slow" />
                                                 ) : (
                                                     <div className="w-5 h-5 rounded-full border-2 border-dashed border-slate-700 opacity-30"></div>
                                                 )}
                                            </div>

                                            <div className="absolute top-1 left-2 text-[10px] font-bold text-slate-500 group-hover:text-slate-300 uppercase tracking-wider transition-colors">
                                                {leader.name}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- VISTA 2: EQUIPO POKÉMON --- */}
            {activeView === 'team' && (
                <div className="flex-1 flex flex-col min-h-0 animate-fade-in">
                    <div className="flex-1 grid grid-cols-2 grid-rows-3 gap-4">
                        {Array.from({ length: 6 }).map((_, index) => {
                            const pokeId = currentTeam[index];
                            const pokemon = pokeId ? POKEMON_DATA.find(p => p.id == pokeId) : null;
                            const isValid = pokemon && pokemon.name;

                            return (
                                <div 
                                    key={index} 
                                    onClick={() => setShowSelector(true)}
                                    className={`
                                        relative rounded-xl border p-2 flex items-center overflow-hidden cursor-pointer transition-all duration-200
                                        ${isValid 
                                            ? 'bg-slate-800/60 border-cyan-500/30 hover:bg-slate-800 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                                            : 'bg-black/20 border-slate-800 hover:border-slate-600 border-dashed'}
                                    `}
                                >
                                    {isValid ? (
                                        <>
                                            <div className="w-20 h-20 flex-shrink-0 relative z-10 bg-black/20 rounded-full flex items-center justify-center mr-3 border border-slate-700/50">
                                                <img 
                                                    src={`/assets/pokemon/normal/${pokemon.id}.png`} 
                                                    alt={pokemon.name}
                                                    className="w-full h-full object-contain drop-shadow-md"
                                                    onError={(e) => {e.target.style.display = 'none'}}
                                                />
                                            </div>
                                            <div className="flex-1 z-10 min-w-0">
                                                <div className="flex items-baseline justify-between">
                                                    <h3 className="text-sm font-black italic text-white uppercase truncate">{pokemon.name}</h3>
                                                    <span className="text-[10px] font-mono text-cyan-400">Lv.50</span>
                                                </div>
                                                <div className="flex gap-1 mt-1">
                                                    {Array.isArray(pokemon.type) ? pokemon.type.map(t => (
                                                        <span key={t} className="text-[9px] px-1.5 py-0.5 bg-slate-700 text-slate-300 rounded uppercase font-bold tracking-wide border border-slate-600">{t}</span>
                                                    )) : <span className="text-[9px] text-slate-500">Normal</span>}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 group-hover:text-slate-400">
                                            <span className="text-3xl font-light mb-1 opacity-50">+</span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Vacío</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* --- FOOTER --- */}
            <div className="h-16 mt-auto pt-6 flex-shrink-0 border-t border-slate-700/50">
                <button 
                    onClick={onGoBack} 
                    className="w-full group flex items-center justify-center gap-3 px-6 py-3 bg-slate-800/80 hover:bg-red-900/20 border-l-4 border-red-500 rounded-tr-xl rounded-bl-xl transition-all duration-300 hover:skew-x-[5deg] shadow-lg"
                >
                    <ArrowLeft size={18} className="text-red-400 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-black italic uppercase tracking-[0.2em] text-slate-300 group-hover:text-red-300">
                        Cerrar Sistema
                    </span>
                </button>
            </div>
        </div>
      </div>

      {/* MODAL SELECTOR */}
      {showSelector && (
        <div className="absolute inset-0 bg-black/80 z-[60] flex items-center justify-center p-6 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#0f172a] rounded-2xl w-full max-w-5xl h-[85%] border border-slate-600 flex flex-col overflow-hidden shadow-2xl relative">
                <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900">
                    <div>
                        <h3 className="text-2xl font-black italic text-white tracking-tight">GESTIONAR EQUIPO</h3>
                        <p className="text-sm text-slate-400">Selecciona tus 6 unidades de combate.</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="px-4 py-1.5 rounded-full bg-slate-800 border border-slate-600 flex items-center gap-2">
                            <span className="text-xs text-slate-400 uppercase">Capacidad</span>
                            <span className={`text-lg font-mono font-bold ${currentTeam.length === 6 ? 'text-red-400' : 'text-cyan-400'}`}>
                                {currentTeam.length} / 6
                            </span>
                        </div>
                        <button onClick={() => setShowSelector(false)} className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded-lg transition-colors shadow-lg">
                            <X size={24} />
                        </button>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-900/50">
                    {myPokemonList.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                            {myPokemonList.map(poke => {
                                const isSelected = currentTeam.includes(poke.id);
                                return (
                                    <div 
                                        key={poke.id} 
                                        onClick={() => handleToggleTeamMember(poke.id)} 
                                        className={`
                                            group relative aspect-square rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center p-2
                                            ${isSelected 
                                                ? 'bg-cyan-900/20 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                                                : 'bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800'}
                                        `}
                                    >
                                        <div className="w-full h-3/4 flex items-center justify-center relative">
                                            <img 
                                                src={`/assets/pokemon/normal/${poke.id}.png`} 
                                                alt={poke.name}
                                                className={`w-full h-full object-contain drop-shadow-md transition-transform ${isSelected ? 'scale-110' : 'group-hover:scale-110 grayscale group-hover:grayscale-0'}`}
                                                onError={(e) => {e.target.style.display = 'none'}}
                                            />
                                        </div>
                                        <div className="w-full h-1/4 flex items-center justify-center">
                                            <span className={`text-[10px] font-bold uppercase tracking-wide truncate w-full text-center ${isSelected ? 'text-cyan-300' : 'text-slate-500 group-hover:text-white'}`}>
                                                {poke.name}
                                            </span>
                                        </div>
                                        <div className="absolute top-2 right-2 z-20">
                                            {isSelected ? (
                                                <div className="bg-cyan-500 text-white p-1 rounded-full shadow-lg animate-bounce-small">
                                                    <Star fill="currentColor" size={12} />
                                                </div>
                                            ) : (
                                                <div className="text-slate-700 group-hover:text-slate-500 transition-colors">
                                                    <Star size={14} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                            <BookOpen size={48} className="mb-4" />
                            <p className="text-xl font-light">Base de datos vacía.</p>
                            <p className="text-sm">Captura Pokémon para asignarlos.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default TrainerCard;