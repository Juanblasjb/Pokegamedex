import React, { useState } from 'react';
import { availableSkins } from './skins';
import { Star, ArrowLeft, Trash2, X, Plus } from 'lucide-react';

const ProfileSelection = ({ 
  profiles = [], 
  onSelectProfile, 
  onNavigateToCreation, 
  onGoBack, 
  onDeleteProfile,
  allowCreation = true 
}) => {
  const safeProfiles = Array.isArray(profiles) ? profiles : [];
  const MAX_PROFILES = 8; 
  const canCreateMore = safeProfiles.length < MAX_PROFILES && allowCreation;
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  // --- ESTILOS DE BOTONES ---
  const topButtonStyleLeft = "pointer-events-auto flex items-center gap-2 bg-slate-900/90 hover:bg-slate-700 text-slate-200 hover:text-white px-5 py-2.5 rounded-tl-xl rounded-br-xl border-l-4 border-cyan-500 shadow-lg backdrop-blur-md text-xs font-bold tracking-widest uppercase transition-all transform hover:translate-x-1";
  const topButtonStyleRight = "pointer-events-auto flex items-center gap-2 px-5 py-2.5 rounded-tr-xl rounded-bl-xl border-r-4 shadow-lg backdrop-blur-md text-xs font-bold tracking-widest uppercase transition-all transform hover:-translate-x-1";

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#0f172a] text-white relative selection:bg-cyan-500 selection:text-white font-sans overflow-x-hidden">
      
      {/* --- 1. FONDOS GLOBALES (Fixed) --- */}
      
      {/* A. Fibra de Carbono */}
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0 pointer-events-none"></div>
      
      {/* B. MALLA TECNOLÓGICA */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(6,182,212,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.10)_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none"></div>

      {/* C. Degradado Ambiental */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-[#0f172a] to-slate-900 z-0 pointer-events-none"></div>
      
      {/* D. Decoración lateral */}
      <div className="fixed top-0 right-0 w-2/3 h-full bg-gradient-to-l from-cyan-900/10 to-transparent skew-x-[-12deg] z-0 pointer-events-none origin-bottom"></div>

      {/* E. Decoración inferior */}
      <div className="fixed bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"></div>


      {/* --- 2. CABECERA --- */}
      <div className="fixed top-6 left-0 w-full px-8 z-50 flex justify-between pointer-events-none">
          <button onClick={() => { setIsDeleteMode(false); onGoBack(); }} className={topButtonStyleLeft}>
            <ArrowLeft size={16} /> Menú
          </button>

          {safeProfiles.length > 0 && (
            <button 
              onClick={() => setIsDeleteMode(!isDeleteMode)} 
              className={`${topButtonStyleRight} ${isDeleteMode 
                    ? 'bg-red-900/90 text-white border-red-500 animate-pulse' 
                    : 'bg-slate-900/90 hover:bg-slate-700 text-slate-200 hover:text-white border-red-600'
                }`}
            >
              <span>{isDeleteMode ? 'Cancelar' : 'Borrar'}</span>
              {isDeleteMode ? <X size={16} /> : <Trash2 size={16} />}
            </button>
          )}
      </div>

      {/* --- 3. CONTENEDOR PRINCIPAL --- */}
      <div className="relative z-10 w-full max-w-[1800px] px-8 md:px-16 pt-28 pb-20 flex flex-col items-center">
        
        {/* TÍTULO */}
        <div className="mb-12 text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter drop-shadow-2xl text-white">
                {isDeleteMode ? <span className="text-red-500">ZONA DE PELIGRO</span> : "SELECCIONAR PERFIL"}
            </h1>
            <div className="flex items-center justify-center gap-3">
                <div className={`h-0.5 w-10 rounded-full ${isDeleteMode ? 'bg-red-500' : 'bg-cyan-500'}`}></div>
                <span className="text-xs font-mono text-slate-400 tracking-widest">
                    SLOTS: {safeProfiles.length} / {MAX_PROFILES}
                </span>
                <div className={`h-0.5 w-10 rounded-full ${isDeleteMode ? 'bg-red-500' : 'bg-cyan-500'}`}></div>
            </div>
        </div>
      
        {/* GRID DE TARJETAS (AUMENTADO EL GAP AQUÍ) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 xl:gap-14 w-full place-items-center">
            
            {/* TARJETA CREAR */}
            {!isDeleteMode && canCreateMore && (
            <button 
                onClick={onNavigateToCreation}
                className="group relative aspect-[3/4] w-full max-w-[260px] bg-slate-800/20 rounded-lg p-[6px] border-2 border-dashed border-slate-600 hover:border-cyan-400 hover:bg-slate-800/40 transition-all duration-500 hover:-translate-y-2 shadow-lg overflow-hidden backdrop-blur-sm"
            >
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 group-hover:text-cyan-400 transition-colors duration-300">
                    <div className="
                        w-16 h-16 rounded-full border-2 border-dashed border-current 
                        flex items-center justify-center mb-4
                        transition-all duration-500 ease-out
                        group-hover:scale-110 group-hover:rotate-180 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]
                        bg-slate-900/50
                    ">
                        <Plus strokeWidth={1.5} size={32} className="transition-transform duration-500" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] group-hover:tracking-[0.25em] transition-all duration-300">
                        Crear Nueva ID
                    </span>
                </div>
            </button>
            )}

            {/* TARJETAS DE PERFIL */}
            {safeProfiles.map((profile) => {
            const profileSkin = availableSkins.find(s => s.id === profile.skin);
            const iconUrl = profileSkin ? profileSkin.iconUrl : null; 
            const rarityStars = profileSkin?.rarity || 1; 
            const formattedId = String(profile.id).slice(-5).padStart(5, '0');
            
            const cardBg = isDeleteMode ? 'bg-red-950' : 'bg-slate-800';
            const borderColor = isDeleteMode ? 'border-red-600' : 'border-slate-600 group-hover:border-cyan-500';
            const accentColor = isDeleteMode ? 'text-red-500' : 'text-cyan-400';
            const shadowColor = isDeleteMode ? 'shadow-red-900/50' : 'shadow-cyan-900/50';

            return (
                <button 
                key={profile.id}
                onClick={() => {
                    if (isDeleteMode) {
                        if (window.confirm(`¿Eliminar permanentemente a ${profile.name}?`)) {
                            onDeleteProfile(profile.id);
                            if (safeProfiles.length <= 1) setIsDeleteMode(false);
                        }
                    } else {
                        onSelectProfile && onSelectProfile(profile);
                    }
                }}
                className={`
                    group relative aspect-[3/4] w-full max-w-[260px] rounded-lg p-[6px] 
                    border ${borderColor} ${cardBg}
                    shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden
                    hover:${shadowColor}
                `}
                >
                    {/* 1. HEADER */}
                    <div className="absolute top-0 left-0 w-full h-[45px] flex items-center px-4 z-20">
                        <h3 className={`text-[9px] font-black italic uppercase tracking-widest ${accentColor} drop-shadow-md`}>
                            {profileSkin ? profileSkin.name : 'ENTRENADOR'}
                        </h3>
                    </div>

                    {/* 2. PANTALLA CENTRAL */}
                    <div 
                        className="absolute left-[6px] right-[6px] bg-[#050505] z-10 overflow-hidden border-r border-l border-slate-800"
                        style={{ 
                            clipPath: 'polygon(0 0, 65% 0, 100% 15%, 100% 82%, 75% 100%, 0 100%)',
                            top: '45px',    
                            bottom: '55px'  
                        }}
                    >
                         <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                         
                         <div className="relative w-full h-full flex items-end justify-center pb-0">
                            <div className={`absolute bottom-0 w-full h-2/3 bg-gradient-to-t ${isDeleteMode ? 'from-red-900/60' : 'from-[#0f172a]'} to-transparent opacity-80`}></div>
                            
                            {iconUrl ? (
                                <img 
                                    src={iconUrl} 
                                    alt="Skin" 
                                    className={`h-[92%] w-auto object-contain drop-shadow-2xl filter transition-all duration-500 ${isDeleteMode ? 'grayscale contrast-125' : 'group-hover:scale-105'}`} 
                                />
                            ) : (
                                <span className="text-6xl text-slate-800">?</span>
                            )}
                         </div>
                    </div>

                    {/* 3. ID BOX */}
                    <div className="absolute bottom-[50px] right-0 z-20">
                        <div className={`bg-[#020617] px-2 py-0.5 rounded-l-md border-l-2 border-t border-b ${isDeleteMode ? 'border-red-500' : 'border-cyan-500'} flex items-center gap-2 shadow-lg`}>
                            <span className="text-[7px] font-bold text-slate-500 uppercase tracking-wide">ID</span>
                            <span className={`text-xs font-mono font-bold ${isDeleteMode ? 'text-red-400' : 'text-cyan-400'}`}>
                                {formattedId}
                            </span>
                        </div>
                    </div>

                    {/* 4. FOOTER */}
                    <div className="absolute bottom-0 left-0 w-full h-[55px] flex flex-col justify-center px-4 z-20">
                        <div className="flex gap-0.5 mb-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star 
                                    key={i} 
                                    size={8}
                                    fill={i < rarityStars ? "currentColor" : "none"}
                                    className={i < rarityStars ? "text-yellow-400" : "text-slate-700"}
                                />
                            ))}
                        </div>
                        <h2 className="text-xl font-black italic uppercase tracking-tighter text-white drop-shadow-md truncate w-full pb-0.5">
                            {profile.name}
                        </h2>
                    </div>
                    
                    <div className={`absolute bottom-2 right-2 w-1 h-1 rounded-full ${isDeleteMode ? 'bg-red-500 animate-ping' : 'bg-cyan-500'}`}></div>
                </button>
            );
            })}

            {/* Relleno Fantasma */}
            {!isDeleteMode && Array.from({ length: Math.max(0, MAX_PROFILES - safeProfiles.length - (canCreateMore ? 1 : 0)) }).map((_, i) => (
                 <div key={`phantom-${i}`} className="hidden lg:block aspect-[3/4] w-full max-w-[260px] rounded-lg border border-slate-800/50 bg-slate-900/20 backdrop-blur-sm"></div>
            ))}

        </div>
      </div>
    </div>
  );
};

export default ProfileSelection;