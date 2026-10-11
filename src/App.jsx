import React, { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import ProfileSelection from './components/ProfileSelection';
import CharacterCreation from './components/CharacterCreation';
import PokemonQuiz from './PokemonQuiz';
import LoadingScreen from './components/LoadingScreen';
import TrainerCard from './components/TrainerCard';
import TrainerProfile from './components/TrainerProfile';
import GameModeSelection from './components/GameModeSelection';
import GymSelection from './components/GymSelection';
import RocketSelection from './components/RocketSelection';
import RocketBattle from './components/RocketBattle';
import EliteSelection from './components/EliteSelection';
import PokedexModeSelection from './components/PokedexModeSelection';
import PokemonQuizHard from './components/PokemonQuizHard';
import UnlockModal from './components/UnlockModal'; 
import GymBattle from './components/GymBattle';
import UnlockRocketModal from './components/UnlockRocketModal';
import GameAlert from './components/GameAlert';
import Shop from './components/Shop';
import Albums from './components/Albums';
import LevelUpModal from './components/LevelUpModal';
import { countRegisteredSpecies, isPokemonOwned, normalizeSaveData, registerCapture, registerSpecialUnlock } from './utils/captureSystem';
import { awardBattleExperience, getLevelRewards, normalizeTrainerProfile } from './utils/trainerProgress';
import { ELITE_DATA } from './data/eliteData';
import { ROCKET_DATA, ROCKET_SPECIAL_UNLOCKS } from './data/rocketData';

function App() {
  // --- ESTADOS DE NAVEGACIÓN Y SISTEMA ---
  const [activeView, setActiveView] = useState('menu');
  const [gameId, setGameId] = useState(0);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [isCreatingMode, setIsCreatingMode] = useState(true);
  const [selectedGameMode, setSelectedGameMode] = useState('pokedex');  
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showRocketUnlockModal, setShowRocketUnlockModal] = useState(false);
  const [levelUpNotice, setLevelUpNotice] = useState(null);
  const [debugUnlockAllNodes, setDebugUnlockAllNodes] = useState(false);
  
  // Nuevo estado para controlar qué gimnasio se seleccionó
  const [selectedGymId, setSelectedGymId] = useState(null);
  const [selectedRocketNodeId, setSelectedRocketNodeId] = useState(null);
  
  // --- ESTADO DE DATOS ---
  const [currentSaveData, setCurrentSaveData] = useState({});

  const [profiles, setProfiles] = useState(() => {
    const savedProfiles = localStorage.getItem('pokemonQuizProfiles');
    return savedProfiles ? JSON.parse(savedProfiles).map(normalizeTrainerProfile) : [];
  });
  const hasSaveData = profiles.length > 0;
  const lastActiveProfileId = localStorage.getItem('lastActiveProfileId');
  const shopProfile = currentProfile
    || profiles.find(profile => String(profile.id) === lastActiveProfileId)
    || profiles[profiles.length - 1];

  // --- ESTADO DE ALERTAS PERSONALIZADAS ---
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' 
  });

  const showAlert = (title, message, type = 'info') => {
    setAlertConfig({ isOpen: true, title, message, type });
  };

  const closeAlert = () => {
    setAlertConfig(prev => ({ ...prev, isOpen: false }));
  };

  // --- LÓGICA DE DESBLOQUEO ---
  const handleGameCapture = (totalCaptures) => {
    const newSaveData = normalizeSaveData(JSON.parse(localStorage.getItem('pokemonQuizSaveData') || '{}'));
    setCurrentSaveData(newSaveData);

    setCurrentProfile(activeProfile => {
      if (!activeProfile) return activeProfile;
      const unlockGym = !activeProfile.gymUnlocked && totalCaptures >= 5;
      const unlockRocket = !activeProfile.rocketUnlocked && totalCaptures >= 15;
      if (!unlockGym && !unlockRocket) return activeProfile;
      if (unlockGym) setShowUnlockModal(true);
      if (unlockRocket) setShowRocketUnlockModal(true);
      const updatedProfile = {
        ...activeProfile,
        gymUnlocked: activeProfile.gymUnlocked || unlockGym,
        rocketUnlocked: activeProfile.rocketUnlocked || unlockRocket,
      };
      setProfiles(currentProfiles => {
        const updatedProfiles = currentProfiles.map(item => item.id === updatedProfile.id ? updatedProfile : item);
        localStorage.setItem('pokemonQuizProfiles', JSON.stringify(updatedProfiles));
        return updatedProfiles;
      });
      return updatedProfile;
    });
  };

  // Auto-guardado del progreso de captura antes de cerrar la aplicación.
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentProfile) {
        const currentProgress = localStorage.getItem('pokemonQuizSaveData');
        if (currentProgress) localStorage.setItem(`save_file_${currentProfile.id}`, currentProgress);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentProfile]);

  // El reloj pertenece al perfil activo, no a una pantalla concreta. De este
  // modo también cuenta el tiempo empleado en Tienda, Mi perfil y la ficha.
  useEffect(() => {
    const profileId = currentProfile?.id;
    if (!profileId) return undefined;

    let previousTick = Date.now();
    const recordElapsedTime = () => {
      const now = Date.now();
      const elapsed = Math.max(0, now - previousTick);
      previousTick = now;
      if (!elapsed) return;

      setCurrentProfile(profile => profile?.id === profileId
        ? { ...profile, playTime: (profile.playTime || 0) + elapsed }
        : profile);
      setProfiles(currentProfiles => {
        const updatedProfiles = currentProfiles.map(profile => profile.id === profileId
          ? { ...profile, playTime: (profile.playTime || 0) + elapsed }
          : profile);
        localStorage.setItem('pokemonQuizProfiles', JSON.stringify(updatedProfiles));
        return updatedProfiles;
      });
    };

    const timer = window.setInterval(recordElapsedTime, 1000);
    return () => window.clearInterval(timer);
  }, [currentProfile?.id]);

  const navigateTo = (view) => setActiveView(view);

  const startGame = (mode = 'pokedex') => {
    setSelectedGameMode(mode);
    setGameId((prevId) => prevId + 1);
    setActiveView('loading');
    setTimeout(() => {
      if (mode === 'pokedex') setActiveView('pokedex');
      else if (mode === 'pokedex_hard') setActiveView('pokedex_hard');
      else if (mode === 'gym') setActiveView('gym_map');
      else if (mode === 'rocket') setActiveView('rocket_map');
      else if (mode === 'elite') setActiveView('elite_map');
      else { 
          // CAMBIO AQUÍ
          showAlert("SISTEMA EN CONSTRUCCIÓN", "Este módulo de simulación aún no está disponible.\nVuelve más tarde, entrenador.", "warning"); 
          setActiveView('game_mode_selection'); 
      }
    }, 4000);
  };

  const handleUpdateProfile = (updatedProfile) => {
    let normalizedProfile = normalizeTrainerProfile(updatedProfile);
    const previousProfile = currentProfile?.id === normalizedProfile.id
      ? currentProfile
      : profiles.find(profile => profile.id === normalizedProfile.id);
    if (previousProfile && normalizedProfile.level > previousProfile.level) {
      setLevelUpNotice({
        previousLevel: previousProfile.level,
        level: normalizedProfile.level,
        rewards: getLevelRewards(previousProfile.level, normalizedProfile.level),
      });
    }
    setProfiles(currentProfiles => {
      const newProfilesList = currentProfiles.map(p => p.id === normalizedProfile.id ? normalizedProfile : p);
      localStorage.setItem('pokemonQuizProfiles', JSON.stringify(newProfilesList));
      return newProfilesList;
    });
    setCurrentProfile(normalizedProfile);
  };

  const handleUpdateSaveData = (nextSaveData) => {
    const normalized = normalizeSaveData(nextSaveData);
    setCurrentSaveData(normalized);
    localStorage.setItem('pokemonQuizSaveData', JSON.stringify(normalized));
    if (currentProfile?.id) localStorage.setItem(`save_file_${currentProfile.id}`, JSON.stringify(normalized));
  };

  // --- HANDLERS DE MENÚ ---
  const handleGoToNewGame = () => { setIsCreatingMode(true); navigateTo('profile_selection'); };
  const handleGoToContinue = () => { setIsCreatingMode(false); navigateTo('profile_selection'); };
  
  const handleOpenTrainerCard = () => {
    if (currentProfile) {
        navigateTo('trainer_card');
        return;
    }

    if (profiles.length > 0) {
      const lastActiveId = localStorage.getItem('lastActiveProfileId');
      let targetProfile = profiles.find(p => p.id == lastActiveId) || profiles[profiles.length - 1];
      
      const savedDataStr = localStorage.getItem(`save_file_${targetProfile.id}`);
      const savedData = normalizeSaveData(savedDataStr ? JSON.parse(savedDataStr) : {});
      
      setCurrentProfile(targetProfile);
      setCurrentSaveData(savedData);
      localStorage.setItem('pokemonQuizSaveData', JSON.stringify(savedData));
      
      navigateTo('trainer_card');
    }
  };

  const handleOpenProfile = () => {
    if (currentProfile) {
      navigateTo('profile');
      return;
    }

    if (profiles.length > 0) {
      const lastActiveId = localStorage.getItem('lastActiveProfileId');
      const targetProfile = profiles.find(p => p.id == lastActiveId) || profiles[profiles.length - 1];
      const savedDataStr = localStorage.getItem(`save_file_${targetProfile.id}`);
      const savedData = normalizeSaveData(savedDataStr ? JSON.parse(savedDataStr) : {});

      setCurrentProfile(targetProfile);
      setCurrentSaveData(savedData);
      localStorage.setItem('pokemonQuizSaveData', JSON.stringify(savedData));
      navigateTo('profile');
    }
  };

  const handleOpenShop = () => {
    if (currentProfile) {
      navigateTo('shop');
      return;
    }

    if (profiles.length > 0) {
      const lastActiveId = localStorage.getItem('lastActiveProfileId');
      const targetProfile = profiles.find(profile => String(profile.id) === lastActiveId) || profiles[profiles.length - 1];
      setCurrentProfile(targetProfile);
      navigateTo('shop');
    }
  };

  const handleOpenAlbums = () => {
    if (currentProfile) {
      navigateTo('albums');
      return;
    }

    if (profiles.length > 0) {
      const lastActiveId = localStorage.getItem('lastActiveProfileId');
      const targetProfile = profiles.find(profile => String(profile.id) === lastActiveId) || profiles[profiles.length - 1];
      const savedDataStr = localStorage.getItem(`save_file_${targetProfile.id}`);
      const savedData = normalizeSaveData(savedDataStr ? JSON.parse(savedDataStr) : {});
      setCurrentProfile(targetProfile);
      setCurrentSaveData(savedData);
    }
    navigateTo('albums');
  };

  // --- GESTIÓN DE PERFILES ---
  const handleCreateProfile = (profileName, skinId) => {
    if (profiles.length >= 8) return;
    
    const newProfile = normalizeTrainerProfile({ 
        id: Date.now(), 
        name: profileName, 
        skin: skinId, 
        startDate: Date.now(), 
        companion: null, 
        playTime: 0, 
        gymProgress: 0, 
        eliteProgress: 0, 
        gymUnlocked: false,
        team: [] 
    });

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
        const resetProfile = normalizeTrainerProfile({ ...profile, playTime: 0, startDate: Date.now(), companion: null, gymProgress: 0, eliteProgress: 0, gymUnlocked: false, rocketUnlocked: false, team: [], experience: 0, level: 1, money: 0, inventory: {}, boosts: {}, claimedAchievements: [] });
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
      const specificSaveDataStr = localStorage.getItem(`save_file_${profile.id}`);
      const specificSaveData = normalizeSaveData(specificSaveDataStr ? JSON.parse(specificSaveDataStr) : {});
      
      const totalCaptures = countRegisteredSpecies(specificSaveData);
      
      let updatedProfile = { ...profile };
      let hasUpdates = false;

      if (totalCaptures >= 5 && !profile.gymUnlocked) {
          updatedProfile.gymUnlocked = true;
          hasUpdates = true;
      }

      if (totalCaptures >= 15 && !profile.rocketUnlocked) {
          updatedProfile.rocketUnlocked = true;
          setShowRocketUnlockModal(true);
          hasUpdates = true;
      }

      if (hasUpdates) {
          const updatedProfilesList = profiles.map(p => p.id === profile.id ? updatedProfile : p);
          setProfiles(updatedProfilesList);
          localStorage.setItem('pokemonQuizProfiles', JSON.stringify(updatedProfilesList));
      }

      setCurrentProfile(updatedProfile); 
      localStorage.setItem('lastActiveProfileId', updatedProfile.id);
      
      localStorage.setItem('pokemonQuizSaveData', JSON.stringify(specificSaveData));
      setCurrentSaveData(specificSaveData); 
      
      navigateTo('game_mode_selection');
    }
  };

  // --- DEV TOOLS: CÓDIGO KONAMI ---
  useEffect(() => {
    const konamiCode = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", 
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", 
      "b", "a"
    ];
    const unlockNodesCode = ["ArrowUp", "ArrowDown", "ArrowUp", "ArrowDown", "j"];
    const restoreNodesCode = ["ArrowDown", "ArrowUp", "ArrowDown", "ArrowUp", "j"];
    let keyBuffer = [];

    const endsWithCode = (buffer, code) => code.every((key, index) => buffer[buffer.length - code.length + index] === key);

    const playSecretSound = () => {
      const successSound = new Audio('/assets/sounds/secret.mp3');
      successSound.volume = 0.5;
      successSound.play().catch(error => console.warn("Audio bloqueado", error));
    };

    const activateDevCheat = () => {
      // 1. Validaciones
      if (currentProfile.cheatUsed) return;
      
      const currentCapturesCount = countRegisteredSpecies(currentSaveData);
      if (currentCapturesCount > 0) return;

      // 2. Lógica
      const allIds = Array.from({ length: 150 }, (_, i) => i + 1);
      const newCaptures = {};
      
      for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * allIds.length);
        const pokemonId = allIds[randomIndex];
        newCaptures[pokemonId] = { registered: true, owned: true, specimen: null, captures: 1 };
        allIds.splice(randomIndex, 1);
      }

      const updatedSaveData = { ...currentSaveData, ...newCaptures };
      setCurrentSaveData(updatedSaveData);
      localStorage.setItem(`save_file_${currentProfile.id}`, JSON.stringify(updatedSaveData));
      localStorage.setItem('pokemonQuizSaveData', JSON.stringify(updatedSaveData));

      playSecretSound();

      const updatedProfile = { ...currentProfile, cheatUsed: true };
      handleUpdateProfile(updatedProfile);

      handleGameCapture(5);
    };

    const handleKeyDown = (event) => {
      if (!currentProfile) return;

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      keyBuffer = [...keyBuffer, key].slice(-konamiCode.length);

      if (endsWithCode(keyBuffer, unlockNodesCode)) {
        setDebugUnlockAllNodes(true);
        playSecretSound();
        showAlert(
          "MODO DE PRUEBA ACTIVADO",
          "Todos los nodos de Gimnasios y Team Rocket están disponibles temporalmente. El progreso y las recompensas guardadas no fueron modificados.",
          "cheat"
        );
        keyBuffer = [];
        return;
      }

      if (endsWithCode(keyBuffer, restoreNodesCode)) {
        setDebugUnlockAllNodes(false);
        playSecretSound();
        showAlert(
          "PROGRESO REAL RESTAURADO",
          "Los nodos vuelven a respetar las capturas, medallas y avances reales del perfil.",
          "info"
        );
        keyBuffer = [];
        return;
      }

      if (endsWithCode(keyBuffer, konamiCode)) {
        activateDevCheat();
        keyBuffer = [];
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentProfile, currentSaveData]); 

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
       
       {showUnlockModal && (
          <UnlockModal onClose={() => setShowUnlockModal(false)} />
       )}

       {showRocketUnlockModal && !levelUpNotice && (
          <UnlockRocketModal onClose={() => setShowRocketUnlockModal(false)} />
       )}

       {levelUpNotice && (
          <LevelUpModal {...levelUpNotice} onClose={() => setLevelUpNotice(null)} />
       )}

       <div className={`screen ${activeView === "menu" ? "visible" : "hidden"}`}><MainMenu onNewGame={handleGoToNewGame} onContinueGame={handleGoToContinue} onOpenTrainerCard={handleOpenTrainerCard} onOpenProfile={handleOpenProfile} onOpenAlbums={handleOpenAlbums} onOpenShop={handleOpenShop} hasSaveData={hasSaveData} /></div>

       <div className={`screen ${activeView === "albums" ? "visible" : "hidden"}`}>
         {activeView === 'albums' && <Albums profile={currentProfile || shopProfile} onProfileUpdate={handleUpdateProfile} saveData={currentSaveData} onGoBack={() => { setCurrentProfile(null); navigateTo('menu'); }} />}
       </div>

       <div className={`screen ${activeView === "shop" ? "visible" : "hidden"}`}>
         {activeView === 'shop' && <Shop onGoBack={() => { setCurrentProfile(null); navigateTo('menu'); }} profile={shopProfile} onProfileUpdate={handleUpdateProfile} />}
       </div>
       
       <div className={`screen ${activeView === "game_mode_selection" ? "visible" : "hidden"}`}>
        {currentProfile && (
            <GameModeSelection 
                key={currentProfile.id} 
                profile={currentProfile}
                capturedData={currentSaveData}
                onStartMode={(mode) => { if (mode === 'pokedex_difficulty_select') navigateTo('pokedex_difficulty'); else startGame(mode); }}
                onBack={() => navigateTo('profile_selection')}
                onGoToMenu={() => { setCurrentProfile(null); navigateTo('menu'); }}
                debugUnlockAllNodes={debugUnlockAllNodes}
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
            debugUnlockAllNodes={debugUnlockAllNodes}
            
            onEnterGym={(gymId) => { 
                const userTeam = (currentProfile.team || []).filter((pokeId) => isPokemonOwned(currentSaveData, pokeId));
                if (userTeam.length < 3) {
                   showAlert(
                     "ACCESO DENEGADO", 
                     "No puedes desafiar al Líder sin un equipo preparado.\n\nPor favor, ve a tu 'Ficha de Entrenador' y selecciona al menos 3 Pokémon en 'MI EQUIPO'.", 
                     "error"
                   );
                   return; 
                }
                // --- CORRECCIÓN AQUÍ: Si pasa la validación, entramos ---
                setSelectedGymId(gymId);
                setActiveView('gym_battle'); 
            }} 
          />
        )}
      </div>

      <div className={`screen ${activeView === "rocket_map" ? "visible" : "hidden"}`}>
        {currentProfile && (
          <RocketSelection
            key={currentProfile.id}
            profile={currentProfile}
            capturedData={currentSaveData}
            onBack={() => navigateTo('game_mode_selection')}
            debugUnlockAllNodes={debugUnlockAllNodes}
            onEnterGym={(nodeId) => {
              const userTeam = (currentProfile.team || []).filter((pokeId) => isPokemonOwned(currentSaveData, pokeId));
              if (userTeam.length < 2) {
                showAlert(
                  "ACCESO DENEGADO",
                  "Las operaciones Rocket son batallas dobles. Selecciona al menos 2 Pokémon en 'MI EQUIPO'.",
                  "error"
                );
                return;
              }

              setSelectedRocketNodeId(nodeId);
              setActiveView('rocket_battle');
            }}
          />
        )}
      </div>

      <div className={`screen ${activeView === "rocket_battle" ? "visible" : "hidden"}`}>
        {currentProfile && selectedRocketNodeId && activeView === 'rocket_battle' && (() => {
          const rocketNode = ROCKET_DATA.find(node => node.id === selectedRocketNodeId);
          return rocketNode ? <RocketBattle
            key={`${currentProfile.id}-${selectedRocketNodeId}`}
            node={rocketNode}
            profile={currentProfile}
            capturedData={currentSaveData}
            onProfileUpdate={handleUpdateProfile}
            onExit={() => { setSelectedRocketNodeId(null); setActiveView('rocket_map'); }}
            onNodeComplete={({ node, fossil }) => {
              const nodeIndex = ROCKET_DATA.findIndex(candidate => candidate.id === node.id);
              let updatedProfile = {
                ...currentProfile,
                rocketProgress: Math.max(currentProfile.rocketProgress || 0, nodeIndex + 1),
              };
              if (fossil) {
                updatedProfile = {
                  ...updatedProfile,
                  fossilQuizUnlocked: true,
                  inventory: { ...updatedProfile.inventory, [fossil]: (updatedProfile.inventory?.[fossil] || 0) + 1 },
                };
              }
              updatedProfile = awardBattleExperience(updatedProfile, 'leagueTrainer');
              handleUpdateProfile(updatedProfile);

              const unlockedSpeciesId = ROCKET_SPECIAL_UNLOCKS[node.id];
              if (unlockedSpeciesId) handleUpdateSaveData(registerSpecialUnlock(currentSaveData, unlockedSpeciesId));

              const rewardMessage = fossil
                ? `El ${fossil === 'fossil-helix' ? 'Fósil Helix' : 'Fósil Domo'} fue enviado a tu Mochila. Los cinco Pokémon fósiles ya están disponibles en el Quiz.`
                : unlockedSpeciesId
                  ? `El Quiz de ${unlockedSpeciesId === 144 ? 'Articuno' : unlockedSpeciesId === 145 ? 'Zapdos' : 'Moltres'} ha sido desbloqueado.`
                  : 'La operación Rocket fue completada y tu progreso quedó guardado.';
              showAlert('¡OPERACIÓN COMPLETADA!', rewardMessage, 'success');
              setSelectedRocketNodeId(null);
              setActiveView('rocket_map');
            }}
          /> : null;
        })()}
      </div>

      <div className={`screen ${activeView === "elite_map" ? "visible" : "hidden"}`}>
        {currentProfile && (
          <EliteSelection
            key={currentProfile.id}
            profile={currentProfile}
            capturedData={currentSaveData}
            onBack={() => navigateTo('game_mode_selection')}
            onEnterGym={(memberId) => {
              const userTeam = (currentProfile.team || []).filter((pokeId) => isPokemonOwned(currentSaveData, pokeId));
              if (userTeam.length < 3) {
                showAlert(
                  "ACCESO DENEGADO",
                  "No puedes desafiar al Alto Mando sin un equipo preparado.\n\nSelecciona al menos 3 Pokémon en 'MI EQUIPO'.",
                  "error"
                );
                return;
              }

              setSelectedGymId(memberId);
              setActiveView('gym_battle');
            }}
          />
        )}
      </div>

      <div className={`screen ${activeView === "gym_battle" ? "visible" : "hidden"}`}>
        {currentProfile && selectedGymId && activeView === 'gym_battle' && (
            <GymBattle 
                key={`${currentProfile.id}-${selectedGymId}`}
                gymId={selectedGymId}
                userName={currentProfile.name}
                profileId={currentProfile.id}
                battleData={selectedGameMode === 'elite' ? ELITE_DATA : undefined}
                progressNamespace={selectedGameMode === 'elite' ? 'elite' : 'gym'}
                userTeam={(currentProfile.team || []).filter((pokeId) => isPokemonOwned(currentSaveData, pokeId))} 
                onProgressReward={(battleType) => handleUpdateProfile(awardBattleExperience(currentProfile, battleType))}
                
                onVictory={(rewardPokemon) => { 
                    if (selectedGameMode === 'elite') {
                        const eliteIndex = ELITE_DATA.findIndex(member => member.id === selectedGymId);
                        const newEliteProgress = Math.max(currentProfile.eliteProgress || 0, eliteIndex + 1);
                        const updatedProfile = awardBattleExperience({ ...currentProfile, eliteProgress: newEliteProgress }, 'leagueTrainer');
                        handleUpdateProfile(updatedProfile);
                        showAlert(
                          newEliteProgress >= ELITE_DATA.length ? "¡NUEVO CAMPEÓN!" : "¡VICTORIA EN LA LIGA!",
                          newEliteProgress >= ELITE_DATA.length
                            ? "Has derrotado a los cinco rivales y conquistado la Liga Pokémon de Kanto."
                            : "Has superado este desafío del Alto Mando. Tu progreso ha sido guardado.",
                          "success"
                        );
                        setSelectedGymId(null);
                        setActiveView('elite_map');
                        return;
                    }

                    const currentProgress = currentProfile.gymProgress || 0;
                    
                    const gymIndex = ["pallet-town", "pewter", "cerulean", "vermilion", "celadon", "fuchsia", "saffron", "cinnabar", "viridian"].indexOf(selectedGymId);
                    const newProgress = Math.max(currentProgress, gymIndex + 1);
                    
                    const updatedProfile = awardBattleExperience({ ...currentProfile, gymProgress: newProgress }, 'gymLeader');
                    handleUpdateProfile(updatedProfile); 
                    
                    if (rewardPokemon) {
                        const newSaveData = registerCapture(currentSaveData, rewardPokemon);
                        setCurrentSaveData(newSaveData);
                        localStorage.setItem(`save_file_${currentProfile.id}`, JSON.stringify(newSaveData));
                        localStorage.setItem('pokemonQuizSaveData', JSON.stringify(newSaveData));
                        
                        showAlert(
                            "¡TUTORIAL COMPLETADO!",
                            `Has completado el entrenamiento básico.\nEl Profesor Oak te ha entregado a ${rewardPokemon.name} como regalo de bienvenida.`,
                            "success"
                        );
                    } else {
                        showAlert(
                            "¡VICTORIA!",
                            "Has obtenido la medalla y tu progreso ha sido guardado.",
                            "success"
                        );
                    }

                    setSelectedGymId(null);
                    setActiveView(selectedGameMode === 'rocket' ? 'rocket_map' : selectedGameMode === 'elite' ? 'elite_map' : 'gym_map');
                }}
                
                onDefeat={() => {
                    showAlert("DERROTA", "Has sido derrotado. ¡Entrena más y vuelve a intentarlo!", "error");
                    setSelectedGymId(null);
                    setActiveView(selectedGameMode === 'rocket' ? 'rocket_map' : selectedGameMode === 'elite' ? 'elite_map' : 'gym_map');
                }}
                
                onExit={() => {
                    setSelectedGymId(null);
                    setActiveView(selectedGameMode === 'rocket' ? 'rocket_map' : selectedGameMode === 'elite' ? 'elite_map' : 'gym_map');
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
                profile={currentProfile}
                onProfileUpdate={handleUpdateProfile}
                onAlert={showAlert} 
                onGoBack={() => { 
                    if (currentProfile) { 
                        const currentProgress = localStorage.getItem('pokemonQuizSaveData'); 
                        if (currentProgress) {
                            localStorage.setItem(`save_file_${currentProfile.id}`, currentProgress);
                            setCurrentSaveData(normalizeSaveData(JSON.parse(currentProgress)));
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
                key={currentProfile.id} 
                profile={currentProfile} 
                capturedData={currentSaveData} 
                onAlert={showAlert}
                onGoBack={() => { setCurrentProfile(null); navigateTo('menu'); }} 
                onProfileUpdate={handleUpdateProfile} 
            />
        )}
      </div>

      <div className={`screen ${activeView === "profile" ? "visible" : "hidden"}`}>
        {currentProfile && (
          <TrainerProfile
            key={currentProfile.id}
            profile={currentProfile}
            capturedData={currentSaveData}
            onGoBack={() => { setCurrentProfile(null); navigateTo('menu'); }}
            onProfileUpdate={handleUpdateProfile}
            onSaveDataUpdate={handleUpdateSaveData}
          />
        )}
      </div>

      {/* --- AQUÍ RENDERIZAMOS LA ALERTA --- */}
      <GameAlert 
          isOpen={alertConfig.isOpen}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          onClose={closeAlert}
      />

    </div>
  );
}

export default App;
