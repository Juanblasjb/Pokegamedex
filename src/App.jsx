import React, { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import ProfileSelection from './components/ProfileSelection';
import CharacterCreation from './components/CharacterCreation';
import PokemonQuiz from './PokemonQuiz';
import LoadingScreen from './components/LoadingScreen';
import TrainerCard from './components/TrainerCard';
import GameModeSelection from './components/GameModeSelection';
import GymSelection from './components/GymSelection';
import PokedexModeSelection from './components/PokedexModeSelection';
import PokemonQuizHard from './components/PokemonQuizHard';
import UnlockModal from './components/UnlockModal'; 
import GymBattle from './components/GymBattle';
import UnlockRocketModal from './components/UnlockRocketModal';

function App() {
  // --- ESTADOS DE NAVEGACIÓN Y SISTEMA ---
  const [activeView, setActiveView] = useState('menu');
  const [gameId, setGameId] = useState(0);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [isCreatingMode, setIsCreatingMode] = useState(true);
  const [selectedGameMode, setSelectedGameMode] = useState('pokedex');  
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showRocketUnlockModal, setShowRocketUnlockModal] = useState(false);
  
  // Nuevo estado para controlar qué gimnasio se seleccionó
  const [selectedGymId, setSelectedGymId] = useState(null);
  
  // --- ESTADO DE DATOS ---
  const [currentSaveData, setCurrentSaveData] = useState({});

  const [profiles, setProfiles] = useState(() => {
    const savedProfiles = localStorage.getItem('pokemonQuizProfiles');
    return savedProfiles ? JSON.parse(savedProfiles) : [];
  });
  const hasSaveData = profiles.length > 0;

  // --- LÓGICA DE DESBLOQUEO ---
  const handleGameCapture = (totalCaptures) => {
    const newSaveData = JSON.parse(localStorage.getItem('pokemonQuizSaveData') || '{}');
    setCurrentSaveData(newSaveData);

    if (currentProfile && !currentProfile.gymUnlocked && totalCaptures >= 5) {
        setShowUnlockModal(true);
        const updatedProfile = { ...currentProfile, gymUnlocked: true };
        setCurrentProfile(updatedProfile);
        
        const updatedProfilesList = profiles.map(p => 
            p.id === updatedProfile.id ? updatedProfile : p
        );
        setProfiles(updatedProfilesList);
        localStorage.setItem('pokemonQuizProfiles', JSON.stringify(updatedProfilesList));
    }

  if (currentProfile && !currentProfile.rocketUnlocked && totalCaptures >= 15) {
        setShowRocketUnlockModal(true); // Modal Rojo (Rocket)
        const updatedProfile = { ...currentProfile, rocketUnlocked: true };
        setCurrentProfile(updatedProfile);
        
        const updatedProfilesList = profiles.map(p => 
            p.id === updatedProfile.id ? updatedProfile : p
        );
        setProfiles(updatedProfilesList);
        localStorage.setItem('pokemonQuizProfiles', JSON.stringify(updatedProfilesList));
    }
  };

  // Auto-guardado
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentProfile) {
        const currentProgress = localStorage.getItem('pokemonQuizSaveData');
        if (currentProgress) localStorage.setItem(`save_file_${currentProfile.id}`, currentProgress);
        
        if (sessionStartTime) {
            const now = Date.now();
            const duration = now - sessionStartTime;
            const savedProfiles = JSON.parse(localStorage.getItem('pokemonQuizProfiles') || '[]');
            const updatedProfiles = savedProfiles.map(p => {
                if (p.id === currentProfile.id) return { ...p, playTime: (p.playTime || 0) + duration };
                return p;
            });
            localStorage.setItem('pokemonQuizProfiles', JSON.stringify(updatedProfiles));
        }
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentProfile, sessionStartTime]);

  const navigateTo = (view) => setActiveView(view);

  const startGame = (mode = 'pokedex') => {
    setSelectedGameMode(mode);
    setGameId((prevId) => prevId + 1);
    setSessionStartTime(Date.now());
    setActiveView('loading');
    setTimeout(() => {
      if (mode === 'pokedex') setActiveView('pokedex');
      else if (mode === 'pokedex_hard') setActiveView('pokedex_hard');
      else if (mode === 'gym') setActiveView('gym_map');
      else { alert("Modo en construcción"); setActiveView('game_mode_selection'); }
    }, 4000);
  };

  const updateProfilePlayTime = () => {
    if (currentProfile && sessionStartTime) {
      const now = Date.now();
      const sessionDuration = now - sessionStartTime;
      const updatedProfile = { ...currentProfile, playTime: (currentProfile.playTime || 0) + sessionDuration };
      setCurrentProfile(updatedProfile);
      const updatedProfilesList = profiles.map(p => p.id === updatedProfile.id ? updatedProfile : p);
      setProfiles(updatedProfilesList);
      localStorage.setItem('pokemonQuizProfiles', JSON.stringify(updatedProfilesList));
      setSessionStartTime(null); 
    }
  };

  const handleUpdateProfile = (updatedProfile) => {
    const newProfilesList = profiles.map(p => p.id === updatedProfile.id ? updatedProfile : p);
    setProfiles(newProfilesList);
    localStorage.setItem('pokemonQuizProfiles', JSON.stringify(newProfilesList));
    setCurrentProfile(updatedProfile);
  };

  // --- HANDLERS DE MENÚ ---
  const handleGoToNewGame = () => { setIsCreatingMode(true); navigateTo('profile_selection'); };
  const handleGoToContinue = () => { setIsCreatingMode(false); navigateTo('profile_selection'); };
  
  const handleOpenTrainerCard = () => {
    // 1. Si ya tenemos un perfil cargado (ej: acabamos de crearlo), úsalo directo.
    if (currentProfile) {
        navigateTo('trainer_card');
        return;
    }

    // 2. Si no (ej: venimos desde el menú principal sin seleccionar), búscalo.
    if (profiles.length > 0) {
      const lastActiveId = localStorage.getItem('lastActiveProfileId');
      let targetProfile = profiles.find(p => p.id == lastActiveId) || profiles[profiles.length - 1];
      
      const savedDataStr = localStorage.getItem(`save_file_${targetProfile.id}`);
      const savedData = savedDataStr ? JSON.parse(savedDataStr) : {};
      
      setCurrentProfile(targetProfile);
      setCurrentSaveData(savedData);
      localStorage.setItem('pokemonQuizSaveData', JSON.stringify(savedData));
      
      navigateTo('trainer_card');
    }
  };

  // --- GESTIÓN DE PERFILES ---
  const handleCreateProfile = (profileName, skinId) => {
    if (profiles.length >= 8) return;
    
    // CORRECCIÓN: Inicializamos 'team' como array vacío
    const newProfile = { 
        id: Date.now(), 
        name: profileName, 
        skin: skinId, 
        startDate: Date.now(), 
        companion: null, 
        playTime: 0, 
        gymProgress: 0, 
        eliteProgress: 0, 
        gymUnlocked: false,
        team: [] // <--- ESTO FALTABA
    };

    const updatedProfiles = [...profiles, newProfile];
    
    setProfiles(updatedProfiles);
    localStorage.setItem('pokemonQuizProfiles', JSON.stringify(updatedProfiles));
    
    localStorage.setItem('pokemonQuizSaveData', '{}');
    setCurrentSaveData({});
    
    setCurrentProfile(newProfile);
    localStorage.setItem('lastActiveProfileId', newProfile.id);
    navigateTo('game_mode_selection'); 
  };

  const handleDeleteProfile = (profileId) => {
    const updatedProfiles = profiles.filter(p => p.id !== profileId);
    setProfiles(updatedProfiles);
    localStorage.setItem('pokemonQuizProfiles', JSON.stringify(updatedProfiles));
    localStorage.removeItem(`save_file_${profileId}`);
  };

  const handleSelectProfile = (profile) => {
    if (isCreatingMode) {
      if (window.confirm(`¿Reiniciar aventura de ${profile.name}?`)) {
        // CORRECCIÓN: Al reiniciar también reseteamos el team
        const resetProfile = { ...profile, playTime: 0, startDate: Date.now(), companion: null, gymProgress: 0, gymUnlocked: false, team: [] };
        const updatedProfiles = profiles.map(p => p.id === profile.id ? resetProfile : p);
        
        setProfiles(updatedProfiles);
        localStorage.setItem('pokemonQuizProfiles', JSON.stringify(updatedProfiles));
        localStorage.removeItem(`save_file_${profile.id}`);
        
        localStorage.setItem('pokemonQuizSaveData', '{}');
        setCurrentSaveData({}); 

        setCurrentProfile(resetProfile);
        localStorage.setItem('lastActiveProfileId', resetProfile.id);
        navigateTo('game_mode_selection');
      }
    } else {
      setCurrentProfile(profile);
      localStorage.setItem('lastActiveProfileId', profile.id);
      
      const specificSaveDataStr = localStorage.getItem(`save_file_${profile.id}`);
      const specificSaveData = specificSaveDataStr ? JSON.parse(specificSaveDataStr) : {};
      
      localStorage.setItem('pokemonQuizSaveData', JSON.stringify(specificSaveData));
      setCurrentSaveData(specificSaveData); 
      
      navigateTo('game_mode_selection');
    }
  };

  const handleExitGame = () => {
    if (currentProfile) {
      const currentProgress = localStorage.getItem('pokemonQuizSaveData');
      if (currentProgress) {
          localStorage.setItem(`save_file_${currentProfile.id}`, currentProgress);
          setCurrentSaveData(JSON.parse(currentProgress));
      }
      updateProfilePlayTime(); 
    }
    setCurrentProfile(null);
    navigateTo('menu');
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
       
       {showUnlockModal && (
          <UnlockModal onClose={() => setShowUnlockModal(false)} />
       )}

       {/* NUEVO MODAL ROCKET */}
       {showRocketUnlockModal && (
          <UnlockRocketModal onClose={() => setShowRocketUnlockModal(false)} />
       )}

       <div className={`screen ${activeView === "menu" ? "visible" : "hidden"}`}><MainMenu onNewGame={handleGoToNewGame} onContinueGame={handleGoToContinue} onOpenTrainerCard={handleOpenTrainerCard} hasSaveData={hasSaveData} /></div>
       
       <div className={`screen ${activeView === "game_mode_selection" ? "visible" : "hidden"}`}>
        {currentProfile && (
            <GameModeSelection 
                key={currentProfile.id} 
                profile={currentProfile}
                capturedData={currentSaveData}
                onStartMode={(mode) => { if (mode === 'pokedex_difficulty_select') navigateTo('pokedex_difficulty'); else startGame(mode); }}
                onBack={() => navigateTo('profile_selection')}
                onGoToMenu={() => { setCurrentProfile(null); navigateTo('menu'); }}
            />
        )}
      </div>

      <div className={`screen ${activeView === "pokedex_difficulty" ? "visible" : "hidden"}`}>
        <PokedexModeSelection 
            capturedData={currentSaveData}
            onBack={() => navigateTo('game_mode_selection')} 
            onSelectMode={(difficulty) => { if (difficulty === 'hard') startGame('pokedex_hard'); else startGame('pokedex'); }} 
        />
      </div>
      
      <div className={`screen ${activeView === "gym_map" ? "visible" : "hidden"}`}>
        {currentProfile && (
          <GymSelection 
            key={currentProfile.id}
            profile={currentProfile} 
            capturedData={currentSaveData} 
            onBack={() => navigateTo('game_mode_selection')} 
            
            onEnterGym={(gymId) => { 
                // --- VALIDACIÓN DE EQUIPO ---
                const userTeam = currentProfile.team || [];

                // Verificamos que tenga al menos 3 Pokémon (necesarios para la Fase 2: Estadio)
                if (userTeam.length < 3) {
                   alert("⚠️ ACCESO DENEGADO AL GIMNASIO\n\nNo puedes desafiar al Líder sin un equipo preparado.\n\nPor favor, ve a tu 'Ficha de Entrenador' y selecciona al menos 3 Pokémon en 'MI EQUIPO'.");
                   return; // Detiene la entrada al gimnasio
                }
                
                // Si cumple la condición, entra
                setSelectedGymId(gymId);
                setActiveView('gym_battle'); 
            }} 
          />
        )}
      </div>

      {/* --- VISTA: BATALLA DE GIMNASIO --- */}
      <div className={`screen ${activeView === "gym_battle" ? "visible" : "hidden"}`}>
        {currentProfile && selectedGymId && activeView === 'gym_battle' && (
            <GymBattle 
                gymId={selectedGymId}
                // Pasamos el equipo, si es undefined pasamos array vacío
                userName={currentProfile.name}
                userTeam={currentProfile.team || []} 
                
                onVictory={() => {
                    const currentProgress = currentProfile.gymProgress || 0;
                    const newProgress = currentProgress + 1;
                    
                    const updatedProfile = { ...currentProfile, gymProgress: newProgress };
                    handleUpdateProfile(updatedProfile); 
                    
                    alert(`¡Felicidades! Has obtenido la medalla.`);
                    setSelectedGymId(null);
                    setActiveView('gym_map');
                }}
                
                onDefeat={() => {
                    alert("Has sido derrotado. ¡Entrena más y vuelve a intentarlo!");
                    setSelectedGymId(null);
                    setActiveView('gym_map');
                }}
                
                onExit={() => {
                    setSelectedGymId(null);
                    setActiveView('gym_map');
                }}
            />
        )}
      </div>
      
      <div className={`screen ${activeView === "profile_selection" ? "visible" : "hidden"}`}><ProfileSelection profiles={profiles} onSelectProfile={handleSelectProfile} onNavigateToCreation={() => navigateTo('character_creation')} onGoBack={() => navigateTo('menu')} onDeleteProfile={handleDeleteProfile} allowCreation={isCreatingMode} /></div>
      <div className={`screen ${activeView === "character_creation" ? "visible" : "hidden"}`}><CharacterCreation onProfileCreate={handleCreateProfile} onGoBack={() => navigateTo('profile_selection')} /></div>
      <div className={`screen ${activeView === "loading" ? "visible" : "hidden"}`}><LoadingScreen isActive={activeView === "loading"} /></div>
      
      <div className={`screen ${activeView === "pokedex" ? "visible" : "hidden"}`}>
        {(activeView === 'pokedex' || activeView === 'loading') && selectedGameMode === 'pokedex' && (
            <PokemonQuiz 
                key={gameId} 
                initialCapturedData={currentSaveData}
                onGoBack={() => { 
                    if (currentProfile) { 
                        const currentProgress = localStorage.getItem('pokemonQuizSaveData'); 
                        if (currentProgress) {
                            localStorage.setItem(`save_file_${currentProfile.id}`, currentProgress);
                            setCurrentSaveData(JSON.parse(currentProgress));
                        }
                    } 
                    navigateTo('game_mode_selection'); 
                }} 
                onGameCapture={handleGameCapture} 
            />
        )}
      </div>

      <div className={`screen ${activeView === "pokedex_hard" ? "visible" : "hidden"}`}>{(activeView === 'pokedex_hard' || activeView === 'loading') && selectedGameMode === 'pokedex_hard' && (<PokemonQuizHard key={`hard-${gameId}`} onGoBack={() => navigateTo('game_mode_selection')} onLose={() => navigateTo('game_mode_selection')} />)}</div>
      
      <div className={`screen ${activeView === "trainer_card" ? "visible" : "hidden"}`}>
        {currentProfile && (
            <TrainerCard 
                // --- CAMBIO CLAVE AQUÍ ---
                // Esto fuerza a que el componente se reinicie si cambia el usuario
                key={currentProfile.id} 
                
                profile={currentProfile} 
                capturedData={currentSaveData} 
                onGoBack={() => { setCurrentProfile(null); navigateTo('menu'); }} 
                onProfileUpdate={handleUpdateProfile} 
            />
        )}
      </div>
    </div>
  );
}

export default App;