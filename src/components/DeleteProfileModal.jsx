import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, ArrowLeft, Trash2, UserRound } from 'lucide-react';
import { availableSkins } from './skins';
import './DeleteProfileModal.css';

export default function DeleteProfileModal({ profile, onCancel, onConfirm }) {
  const cancelRef = useRef(null);
  const confirmRef = useRef(null);
  const dialogRef = useRef(null);
  const submittedRef = useRef(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [step, setStep] = useState(0);
  const [isFinalCheck, setIsFinalCheck] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const profileSkin = availableSkins.find(skin => skin.id === profile.skin);

  useEffect(() => {
    // Match the staged entrance of UnlockModal; clean up on early cancellation.
    const timers = [50, 280, 480, 680, 850, 1000, 1150, 1300].map((delay, index) =>
      setTimeout(() => setStep(index + 1), delay));
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    return () => {
      timers.forEach(clearTimeout);
      document.body.style.overflow = previousOverflow;
      // Wait for the selector to stop being inert before restoring keyboard focus.
      queueMicrotask(() => {
        const target = previousFocus?.isConnected ? previousFocus : document.querySelector('.aaa-profile-selection button');
        target?.focus();
      });
    };
  }, []);

  const reveal = stage => ({ 'data-revealed': step >= stage });

  useEffect(() => {
    if (step === 8) cancelRef.current?.focus({ preventScroll: true });
  }, [step]);

  const requestFinalConfirmation = () => {
    setIsFinalCheck(true);
    setIsGlitching(true);
    window.setTimeout(() => setIsGlitching(false), 560);
    window.setTimeout(() => cancelRef.current?.focus({ preventScroll: true }), 50);
  };

  const handleKeyDown = event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      onCancel();
    }
    if (event.key === 'Tab') {
      if (step < 8) {
        event.preventDefault();
        return;
      }
      if (event.shiftKey && document.activeElement === cancelRef.current) {
        event.preventDefault();
        confirmRef.current?.focus();
      } else if (!event.shiftKey && document.activeElement === confirmRef.current) {
        event.preventDefault();
        cancelRef.current?.focus();
      }
    }
  };

  // Portal keeps the confirmation outside hidden/animated screen containers.
  return createPortal(
    <div ref={dialogRef} tabIndex={-1} className="profile-delete-modal" data-step={step} data-final-check={isFinalCheck} role="alertdialog" aria-modal="true" aria-labelledby="profile-delete-title" aria-describedby="profile-delete-description" onKeyDown={handleKeyDown}>
      <div className="pdm-background" {...reveal(1)} aria-hidden="true" />
      <div className={`pdm-content ${isGlitching ? 'pdm-content--glitch' : ''}`}>
        <p className="pdm-eyebrow" {...reveal(3)}><span /><AlertTriangle size={22} aria-hidden="true" /> {isFinalCheck ? 'Confirmación final' : 'Operación irreversible'} <span /></p>
        <div className="pdm-core" {...reveal(3)}>
          <div className="pdm-orbit" aria-hidden="true" /><div className="pdm-warning-ring" aria-hidden="true" />
          <div className="pdm-portrait" {...reveal(4)}>
            {profileSkin?.iconUrl && !imageFailed ? <img src={profileSkin.iconUrl} alt={`Foto de perfil de ${profile.name}`} onError={() => setImageFailed(true)} /> : <UserRound aria-label="Foto de perfil no disponible" />}
          </div>
        </div>
        <div className="pdm-horizon" {...reveal(2)} aria-hidden="true" />
        <h1 id="profile-delete-title" {...reveal(4)}>{isFinalCheck ? <>¿Estás <span>seguro?</span></> : <>Eliminar <span>perfil</span></>}</h1>
        <div className="pdm-identity"><p className="pdm-profile-name" {...reveal(5)}>{profile.name}</p><p className="pdm-profile-details" {...reveal(6)}>{profileSkin?.name || 'Entrenador'} <span>· ID {String(profile.id).slice(-5).padStart(5, '0')}</span></p></div>
        <p id="profile-delete-description" {...reveal(7)}>{isFinalCheck ? <>Esta es la última confirmación. El perfil y todo su progreso desaparecerán definitivamente.</> : <>Se eliminarán permanentemente este perfil y su progreso guardado.<br />Esta acción no se puede deshacer.</>}</p>
        <div className="pdm-actions">
          <button ref={cancelRef} {...reveal(8)} disabled={step < 8} type="button" className="pdm-cancel" onClick={onCancel}><ArrowLeft size={18} /> {isFinalCheck ? 'Volver' : 'Cancelar'}</button>
          <button ref={confirmRef} {...reveal(8)} disabled={step < 8} type="button" className="pdm-confirm" onClick={() => {
            if (!isFinalCheck) {
              requestFinalConfirmation();
              return;
            }
            if (submittedRef.current) return;
            submittedRef.current = true;
            onConfirm();
          }}><Trash2 size={18} /> {isFinalCheck ? 'Sí, eliminar' : 'Eliminar perfil'}</button>
        </div>
      </div>
    </div>, document.body
  );
}
