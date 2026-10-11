import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Sparkles, TrendingUp, Zap } from 'lucide-react';
import CurrencyAmount from './CurrencyAmount';
import './LevelUpModal.css';

export default function LevelUpModal({ previousLevel, level, rewards, onClose }) {
  const [step, setStep] = useState(0);
  const closingRef = useRef(false);

  useEffect(() => {
    const timers = [50, 380, 760, 1080].map((delay, index) => window.setTimeout(() => setStep(index + 1), delay));
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      timers.forEach(window.clearTimeout);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const close = () => {
    if (step < 4 || closingRef.current) return;
    closingRef.current = true;
    setStep(5);
    window.setTimeout(onClose, 500);
  };

  useEffect(() => {
    const handleKeyDown = event => {
      if ((event.key === 'Enter' || event.key === 'Escape' || event.key === ' ') && step >= 4) {
        event.preventDefault();
        close();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return createPortal(
    <div className={`level-up-modal ${step >= 1 ? 'is-open' : ''} ${step === 5 ? 'is-closing' : ''}`} role="dialog" aria-modal="true" aria-labelledby="level-up-title" onClick={close}>
      <div className="lum-background" aria-hidden="true" />
      <div className={`lum-horizon ${step >= 2 ? 'is-visible' : ''}`} aria-hidden="true" />
      <section className="lum-content">
        <div className={`lum-eyebrow ${step >= 3 ? 'is-visible' : ''}`}><i /> <Sparkles /> Progreso de entrenador <i /></div>
        <div className={`lum-core ${step >= 3 ? 'is-visible' : ''}`}>
          <div className="lum-orbit" aria-hidden="true" />
          <div className="lum-level"><TrendingUp /><small>Nivel</small><strong>{level}</strong></div>
        </div>
        <div className={`lum-copy ${step >= 4 ? 'is-visible' : ''}`}>
          <h1 id="level-up-title">¡Nivel <span>alcanzado!</span></h1>
          <p>Felicitaciones, entrenador. Subiste del nivel {previousLevel} al nivel {level}.</p>
          <div className="lum-rewards" aria-label="Premios obtenidos">
            <article className="lum-money-reward"><span>Dinero</span><strong><CurrencyAmount amount={rewards.money} prefix="+" /></strong></article>
            {rewards.boostSets > 0 && <article><Zap /><span>Potenciadores</span><strong>+{rewards.boostSets} de cada tipo</strong><small>Huevo Suerte y Amuleto Moneda</small></article>}
          </div>
        </div>
      </section>
      <button type="button" className={`lum-close ${step >= 4 ? 'is-visible' : ''}`} onClick={event => { event.stopPropagation(); close(); }}><span>Continuar</span><ChevronDown /></button>
    </div>,
    document.body,
  );
}
