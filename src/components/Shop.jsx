import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, Award, Boxes, ChevronLeft, ChevronRight, CircleDot,
  HeartPulse, LayoutGrid, Medal, Package, Search, ShieldQuestion, ShoppingCart, UserRound,
} from 'lucide-react';
import { buyItem, SHOP_ITEMS } from '../utils/trainerProgress';
import { createShopOffers, getDiscountedPrice, getLocalDayKey } from '../utils/shopOffers';
import ShopPurchaseModal from './ShopPurchaseModal';
import './Shop.css';

const categories = [
  { id: 'featured', label: 'Destacados', icon: ShoppingCart, title: 'Artículos en oferta' },
  { id: 'all', label: 'Todos', icon: LayoutGrid, title: 'Todos los artículos' },
  { id: 'capture', label: 'Captura', icon: CircleDot, title: 'Sistema de reintento según rareza' },
  { id: 'quiz', label: 'Quiz', icon: ShieldQuestion, title: 'Recursos tácticos para responder' },
  { id: 'recovery', label: 'Recuperación', icon: HeartPulse, title: 'Devuelve a tus Pokémon al combate' },
  { id: 'avatars', label: 'Avatares', icon: UserRound, title: 'Imágenes para tu perfil' },
  { id: 'titles', label: 'Títulos', icon: Medal, title: 'Títulos para tu entrenador' },
  { id: 'collection', label: 'Colección', icon: Award, title: 'Productos de edición especial' },
];

const itemIcons = { capture: CircleDot, recovery: HeartPulse, quiz: ShieldQuestion, avatars: UserRound, titles: Medal, collection: Award };

const ITEM_IMAGES = Object.freeze({
  'poke-ball': '/assets/items/pokeball.png',
  'super-ball': '/assets/items/superball.png',
  'ultra-ball': '/assets/items/ultraball.png',
  'master-ball': '/assets/items/masterball.png',
  revive: '/assets/items/revivir.png',
  'super-revive': '/assets/items/superrevivir.png',
  'mega-revive': '/assets/items/megarevivir.png',
  'max-revive': '/assets/items/revivirmaximo.png',
  repel: '/assets/items/repelente.png',
  'super-repel': '/assets/items/superrepelente.png',
  'max-repel': '/assets/items/repelentemaximo.png',
});

const ALBUM_PACK_IMAGES = Object.freeze([
  '/assets/items/Sobre-abra.png',
  '/assets/items/Sobre-bellsprout.png',
  '/assets/items/Sobre-gastly.png',
  '/assets/items/Sobre-growlithe.png',
  '/assets/items/Sobre-machop.png',
  '/assets/items/Sobre-poliwag.png',
  '/assets/items/Sobre-sandshrew.png',
]);

const COIN_IMAGE = '/assets/items/coin.png';

export default function Shop({ onGoBack, profile, onProfileUpdate }) {
  const [activeCategory, setActiveCategory] = useState('featured');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(4);
  const [notice, setNotice] = useState('');
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [albumPackImage] = useState(() => ALBUM_PACK_IMAGES[Math.floor(Math.random() * ALBUM_PACK_IMAGES.length)]);
  const [now, setNow] = useState(Date.now());
  const balance = profile?.money || 0;

  useEffect(() => {
    const updatePageSize = () => {
      if (window.innerWidth <= 640) setPageSize(1);
      else if (window.innerWidth <= 1024 && window.matchMedia('(orientation: portrait)').matches) setPageSize(2);
      else setPageSize(4);
    };
    updatePageSize();
    window.addEventListener('resize', updatePageSize);
    return () => window.removeEventListener('resize', updatePageSize);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const dayKey = getLocalDayKey(now);
  const offers = useMemo(() => createShopOffers(SHOP_ITEMS, new Date(`${dayKey}T12:00:00`).getTime()), [dayKey]);
  const offerByItem = useMemo(() => new Map(offers.map(offer => [offer.itemId, offer])), [offers]);

  const activeMeta = categories.find(category => category.id === activeCategory) || categories[0];
  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery = item => `${item.name} ${item.description}`.toLowerCase().includes(normalizedQuery);
    if (activeCategory === 'featured') {
      const offeredItems = offers.map(offer => SHOP_ITEMS.find(item => item.id === offer.itemId)).filter(Boolean);
      return offeredItems.filter(matchesQuery);
    }
    if (activeCategory === 'all') {
      return SHOP_ITEMS
        .filter(item => !item.progressionOnly && matchesQuery(item))
        .sort((left, right) => {
          const leftOffer = offerByItem.get(left.id);
          const rightOffer = offerByItem.get(right.id);
          const leftPrice = left.price == null ? Number.POSITIVE_INFINITY : leftOffer ? getDiscountedPrice(left.price, leftOffer.discount) : left.price;
          const rightPrice = right.price == null ? Number.POSITIVE_INFINITY : rightOffer ? getDiscountedPrice(right.price, rightOffer.discount) : right.price;
          return leftPrice - rightPrice;
        });
    }
    return SHOP_ITEMS.filter(item => !item.progressionOnly && item.category === activeCategory && matchesQuery(item));
  }, [activeCategory, offerByItem, offers, query]);
  const pageCount = Math.max(1, Math.ceil(visibleItems.length / pageSize));
  const pageItems = visibleItems.slice(page * pageSize, (page + 1) * pageSize);

  useEffect(() => setPage(0), [activeCategory, dayKey, query, pageSize]);

  const purchase = (item, price, quantity = 1) => {
    if (!profile || !onProfileUpdate || item.price == null || item.future || balance < price * quantity) return;
    const updated = buyItem(profile, item.id, price, quantity);
    if (updated === profile) return;
    onProfileUpdate(updated);
    setNotice(item.rewardType === 'title' ? `${item.name} desbloqueado en Títulos.` : `${quantity} × ${item.name} añadido${quantity > 1 ? 's' : ''} a la mochila.`);
  };

  return (
    <main className="shop-screen">
      <div className="shop-bg" aria-hidden="true" />
      <header className="shop-header">
        <button type="button" className="shop-back" onClick={onGoBack}><ArrowLeft size={16} /><span>Volver</span></button>
        <div className="shop-brand"><span className="shop-ball"><CircleDot /></span><div><h1>Tienda</h1><p>Productos especiales</p></div></div>
        <span className="shop-balance" aria-label={`${balance} monedas`}><img src={COIN_IMAGE} alt="" /> {balance.toLocaleString('es-CL')}</span>
      </header>

      <div className="shop-layout">
        <nav className="shop-sidebar" aria-label="Categorías de la tienda">
          {categories.map(category => {
            const Icon = category.icon;
            return <button key={category.id} type="button" className={activeCategory === category.id ? 'is-active' : ''} onClick={() => setActiveCategory(category.id)}><Icon size={21} /><span>{category.label}</span></button>;
          })}
          <div className="shop-sidebar-mark" aria-hidden="true"><Boxes /><span>CAPTURA<br />PROGRESA<br />COLECCIONA</span></div>
        </nav>

        <section className="shop-catalog">
          <div className="shop-intro">
            <div className="shop-heading"><span className="shop-kicker">{activeMeta.label}</span><h2>{activeMeta.title}</h2></div>
            <label className="shop-search"><Search size={21} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar en la tienda..." /></label>
          </div>

          <div className="shop-grid">
            {pageItems.map((item, index) => {
              const Icon = itemIcons[item.category] || Package;
              const itemImage = item.id === 'album-pack' ? albumPackImage : ITEM_IMAGES[item.id];
              const offer = offerByItem.get(item.id);
              const currentPrice = offer ? getDiscountedPrice(item.price, offer.discount) : item.price;
              const visualClass = item.id.endsWith('-ball') ? 'is-ball' : item.category === 'quiz' ? 'is-repel' : item.category === 'recovery' ? 'is-recovery' : item.id === 'album-pack' ? 'is-album-pack' : '';
              const alreadyOwned = item.rewardType === 'title' && profile?.eventTitles?.some(title => title.id === item.id);
              const unavailable = !profile || currentPrice == null || item.future || balance < currentPrice || alreadyOwned;
              const status = alreadyOwned ? 'Desbloqueado' : item.future ? 'Futura implementación' : currentPrice == null ? 'Precio pendiente' : !profile ? 'Selecciona un perfil' : balance < currentPrice ? 'Saldo insuficiente' : 'Comprar';
              return <article className={`shop-product ${offer ? 'is-on-sale' : ''} ${visualClass}`} key={item.id}>
                {offer && <span className={`shop-offer-badge ${offer.kind === 'daily' ? 'is-daily' : ''}`}>-{offer.discount}%</span>}
                <span className="shop-product-id">#{String((page * pageSize) + index + 1).padStart(3, '0')}</span>
                <div className="shop-product-visual">
                  {itemImage
                    ? <img className={`shop-product-image ${item.id === 'album-pack' ? 'is-album-pack' : ''}`} src={itemImage} alt={item.name} loading="lazy" decoding="async" />
                    : <span><Icon /></span>}
                </div>
                <div className="shop-product-details">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  {currentPrice != null && !item.future && <div className="shop-product-price"><strong><img src={COIN_IMAGE} alt="" />{currentPrice.toLocaleString('es-CL')}</strong>{offer && <del>{item.price.toLocaleString('es-CL')}</del>}</div>}
                  <button type="button" disabled={unavailable} onClick={() => setSelectedPurchase({ item, itemImage, offer, price: currentPrice })}><ShoppingCart size={18} /> {status}</button>
                </div>
              </article>;
            })}
            {pageItems.length === 0 && <div className="shop-empty"><Search size={30} /><p>No hay artículos que coincidan con la búsqueda.</p></div>}
          </div>

          <div className={`shop-pagination ${pageCount <= 1 ? 'is-single-page' : ''}`}>
            <p className="shop-notice" role="status" aria-live="polite">{notice}</p>
            {pageCount > 1 && <><div className="shop-page-lines" aria-hidden="true">{Array.from({ length: Math.min(3, pageCount) }, (_, index) => <span key={index} className={Math.min(page, 2) === index ? 'is-active' : ''} />)}</div>
              <button type="button" aria-label="Página anterior" disabled={page === 0} onClick={() => setPage(value => Math.max(0, value - 1))}><ChevronLeft /></button>
              <button type="button" aria-label="Página siguiente" disabled={page >= pageCount - 1} onClick={() => setPage(value => Math.min(pageCount - 1, value + 1))}><ChevronRight /></button></>}
          </div>
        </section>
      </div>
      <footer className="shop-footer"><span>Pokémon Kanto</span><span>Región Kanto ///</span></footer>
      {selectedPurchase && <ShopPurchaseModal {...selectedPurchase} balance={balance} now={now} onClose={() => setSelectedPurchase(null)} onConfirm={quantity => purchase(selectedPurchase.item, selectedPurchase.price, quantity)} />}
    </main>
  );
}
