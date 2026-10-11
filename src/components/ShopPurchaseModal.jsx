import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronLeft, Minus, Package, Plus, ShoppingCart, X } from 'lucide-react';
import { formatOfferRemaining } from '../utils/shopOffers';
import './ShopPurchaseModal.css';

const COIN_IMAGE = '/assets/items/coin.png';

export default function ShopPurchaseModal({ item, itemImage, offer, price, balance, now, onClose, onConfirm }) {
  const [isVisible, setIsVisible] = useState(false);
  const [quantityMode, setQuantityMode] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const dialogRef = useRef(null);
  const visualClass = item.id.endsWith('-ball') ? 'is-ball' : item.category === 'quiz' ? 'is-repel' : item.category === 'recovery' ? 'is-recovery' : item.id === 'album-pack' ? 'is-album-pack' : '';
  const maxQuantity = item.rewardType === 'title' ? 1 : Math.max(1, Math.min(99, Math.floor(balance / price)));
  const total = price * quantity;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsVisible(true));
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const close = () => {
    setIsVisible(false);
    window.setTimeout(onClose, 260);
  };

  const confirm = amount => {
    onConfirm(amount);
    close();
  };

  const onKeyDown = event => {
    if (event.key === 'Escape') close();
  };

  return createPortal(
    <div className={`shop-purchase-modal ${isVisible ? 'is-visible' : ''}`} role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) close(); }}>
      <section ref={dialogRef} tabIndex={-1} className={`spm-panel ${visualClass}`} role="dialog" aria-modal="true" aria-labelledby="shop-purchase-title" onKeyDown={onKeyDown}>
        <button type="button" className="spm-close" aria-label="Cerrar" onClick={close}><X /></button>
        <div className="spm-visual">
          <span className="spm-scan-ring" aria-hidden="true" />
          {itemImage ? <img src={itemImage} alt={item.name} /> : <Package aria-hidden="true" />}
          {offer && <strong className="spm-discount">-{offer.discount}%</strong>}
        </div>

        <div className="spm-copy">
          <span className="spm-kicker">Confirmación de compra</span>
          <h2 id="shop-purchase-title">{item.name}</h2>
          <p>{item.longDescription || item.description}</p>
          <div className="spm-data">
            <div><small>Precio por unidad</small><strong><img src={COIN_IMAGE} alt="" />{price.toLocaleString('es-CL')}</strong></div>
            {offer && <div><small>Promoción disponible</small><strong className="spm-time">{formatOfferRemaining(offer.endsAt, now)}</strong></div>}
          </div>

          {quantityMode && <div className="spm-quantity">
            <button type="button" aria-label="Disminuir cantidad" onClick={() => setQuantity(value => Math.max(1, value - 1))}><Minus /></button>
            <div><small>Cantidad</small><strong>{quantity}</strong></div>
            <button type="button" aria-label="Aumentar cantidad" onClick={() => setQuantity(value => Math.min(maxQuantity, value + 1))} disabled={quantity >= maxQuantity}><Plus /></button>
            <span>Total <b><img src={COIN_IMAGE} alt="" />{total.toLocaleString('es-CL')}</b></span>
          </div>}

          <div className="spm-actions">
            {!quantityMode ? <>
              <button type="button" className="spm-unit" onClick={() => confirm(1)}><ShoppingCart /> Comprar unidad</button>
              <button type="button" className="spm-primary" onClick={() => setQuantityMode(true)} disabled={maxQuantity < 2}><Package /> Elegir cantidad</button>
            </> : <>
              <button type="button" className="spm-secondary" onClick={() => setQuantityMode(false)}><ChevronLeft /> Volver</button>
              <button type="button" className="spm-primary" onClick={() => confirm(quantity)} disabled={total > balance}><Check /> Comprar x{quantity}</button>
            </>}
          </div>
        </div>
      </section>
    </div>,
    document.body,
  );
}
