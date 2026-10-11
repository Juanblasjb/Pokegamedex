import { useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, Clock, Crown, Map, RefreshCw } from 'lucide-react';
import { availableSkins } from './skins';
import CurrencyAmount from './CurrencyAmount';
import { getTitles } from '../utils/trainerProgress';
import { countOwnedPokemon, countRegisteredSpecies, normalizeSaveData } from '../utils/captureSystem';
import './TrainerCard.css';

const GYM_LEADERS = [
  { id: 'brock', name: 'Brock', img: '/assets/badges/roca.png', order: 2 },
  { id: 'misty', name: 'Misty', img: '/assets/badges/cascada.png', order: 3 },
  { id: 'surge', name: 'Lt. Surge', img: '/assets/badges/trueno.png', order: 4 },
  { id: 'erika', name: 'Erika', img: '/assets/badges/arcoiris.png', order: 5 },
  { id: 'koga', name: 'Koga', img: '/assets/badges/alma.png', order: 6 },
  { id: 'sabrina', name: 'Sabrina', img: '/assets/badges/pantano.png', order: 7 },
  { id: 'blaine', name: 'Blaine', img: '/assets/badges/volcan.png', order: 8 },
  { id: 'giovanni', name: 'Giovanni', img: '/assets/badges/tierra.png', order: 9 },
];

export default function TrainerCard({ profile, capturedData, onGoBack }) {
  const [activeView, setActiveView] = useState('info');
  const trainerSkin = availableSkins.find(skin => skin.id === profile.skin) || availableSkins[0];
  const safeCapturedData = useMemo(() => normalizeSaveData(capturedData || {}), [capturedData]);
  const registeredCount = countRegisteredSpecies(safeCapturedData);
  const ownedCount = countOwnedPokemon(safeCapturedData);
  const gymProgress = profile.gymProgress || 0;
  const equippedTitle = getTitles(profile, safeCapturedData).find(title => title.id === profile.titleId && title.unlocked);
  const hallEntries = Array.isArray(profile.hallOfFame) ? profile.hallOfFame : [];
  const hallEntry = hallEntries[0];
  const totalMinutes = Math.floor((profile.playTime || 0) / 60000);
  const playTime = `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;

  const StatChip = ({ icon, label, value }) => <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-2 flex flex-col justify-center items-start relative overflow-hidden group hover:border-slate-500 transition-colors"><div className="absolute top-1 right-1 opacity-20 text-cyan-400">{icon}</div><span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">{label}</span><span className="text-lg leading-none min-h-7 flex items-center font-mono font-bold text-white truncate w-full">{value}</span></div>;

  return <div className="aaa-trainer-card fixed inset-0 flex items-center justify-center bg-[#0f172a] text-white z-50 font-sans">
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0" />
    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-[#0f172a] to-slate-900 z-0 pointer-events-none" />

    <div className="relative z-10 w-full max-w-6xl h-[85vh] flex rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-slate-700 bg-slate-900/90 backdrop-blur-md">
      <div className="w-5/12 h-full relative flex items-end justify-center overflow-hidden border-r border-slate-700">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/30 to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(6,182,212,0.05)_25%,rgba(6,182,212,0.05)_26%,transparent_27%,transparent_74%,rgba(6,182,212,0.05)_75%,rgba(6,182,212,0.05)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(6,182,212,0.05)_25%,rgba(6,182,212,0.05)_26%,transparent_27%,transparent_74%,rgba(6,182,212,0.05)_75%,rgba(6,182,212,0.05)_76%,transparent_77%,transparent)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/20 to-transparent z-10 pointer-events-none" />
        <img src={trainerSkin.imageUrl} alt={trainerSkin.name} className="trainer-card-skin relative z-[5] drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]" />
        <div className="absolute bottom-10 left-8 z-20 flex flex-col items-start gap-1">
          {equippedTitle && <p className="text-xs text-yellow-400">{equippedTitle.name}</p>}
          <h2 className="text-5xl font-black italic uppercase text-white drop-shadow-xl tracking-tighter leading-none">{profile.name}</h2>
          <div className="flex items-center gap-3 mt-2 pl-1"><div className="h-0.5 w-8 bg-cyan-500" /><p className="text-cyan-400 font-mono text-sm tracking-[0.2em] font-bold bg-slate-950/90 px-3 py-1 rounded border border-slate-700">ID {String(profile.id).slice(-5)}</p></div>
        </div>
      </div>

      <div className="w-7/12 h-full p-8 flex flex-col bg-slate-900/50">
        <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
          <div><h3 className="text-xs font-bold text-cyan-500 uppercase tracking-[0.2em] mb-1">Ficha de entrenador</h3><h1 className="text-3xl font-black italic tracking-tight text-white">{activeView === 'info' ? 'ESTADÍSTICAS' : 'SALÓN DE LA FAMA'}</h1></div>
          <button type="button" onClick={() => setActiveView(activeView === 'info' ? 'hall' : 'info')} className="group flex items-center gap-3 px-6 py-2.5 bg-slate-800/50 hover:bg-cyan-900/20 border-r-4 border-cyan-500 rounded-tl-xl rounded-bl-sm transition-all duration-300 shadow-lg"><RefreshCw size={18} className={`text-cyan-400 transition-transform duration-500 ${activeView === 'hall' ? 'rotate-180' : ''}`} /><span className="text-xs font-black italic uppercase tracking-widest text-slate-200">{activeView === 'info' ? 'Hall of Fame' : 'Ver Datos'}</span></button>
        </div>

        {activeView === 'info' && <div className="flex-1 flex flex-col min-h-0 animate-fade-in gap-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3"><StatChip icon={<BookOpen size={24} />} label="Pokédex" value={`${registeredCount} / 151`} /><StatChip label="Dinero" value={<CurrencyAmount amount={profile.money} />} /><StatChip icon={<Clock size={24} />} label="Tiempo" value={playTime} /><StatChip icon={<Map size={24} />} label="En posesión" value={`${ownedCount}`} /></div>
          <div className="flex-1 flex flex-col min-h-0"><div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 bg-cyan-500" /><h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Medallas de Kanto</h3></div><div className="flex-1 bg-black/20 rounded-xl p-4 border border-slate-700/50 overflow-hidden"><div className="grid grid-cols-4 grid-rows-2 gap-3 h-full w-full">{GYM_LEADERS.map(leader => { const unlocked = gymProgress >= leader.order; return <div key={leader.id} className="relative w-full h-full bg-slate-800/80 rounded-lg overflow-hidden border border-slate-700"><img src={`/assets/gym_leaders/${leader.id}.png`} alt={leader.name} className={`w-full h-full object-cover transition-all duration-500 ${unlocked ? 'opacity-100' : 'grayscale opacity-10'}`} /><div className="absolute bottom-0 right-0 w-9 h-9 bg-[#0f172a] rounded-tl-lg border-t border-l border-slate-600 flex items-center justify-center">{unlocked ? <img src={leader.img} alt="" className="w-6 h-6 object-contain" /> : <div className="w-5 h-5 rounded-full border-2 border-dashed border-slate-700 opacity-30" />}</div><span className="absolute top-1 left-2 text-[10px] font-bold text-slate-500 uppercase">{leader.name}</span></div>; })}</div></div></div>
        </div>}

        {activeView === 'hall' && <div className="trainer-card-hall flex-1 min-h-0 animate-fade-in">
          {hallEntry ? <><div className="trainer-card-hall-meta"><Crown /><div><strong>Equipo campeón</strong><span>{new Date(hallEntry.wonAt).toLocaleDateString('es-CL')}</span></div></div><div className="trainer-card-hall-team">{hallEntry.team.map((member,index) => <article key={`${member.speciesId}-${index}`}><span>{String(index + 1).padStart(2,'0')}</span><img src={`/assets/pokemon/${member.specimen?.isShiny ? 'shiny' : 'normal'}/${member.speciesId}.png`} alt={member.name} /><strong>{member.name}</strong><small>{member.specimen?.nature || 'Campeón de Kanto'}</small></article>)}</div></> : <div className="trainer-card-hall-empty"><Crown /><h2>Tu leyenda está por comenzar</h2><p>Gana la Liga Pokémon para registrar aquí a tus seis campeones.</p><div>{Array.from({ length:6 },(_,index) => <span key={index}>{String(index + 1).padStart(2,'0')}</span>)}</div></div>}
        </div>}

        <div className="h-16 mt-auto pt-6 flex-shrink-0 border-t border-slate-700/50"><button type="button" onClick={onGoBack} className="w-full group flex items-center justify-center gap-3 px-6 py-3 bg-slate-800/80 hover:bg-red-900/20 border-l-4 border-red-500 rounded-tr-xl rounded-bl-xl transition-all duration-300 shadow-lg"><ArrowLeft size={18} className="text-red-400" /><span className="text-xs font-black italic uppercase tracking-[0.2em] text-slate-300">Cerrar Sistema</span></button></div>
      </div>
    </div>
  </div>;
}
