import React, { useState } from 'react';
import { Lock, ArrowLeft, User, ChevronRight } from 'lucide-react';
import { availableSkins } from './skins'; 

const CharacterCreation = ({ onProfileCreate, onGoBack }) => {
  const [profileName, setProfileName] = useState('');
  const [selectedSkin, setSelectedSkin] = useState(availableSkins.find(s => !s.locked));

  const handleBackAndReset = () => {
    setProfileName(''); 
    setSelectedSkin(availableSkins.find(s => !s.locked)); 
    onGoBack(); 
  };

  const handleStartGame = () => {
    if (profileName.trim()) {
      onProfileCreate(profileName.trim(), selectedSkin.id);
      setProfileName('');
      setSelectedSkin(availableSkins.find(s => !s.locked));
    }
  };

  return (
    <div className="w-screen h-screen flex bg-[#0f172a] text-white overflow-hidden font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* --- 1. FONDOS GLOBALES (UNIFORMIDAD) --- */}
      
      {/* A. Fibra de Carbono */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0"></div>
      
      {/* B. MALLA TECNOLÓGICA (High Visibility) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.10)_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none"></div>

      {/* C. Degradado Ambiental */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-[#0f172a] to-slate-900 z-0 pointer-events-none"></div>
      
      {/* D. Decoración inferior */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"></div>


      {/* --- 2. BOTÓN SUPERIOR IZQUIERDO (ESTANDARIZADO) --- */}
      <div className="absolute top-6 left-8 z-50">
          <button 
            onClick={handleBackAndReset} 
            className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-700 text-slate-200 hover:text-white px-5 py-2.5 rounded-tl-xl rounded-br-xl border-l-4 border-cyan-500 shadow-lg backdrop-blur-md text-xs font-bold tracking-widest uppercase transition-all transform hover:translate-x-1"
          >
            <ArrowLeft size={16} /> Cancelar
          </button>
      </div>


      {/* --- 3. PANEL IZQUIERDO (SELECTOR) --- */}
      <div className="relative z-20 w-[400px] bg-slate-900/95 h-full border-r border-slate-700 flex flex-col shadow-2xl pt-24"> 
        
        <div className="px-8 mb-4">
            <h2 className="text-xl font-black italic text-white tracking-tighter uppercase flex items-center gap-3">
                <User size={20} className="text-cyan-400" />
                Seleccionar Avatar
            </h2>
            <div className="h-px w-full bg-gradient-to-r from-cyan-500/50 to-transparent mt-2"></div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
          <div className="grid grid-cols-2 gap-3">
            {availableSkins.map(skin => (
              <div 
                key={skin.id}
                onClick={() => !skin.locked && setSelectedSkin(skin)}
                className={`
                    group relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200
                    ${selectedSkin.id === skin.id 
                        ? 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] ring-1 ring-cyan-500/50' 
                        : 'border-slate-700 hover:border-slate-500 opacity-60 hover:opacity-100'}
                    ${skin.locked ? 'grayscale cursor-not-allowed opacity-40' : ''}
                `}
              >
                <img src={skin.iconUrl} alt={skin.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                
                {skin.locked && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-[2px]">
                    <Lock className="w-6 h-6 text-slate-500" />
                  </div>
                )}
                
                <div className={`
                    absolute bottom-0 left-0 right-0 p-1 text-center transition-colors
                    ${selectedSkin.id === skin.id ? 'bg-cyan-900/90' : 'bg-black/80'}
                `}>
                  <span className={`text-[8px] font-bold uppercase tracking-widest block ${selectedSkin.id === skin.id ? 'text-cyan-100' : 'text-slate-400'}`}>
                    {skin.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* --- 4. PANEL DERECHO (VISUALIZACIÓN) --- */}
      <div className="flex-1 relative flex items-center justify-center z-10 overflow-hidden">
        
        {/* A. Luz ambiental tras personaje (Mejorada para dar profundidad sin usar drop-shadow en la img) */}
        {/* Hacemos un doble brillo: uno central intenso y uno difuso exterior */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none"></div>
        
        {/* B. IMAGEN DEL PERSONAJE */}
        <img 
          src={selectedSkin.imageUrl} 
          alt={selectedSkin.name}
          /* 
             CORRECCIONES:
             1. Quitamos 'drop-shadow-...' para eliminar el borde cuadrado.
             2. Añadimos 'select-none' y 'pointer-events-none' para evitar arrastres o bordes de selección.
          */
          className="h-[85vh] object-contain z-20 relative -left-10 select-none pointer-events-none animate-fade-in-up" 
          style={{ 
            /* La máscara crea el desvanecimiento en los pies */
            maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
            /* IMPORTANTE: Evita que la máscara se repita y cree líneas horizontales */
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat'
          }}
        />

        {/* --- UI FLOTANTE DERECHA (FORMULARIO) --- */}
        <div className="absolute top-0 right-0 bottom-0 w-96 p-12 flex flex-col justify-center items-end z-30 pointer-events-none">
            
            {/* --- INPUT GROUP --- */}
            <div className="pointer-events-auto mb-8 flex flex-col items-end gap-2 group w-full">
                
                {/* Header del Input */}
                <div className="flex items-center gap-2 opacity-80 group-focus-within:opacity-100 transition-opacity">
                    <div className="h-px w-8 bg-cyan-500/50 shadow-[0_0_5px_rgba(6,182,212,0.5)]"></div>
                    <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.2em] drop-shadow-md">
                        Identificación
                    </label>
                </div>
                
                {/* Contenedor del Input (Tamaño original restaurado) */}
                <div className="relative w-full transition-transform duration-300 group-focus-within:translate-x-[-5px]">
                    <input 
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value.toUpperCase())}
                        placeholder="NOMBRE"
                        maxLength={12}
                        className="w-full bg-slate-900/90 border border-slate-600 focus:border-cyan-400 text-white text-2xl font-black italic uppercase text-right px-4 py-3 rounded-lg outline-none shadow-xl transition-all placeholder:text-slate-700 focus:shadow-[0_0_20px_rgba(34,211,238,0.15)] backdrop-blur-sm"
                        autoFocus
                    />
                    
                    {/* Decoración esquinas */}
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-cyan-500 opacity-0 group-focus-within:opacity-100 transition-all duration-300"></div>
                    <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-cyan-500 opacity-0 group-focus-within:opacity-100 transition-all duration-300"></div>
                </div>
                
                {/* Contador */}
                <p className="text-[9px] text-slate-500 font-mono text-right tracking-wider">
                    {profileName.length}/12 CHARS
                </p>
            </div>

            {/* --- BOTÓN CONFIRMAR --- */}
            <div className="pointer-events-auto h-14 flex items-center justify-end w-full">
                <button
                    onClick={handleStartGame}
                    disabled={!profileName.trim()}
                    className={`
                        group relative px-8 py-3 rounded-tr-xl rounded-bl-xl border-r-4 shadow-lg transition-all duration-300 overflow-hidden
                        ${!profileName.trim() 
                            ? 'bg-slate-800/80 border-slate-600 text-slate-600 cursor-not-allowed grayscale' 
                            : 'bg-gradient-to-l from-cyan-700 to-blue-700 text-white border-cyan-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] active:scale-95'}
                    `}
                >
                    <div className="flex items-center gap-2 relative z-10">
                        <span className="text-sm font-black italic uppercase tracking-widest">
                            Confirmar
                        </span>
                        <ChevronRight size={18} className={`transition-transform duration-300 ${profileName.trim() ? 'group-hover:translate-x-1' : ''}`} />
                    </div>
                    
                    {/* Brillo "Shine" */}
                    {profileName.trim() && (
                        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                    )}
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};

export default CharacterCreation;