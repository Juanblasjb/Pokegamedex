import { useMemo, useState } from 'react';
import { ArrowLeft, Award, Backpack, ChevronRight, CircleDot, Pencil, Shirt, Trophy, UsersRound } from 'lucide-react';
import TrainerEditor from './TrainerEditor';
import ProfileImageSelector from './ProfileImageSelector';
import CurrencyAmount from './CurrencyAmount';
import { getLevelProgress, getTitles } from '../utils/trainerProgress';
import { normalizeSaveData } from '../utils/captureSystem';
import './TrainerProfile.css';

const PROFILE_OPTIONS = [
  { id: 'wardrobe', label: 'Vestuario', caption: 'Personaliza tu apariencia', icon: Shirt },
  { id: 'titles', label: 'Títulos', caption: 'Demuestra tu historia', icon: Award },
  { id: 'achievements', label: 'Logros', caption: 'Desafíos completados', icon: Trophy },
  { id: 'bag', label: 'Mochila', caption: 'Objetos y recursos', icon: Backpack },
  { id: 'team', label: 'Mi equipo', caption: 'Gestiona tus seis Pokémon', icon: UsersRound },
  { id: 'captures', label: 'Registro de capturas', caption: 'Tu historia de Pokémon', icon: CircleDot },
];

export default function TrainerProfile({ profile, capturedData, onGoBack, onProfileUpdate, onSaveDataUpdate }) {
  const [activePanel, setActivePanel] = useState(null);
  const safeCapturedData = useMemo(() => normalizeSaveData(capturedData || {}), [capturedData]);
  const equippedTitle = getTitles(profile, safeCapturedData).find(title => title.id === profile.titleId && title.unlocked);
  const progress = getLevelProgress(profile.experience);
  const profileImageSpeciesId = Number(String(profile.profileImage || 'normal-25').split('-').at(-1)) || 25;

  return (
    <main className="trainer-profile-screen">
      <div className="tp-background" aria-hidden="true" />

      <header className="tp-header">
        <button type="button" className="tp-menu-button" onClick={onGoBack}><ArrowLeft size={16} /><span>Volver</span></button>
        <div className="tp-page-title"><h1>Mi <span>perfil</span></h1><p>Entrenador Pokémon</p></div>
        <div className="tp-balance"><CurrencyAmount amount={profile.money} /></div>
      </header>

      <div className="tp-content">
        <section className="tp-hero" aria-labelledby="trainer-profile-name">
          <div className="tp-portrait-column">
            <div className="tp-portrait-radar" aria-hidden="true" />
            <div className="tp-portrait-frame">
              <span className="tp-portrait-clip"><img className="tp-profile-pokemon" src={`/assets/pokemon/normal/${profileImageSpeciesId}.png`} alt={`Imagen de perfil de ${profile.name}`} /></span>
              <button type="button" className="tp-portrait-edit" onClick={() => setActivePanel('profile-image')} aria-label="Editar imagen de perfil" title="Editar imagen de perfil"><Pencil /></button>
            </div>
          </div>

          <div className="tp-identity">
            <p className="tp-eyebrow">Entrenador</p>
            <div className="tp-name-line">
              <h2 id="trainer-profile-name">{profile.name}</h2>
              <button type="button" className="tp-name-edit" onClick={() => setActivePanel('rename')} aria-label="Editar nombre" title="Editar nombre"><Pencil /></button>
            </div>
            <div className="tp-title-chip">{equippedTitle?.name || 'Entrenador principiante'}</div>

            <div className="tp-level-row">
              <div className="tp-level"><span>Nivel</span><strong>{progress.level}</strong></div>
              <span className="tp-level-divider" aria-hidden="true" />
              <div className="tp-experience">
                <div><span>Experiencia</span><strong>{progress.level === 100 ? 'NIVEL MÁXIMO' : `${progress.current.toLocaleString('es-CL')} / ${progress.target.toLocaleString('es-CL')} EXP`}</strong></div>
                <div className="tp-progress-track" role="progressbar" aria-label="Experiencia del entrenador" aria-valuemin="0" aria-valuemax={Math.max(1, progress.target)} aria-valuenow={progress.current}><span style={{ width: `${progress.percent}%` }} /></div>
                <small>{progress.level === 100 ? `${progress.total.toLocaleString('es-CL')} EXP acumulada` : `Siguiente nivel: ${progress.remaining.toLocaleString('es-CL')} EXP`}</small>
              </div>
            </div>
          </div>

          <div className="tp-hero-art" aria-hidden="true">
            <img src="/assets/pokemon/normal/150.png" alt="" />
            <p>“Un verdadero entrenador<br />nunca deja de explorar”</p>
          </div>
        </section>

        <nav className="tp-options" aria-label="Opciones de Mi perfil">
          {PROFILE_OPTIONS.map(option => {
            const Icon = option.icon;
            return <button type="button" key={option.id} onClick={() => setActivePanel(option.id)}>
              <Icon className="tp-option-icon" aria-hidden="true" />
              <span><strong>{option.label}</strong><small>{option.caption}</small></span>
              <Icon className="tp-option-art" aria-hidden="true" />
              <ChevronRight className="tp-option-arrow" aria-hidden="true" />
            </button>;
          })}
        </nav>
      </div>

      <footer className="tp-footer" aria-hidden="true"><span>Pokémon Kanto</span><span>Perfil de entrenador ///</span></footer>

      {activePanel === 'profile-image' && <ProfileImageSelector profile={profile} data={safeCapturedData} onUpdate={onProfileUpdate} onClose={() => setActivePanel(null)} onMenu={onGoBack} />}
      {activePanel && activePanel !== 'profile-image' && <TrainerEditor key={activePanel} initialView={activePanel} profile={profile} data={safeCapturedData} onUpdate={onProfileUpdate} onDataUpdate={onSaveDataUpdate} onClose={() => setActivePanel(null)} />}
    </main>
  );
}
