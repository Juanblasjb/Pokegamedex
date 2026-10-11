import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Award, Trophy, Backpack, CircleDot, Crown, Pencil, Lock, Check, Search, Star, UsersRound, Boxes, Egg, Coins, HeartPulse, ShieldQuestion, PackageSearch, SlidersHorizontal } from 'lucide-react';
import CharacterCreation from './CharacterCreation';
import CurrencyAmount from './CurrencyAmount';
import { POKEMON_DATA } from '../pokemonData';
import { getCaptureRecord, getDisplayStats, isPokemonOwned, isSpeciesRegistered, registerCapture } from '../utils/captureSystem';
import { activateBoostItem, claimAchievement, getAchievements, getTitles, renameTrainer, RENAME_COST, SHOP_ITEMS } from '../utils/trainerProgress';
import './TrainerEditor.css';

const VIEW_TITLES = { wardrobe: 'Vestuario', titles: 'Títulos', achievements: 'Logros', bag: 'Mochila', hall: 'Salón de la Fama', team: 'Mi equipo', captures: 'Registro de capturas', rename: 'Editar nombre' };
const ITEM_IMAGES = Object.freeze({
  'poke-ball': '/assets/items/pokeball.png', 'super-ball': '/assets/items/superball.png', 'ultra-ball': '/assets/items/ultraball.png', 'master-ball': '/assets/items/masterball.png',
  revive: '/assets/items/revivir.png', 'super-revive': '/assets/items/superrevivir.png', 'mega-revive': '/assets/items/megarevivir.png', 'max-revive': '/assets/items/revivirmaximo.png',
  repel: '/assets/items/repelente.png', 'super-repel': '/assets/items/superrepelente.png', 'max-repel': '/assets/items/repelentemaximo.png',
  'lucky-egg': '/assets/items/egglucky.png', 'amulet-coin': '/assets/items/monamuleto.png',
  'album-pack': '/assets/items/Sobre-abra.png',
  'fossil-helix': '/assets/pokemon/normal/138.png', 'fossil-dome': '/assets/pokemon/normal/140.png',
});
const BAG_CATEGORIES = [
  { id: 'all', label: 'Todos', icon: Boxes },
  { id: 'capture', label: 'Captura', icon: CircleDot },
  { id: 'quiz', label: 'Quiz', icon: ShieldQuestion },
  { id: 'recovery', label: 'Recuperación', icon: HeartPulse },
  { id: 'progression', label: 'Potenciadores', icon: Star },
  { id: 'collection', label: 'Colección', icon: Award },
];
const BOOST_KEYS = Object.freeze({ 'lucky-egg': 'luckyEggCharges', 'amulet-coin': 'amuletCoinCharges' });
export const PokemonPortrait = ({ pokemon, data, ...props }) => <img {...props} src={`/assets/pokemon/${getCaptureRecord(data, pokemon.id).specimen?.isShiny ? 'shiny' : 'normal'}/${pokemon.id}.png`} alt={pokemon.name} />;

export default function TrainerEditor({ profile, data, onUpdate, onDataUpdate, onClose, initialView = 'wardrobe' }) {
  const [view] = useState(initialView);
  const [category, setCategory] = useState(0);
  const [query, setQuery] = useState('');
  const [name, setName] = useState(profile.name);
  const [notice, setNotice] = useState('');
  const [hallIndex, setHallIndex] = useState(0);
  const [confirmName, setConfirmName] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(Array.isArray(profile.team) ? profile.team : []);
  const [bagCategory, setBagCategory] = useState('all');
  const [bagQuery, setBagQuery] = useState('');
  const [bagSort, setBagSort] = useState('category');
  const [selectedBagItemId, setSelectedBagItemId] = useState(null);
  const [teamSort, setTeamSort] = useState('number');
  const rootRef = useRef(null);
  const hallEntries = profile.hallOfFame || [];
  const hallEntry = hallEntries[hallIndex];
  const species = POKEMON_DATA.filter(p => p.id <= 150 || (p.id === 151 && isSpeciesRegistered(data, 151)));
  const filteredSpecies = species.filter(p => `${p.id} ${p.name}`.toLowerCase().includes(query.toLowerCase()));
  const achievements = getAchievements(profile, data, category);
  const titles = getTitles(profile, data);
  const selectedPokemon = species.find(p => p.id === category);
  const registeredSpecies = species.filter(p => isSpeciesRegistered(data, p.id));
  const ownedSpecies = species.filter(p => isPokemonOwned(data, p.id));
  const inventoryItems = SHOP_ITEMS.filter(item => {
    const quantity = profile.inventory?.[item.id] || 0;
    const charges = BOOST_KEYS[item.id] ? profile.boosts?.[BOOST_KEYS[item.id]] || 0 : 0;
    return quantity > 0 || charges > 0;
  });
  const filteredInventoryItems = inventoryItems.filter(item => {
    const inCategory = bagCategory === 'all' || item.category === bagCategory;
    const matchesQuery = `${item.name} ${item.description}`.toLowerCase().includes(bagQuery.trim().toLowerCase());
    return inCategory && matchesQuery;
  }).sort((left, right) => {
    if (bagSort === 'name') return left.name.localeCompare(right.name, 'es');
    if (bagSort === 'quantity') return (profile.inventory?.[right.id] || 0) - (profile.inventory?.[left.id] || 0);
    return left.category.localeCompare(right.category, 'es') || left.name.localeCompare(right.name, 'es');
  });
  const selectableInventoryItems = filteredInventoryItems.filter(item => item.id !== 'album-pack');
  const selectedBagItem = selectableInventoryItems.find(item => item.id === selectedBagItemId) || selectableInventoryItems[0];
  const sortedOwnedSpecies = [...ownedSpecies].sort((left, right) => teamSort === 'name' ? left.name.localeCompare(right.name, 'es') : left.id - right.id);
  const hasPass = (profile.inventory?.['rename-pass'] || 0) > 0;
  const validName = name.trim().length > 0 && name.trim().length <= 12 && name.trim() !== profile.name;
  const canRename = validName && (hasPass || (profile.money || 0) >= RENAME_COST);

  useEffect(() => {
    const previousFocus = document.activeElement;
    rootRef.current?.focus();
    return () => previousFocus?.focus?.();
  }, []);

  const update = (next, message) => {
    if (next === profile) return;
    onUpdate(next);
    setNotice(message);
  };
  const redeemFossil = itemId => {
    const pokemonId = itemId === 'fossil-helix' ? 138 : 140;
    const pokemon = POKEMON_DATA.find(candidate => candidate.id === pokemonId);
    if (!pokemon || (profile.inventory?.[itemId] || 0) <= 0) return;
    const nextData = registerCapture(data, pokemon);
    const nextProfile = {
      ...profile,
      inventory: { ...profile.inventory, [itemId]: profile.inventory[itemId] - 1 },
    };
    onDataUpdate?.(nextData);
    update(nextProfile, `${pokemon.name} fue restaurado y capturado automáticamente.`);
  };
  const toggleTeamMember = pokemonId => {
    let nextTeam;
    if (currentTeam.includes(pokemonId)) nextTeam = currentTeam.filter(id => id !== pokemonId);
    else if (currentTeam.length < 6) nextTeam = [...currentTeam, pokemonId];
    else { setNotice('Tu equipo ya tiene seis Pokémon. Quita uno antes de añadir otro.'); return; }
    setCurrentTeam(nextTeam);
    update({ ...profile, team: nextTeam }, 'Equipo actualizado.');
  };
  const onKeyDown = event => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onClose();
    }
    if (event.key === 'Tab') {
      const focusable = [...rootRef.current.querySelectorAll('button:not(:disabled), input, [tabindex="0"]')].filter(el => el.getClientRects().length);
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && (document.activeElement === first || document.activeElement === rootRef.current)) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  };

  return <div className={`trainer-editor ${view === 'bag' || view === 'team' ? 'te-dense-mode' : ''}`} role="dialog" aria-modal="true" aria-label={VIEW_TITLES[view]} tabIndex={-1} ref={rootRef} onKeyDown={onKeyDown}>
    {view !== 'wardrobe' && <div className="te-scenery" aria-hidden="true"><div className="te-grid-background" /><div className="te-ambient-background" /><span className="te-emblem te-emblem-large" /><div className="te-floor-shade" /></div>}
    {view === 'wardrobe' ? <CharacterCreation wardrobeProfile={profile} onGoBack={onClose} onSkinSave={skin => { onUpdate({ ...profile, skin }); onClose(); }} /> : <>
      <header className="te-header">
        <button className="te-icon" aria-label="Volver a Mi perfil" title="Volver" onClick={onClose}><ArrowLeft /><span>Volver</span></button>
        <div><h1>{VIEW_TITLES[view]}</h1></div>
        <span className="te-wallet"><CurrencyAmount amount={profile.money} /></span>
      </header>
      <div className="te-content">
        {view === 'titles' && <div className="te-list">
          <button className="te-action" onClick={() => update({ ...profile, titleId: null }, 'Título retirado.')}>Sin título { !profile.titleId && <Check size={18} /> }</button>
          {titles.map(title => <article className="te-row" key={title.id}>
            <Award className={title.unlocked ? 'te-gold' : 'te-muted'} /><div><h2>{title.name}</h2><p>{title.requirement}</p>{title.hidden && <small>Evento especial</small>}</div>
            <button className="te-action" disabled={!title.unlocked || profile.titleId === title.id} onClick={() => update({ ...profile, titleId: title.id }, 'Título equipado.')}>
              {!title.unlocked ? <><Lock size={16} /> Bloqueado</> : profile.titleId === title.id ? <><Check size={16} /> Equipado</> : 'Equipar'}
            </button>
          </article>)}
        </div>}

        {view === 'achievements' && <div className="te-achievements">
          <aside className="te-categories" aria-label="Categorías de logros">
            <label className="te-search"><Search size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar Pokémon" aria-label="Buscar categoría Pokémon" /></label>
            <div className="te-species-grid">
              <button className={category === 0 ? 'selected' : ''} onClick={() => setCategory(0)} aria-pressed={category === 0}><span className="te-pokeball" aria-hidden="true" /><span>Generales</span></button>
              {filteredSpecies.map(p => <button key={p.id} className={category === p.id ? 'selected' : ''} onClick={() => setCategory(p.id)} aria-pressed={category === p.id}>
                <img src={`/assets/pokemon/normal/${p.id}.png`} alt="" loading="lazy" /><small>#{String(p.id).padStart(3, '0')}</small><span>{p.name}</span>
              </button>)}
              {!filteredSpecies.length && <p>Sin coincidencias.</p>}
            </div>
          </aside>
          <section className="te-achievement-detail">
            <h2>{selectedPokemon ? selectedPokemon.name : 'Logros generales'}</h2>
            {achievements.map(a => {
              const claimed = profile.claimedAchievements?.includes(a.id);
              const complete = claimed || a.current >= a.target;
              return <article className="te-milestone" key={a.id}>
                <div className="te-row"><Trophy className={complete ? 'te-gold' : 'te-muted'} /><div><h3>{a.name}</h3><p>{a.requirement}</p></div></div>
                <progress value={claimed ? a.target : Math.min(a.current, a.target)} max={a.target} aria-label={a.name} />
                <div className="te-reward"><span>{claimed ? a.target : Math.min(a.current, a.target)} / {a.target}</span><span>{a.reward.toLocaleString('es-CL')} EXP{a.moneyReward ? <> · <CurrencyAmount amount={a.moneyReward} /></> : null}{a.profileImageId ? ' · Imagen de perfil' : ''}</span><button className="te-action" disabled={!complete || claimed} onClick={() => update(claimAchievement(profile, data, category, a.id), `Recompensa recibida: ${a.reward.toLocaleString('es-CL')} EXP${a.moneyReward ? `, ${a.moneyReward.toLocaleString('es-CL')} monedas e imagen de perfil.` : '.'}`)}>{claimed ? 'Reclamado' : 'Reclamar'}</button></div>
              </article>;
            })}
          </section>
        </div>}

        {view === 'bag' && <section className="te-bag">
          <div className="te-surface-heading"><Backpack /><div><h2>Mochila</h2><p>Objetos que te acompañan</p></div></div>
          <div className="te-bag-layout">
            <aside className="te-bag-categories" aria-label="Categorías de la mochila">
              {BAG_CATEGORIES.map(bagItemCategory => {
                const CategoryIcon = bagItemCategory.icon;
                const categoryCount = inventoryItems.filter(item => bagItemCategory.id === 'all' || item.category === bagItemCategory.id).length;
                return <button type="button" key={bagItemCategory.id} className={bagCategory === bagItemCategory.id ? 'is-active' : ''} onClick={() => { setBagCategory(bagItemCategory.id); setSelectedBagItemId(null); }}><CategoryIcon /><span>{bagItemCategory.label}</span><b>{categoryCount}</b></button>;
              })}
            </aside>

            <div className="te-bag-browser">
              <div className="te-bag-tools"><label className="te-bag-search"><Search /><input value={bagQuery} onChange={event => { setBagQuery(event.target.value); setSelectedBagItemId(null); }} placeholder="Buscar objeto..." aria-label="Buscar objeto" /></label><label className="te-bag-sort"><SlidersHorizontal /><select value={bagSort} onChange={event => setBagSort(event.target.value)} aria-label="Ordenar objetos"><option value="category">Por categoría</option><option value="name">Por nombre</option><option value="quantity">Por cantidad</option></select></label></div>
              {filteredInventoryItems.length ? <div className="te-bag-grid">{filteredInventoryItems.map(item => {
                const quantity = profile.inventory?.[item.id] || 0;
                const boostKey = BOOST_KEYS[item.id];
                const charges = boostKey ? profile.boosts?.[boostKey] || 0 : 0;
                const selected = selectedBagItem?.id === item.id;
                if (item.id === 'album-pack') return <article className="te-bag-readonly" key={item.id} aria-label={`${item.name}, ${quantity} unidades`}>
                  <span className="te-bag-quantity">×{quantity}</span>
                  <span className="te-bag-item-visual"><img className="te-bag-image is-album-pack" src={ITEM_IMAGES[item.id]} alt="" /></span>
                  <strong>{item.name}</strong><small>Colección</small><em>Se abre desde Álbumes</em>
                </article>;
                return <button type="button" className={selected ? 'is-selected' : ''} key={item.id} onClick={() => setSelectedBagItemId(item.id)} aria-pressed={selected}>
                  <span className="te-bag-quantity">×{quantity}</span>
                  <span className="te-bag-item-visual">{ITEM_IMAGES[item.id] ? <img className={`te-bag-image is-${item.id}`} src={ITEM_IMAGES[item.id]} alt="" /> : item.id === 'lucky-egg' ? <Egg /> : item.id === 'amulet-coin' ? <Coins /> : <Backpack />}</span>
                  <strong>{item.name}</strong><small>{boostKey ? 'Potenciador' : item.category}</small>
                  {charges > 0 && <em>{charges} intentos activos</em>}
                </button>;
              })}</div> : <div className="te-empty te-bag-empty"><PackageSearch size={48} /><h2>Sin objetos en esta categoría</h2><p>Los artículos que compres en la Tienda aparecerán aquí.</p></div>}
            </div>

            <aside className="te-bag-detail" aria-live="polite">
              {selectedBagItem ? (() => {
                const quantity = profile.inventory?.[selectedBagItem.id] || 0;
                const boostKey = BOOST_KEYS[selectedBagItem.id];
                const charges = boostKey ? profile.boosts?.[boostKey] || 0 : 0;
                return <>
                  <span className="te-bag-detail-kind">{boostKey ? 'Potenciador' : 'Objeto in-game'}</span>
                  <div className="te-bag-detail-visual">{ITEM_IMAGES[selectedBagItem.id] ? <img className={`te-bag-image is-${selectedBagItem.id}`} src={ITEM_IMAGES[selectedBagItem.id]} alt={selectedBagItem.name} /> : selectedBagItem.id === 'lucky-egg' ? <Egg /> : selectedBagItem.id === 'amulet-coin' ? <Coins /> : <Backpack />}</div>
                  <h3>{selectedBagItem.name}</h3><p>{selectedBagItem.longDescription || selectedBagItem.description}</p>
                  <div className="te-bag-detail-meta"><span>En mochila <b>×{quantity}</b></span>{boostKey && <span>Efecto activo <b>{charges} intentos</b></span>}</div>
                  {selectedBagItem.id === 'fossil-helix' || selectedBagItem.id === 'fossil-dome'
                    ? <button type="button" className="te-bag-activate" disabled={quantity <= 0} onClick={() => redeemFossil(selectedBagItem.id)}><Star /> {quantity > 0 ? 'Restaurar Pokémon' : 'Sin unidades'}</button>
                    : boostKey
                    ? <button type="button" className="te-bag-activate" disabled={quantity <= 0} onClick={() => update(activateBoostItem(profile, selectedBagItem.id), `${selectedBagItem.name} activado durante 10 intentos.`)}><Star /> {quantity > 0 ? 'Activar objeto' : 'Sin unidades'}</button>
                    : <div className="te-bag-ingame"><Lock /> Se utiliza únicamente durante el juego</div>}
                </>;
              })() : filteredInventoryItems.some(item => item.id === 'album-pack') ? <div className="te-empty"><PackageSearch size={48} /><h2>Sobres almacenados</h2><p>Consulta la cantidad aquí y ábrelos desde la sección Álbumes.</p></div> : <div className="te-empty"><Backpack size={48} /><h2>Mochila vacía</h2><p>Consigue objetos para consultar aquí sus detalles.</p></div>}
            </aside>
          </div>
        </section>}

        {view === 'hall' && <section className="te-hall">
          {hallEntry ? <>
            <div className="te-hall-heading"><Crown /><h2>Equipo campeón</h2><p>{hallEntry.trainerName} · {new Date(hallEntry.wonAt).toLocaleDateString('es-CL')}</p></div>
            {hallEntries.length > 1 && <div className="te-hall-history" aria-label="Victorias registradas">{hallEntries.map((entry, index) => <button key={entry.id} className="te-action" aria-pressed={hallIndex === index} onClick={() => setHallIndex(index)}>Victoria {hallEntries.length - index}</button>)}</div>}
            <div className="te-hall-team">{hallEntry.team.map((member, index) => <article key={`${member.speciesId}-${index}`}>
              <span className="te-hall-number">{String(index + 1).padStart(2, '0')}</span><img src={`/assets/pokemon/${member.specimen?.isShiny ? 'shiny' : 'normal'}/${member.speciesId}.png`} alt={member.name} />
              <h3>{member.name}</h3><p>#{String(member.speciesId).padStart(3, '0')}{member.specimen?.isShiny ? ' · Shiny' : ''}</p><small>{member.specimen?.nature || 'Miembro del equipo campeón'}</small>
            </article>)}</div>
          </> : <div className="te-empty te-hall-empty"><Crown size={64} /><h2>Tu leyenda está por comenzar</h2><p>Gana la Liga Pokémon para inmortalizar aquí a tus seis campeones.</p><div className="te-hall-slots" aria-label="Seis plazas del equipo campeón">{Array.from({ length: 6 }, (_, index) => <span key={index}><span className="te-emblem" /><small>{String(index + 1).padStart(2, '0')}</small></span>)}</div><span className="te-hall-lock"><Lock size={16} /> Pendiente de tu primera victoria</span></div>}
        </section>}

        {view === 'captures' && <section className="te-captures">
          <div className="te-captures-heading"><CircleDot /><div><h2>Registro de capturas</h2><p>{registeredSpecies.length} especies descubiertas durante tu aventura.</p></div></div>
          {registeredSpecies.length ? <div className="te-capture-grid">{registeredSpecies.map(pokemon => {
            const record = getCaptureRecord(data, pokemon.id);
            const owned = Boolean(record.owned);
            const capturedAt = record.lastCapturedAt || record.firstRegisteredAt;
            const captureDate = capturedAt ? new Date(capturedAt).toLocaleDateString('es-CL') : 'Fecha no disponible';
            return <article key={pokemon.id}>
              <img src={`/assets/pokemon/${record.specimen?.isShiny ? 'shiny' : 'normal'}/${pokemon.id}.png`} alt={pokemon.name} />
              <div><small>#{String(pokemon.id).padStart(3, '0')}</small><h3>{pokemon.name}</h3><p>{owned ? 'Capturado' : 'Liberado'}</p><time dateTime={capturedAt ? new Date(capturedAt).toISOString() : undefined}>{record.captures > 1 ? 'Última captura' : 'Capturado'}: {captureDate}</time></div>
              <span className={owned ? 'is-owned' : 'is-released'}>{owned ? 'En posesión' : 'Registrado'}</span>
            </article>;
          })}</div> : <div className="te-empty"><CircleDot size={48} /><h2>Aún no hay capturas</h2><p>Las especies registradas aparecerán aquí.</p></div>}
        </section>}

        {view === 'team' && <section className="te-team">
          <div className="te-surface-heading te-team-title"><UsersRound /><div><h2>Mi <span>equipo</span></h2><p>Tus compañeros de aventura</p></div></div>
          <div className="te-team-toolbar">
            <div className="te-team-tabs"><span className="is-active"><UsersRound /> Equipo actual <b>{currentTeam.length}/6</b></span><span><CircleDot /> Todos mis Pokémon <b>{ownedSpecies.length}</b></span></div>
            <label>Ordenar por <select value={teamSort} onChange={event => setTeamSort(event.target.value)}><option value="number">Número Pokédex</option><option value="name">Nombre</option></select><SlidersHorizontal /></label>
          </div>
          <div className="te-section-label"><strong>Equipo actual</strong><span>Pokémon que te acompañan en tu aventura</span></div>
          <div className="te-team-active">{Array.from({ length: 6 }, (_, index) => {
            const pokemon = POKEMON_DATA.find(item => item.id === currentTeam[index]);
            const record = pokemon ? getCaptureRecord(data, pokemon.id) : null;
            const stats = pokemon ? getDisplayStats(pokemon, record) : null;
            return <article key={index} className={pokemon ? 'is-filled' : ''}>{pokemon ? <>
              <span className="te-team-number">#{String(pokemon.id).padStart(3, '0')}</span>
              <img src={`/assets/pokemon/${record.specimen?.isShiny ? 'shiny' : 'normal'}/${pokemon.id}.png`} alt={pokemon.name} />
              <div><h3>{pokemon.name}</h3><div className="te-team-types">{pokemon.type.map(type => <span className={`is-${type.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()}`} key={type}>{type}</span>)}</div><p>Poder total <b>{stats.total}</b></p></div>
              <button type="button" onClick={() => toggleTeamMember(pokemon.id)} aria-label={`Quitar a ${pokemon.name}`}>×</button>
            </> : <><span>+</span><small>Espacio libre</small></>}</article>;
          })}</div>
          <div className="te-section-label te-roster-label"><strong>Todos mis Pokémon</strong><span>Explora y gestiona tus Pokémon capturados</span><b>{ownedSpecies.length} Pokémon</b></div>
          {sortedOwnedSpecies.length ? <div className="te-team-roster">{sortedOwnedSpecies.map(pokemon => {
            const selected = currentTeam.includes(pokemon.id);
            return <button type="button" key={pokemon.id} className={selected ? 'is-selected' : ''} onClick={() => toggleTeamMember(pokemon.id)} aria-pressed={selected}>
              <img src={`/assets/pokemon/${getCaptureRecord(data, pokemon.id).specimen?.isShiny ? 'shiny' : 'normal'}/${pokemon.id}.png`} alt="" />
              <span><small>#{String(pokemon.id).padStart(3, '0')}</small><strong>{pokemon.name}</strong><em>{pokemon.rarity}</em></span>{selected && <Star fill="currentColor" />}
            </button>;
          })}</div> : <div className="te-empty"><UsersRound size={48} /><h2>No hay Pokémon disponibles</h2><p>Captura un ejemplar para añadirlo a tu equipo.</p></div>}
        </section>}

        {view === 'rename' && <form className="te-rename" onSubmit={e => { e.preventDefault(); if (!canRename) return; if (!confirmName) { setConfirmName(true); return; } update(renameTrainer(profile, name), 'Nombre actualizado.'); setConfirmName(false); }}>
          <Pencil size={32} /><h2>Una nueva identidad</h2><p>Nombre actual: <strong>{profile.name}</strong></p>
          <label htmlFor="trainer-new-name">Nuevo nombre</label><input id="trainer-new-name" value={name} maxLength={12} onChange={e => { setName(e.target.value); setConfirmName(false); }} autoComplete="off" required />
          <small>{name.length}/12 caracteres</small><p>{hasPass ? 'Se consumirá 1 vale de identidad.' : <>Coste: <CurrencyAmount amount={RENAME_COST} /> · Saldo: <CurrencyAmount amount={profile.money} /></>}</p>
          {!hasPass && (profile.money || 0) < RENAME_COST && <p>Saldo insuficiente. Puedes ganar dinero reclamando logros.</p>}
          {confirmName && <p role="alert">Cambiar a «{name.trim()}»{hasPass ? ' usando tu vale' : <> por <CurrencyAmount amount={RENAME_COST} /></>}.</p>}
          <button className="te-action" disabled={!canRename} type="submit">{confirmName ? 'Confirmar cambio' : 'Cambiar nombre'}</button>
          {confirmName && <button className="te-action" type="button" onClick={() => setConfirmName(false)}>Cancelar</button>}
        </form>}
      </div>
      <p className="te-notice" role="status" aria-live="polite">{notice}</p>
    </>}
  </div>;
}
