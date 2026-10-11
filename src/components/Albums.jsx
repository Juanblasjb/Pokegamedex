import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, CircleDot, Disc3, Image, Lock, PackageOpen, Sparkles } from 'lucide-react';
import { AnimatePresence, animate, motion as Motion, useMotionValue, useTransform } from 'motion/react';
import { PageFlip } from 'page-flip';
import { POKEMON_DATA } from '../pokemonData';
import { getAlbumSticker, openAlbumPacks, placeAlbumSticker } from '../utils/albumCollection';
import { isSpeciesRegistered } from '../utils/captureSystem';
import './Albums.css';

const POKEMON = POKEMON_DATA.filter(pokemon => pokemon.id <= 151);
const ALBUM_PACKS = ['/assets/items/Sobre-abra.png', '/assets/items/Sobre-bellsprout.png', '/assets/items/Sobre-gastly.png', '/assets/items/Sobre-growlithe.png', '/assets/items/Sobre-machop.png', '/assets/items/Sobre-poliwag.png', '/assets/items/Sobre-sandshrew.png'];

function AlbumBackdrop() {
  return <div className="albums-backdrop" aria-hidden="true"><span /><span /><span /></div>;
}

function AlbumHeader({ title = 'Álbumes', subtitle = 'Tu rincón de productos coleccionables', onBack, backLabel = 'Volver' }) {
  return <header className="albums-header">
    <button type="button" className="albums-back is-back" onClick={onBack}><ArrowLeft /><span>{backLabel}</span></button>
    <div className="albums-brand"><div><h1>{title}</h1><p>{subtitle}</p></div></div>
  </header>;
}

function StickerPreview() {
  return <div className="albums-sticker-preview" aria-hidden="true">
    {[6, 25, 9].map((id, index) => <span key={id} style={{ '--preview-order': index }}><small>#{String(id).padStart(3, '0')}</small><img src={`/assets/pokemon/normal/${id}.png`} alt="" /></span>)}
  </div>;
}

function TazoPreview() {
  return <div className="albums-tazo-preview" aria-hidden="true">
    {[25, 150, 6].map((id, index) => <span key={id} style={{ '--tazo-order': index }}><img src={`/assets/pokemon/normal/${id}.png`} alt="" /></span>)}
  </div>;
}

function PackPreview({ image }) {
  return <div className="albums-pack-preview" aria-hidden="true"><span /><img src={image} alt="" /><Sparkles /></div>;
}

function RotatingPack({ image, opening = false }) {
  const rotateY = useMotionValue(-8);
  const frontOpacity = useTransform(rotateY, value => {
    const angle = ((value % 360) + 360) % 360;
    return angle > 90 && angle < 270 ? 0 : 1;
  });
  const backOpacity = useTransform(frontOpacity, value => 1 - value);
  const rotatePack = direction => animate(rotateY, rotateY.get() + direction * 180, { type: 'spring', stiffness: 110, damping: 16 });
  return <div className={`pack-rotator ${opening ? 'is-opening' : ''}`}>
    <Motion.div
      className="pack-model"
      style={{ rotateY }}
      onPan={(_, info) => rotateY.set(rotateY.get() + info.delta.x * .8)}
      onDoubleClick={() => rotatePack(2)}
      tabIndex={0}
      role="img"
      aria-label="Sobre interactivo. Arrastra horizontalmente para girarlo."
      onKeyDown={event => {
        if (event.key === 'ArrowLeft') rotatePack(-1);
        if (event.key === 'ArrowRight') rotatePack(1);
      }}
    >
      {[-14, -12, -10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10, 12, 14].map(depth => <span className="pack-depth-layer" style={{ '--pack-depth': `${depth}px` }} key={depth} aria-hidden="true" />)}
      <Motion.span className="pack-face is-front" style={{ opacity: frontOpacity }}><img src={image} alt="Frente del sobre" draggable="false" /></Motion.span>
      <Motion.span className="pack-face is-back" style={{ opacity: backOpacity }}><img src="/assets/items/Sobre-back.png" alt="Reverso del sobre" draggable="false" /></Motion.span>
    </Motion.div>
    <span className="pack-drag-hint">Arrastra para girar 360°</span>
  </div>;
}

function PackOpening({ packImage, profile, saveData, onProfileUpdate, onBack }) {
  const [phase, setPhase] = useState('idle');
  const [openingResult, setOpeningResult] = useState(null);
  const [revealIndex, setRevealIndex] = useState(0);
  const timerRef = useRef(null);
  const packCount = Math.max(0, Number(profile?.inventory?.['album-pack']) || 0);
  const bulkOpenCount = Math.min(packCount, 10);
  const currentSticker = openingResult?.stickers?.[revealIndex];
  const currentPokemon = currentSticker ? POKEMON.find(pokemon => pokemon.id === currentSticker.speciesId) : null;

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const openPacks = quantity => {
    if (!profile || !onProfileUpdate || quantity <= 0) return;
    setOpeningResult(null);
    setRevealIndex(0);
    setPhase('opening');
    timerRef.current = window.setTimeout(() => {
      const result = openAlbumPacks(profile, quantity, { includeMew: isSpeciesRegistered(saveData, 151) });
      onProfileUpdate(result.profile);
      setOpeningResult(result);
      setPhase('reveal');
    }, 1150);
  };

  const showNextSticker = () => {
    if (!openingResult) return;
    if (revealIndex >= openingResult.stickers.length - 1) setPhase('summary');
    else setRevealIndex(index => index + 1);
  };

  return <main className="albums-screen pack-opening-screen">
    <AlbumBackdrop />
    <AlbumHeader title="Apertura de sobres" subtitle="Gira · abre · descubre" onBack={onBack} backLabel="Volver" />
    <section className={`pack-opening-stage is-${phase}`}>
      {(phase === 'idle' || phase === 'opening') && <>
        <RotatingPack image={packImage} opening={phase === 'opening'} />
        <div className="pack-opening-copy">
          <span>{packCount} {packCount === 1 ? 'sobre disponible' : 'sobres disponibles'}</span>
          <h2>{phase === 'opening' ? 'Rompiendo el sello' : packCount ? 'Tu próxima colección espera' : 'No tienes sobres'}</h2>
          <p>{packCount ? 'Cada sobre contiene cinco láminas aleatorias. Los duplicados se convierten automáticamente en monedas.' : 'Consigue sobres en la Tienda para descubrir nuevas láminas.'}</p>
          {phase === 'idle' && packCount > 0 && <div className="pack-opening-actions">
            <button type="button" onClick={() => openPacks(1)}><PackageOpen /> Abrir sobre</button>
            {packCount > 1 && <button type="button" className="is-gold" onClick={() => openPacks(bulkOpenCount)}><Sparkles /> Abrir {bulkOpenCount} sobres</button>}
          </div>}
          {phase === 'opening' && <div className="pack-opening-loader"><i /><span>Preparando láminas</span></div>}
        </div>
      </>}

      {phase === 'reveal' && currentSticker && currentPokemon && <div className="pack-reveal">
        <div className="pack-reveal-progress"><span>Lámina {revealIndex + 1} / {openingResult.stickers.length}</span><i style={{ width: `${((revealIndex + 1) / openingResult.stickers.length) * 100}%` }} /></div>
        <AnimatePresence mode="wait">
          <Motion.article
            className={`revealed-sticker is-${currentSticker.finish} ${currentSticker.duplicate ? 'is-duplicate' : ''}`}
            key={`${currentSticker.key}-${revealIndex}`}
            initial={{ opacity: 0, rotateY: -95, y: 45, scale: .72 }}
            animate={{ opacity: 1, rotateY: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, rotateY: 75, x: 120, scale: .82 }}
            transition={{ type: 'spring', stiffness: 150, damping: 17 }}
          >
            <small>#{String(currentPokemon.id).padStart(3, '0')} · Lámina {String(currentSticker.slot).padStart(2, '0')}</small>
            <img src={`/assets/pokemon/normal/${currentPokemon.id}.png`} alt={currentPokemon.name} />
            <h2>{currentPokemon.name}</h2>
            <span>{currentSticker.finish === 'holo' ? 'Holográfica' : 'Normal'}</span>
            {currentSticker.duplicate && <strong><img src="/assets/items/coin.png" alt="" /> Duplicada · +{currentSticker.resaleValue}</strong>}
          </Motion.article>
        </AnimatePresence>
        <button type="button" className="pack-reveal-next" onClick={showNextSticker}>{revealIndex >= openingResult.stickers.length - 1 ? 'Ver resumen' : 'Revelar siguiente'} <ArrowRight /></button>
      </div>}

      {phase === 'summary' && openingResult && <Motion.div className="pack-summary" initial={{ opacity: 0, scale: .86 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 150, damping: 18 }}>
        <Sparkles /><span>Apertura completada</span><h2>{openingResult.stickers.filter(sticker => !sticker.duplicate).length} láminas nuevas</h2>
        <p>Se abrieron {openingResult.packCount} {openingResult.packCount === 1 ? 'sobre' : 'sobres'} y se revisaron {openingResult.stickers.length} láminas.</p>
        <div><small>Duplicados vendidos</small><strong><img src="/assets/items/coin.png" alt="" /> +{openingResult.duplicateMoney.toLocaleString('es-CL')}</strong></div>
        <button type="button" onClick={() => { setPhase('idle'); setOpeningResult(null); }}>Continuar</button>
      </Motion.div>}
    </section>
  </main>;
}

function AlbumSelection({ packImage, onBack, onOpenStickerAlbum, onOpenTazoAlbum, onOpenPacks }) {
  return <main className="albums-screen">
    <AlbumBackdrop />
    <AlbumHeader onBack={onBack} />
    <section className="albums-choice" aria-label="Selecciona una colección">
      <button type="button" className="albums-choice-card is-stickers" onClick={onOpenStickerAlbum}>
        <StickerPreview />
        <div className="albums-choice-copy"><Image /><h2>Álbum <span>de láminas</span></h2><p>Colecciona las láminas de tus Pokémon favoritos.</p></div>
        <span className="albums-enter">Entrar <ArrowRight /></span>
      </button>
      <button type="button" className="albums-choice-card is-tazos" onClick={onOpenTazoAlbum}>
        <TazoPreview />
        <div className="albums-choice-copy"><Disc3 /><h2>Álbum <span>de tazos</span></h2><p>Reúne los tazos y completa tu colección.</p></div>
        <span className="albums-enter">Entrar <ArrowRight /></span>
      </button>
      <button type="button" className="albums-choice-card is-packs" onClick={onOpenPacks}>
        <PackPreview image={packImage} />
        <div className="albums-choice-copy"><PackageOpen /><h2>Apertura <span>de sobres</span></h2><p>Descubre nuevas láminas para completar el álbum.</p></div>
        <span className="albums-enter">Entrar <ArrowRight /></span>
      </button>
    </section>
    <footer className="albums-footer"><span>Pokémon · Trainer System</span><span>Colecciona · Explora · Disfruta</span></footer>
  </main>;
}

function PosterMosaic() {
  return <div className="digital-page is-poster-page">
    <span className="digital-page-number">MOSAICO · 01</span><small>Láminas especiales</small><h2>La aventura comienza</h2>
    <div className="digital-poster-grid">{Array.from({ length: 9 }, (_, index) => <span key={index} style={{ '--poster-x': `${(index % 3) * 50}%`, '--poster-y': `${Math.floor(index / 3) * 50}%` }}><i>{String(index + 1).padStart(2, '0')}</i></span>)}</div>
    <p>Nueve láminas que, al reunirse, forman una ilustración especial.</p>
  </div>;
}

function StickerSlots({ count, pokemon, locked, start, albumCollection, placingSticker, onPlace }) {
  return <div className={`digital-sticker-grid is-${count}`}>
    {Array.from({ length: count }, (_, index) => {
      const slot = start + index;
      const state = getAlbumSticker(albumCollection, pokemon.id, slot);
      const ready = Boolean(state.sticker && !state.placed);
      const isPlacing = placingSticker === state.key;
      return <button
        type="button"
        key={index}
        className={`${ready ? 'is-ready' : ''} ${state.placed ? `is-placed is-${state.sticker?.finish || 'normal'}` : ''} ${isPlacing ? 'is-placing' : ''}`}
        disabled={locked || !ready}
        onPointerDown={event => ready && event.stopPropagation()}
        onClick={event => { event.stopPropagation(); if (ready) onPlace?.(pokemon.id, slot); }}
        aria-label={locked ? `Lámina ${slot} bloqueada` : state.placed ? `Lámina ${slot} colocada` : ready ? `Pegar lámina ${slot}` : `Espacio de lámina ${slot}`}
      >
        <i>{String(slot).padStart(2, '0')}</i>
        {locked ? <Lock /> : state.placed
          ? <Motion.span className="sticker-placement-sheet" initial={isPlacing ? { opacity: 0, y: -52, rotateX: -42, rotateZ: -6, scale: 1.18 } : false} animate={{ opacity: 1, y: 0, rotateX: 0, rotateZ: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 22, mass: .65 }}>
              <img loading="lazy" decoding="async" src={`/assets/pokemon/normal/${pokemon.id}.png`} alt="" />
              {isPlacing && <><Motion.em className="sticker-pressure-wave" initial={{ opacity: .8, scale: .35 }} animate={{ opacity: 0, scale: 1.55 }} transition={{ duration: .45, delay: .18 }} />{Array.from({ length: 6 }, (_, particle) => <Motion.em className="sticker-particle" style={{ '--particle-angle': `${particle * 60}deg` }} initial={{ opacity: 1, scale: .2 }} animate={{ opacity: 0, scale: 1, x: Math.cos(particle * Math.PI / 3) * 30, y: Math.sin(particle * Math.PI / 3) * 30 }} transition={{ duration: .4, delay: .16 }} key={particle} />)}</>}
            </Motion.span>
          : <>{ready && <><span className="sticker-ready-silhouette" style={{ backgroundImage: `url('/assets/pokemon/normal/${pokemon.id}.png')` }} /><b>Pegar</b></>}</>}
      </button>;
    })}
  </div>;
}

function PokemonAlbumPage({ pokemon, side, saveData, albumCollection, placingSticker, onPlace }) {
  const locked = pokemon.id === 151 && !isSpeciesRegistered(saveData, 151);
  const number = String(pokemon.id).padStart(3, '0');
  const isLeft = side === 'left';
  return <div className={`digital-page is-pokemon-album-page ${isLeft ? 'is-left-layout' : 'is-right-layout'} ${locked ? 'is-secret' : ''}`}>
    <span className="digital-page-number">#{number} · {isLeft ? 'A' : 'B'}</span>
    <div className="digital-species-heading">
      {locked ? <Lock /> : <img loading="lazy" decoding="async" src={`/assets/pokemon/normal/${pokemon.id}.png`} alt="" />}
      <div><small>{locked ? 'Contenido clasificado' : `Pokémon #${number}`}</small><h2>{locked ? 'Especie secreta' : pokemon.name}</h2>{!locked && <div className="digital-types">{pokemon.type.map(type => <span key={type}>{type}</span>)}</div>}</div>
    </div>
    <StickerSlots count={isLeft ? 3 : 8} pokemon={pokemon} locked={locked} start={isLeft ? 1 : 4} albumCollection={albumCollection} placingSticker={placingSticker} onPlace={onPlace} />
    <p>{locked ? 'Registra esta especie para revelar sus espacios.' : `${isLeft ? 'Primera' : 'Segunda'} hoja de la colección de ${pokemon.name}.`}</p>
  </div>;
}

function AlbumPage({ page, saveData, albumCollection, placingSticker, onPlace }) {
  if (page.kind === 'front-cover') return <div className="digital-page digital-cover is-front-cover">
    <span className="digital-cover-edition">Edición Kanto · 001</span><CircleDot /><small>Pokémon</small><h2>Álbum<br />de láminas</h2><img src="/assets/pokemon/normal/25.png" alt="Pikachu" /><b>151 especies para descubrir</b>
  </div>;
  if (page.kind === 'inside-front') return <div className="digital-page is-inside-cover">
    <span className="digital-page-number">00</span><CircleDot /><small>Archivo regional</small><h2>Tu aventura<br />en Kanto</h2><p>Un espacio para conservar cada encuentro, cada descubrimiento y cada recuerdo.</p><b>151 especies · 1.670 láminas</b>
  </div>;
  if (page.kind === 'poster') return <PosterMosaic />;
  if (page.kind === 'pokemon') return <PokemonAlbumPage pokemon={page.pokemon} side={page.side} saveData={saveData} albumCollection={albumCollection} placingSticker={placingSticker} onPlace={onPlace} />;
  if (page.kind === 'closing') return <div className="digital-page is-inside-cover is-closing"><BookOpen /><small>Colección regional</small><h2>151 historias<br />por completar</h2><p>Cada pliego conserva once momentos de una especie distinta.</p></div>;
  if (page.kind === 'inside-back') return <div className="digital-page is-inside-cover is-back"><CircleDot /><small>Registro completado</small><h2>La historia<br />continúa</h2><p>La última página no cierra la aventura. Siempre queda una nueva colección por comenzar.</p><b>Pokédex de Kanto</b></div>;
  return <div className="digital-page digital-cover is-rear-cover"><CircleDot /><h2>Pokémon<br />Trainer System</h2><p>Álbum digital · Región de Kanto</p><span>001 / 151</span></div>;
}

const PageFlipBook = memo(function PageFlipBook({ pages, saveData, albumCollection, placingSticker, onPlace, onFlip, onReady }) {
  const bookElement = useRef(null);

  useEffect(() => {
    const root = bookElement.current;
    let pageFlip = null;
    const initialize = window.setTimeout(() => {
      pageFlip = new PageFlip(root, {
        width: 590,
        height: 620,
        size: 'stretch',
        minWidth: 300,
        maxWidth: 590,
        minHeight: 340,
        maxHeight: 620,
        showCover: true,
        usePortrait: false,
        drawShadow: true,
        maxShadowOpacity: 0.42,
        flippingTime: 780,
        mobileScrollSupport: false,
        swipeDistance: 24,
        useMouseEvents: true,
        showPageCorners: false,
        disableFlipByClick: true,
        autoSize: true,
      });
      pageFlip.on('flip', event => onFlip(event.data));
      pageFlip.loadFromHTML(root.querySelectorAll('.digital-page-shell'));
      onReady(pageFlip);
    }, 0);
    return () => {
      window.clearTimeout(initialize);
      onReady(null);
      pageFlip?.destroy();
    };
  }, [onFlip, onReady]);

  return <div className="digital-pageflip" ref={bookElement}>
    {pages.map((page, index) => <div className="digital-page-shell" data-density={page.density || 'soft'} key={`${page.kind}-${page.pokemon?.id || index}-${page.side || ''}`}><AlbumPage page={page} saveData={saveData} albumCollection={albumCollection} placingSticker={placingSticker} onPlace={onPlace} /></div>)}
  </div>;
});

function DigitalAlbum({ profile, saveData, onProfileUpdate, onBack }) {
  const pages = useMemo(() => [
    { kind: 'front-cover', density: 'hard' },
    { kind: 'inside-front' },
    { kind: 'poster' },
    ...POKEMON.flatMap(pokemon => [{ kind: 'pokemon', side: 'left', pokemon }, { kind: 'pokemon', side: 'right', pokemon }]),
    { kind: 'closing' },
    { kind: 'inside-back' },
    { kind: 'rear-cover', density: 'hard' },
  ], []);
  const pageFlip = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [placingSticker, setPlacingSticker] = useState(null);
  const placementTimer = useRef(null);
  const handleReady = useCallback(instance => { pageFlip.current = instance; }, []);
  const handleFlip = useCallback(page => setCurrentPage(page), []);
  const handlePlace = useCallback((speciesId, slot) => {
    if (!profile || !onProfileUpdate) return;
    const key = `${speciesId}-${slot}`;
    setPlacingSticker(key);
    const updated = placeAlbumSticker(profile, speciesId, slot);
    if (updated !== profile) onProfileUpdate(updated);
    window.clearTimeout(placementTimer.current);
    placementTimer.current = window.setTimeout(() => setPlacingSticker(null), 700);
  }, [onProfileUpdate, profile]);
  const lastPage = pages.length - 1;
  const progress = Math.round((currentPage / lastPage) * 100);
  const currentPokemonIndex = currentPage >= 3 && currentPage <= 304 ? Math.floor((currentPage - 3) / 2) : -1;

  useEffect(() => {
    const onKeyDown = event => {
      if (event.key === 'ArrowRight') pageFlip.current?.flipNext('top');
      if (event.key === 'ArrowLeft') pageFlip.current?.flipPrev('top');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => () => window.clearTimeout(placementTimer.current), []);

  const goToCollection = value => {
    if (value === 'cover') pageFlip.current?.flip(0, 'top');
    else if (value === 'poster') pageFlip.current?.flip(1, 'top');
    else if (value === 'end') pageFlip.current?.flip(lastPage, 'top');
    else pageFlip.current?.flip(3 + Number(value) * 2, 'top');
  };

  const locationLabel = currentPage === 0 ? 'Portada' : currentPage >= lastPage - 2 ? 'Final del álbum' : currentPage <= 2 ? 'Mosaico inicial' : `#${String(POKEMON[currentPokemonIndex]?.id || 1).padStart(3, '0')} ${POKEMON[currentPokemonIndex]?.name || ''}`;

  return <main className="albums-screen digital-album-screen">
    <AlbumBackdrop />
    <header className="albums-header digital-album-toolbar">
      <button type="button" className="albums-back is-back" onClick={onBack}><ArrowLeft /><span>Volver</span></button>
      <div className="digital-progress is-header" aria-live="polite">
        <span>{locationLabel}</span><div className="digital-progress-track"><i style={{ width: `${progress}%` }} /></div><b>{progress}%</b>
        <label className="digital-jump"><span>Ir a</span><select value={currentPokemonIndex >= 0 ? String(currentPokemonIndex) : currentPage === 0 ? 'cover' : currentPage <= 2 ? 'poster' : 'end'} onChange={event => goToCollection(event.target.value)}><option value="cover">Portada</option><option value="poster">Mosaico inicial</option>{POKEMON.map((pokemon, index) => <option value={index} key={pokemon.id}>#{String(pokemon.id).padStart(3, '0')} · {pokemon.name}</option>)}<option value="end">Final del álbum</option></select></label>
      </div>
    </header>
    <section className="digital-album-stage" aria-label="Álbum digital de láminas">
      <PageFlipBook pages={pages} saveData={saveData} albumCollection={profile?.albumCollection} placingSticker={placingSticker} onPlace={handlePlace} onFlip={handleFlip} onReady={handleReady} />
      <button type="button" className="digital-page-control is-previous" onClick={() => pageFlip.current?.flipPrev('top')} disabled={currentPage === 0} aria-label="Página anterior"><ArrowLeft /></button>
      <button type="button" className="digital-page-control is-next" onClick={() => pageFlip.current?.flipNext('top')} disabled={currentPage >= lastPage - 1} aria-label="Página siguiente"><ArrowRight /></button>
    </section>
  </main>;
}

function CollectionPlaceholder({ type, packImage, onBack }) {
  const isPacks = type === 'packs';
  return <main className="albums-screen collection-placeholder-screen">
    <AlbumBackdrop /><AlbumHeader title={isPacks ? 'Apertura de sobres' : 'Álbum de tazos'} subtitle={isPacks ? 'Nuevas láminas · Nuevas historias' : 'Colección en preparación'} onBack={onBack} backLabel="Volver" />
    <section className={`collection-placeholder ${isPacks ? 'is-packs' : 'is-tazos'}`}>{isPacks ? <PackPreview image={packImage} /> : <TazoPreview />}{isPacks ? <PackageOpen /> : <Disc3 />}<span>Próxima colección</span><h2>{isPacks ? 'La apertura está preparada' : 'El tablero está listo'}</h2><p>{isPacks ? 'Aquí podrás abrir los sobres conseguidos y descubrir las láminas que contienen.' : 'La estructura del Álbum de Tazos llegará cuando estén disponibles sus diseños definitivos.'}</p></section>
  </main>;
}

export default function Albums({ onGoBack, profile, onProfileUpdate, saveData = {} }) {
  const [view, setView] = useState('selection');
  const [packImage] = useState(() => ALBUM_PACKS[Math.floor(Math.random() * ALBUM_PACKS.length)]);
  if (view === 'stickers') return <DigitalAlbum profile={profile} saveData={saveData} onProfileUpdate={onProfileUpdate} onBack={() => setView('selection')} />;
  if (view === 'tazos') return <CollectionPlaceholder type="tazos" packImage={packImage} onBack={() => setView('selection')} />;
  if (view === 'packs') return <PackOpening packImage={packImage} profile={profile} saveData={saveData} onProfileUpdate={onProfileUpdate} onBack={() => setView('selection')} />;
  return <AlbumSelection packImage={packImage} onBack={onGoBack} onOpenStickerAlbum={() => setView('stickers')} onOpenTazoAlbum={() => setView('tazos')} onOpenPacks={() => setView('packs')} />;
}
