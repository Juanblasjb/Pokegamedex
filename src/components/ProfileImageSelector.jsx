import { ArrowLeft, Check, ChevronLeft, ChevronRight, Lock, Menu, UserRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import { POKEMON_DATA } from '../pokemonData';
import { isSpeciesRegistered } from '../utils/captureSystem';
import { equipProfileImage } from '../utils/trainerProgress';
import './ProfileImageSelector.css';

const PAGE_SIZE = 24;
const AVATAR_FOCUS = {
  9: { x: '0%', y: '27%', scale: 1.6 },
  16: { x: '10%', y: '17%', scale: 1.58 },
  17: { x: '9%', y: '18%', scale: 1.58 },
  18: { x: '-24%', y: '5%', scale: 1.5 },
  21: { x: '-8%', y: '17%', scale: 1.6 },
  22: { x: '24%', y: '6%', scale: 1.45 },
  23: { x: '20%', y: '25%', scale: 1.5 },
  24: { x: '-8%', y: '16%', scale: 1.58 },
  41: { x: '7%', y: '17%', scale: 1.6 },
  42: { x: '5%', y: '16%', scale: 1.58 },
  83: { x: '-7%', y: '15%', scale: 1.58 },
  84: { x: '-8%', y: '17%', scale: 1.58 },
  85: { x: '-7%', y: '16%', scale: 1.55 },
  95: { x: '-7%', y: '18%', scale: 1.55 },
  130: { x: '-7%', y: '18%', scale: 1.55 },
  142: { x: '-8%', y: '17%', scale: 1.55 },
  144: { x: '7%', y: '18%', scale: 1.55 },
  145: { x: '-8%', y: '18%', scale: 1.55 },
  146: { x: '7%', y: '18%', scale: 1.55 },
  147: { x: '-6%', y: '17%', scale: 1.58 },
  148: { x: '-6%', y: '16%', scale: 1.58 },
  149: { x: '-7%', y: '15%', scale: 1.58 },
};

export default function ProfileImageSelector({ profile, data, onUpdate, onClose, onMenu }) {
  const [page, setPage] = useState(0);
  const orderedPokemon = useMemo(() => {
    const kanto = POKEMON_DATA.filter(pokemon => pokemon.id <= 150 || (pokemon.id === 151 && isSpeciesRegistered(data, 151)));
    const pikachu = kanto.find(pokemon => pokemon.id === 25);
    return pikachu ? [pikachu, ...kanto.filter(pokemon => pokemon.id !== 25)] : kanto;
  }, [data]);
  const pageCount = Math.ceil(orderedPokemon.length / PAGE_SIZE);
  const pagePokemon = orderedPokemon.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const selectImage = pokemonId => {
    const next = equipProfileImage(profile, `normal-${pokemonId}`);
    if (next !== profile) onUpdate(next);
  };

  return <main className="profile-image-screen">
    <div className="pis-background" aria-hidden="true" />
    <header className="pis-header">
      <button type="button" className="pis-command pis-back" onClick={onClose}><ArrowLeft /><span>Volver</span></button>
      <button type="button" className="pis-command pis-menu" onClick={onMenu}><span>Menú</span><Menu /></button>
    </header>

    <section className="pis-intro">
      <div className="pis-heading">
        <span>Perfil</span>
        <h1>Imágenes de perfil</h1>
        <p>Elige tu avatar</p>
      </div>
      <div className="pis-info"><UserRound /><span /><div><strong>Selecciona la imagen que más te guste.</strong><small>Podrás cambiarla cuando quieras.</small></div></div>
    </section>

    <section className="pis-gallery" aria-label="Galería de imágenes de perfil">
      {pagePokemon.map(pokemon => {
        const imageId = `normal-${pokemon.id}`;
        // Pikachu is always available because it is the default account portrait.
        const unlocked = pokemon.id === 25 || profile.unlockedProfileImages?.includes(imageId);
        const selected = profile.profileImage === imageId;
        const focus = AVATAR_FOCUS[pokemon.id];
        return <button
          type="button"
          key={pokemon.id}
          className={`pis-avatar ${selected ? 'is-selected' : ''} ${unlocked ? 'is-unlocked' : 'is-locked'}`}
          onClick={() => selectImage(pokemon.id)}
          disabled={!unlocked}
          aria-label={`${pokemon.name}${unlocked ? selected ? ', seleccionada' : ', desbloqueada' : ', bloqueada'}`}
          aria-pressed={selected}
        >
          <span className="pis-avatar-ring"><img src={`/assets/pokemon/normal/${pokemon.id}.png`} alt="" loading="lazy" style={focus ? { '--avatar-x': focus.x, '--avatar-y': focus.y, '--avatar-scale': focus.scale } : undefined} /></span>
          <span className="pis-avatar-status">{selected ? <Check /> : !unlocked ? <Lock /> : null}</span>
          <small>{pokemon.name}</small>
        </button>;
      })}
    </section>

    <nav className="pis-pagination" aria-label="Páginas de imágenes">
      <button type="button" aria-label="Página anterior" disabled={page === 0} onClick={() => setPage(value => Math.max(0, value - 1))}><ChevronLeft /></button>
      <div>{Array.from({ length: pageCount }, (_, index) => <button type="button" key={index} className={index === page ? 'is-active' : ''} onClick={() => setPage(index)} aria-label={`Página ${index + 1}`} aria-current={index === page ? 'page' : undefined} />)}</div>
      <button type="button" aria-label="Página siguiente" disabled={page >= pageCount - 1} onClick={() => setPage(value => Math.min(pageCount - 1, value + 1))}><ChevronRight /></button>
    </nav>

    <footer className="pis-footer"><span>Pokémon<br />Trainer profile</span><span>Tu historia continúa</span></footer>
  </main>;
}
