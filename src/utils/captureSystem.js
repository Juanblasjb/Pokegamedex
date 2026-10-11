const STAT_KEYS = ['hp', 'atk', 'def', 'spAtk', 'spDef', 'spd'];

const NATURES = [
  'Fuerte', 'Osada', 'Modesta', 'Miedosa', 'Alegre', 'Serena',
  'Firme', 'Cauta', 'Audaz', 'Activa', 'Dócil', 'Rara'
];

const STAT_LABELS = {
  hp: 'PS',
  atk: 'Ataque',
  def: 'Defensa',
  spAtk: 'Ataque Especial',
  spDef: 'Defensa Especial',
  spd: 'Velocidad',
};

export const SPECIMEN_VARIATION = 0.075;
export const SHINY_CHANCE = 0.01;

export const getCaptureRecord = (saveData, pokemonId) => {
  const raw = saveData?.[pokemonId];

  if (raw === true) {
    return { registered: true, owned: true, specimen: null, captures: 1, legacy: true };
  }

  if (raw === 'unlocked') {
    return { registered: true, owned: false, specimen: null, captures: 0, specialUnlock: true };
  }

  if (raw && typeof raw === 'object') {
    return {
      registered: Boolean(raw.registered || raw.owned || raw.specimen),
      owned: Boolean(raw.owned),
      specimen: raw.specimen || null,
      captures: raw.captures || (raw.owned ? 1 : 0),
      specialUnlock: Boolean(raw.specialUnlock),
      everShiny: Boolean(raw.everShiny || raw.specimen?.isShiny),
      firstRegisteredAt: raw.firstRegisteredAt || null,
      releasedAt: raw.releasedAt || null,
      lastCapturedAt: raw.lastCapturedAt || null,
    };
  }

  return { registered: false, owned: false, specimen: null, captures: 0 };
};

export const isSpeciesRegistered = (saveData, pokemonId) => getCaptureRecord(saveData, pokemonId).registered;
export const isPokemonOwned = (saveData, pokemonId) => getCaptureRecord(saveData, pokemonId).owned;

export const countRegisteredSpecies = (saveData = {}) =>
  Object.keys(saveData).filter((id) => isSpeciesRegistered(saveData, id)).length;

export const countOwnedPokemon = (saveData = {}) =>
  Object.keys(saveData).filter((id) => isPokemonOwned(saveData, id)).length;

export const normalizeSaveData = (saveData = {}) =>
  Array.isArray(saveData)
    ? Object.fromEntries(
        saveData.map((id) => [id, getCaptureRecord({ [id]: true }, id)])
      )
    : Object.fromEntries(
        Object.entries(saveData || {}).map(([id, value]) => [id, getCaptureRecord({ [id]: value }, id)])
      );

const rollStat = (baseValue) => {
  const variation = 1 + ((Math.random() * 2 - 1) * SPECIMEN_VARIATION);
  return Math.max(1, Math.round(baseValue * variation));
};

const rollGender = (pokemon) => {
  const name = pokemon?.name || '';
  if (['Magnemite', 'Magneton', 'Voltorb', 'Electrode', 'Staryu', 'Starmie', 'Ditto', 'Porygon', 'Mewtwo', 'Mew'].includes(name)) {
    return 'Sin género';
  }

  if (name.includes('♀')) return '♀';
  if (name.includes('♂')) return '♂';
  return Math.random() < 0.5 ? '♂' : '♀';
};

export const createSpecimen = (pokemon) => {
  const stats = Object.fromEntries(
    STAT_KEYS.map((key) => [key, rollStat(pokemon.stats?.[key] || 1)])
  );

  return {
    id: `${pokemon.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    speciesId: pokemon.id,
    createdAt: Date.now(),
    stats,
    total: Object.values(stats).reduce((sum, value) => sum + value, 0),
    nature: NATURES[Math.floor(Math.random() * NATURES.length)],
    gender: rollGender(pokemon),
    isShiny: Math.random() < SHINY_CHANCE,
  };
};

export const registerCapture = (saveData, pokemon) => {
  const current = getCaptureRecord(saveData, pokemon.id);
  const specimen = createSpecimen(pokemon);

  return {
    ...saveData,
    [pokemon.id]: {
      ...current,
      registered: true,
      owned: true,
      specimen,
      everShiny: Boolean(current.everShiny || specimen.isShiny),
      captures: current.captures + 1,
      firstRegisteredAt: current.firstRegisteredAt || current.lastCapturedAt || Date.now(),
      lastCapturedAt: Date.now(),
    },
  };
};

export const registerSpecialUnlock = (saveData, pokemonId) => ({
  ...saveData,
  [pokemonId]: {
    ...getCaptureRecord(saveData, pokemonId),
    registered: true,
    owned: false,
    specialUnlock: true,
  },
});

export const releasePokemon = (saveData, pokemonId) => {
  const current = getCaptureRecord(saveData, pokemonId);
  if (!current.registered) return saveData;

  return {
    ...saveData,
    [pokemonId]: {
      ...current,
      registered: true,
      owned: false,
      specimen: null,
      releasedAt: Date.now(),
    },
  };
};

export const getDisplayStats = (pokemon, record) => {
  const stats = record?.owned && record.specimen?.stats ? record.specimen.stats : pokemon.stats;
  return {
    stats,
    total: Object.values(stats || {}).reduce((sum, value) => sum + value, 0),
    labels: STAT_LABELS,
  };
};

export const getSpeciesDetails = (pokemon) => ({
  pokedexNumber: String(pokemon.id).padStart(3, '0'),
  category: pokemon.category || pokemon.species || inferCategory(pokemon),
  ability: pokemon.ability || pokemon.abilities?.[0] || inferAbility(pokemon),
  habitat: pokemon.habitat || inferHabitat(pokemon),
  captureRate: pokemon.captureRate || inferCaptureRate(pokemon),
});

const inferCategory = (pokemon) => {
  const question = pokemon.quiz?.find((item) => item.question?.toLowerCase().includes('categoría'));
  return question?.options?.[question.correct] ? `Pokémon ${question.options[question.correct]}` : 'Especie Pokémon';
};

const inferAbility = (pokemon) => {
  const question = pokemon.quiz?.find((item) => item.question?.toLowerCase().includes('habilidad normal'));
  return question?.options?.[question.correct] || 'No registrada';
};

const inferCaptureRate = (pokemon) => {
  const question = pokemon.quiz?.find((item) => item.question?.toLowerCase().includes('tasa de captura') || item.question?.toLowerCase().includes('ratio de captura'));
  return question?.options?.[question.correct] || 'No registrado';
};

const inferHabitat = (pokemon) => {
  const locations = pokemon.gameLocations || [];
  const wildLocation = locations.find((entry) => !entry.location?.toLowerCase().includes('no aparece'));
  return wildLocation?.location || 'Kanto';
};
