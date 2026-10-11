import { countRegisteredSpecies, getCaptureRecord } from './captureSystem.js';
import { normalizeAlbumCollection } from './albumCollection.js';

export const MAX_TRAINER_LEVEL = 100;
export const RENAME_COST = 500;
export const CAPTURE_MONEY = 500;
export const PROFILE_IMAGE_ACHIEVEMENT_MONEY = 1000;
export const TRAINER_EXP_BY_RARITY = Object.freeze({ comun: 100, normal: 100, infrecuente: 200, raro: 400, legendario: 800, mitico: 1500 });
export const BATTLE_EXP = Object.freeze({ gymTrainer: 250, gymLeader: 1000, leagueTrainer: 3000 });

export const SHOP_ITEMS = [
  { id: 'poke-ball', category: 'capture', name: 'Poké Ball', price: 200, description: 'Reintento para Pokémon de rareza normal.', longDescription: 'Concede un nuevo intento de captura cuando falla el encuentro con un Pokémon de rareza normal. Se consume automáticamente al solicitar el reintento.' },
  { id: 'super-ball', category: 'capture', name: 'Super Ball', price: 600, description: 'Reintento para Pokémon infrecuentes.', longDescription: 'Permite repetir una captura fallida contra un Pokémon infrecuente sin perder la oportunidad del encuentro. Se guarda en la Mochila hasta que decidas utilizarla.' },
  { id: 'ultra-ball', category: 'capture', name: 'Ultra Ball', price: 1200, description: 'Reintento para Pokémon raros.', longDescription: 'Otorga un reintento adicional frente a Pokémon raros, cuyos encuentros son mucho menos frecuentes. Solo se consume cuando confirmas que deseas repetir la captura.' },
  { id: 'master-ball', category: 'capture', name: 'Master Ball', price: 12000, description: 'Reintento para Pokémon legendarios y míticos.', longDescription: 'Reserva una segunda oportunidad para capturar Pokémon legendarios o míticos. Es el recurso de reintento más exclusivo y permanece en la Mochila hasta ser utilizado.' },
  { id: 'revive', category: 'recovery', name: 'Revivir', price: 450, description: 'Recupera un Pokémon normal debilitado.', longDescription: 'Devuelve al combate a un Pokémon de rareza normal que haya quedado debilitado. El objeto se consume al confirmar la recuperación desde tu equipo.' },
  { id: 'super-revive', category: 'recovery', name: 'Super Revivir', price: 900, description: 'Recupera un Pokémon infrecuente debilitado.', longDescription: 'Restaura a un Pokémon infrecuente debilitado para que vuelva a estar disponible en combate. Puedes conservar varias unidades en la Mochila.' },
  { id: 'mega-revive', category: 'recovery', name: 'Mega Revivir', price: 1600, description: 'Recupera un Pokémon raro debilitado.', longDescription: 'Permite recuperar un Pokémon raro después de una derrota, evitando que quede fuera de tu formación. Se consume únicamente al aplicar su efecto.' },
  { id: 'max-revive', category: 'recovery', name: 'Revivir Máximo', price: 4000, description: 'Recupera un Pokémon legendario o mítico.', longDescription: 'Reactiva a un Pokémon legendario o mítico debilitado y lo devuelve a tu equipo de combate. Es el objeto de recuperación de mayor categoría.' },
  { id: 'repel', category: 'quiz', name: 'Repelente', price: 300, description: 'Elimina una respuesta incorrecta del Quiz.', longDescription: 'Descarta una alternativa incorrecta de la pregunta actual del Quiz. Úsalo cuando necesites reducir el riesgo sin revelar directamente la respuesta correcta.' },
  { id: 'super-repel', category: 'quiz', name: 'Superrepelente', price: 600, description: 'Elimina dos respuestas incorrectas del Quiz.', longDescription: 'Elimina dos alternativas incorrectas de una pregunta y deja una decisión mucho más precisa. El efecto se aplica a una sola pregunta del Quiz.' },
  { id: 'max-repel', category: 'quiz', name: 'Repelente Máximo', price: 1400, description: 'Resuelve correctamente una pregunta del Quiz.', longDescription: 'Completa correctamente la pregunta actual de forma automática. Es la ayuda táctica más poderosa y se consume inmediatamente después de activarla.' },
  { id: 'profile-normal', category: 'avatars', name: 'Imagen Normal', price: 1000, description: 'Retrato estándar de un Pokémon registrado.', longDescription: 'Desbloquea una imagen de perfil con el artwork estándar del Pokémon seleccionado. Una vez adquirida, podrás equiparla cuando quieras desde Imágenes de perfil.' },
  { id: 'profile-combat', category: 'avatars', name: 'Imagen Combat', price: 3000, description: 'Retrato Pokémon en pose de combate.', longDescription: 'Desbloquea una variante dinámica del Pokémon en pose de combate para tu perfil. La compra queda vinculada permanentemente a tu entrenador.' },
  { id: 'profile-holo', category: 'avatars', name: 'Imagen Holo', price: 5000, description: 'Retrato premium con acabado holográfico.', longDescription: 'Desbloquea una variante premium con tratamiento holográfico y presencia especial en tu ficha. Podrás alternarla libremente después de adquirirla.' },
  { id: 'shop-title', category: 'titles', name: 'Título de tienda', price: 1000, rewardType: 'title', description: 'Título cosmético para personalizar tu perfil.', longDescription: 'Añade este título a tu colección personal para utilizarlo bajo tu nombre de entrenador. Los títulos comprados se guardan permanentemente en la sección Títulos.' },
  { id: 'album-pack', category: 'collection', name: 'Sobre de Álbum', price: 750, description: 'Contiene cinco láminas aleatorias para el Álbum Pokémon.', longDescription: 'Añade cinco láminas aleatorias a tu colección. Pueden aparecer repetidas y acabados holográficos; los duplicados se venden automáticamente por monedas al abrir el sobre desde Álbumes.' },
  { id: 'lucky-egg', category: 'progression', name: 'Huevo Suerte', price: null, progressionOnly: true, description: 'Triplica la EXP de captura durante 10 intentos.' },
  { id: 'amulet-coin', category: 'progression', name: 'Amuleto Moneda', price: null, progressionOnly: true, description: 'Triplica el dinero de captura durante 10 intentos.' },
  { id: 'fossil-helix', category: 'progression', name: 'Fósil Helix', price: null, progressionOnly: true, description: 'Un fósil del Monte Luna capaz de restaurar a Omanyte.', longDescription: 'Canjéalo desde la Mochila para capturar automáticamente a Omanyte, sin realizar su Quiz.' },
  { id: 'fossil-dome', category: 'progression', name: 'Fósil Domo', price: null, progressionOnly: true, description: 'Un fósil del Monte Luna capaz de restaurar a Kabuto.', longDescription: 'Canjéalo desde la Mochila para capturar automáticamente a Kabuto, sin realizar su Quiz.' },
];

const normalizeRarity = value => String(value || 'Común').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function getRetryBallId(pokemon) {
  if (pokemon?.id === 151) return 'master-ball';
  return ({ comun: 'poke-ball', normal: 'poke-ball', infrecuente: 'super-ball', raro: 'ultra-ball', legendario: 'master-ball', mitico: 'master-ball' })[normalizeRarity(pokemon?.rarity)] || 'poke-ball';
}

export function consumeInventoryItem(rawProfile, itemId) {
  const profile = normalizeTrainerProfile(rawProfile);
  if ((profile.inventory[itemId] || 0) <= 0) return rawProfile;
  return normalizeTrainerProfile({ ...profile, inventory: { ...profile.inventory, [itemId]: profile.inventory[itemId] - 1 } });
}

export function activateBoostItem(rawProfile, itemId) {
  const profile = normalizeTrainerProfile(rawProfile);
  const boostKey = ({ 'lucky-egg': 'luckyEggCharges', 'amulet-coin': 'amuletCoinCharges' })[itemId];
  if (!boostKey || (profile.inventory[itemId] || 0) <= 0) return rawProfile;
  return normalizeTrainerProfile({
    ...profile,
    inventory: { ...profile.inventory, [itemId]: profile.inventory[itemId] - 1 },
    boosts: { ...profile.boosts, [boostKey]: profile.boosts[boostKey] + 10 },
  });
}

export function getLevelCost(level) {
  const current = Math.max(1, Math.min(MAX_TRAINER_LEVEL - 1, Number(level) || 1));
  if (current <= 10) return current * 100;
  if (current <= 25) return 1000 + ((current - 10) * 250);
  if (current <= 50) return 4750 + ((current - 25) * 500);
  if (current <= 75) return 17250 + ((current - 50) * 1000);
  return 42250 + ((current - 75) * 2000);
}

export function getAccumulatedExpForLevel(level) {
  let total = 0;
  for (let current = 1; current < Math.min(MAX_TRAINER_LEVEL, Math.max(1, level)); current += 1) total += getLevelCost(current);
  return total;
}

export function getTrainerLevel(experience = 0) {
  const total = Math.max(0, Number(experience) || 0);
  let level = 1;
  while (level < MAX_TRAINER_LEVEL && total >= getAccumulatedExpForLevel(level + 1)) level += 1;
  return level;
}

export function getLevelProgress(experience = 0) {
  const total = Math.max(0, Number(experience) || 0);
  const level = getTrainerLevel(total);
  const floor = getAccumulatedExpForLevel(level);
  const target = level >= MAX_TRAINER_LEVEL ? 0 : getLevelCost(level);
  const current = level >= MAX_TRAINER_LEVEL ? 0 : total - floor;
  return { level, total, current, target, remaining: Math.max(0, target - current), percent: level >= MAX_TRAINER_LEVEL ? 100 : Math.min(100, (current / target) * 100) };
}

export function normalizeTrainerProfile(profile = {}) {
  const experience = Math.max(0, Number(profile.experience) || 0);
  const unlockedProfileImages = [...new Set(['normal-25', ...(Array.isArray(profile.unlockedProfileImages) ? profile.unlockedProfileImages : [])])];
  const requestedProfileImage = typeof profile.profileImage === 'string' ? profile.profileImage : 'normal-25';
  const inventory = { ...(profile.inventory || {}) };
  const eventTitles = [...(Array.isArray(profile.eventTitles) ? profile.eventTitles : [])];
  // Migrate titles purchased before they had their own collection.
  if (inventory['shop-title'] > 0 && !eventTitles.some(title => title?.id === 'shop-title')) {
    eventTitles.push({ id: 'shop-title', name: 'Título de tienda', requirement: 'Adquirido en la Tienda Pokémon.' });
  }
  delete inventory['shop-title'];
  return {
    ...profile,
    profileImage: unlockedProfileImages.includes(requestedProfileImage) ? requestedProfileImage : 'normal-25',
    unlockedProfileImages,
    experience,
    level: getTrainerLevel(experience),
    money: Math.max(0, Number(profile.money) || 0),
    rocketProgress: Math.max(0, Number(profile.rocketProgress) || 0),
    rocketUnlocked: Boolean(profile.rocketUnlocked),
    fossilQuizUnlocked: Boolean(profile.fossilQuizUnlocked),
    inventory,
    albumCollection: normalizeAlbumCollection(profile.albumCollection),
    eventTitles,
    boosts: {
      luckyEggCharges: Math.max(0, Number(profile.boosts?.luckyEggCharges) || 0),
      amuletCoinCharges: Math.max(0, Number(profile.boosts?.amuletCoinCharges) || 0),
    },
    claimedAchievements: [...(profile.claimedAchievements || [])],
  };
}

export function getLevelMoneyReward(level) {
  if (level === 100) return 100000;
  if (level === 75) return 50000;
  if (level === 50) return 25000;
  if (level === 25) return 10000;
  if (level % 10 === 0) return 5000;
  if (level % 5 === 0) return 1000;
  return 500;
}

export function getLevelRewards(previousLevel, reachedLevel) {
  const from = Math.max(1, Number(previousLevel) || 1);
  const to = Math.min(MAX_TRAINER_LEVEL, Math.max(from, Number(reachedLevel) || from));
  let money = 0;
  let boostSets = 0;
  for (let level = from + 1; level <= to; level += 1) {
    money += getLevelMoneyReward(level);
    if (level % 10 === 0) boostSets += 1;
  }
  return { money, boostSets, levelsGained: to - from };
}

export function grantTrainerExperience(rawProfile, amount) {
  const profile = normalizeTrainerProfile(rawProfile);
  const previousLevel = profile.level;
  const experience = profile.experience + Math.max(0, Math.round(amount));
  const level = getTrainerLevel(experience);
  let moneyReward = 0;
  let boostSets = 0;
  for (let reached = previousLevel + 1; reached <= level; reached += 1) {
    moneyReward += getLevelMoneyReward(reached);
    if (reached % 10 === 0) boostSets += 1;
  }
  return normalizeTrainerProfile({
    ...profile,
    experience,
    money: profile.money + moneyReward,
    inventory: {
      ...profile.inventory,
      'lucky-egg': (profile.inventory['lucky-egg'] || 0) + boostSets,
      'amulet-coin': (profile.inventory['amulet-coin'] || 0) + boostSets,
    },
    boosts: { ...profile.boosts },
  });
}

export function resolveCaptureAttempt(rawProfile, pokemon, { success, isShiny = false, perfect = false } = {}) {
  const profile = normalizeTrainerProfile(rawProfile);
  const usedLuckyEgg = profile.boosts.luckyEggCharges > 0;
  const usedAmuletCoin = profile.boosts.amuletCoinCharges > 0;
  let next = {
    ...profile,
    boosts: {
      luckyEggCharges: Math.max(0, profile.boosts.luckyEggCharges - Number(usedLuckyEgg)),
      amuletCoinCharges: Math.max(0, profile.boosts.amuletCoinCharges - Number(usedAmuletCoin)),
    },
  };
  if (!success) return { profile: normalizeTrainerProfile(next), rewards: { experience: 0, money: 0, usedLuckyEgg, usedAmuletCoin } };
  const rarity = pokemon?.id === 151 ? 'mitico' : normalizeRarity(pokemon?.rarity);
  const baseExperience = TRAINER_EXP_BY_RARITY[rarity] || TRAINER_EXP_BY_RARITY.comun;
  const experience = baseExperience * (isShiny ? 2 : 1) * (usedLuckyEgg ? 3 : 1);
  const money = CAPTURE_MONEY * (perfect ? 2 : 1) * (usedAmuletCoin ? 3 : 1);
  next = grantTrainerExperience(next, experience);
  next = normalizeTrainerProfile({ ...next, money: next.money + money });
  return { profile: next, rewards: { experience, money, usedLuckyEgg, usedAmuletCoin } };
}

export function awardBattleExperience(profile, battleType) {
  return grantTrainerExperience(profile, BATTLE_EXP[battleType] || 0);
}

const achievementExp = difficulty => ({ common: 250, uncommon: 1000, rare: 5000, epic: 10000, legendary: 25000 }[difficulty]);

export function getAchievements(profile, data, speciesId = 0) {
  if (speciesId) {
    const record = getCaptureRecord(data, speciesId);
    return [
      { id: `species-${speciesId}-1`, name: 'Primer encuentro', difficulty: 'common', requirement: 'Captura esta especie una vez.', current: record.captures, target: 1 },
      { id: `species-${speciesId}-5`, name: 'Vínculo renovado', difficulty: 'uncommon', requirement: 'Captura esta especie 5 veces.', current: record.captures, target: 5 },
      { id: `species-${speciesId}-10`, name: 'Especialista', difficulty: 'rare', requirement: 'Captura esta especie 10 veces.', current: record.captures, target: 10 },
      { id: `species-${speciesId}-shiny`, name: 'Un brillo especial', difficulty: 'epic', requirement: 'Captura un ejemplar Shiny de esta especie.', current: Number(Boolean(record.everShiny || record.specimen?.isShiny)), target: 1 },
    ].map(item => ({
      ...item,
      reward: achievementExp(item.difficulty),
      rewardType: 'experience',
      ...(item.target === 5 ? { moneyReward: PROFILE_IMAGE_ACHIEVEMENT_MONEY, profileImageId: `normal-${speciesId}` } : {}),
    }));
  }
  const count = countRegisteredSpecies(data);
  const milestones = [
    { target: 1, difficulty: 'common' }, { target: 10, difficulty: 'uncommon' }, { target: 50, difficulty: 'rare' },
    { target: 100, difficulty: 'epic' }, { target: 151, difficulty: 'legendary' },
  ];
  return milestones.map(({ target, difficulty }) => ({
    id: `dex-${target}`, name: target === 151 ? 'Maestría de Kanto' : `Descubrimientos: ${target}`,
    difficulty, requirement: `Registra ${target} ${target === 1 ? 'especie' : 'especies'} en la Pokédex.`, current: count, target,
    reward: achievementExp(difficulty), rewardType: 'experience',
  })).concat({ id: 'gym-8', name: 'Liga de Kanto', difficulty: 'epic', requirement: 'Consigue las 8 medallas de Kanto.', current: Math.max(0, (profile.gymProgress || 0) - 1), target: 8, reward: achievementExp('epic'), rewardType: 'experience' });
}

export function getTitles(profile, data) {
  const count = countRegisteredSpecies(data);
  return [
    { id: 'rookie', name: 'Entrenador principiante', requirement: 'Crea tu perfil.', unlocked: true },
    { id: 'explorer', name: 'Explorador de Kanto', requirement: 'Registra 10 especies.', unlocked: count >= 10 },
    { id: 'researcher', name: 'Investigador Pokémon', requirement: 'Registra 50 especies.', unlocked: count >= 50 },
    { id: 'master', name: 'Maestro de la Pokédex', requirement: 'Registra 151 especies.', unlocked: count >= 151 },
    { id: 'champion', name: 'Campeón de Kanto', requirement: 'Consigue las 8 medallas.', unlocked: profile.gymProgress >= 9 },
    { id: 'myth', name: 'Tras el mito', requirement: 'Completa el evento especial de Mew.', hidden: true, unlocked: getCaptureRecord(data, 151).specialUnlock || getCaptureRecord(data, 151).captures > 0 },
    ...(profile.eventTitles || []).filter(t => t && typeof t.id === 'string' && typeof t.name === 'string').map(t => ({ ...t, hidden: true, unlocked: true, requirement: t.requirement || 'Recompensa de evento especial.' })),
  ].filter(t => !t.hidden || t.unlocked);
}

export function claimAchievement(rawProfile, data, speciesId, achievementId) {
  const profile = normalizeTrainerProfile(rawProfile);
  const achievement = getAchievements(profile, data, speciesId).find(item => item.id === achievementId);
  if (!achievement || achievement.current < achievement.target || profile.claimedAchievements.includes(achievementId)) return rawProfile;
  const unlockedProfileImages = achievement.profileImageId
    ? [...new Set([...profile.unlockedProfileImages, achievement.profileImageId])]
    : profile.unlockedProfileImages;
  return grantTrainerExperience({
    ...profile,
    money: profile.money + (achievement.moneyReward || 0),
    unlockedProfileImages,
    claimedAchievements: [...profile.claimedAchievements, achievementId],
  }, achievement.reward);
}

export function equipProfileImage(rawProfile, profileImageId) {
  const profile = normalizeTrainerProfile(rawProfile);
  if (!profile.unlockedProfileImages.includes(profileImageId)) return rawProfile;
  return normalizeTrainerProfile({ ...profile, profileImage: profileImageId });
}

export function buyItem(rawProfile, itemId, offeredPrice, requestedQuantity = 1) {
  const profile = normalizeTrainerProfile(rawProfile);
  const item = SHOP_ITEMS.find(candidate => candidate.id === itemId);
  if (!item || item.price == null || item.future || item.progressionOnly) return rawProfile;
  const quantity = item.rewardType === 'title'
    ? 1
    : Math.max(1, Math.min(99, Math.floor(Number(requestedQuantity) || 1)));
  const numericOffer = Number(offeredPrice);
  const unitPrice = offeredPrice == null || !Number.isFinite(numericOffer)
    ? item.price
    : Math.max(0, Math.min(item.price, Math.round(numericOffer)));
  const price = unitPrice * quantity;
  if (profile.money < price) return rawProfile;
  if (item.rewardType === 'title') {
    if (profile.eventTitles?.some(title => title.id === item.id)) return rawProfile;
    return normalizeTrainerProfile({
      ...profile,
      money: profile.money - price,
      eventTitles: [
        ...(profile.eventTitles || []),
        { id: item.id, name: item.name, requirement: 'Adquirido en la Tienda Pokémon.' },
      ],
    });
  }
  return normalizeTrainerProfile({ ...profile, money: profile.money - price, inventory: { ...profile.inventory, [itemId]: (profile.inventory[itemId] || 0) + quantity } });
}

export function renameTrainer(rawProfile, rawName) {
  const profile = normalizeTrainerProfile(rawProfile);
  const name = rawName.trim();
  if (!name || name.length > 12 || name === profile.name || [...name].some(char => char.charCodeAt(0) < 32)) return rawProfile;
  const hasPass = (profile.inventory['rename-pass'] || 0) > 0;
  if (!hasPass && profile.money < RENAME_COST) return rawProfile;
  return normalizeTrainerProfile({ ...profile, name, money: profile.money - (hasPass ? 0 : RENAME_COST), inventory: hasPass ? { ...profile.inventory, 'rename-pass': profile.inventory['rename-pass'] - 1 } : profile.inventory });
}
