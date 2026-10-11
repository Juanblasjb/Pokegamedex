import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'motion/react';
import { ArrowLeft, CirclePlus, Swords, TimerReset, Users, X } from 'lucide-react';
import { POKEMON_DATA } from '../pokemonData';
import { getCaptureRecord } from '../utils/captureSystem';
import { applyRocketDefeat, resolveRocketBattle } from '../utils/rocketBattle';
import CurrencyAmount from './CurrencyAmount';
import './RocketBattle.css';
import './RocketBattleOverrides.css';

const STAT_LABELS = [
  ['hp', 'PS'],
  ['atk', 'ATQ'],
  ['def', 'DEF'],
  ['spAtk', 'ATQ. ESP.'],
  ['spDef', 'DEF. ESP.'],
  ['spd', 'VEL'],
];

const getPokemon = (id, data) => {
  const base = POKEMON_DATA.find(pokemon => pokemon.id === id);
  if (!base) return null;
  const specimenStats = getCaptureRecord(data, id).specimen?.stats;
  return { ...base, battleStats: specimenStats || base.stats, hasCustomStats: Boolean(specimenStats) };
};

const getOpponentPresentation = opponent => ({
  image: opponent.image || (opponent.name.includes('Giovanni')
    ? '/assets/gym_leaders/giovanni_full_art.png'
    : '/assets/Skins/Team_Rocket_Skin.png'),
  quote: opponent.introQuote || (opponent.boss
    ? 'Has llegado demasiado lejos. Esta operación termina aquí.'
    : 'No darás un paso más. El Team Rocket controla esta zona.'),
  role: opponent.role || (opponent.boss ? 'Mando de operación' : 'Unidad de infiltración'),
  threat: opponent.threatLevel || (opponent.boss ? 5 : 2),
});

function PokemonCard({ pokemon, selected = false, selectedIndex = -1, enemy = false, compact = false, onClick }) {
  if (!pokemon) return null;
  const content = <>
    <div className="rocket-pokemon-image"><img src={`/assets/pokemon/normal/${pokemon.id}.png`} alt={pokemon.name} /></div>
    <div className="rocket-pokemon-copy">
      <small>#{String(pokemon.id).padStart(3, '0')}</small>
      <strong>{pokemon.name}</strong>
      <em>{pokemon.type.join(' · ')}</em>
      {!compact && <div className="rocket-stat-row">
        {STAT_LABELS.map(([key, label]) => <span key={key}><b>{label}</b>{pokemon.battleStats?.[key] ?? 0}</span>)}
      </div>}
    </div>
    {pokemon.hasCustomStats && !enemy && <span className="rocket-custom-stat">Ejemplar</span>}
    {selected && <span className="rocket-selected-index">{selectedIndex + 1}</span>}
    {selected && !enemy && !compact && <span className="rocket-remove-pokemon" aria-hidden="true"><X /></span>}
  </>;

  if (enemy) return <article className={`rocket-pokemon-card is-enemy ${compact ? 'is-compact' : ''}`}>{content}</article>;
  return <button type="button" className={`rocket-pokemon-card ${selected ? 'is-selected' : ''} ${compact ? 'is-compact' : ''}`} onClick={onClick}>{content}</button>;
}

function ChallengeBriefing({ opponent, onStart }) {
  const presentation = getOpponentPresentation(opponent);
  const [firstName, ...restOfName] = opponent.name.split(' ');
  return <Motion.div
    className="w-full h-full flex items-center justify-center relative z-10 p-4"
    initial={{ opacity: 0, x: 80, scale: 0.98 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    exit={{ opacity: 0, x: -80, scale: 0.98 }}
    transition={{ type: 'spring', stiffness: 170, damping: 22 }}
  >
    <div className="relative w-full max-w-5xl h-[600px]">
      <div className="rocket-briefing-surface absolute inset-0 bg-[#080a0f]/95 backdrop-blur-xl border border-red-900/70 rounded-[2rem] transform -skew-x-3 shadow-[0_0_55px_rgba(127,29,29,0.28)] overflow-hidden">
        <div className="rocket-briefing-blueprint absolute inset-0"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-red-700/10 to-transparent animate-scan-vertical pointer-events-none"></div>
      </div>
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 items-center">
        <div className="flex flex-col justify-center space-y-6 pl-12 md:pl-16 pr-4 z-20 animate-slide-in-left">
          <div className="flex items-center gap-3">
            <div className="flex space-x-1"><div className="w-1 h-4 bg-red-600 animate-pulse"></div><div className="w-1 h-4 bg-slate-500"></div></div>
            <span className="text-[10px] font-mono text-red-400 uppercase tracking-[0.25em] font-bold">Amenaza Detectada</span>
          </div>
          <div className="relative">
            <h2 className="text-5xl md:text-6xl font-black italic uppercase text-white tracking-tighter drop-shadow-2xl leading-[0.9]">
              <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">{firstName}</span>
              <span className="block text-red-500">{restOfName.join(' ')}</span>
            </h2>
          </div>
          <div className="bg-black/60 border-l-4 border-red-600 p-5 rounded-r-xl backdrop-blur-sm max-w-md shadow-lg transform skew-x-[-3deg]">
            <p className="text-sm text-slate-300 font-medium italic skew-x-[3deg]">“{presentation.quote}”</p>
            <div className="w-full h-px bg-slate-700 my-3 skew-x-[3deg]"></div>
            <div className="flex gap-6 text-[9px] font-mono text-red-300 uppercase tracking-widest skew-x-[3deg]"><span>Clase: {presentation.role}</span><span>Tier: {opponent.boss ? 'S' : 'D'}</span></div>
          </div>
          <div className="pt-4">
            <button type="button" onClick={onStart} className="rocket-start-button group relative px-8 py-4 text-white font-black uppercase tracking-widest text-sm rounded-lg transition-all hover:scale-[1.02] overflow-hidden border-0">
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              <span className="relative z-10 flex items-center gap-3">Iniciar combate <Swords size={18} /></span>
            </button>
          </div>
        </div>
        <div className="relative h-full flex items-end justify-center z-20 animate-slide-in-right pb-0 md:pr-10">
          <div className="absolute bottom-20 w-[300px] h-[300px] border-2 border-red-700/25 rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-20 w-[250px] h-[250px] border border-dashed border-slate-500/30 rounded-full animate-reverse-spin"></div>
          <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-red-950/35 to-transparent blur-2xl"></div>
          <img src={presentation.image} alt={opponent.name} className="relative z-20 h-[90%] w-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] filter brightness-110 hover:scale-105 transition-transform duration-700 origin-bottom" />
          <div className="absolute top-10 right-10 bg-black/70 border border-slate-600 px-3 py-2 rounded backdrop-blur-md flex flex-col items-end shadow-xl">
            <span className="text-[8px] text-slate-400 uppercase font-bold tracking-widest mb-1">Amenaza</span>
            <div className="flex gap-1">{Array.from({ length: 5 }, (_, index) => <div key={index} className={`w-1 h-3 rounded-full ${index < presentation.threat ? 'bg-red-600 animate-pulse' : 'bg-slate-800'}`}></div>)}</div>
          </div>
        </div>
      </div>
    </div>
  </Motion.div>;
}

function DoubleBattleArena({ availableTeam, selectedIds, enemyTeam, opponent, selectionHint, isResolving, onTogglePokemon, onFight }) {
  const selectedTeam = selectedIds.map(id => availableTeam.find(pokemon => pokemon.id === id)).filter(Boolean);
  return <Motion.section
    className="rocket-double-arena"
    initial={{ opacity: 0, y: 45 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -35 }}
    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
  >
    <div className="rocket-arena-heading">
      <span>Protocolo de enfrentamiento</span>
      <h1><Users /> Combate doble <b>2 vs 2</b></h1>
      <small>Las seis estadísticas, tipos, debilidades y resistencias deciden el resultado</small>
    </div>

    <div className="rocket-arena-field">
      <div className="rocket-active-team is-player">
        <header><span>Tu pareja activa</span><small>{selectedTeam.length}/2 seleccionados</small></header>
        <div>
          {selectedTeam.map((pokemon, index) => <PokemonCard key={pokemon.id} pokemon={pokemon} selected selectedIndex={index} onClick={() => onTogglePokemon(pokemon.id)} />)}
          {Array.from({ length: Math.max(0, 2 - selectedTeam.length) }, (_, index) => <article className="rocket-pokemon-slot-empty" key={`empty-${index}`}><CirclePlus /><span>Selecciona un Pokémon</span></article>)}
        </div>
      </div>

      <div className={`rocket-clash-core ${isResolving ? 'is-resolving' : ''}`}>
        <div className="rocket-core-rings"><span /><span /><span /></div>
        <b>{isResolving ? 'ANALIZANDO' : 'VS'}</b>
        <small>{isResolving ? 'Stats · tipos · sinergia' : opponent.name}</small>
      </div>

      <div className="rocket-active-team is-enemy">
        <header><span>Unidad Rocket</span><small>Formación detectada</small></header>
        <div>{enemyTeam.map((pokemon, index) => <PokemonCard key={pokemon.id} pokemon={pokemon} enemy selectedIndex={index} />)}</div>
      </div>
    </div>

    <div className="rocket-bench">
      <span><b>Tu equipo</b><small>Elige exactamente dos Pokémon</small></span>
      <div>{availableTeam.map(pokemon => { const selectedIndex = selectedIds.indexOf(pokemon.id); return <PokemonCard key={pokemon.id} pokemon={pokemon} selected={selectedIndex >= 0} selectedIndex={selectedIndex} compact onClick={() => onTogglePokemon(pokemon.id)} />; })}</div>
    </div>

    <div className="rocket-command-deck">
      <div className={`rocket-selection-status ${selectedTeam.length === 2 ? 'is-ready' : ''}`}>
        <span>{selectedTeam.length === 2 ? 'Pareja preparada' : `${selectedTeam.length} de 2 seleccionados`}</span>
        <small>{selectionHint || 'Haz clic en una tarjeta activa para retirarla.'}</small>
      </div>
      <button type="button" className="rocket-fight" onClick={onFight} disabled={selectedTeam.length !== 2 || isResolving}><Swords />{isResolving ? 'Calculando combate' : 'Iniciar combate doble'}</button>
    </div>
  </Motion.section>;
}

export default function RocketBattle({ node, profile, capturedData, onProfileUpdate, onNodeComplete, onExit }) {
  const availableTeam = useMemo(() => (profile.team || []).map(id => getPokemon(id, capturedData)).filter(Boolean), [capturedData, profile.team]);
  const [selectedIds, setSelectedIds] = useState(() => availableTeam.slice(0, 2).map(pokemon => pokemon.id));
  const [opponentIndex, setOpponentIndex] = useState(0);
  const [stage, setStage] = useState('briefing');
  const [selectionHint, setSelectionHint] = useState('El orden elegido se conservará durante el combate.');
  const [result, setResult] = useState(null);
  const [isResolving, setIsResolving] = useState(false);
  const [choosingFossil, setChoosingFossil] = useState(false);
  const resolutionTimer = useRef(null);
  const opponent = node.opponents[opponentIndex];
  const enemyTeam = opponent.team.map(id => getPokemon(id, capturedData)).filter(Boolean);
  const selectedTeam = selectedIds.map(id => availableTeam.find(pokemon => pokemon.id === id)).filter(Boolean);

  useEffect(() => () => window.clearTimeout(resolutionTimer.current), []);

  const togglePokemon = id => {
    if (isResolving) return;
    setSelectedIds(current => {
      if (current.includes(id)) {
        setSelectionHint('Espacio liberado. Selecciona otro Pokémon de tu equipo.');
        return current.filter(item => item !== id);
      }
      if (current.length < 2) {
        setSelectionHint('Selección añadida sin alterar el orden del equipo.');
        return [...current, id];
      }
      setSelectionHint('Retira primero uno de los dos Pokémon activos.');
      return current;
    });
  };

  const fight = () => {
    if (selectedTeam.length !== 2 || isResolving) return;
    setIsResolving(true);
    resolutionTimer.current = window.setTimeout(() => {
      const resolution = resolveRocketBattle(selectedTeam, enemyTeam, 'balanced');
      if (resolution.won) {
        const nextProfile = { ...profile, money: (profile.money || 0) + opponent.reward };
        onProfileUpdate(nextProfile);
        setResult({ ...resolution, money: opponent.reward, won: true });
      } else {
        const penalty = applyRocketDefeat(profile, opponent);
        onProfileUpdate(penalty.profile);
        setOpponentIndex(0);
        setResult({ ...resolution, ...penalty, won: false, boss: opponent.boss });
      }
      setIsResolving(false);
    }, 1150);
  };

  const continueBattle = () => {
    if (!result?.won) { setResult(null); setStage('briefing'); return; }
    if (opponentIndex < node.opponents.length - 1) {
      setOpponentIndex(index => index + 1);
      setResult(null);
      setStage('briefing');
      return;
    }
    if (node.id === 'rocket-moon' && !profile.fossilQuizUnlocked) { setResult(null); setChoosingFossil(true); }
    else onNodeComplete({ node });
  };

  return <main className={`rocket-battle ${stage === 'briefing' ? 'is-briefing' : ''}`} style={{ '--rocket-background': `url(${node.background})` }}>
    <div className="rocket-battle-backdrop" aria-hidden="true" />
    <div className="rocket-battle-tint" aria-hidden="true" />
    {stage === 'briefing' ? <div className="rocket-retreat-wrap absolute top-6 left-8 z-50 animate-fade-in-down">
      <button type="button" onClick={onExit} className="rocket-retreat-button group flex items-center gap-3 px-5 py-2.5 bg-slate-900 hover:bg-red-950 text-slate-200 hover:text-white rounded-tl-xl rounded-br-xl border-l-4 border-slate-500 hover:border-red-600 shadow-lg transition-all duration-300 hover:pl-4 hover:pr-6">
        <ArrowLeft size={16} className="text-slate-400 group-hover:text-white group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-black tracking-[0.2em] uppercase">Retirada</span>
      </button>
    </div> : <header className="rocket-battle-header">
        <button type="button" onClick={onExit}><ArrowLeft /> Volver</button>
        <div><small>Operación {opponentIndex + 1} de {node.opponents.length}</small><h2>{node.name}</h2><p>Arena táctica Rocket</p></div>
        <CurrencyAmount amount={profile.money} />
      </header>}

    <div className={`rocket-stage-shell ${stage === 'briefing' ? 'is-briefing' : ''}`}>
      <AnimatePresence mode="wait">
        {stage === 'briefing'
          ? <ChallengeBriefing key={`briefing-${opponentIndex}`} opponent={opponent} onStart={() => setStage('battle')} />
          : <DoubleBattleArena key={`battle-${opponentIndex}`} availableTeam={availableTeam} selectedIds={selectedIds} enemyTeam={enemyTeam} opponent={opponent} selectionHint={selectionHint} isResolving={isResolving} onTogglePokemon={togglePokemon} onFight={fight} />}
      </AnimatePresence>
    </div>

    <AnimatePresence>
      {result && <Motion.div className="rocket-result" role="dialog" aria-modal="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <Motion.div className={result.won ? 'is-win' : 'is-loss'} initial={{ y: 50, scale: 0.92 }} animate={{ y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 210, damping: 20 }}>
          {result.won ? <Swords /> : <TimerReset />}
          <small>{result.won ? 'OPERACIÓN SUPERADA' : 'DERROTA · REINICIO LOCAL'}</small>
          <h2>{result.won ? `Has vencido a ${opponent.name}` : 'El Team Rocket se queda con el botín'}</h2>
          <p>{result.won
            ? <>Recibiste <CurrencyAmount amount={result.money} />. Potencia táctica: {result.userScore} contra {result.enemyScore}.</>
            : <>Perdiste <CurrencyAmount amount={result.moneyLost} />{result.stolenItemId ? ` y una unidad de ${result.stolenItemId}` : ''}. Volverás al primer rival de {node.name}.</>}</p>
          <button type="button" onClick={continueBattle}>{result.won && opponentIndex === node.opponents.length - 1 ? 'Completar nodo' : 'Continuar'}</button>
        </Motion.div>
      </Motion.div>}
    </AnimatePresence>

    {choosingFossil && <div className="rocket-result" role="dialog" aria-modal="true">
      <div className="rocket-fossil-choice">
        <small>RECOMPENSA DEL MONTE LUNA</small><h2>Elige un fósil</h2><p>La elección irá a tu Mochila. Al canjearla, el Pokémon se capturará automáticamente.</p>
        <div><button type="button" onClick={() => onNodeComplete({ node, fossil: 'fossil-helix' })}><img src="/assets/pokemon/normal/138.png" alt="Omanyte" /><strong>Fósil Helix</strong><span>Omanyte</span></button><button type="button" onClick={() => onNodeComplete({ node, fossil: 'fossil-dome' })}><img src="/assets/pokemon/normal/140.png" alt="Kabuto" /><strong>Fósil Domo</strong><span>Kabuto</span></button></div>
      </div>
    </div>}
  </main>;
}
