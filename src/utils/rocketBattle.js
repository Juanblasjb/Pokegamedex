const TYPE_EFFECTIVENESS = {
  Agua: { Fuego: 2, Roca: 2, Tierra: 2, Agua: 0.5, Planta: 0.5, Dragón: 0.5 },
  Bicho: { Planta: 2, Psíquico: 2, Veneno: 0.5, Fantasma: 0.5, Fuego: 0.5, Lucha: 0.5, Volador: 0.5 },
  Eléctrico: { Agua: 2, Volador: 2, Eléctrico: 0.5, Planta: 0.5, Dragón: 0.5, Tierra: 0 },
  Fantasma: { Fantasma: 2, Psíquico: 2, Normal: 0 },
  Fuego: { Bicho: 2, Hielo: 2, Planta: 2, Agua: 0.5, Dragón: 0.5, Fuego: 0.5, Roca: 0.5 },
  Hielo: { Dragón: 2, Planta: 2, Tierra: 2, Volador: 2, Agua: 0.5, Fuego: 0.5, Hielo: 0.5 },
  Lucha: { Hielo: 2, Normal: 2, Roca: 2, Fantasma: 0, Psíquico: 0.5, Veneno: 0.5, Volador: 0.5 },
  Planta: { Agua: 2, Roca: 2, Tierra: 2, Bicho: 0.5, Dragón: 0.5, Fuego: 0.5, Planta: 0.5, Veneno: 0.5, Volador: 0.5 },
  Psíquico: { Lucha: 2, Veneno: 2, Psíquico: 0.5 },
  Roca: { Bicho: 2, Fuego: 2, Hielo: 2, Volador: 2, Lucha: 0.5, Tierra: 0.5 },
  Tierra: { Eléctrico: 2, Fuego: 2, Roca: 2, Veneno: 2, Bicho: 0.5, Planta: 0.5, Volador: 0 },
  Veneno: { Planta: 2, Fantasma: 0.5, Roca: 0.5, Tierra: 0.5, Veneno: 0.5 },
  Volador: { Bicho: 2, Lucha: 2, Planta: 2, Eléctrico: 0.5, Roca: 0.5 },
};

const stat = (pokemon, key) => Number(pokemon?.battleStats?.[key] ?? pokemon?.stats?.[key] ?? 1);
const types = pokemon => Array.isArray(pokemon?.type) ? pokemon.type : [pokemon?.type].filter(Boolean);

export function typeMultiplier(attackTypes, defenderTypes) {
  const attacks = Array.isArray(attackTypes) ? attackTypes : [attackTypes];
  const defenders = Array.isArray(defenderTypes) ? defenderTypes : [defenderTypes];
  if (!attacks.length) return 1;
  return Math.max(...attacks.map(attack => defenders.reduce((value, defender) => value * (TYPE_EFFECTIVENESS[attack]?.[defender] ?? 1), 1)));
}

export function scoreDoubleTeam(team, opponents, tactic = 'balanced') {
  const tacticWeights = {
    assault: { atk: 1.35, spAtk: 1.35, def: 0.75, spDef: 0.75, spd: 1 },
    guard: { atk: 0.82, spAtk: 0.82, def: 1.35, spDef: 1.35, spd: 0.9 },
    speed: { atk: 1, spAtk: 1, def: 0.9, spDef: 0.9, spd: 1.55 },
    balanced: { atk: 1, spAtk: 1, def: 1, spDef: 1, spd: 1 },
  };
  const weights = tacticWeights[tactic] || tacticWeights.balanced;
  return team.reduce((total, pokemon) => {
    const offense = (stat(pokemon, 'atk') * weights.atk) + (stat(pokemon, 'spAtk') * weights.spAtk);
    const defense = (stat(pokemon, 'def') * weights.def) + (stat(pokemon, 'spDef') * weights.spDef) + (stat(pokemon, 'hp') * 0.55);
    const speed = stat(pokemon, 'spd') * weights.spd;
    const matchup = opponents.length
      ? opponents.reduce((sum, opponent) => sum + typeMultiplier(types(pokemon), types(opponent)), 0) / opponents.length
      : 1;
    return total + ((offense * matchup) + defense + speed);
  }, 0);
}

export function resolveRocketBattle(userTeam, enemyTeam, tactic, randomValue = Math.random()) {
  const variance = 0.94 + (Math.max(0, Math.min(1, randomValue)) * 0.12);
  const userScore = scoreDoubleTeam(userTeam, enemyTeam, tactic) * variance;
  const enemyScore = scoreDoubleTeam(enemyTeam, userTeam, 'balanced');
  return { won: userScore >= enemyScore, userScore: Math.round(userScore), enemyScore: Math.round(enemyScore) };
}

export function applyRocketDefeat(profile, opponent, randomValue = Math.random()) {
  const boss = Boolean(opponent?.boss);
  const moneyLost = Math.min(profile.money || 0, Math.round((opponent?.reward || 0) * (boss ? 2 : 0.5)));
  const inventory = { ...(profile.inventory || {}) };
  let stolenItemId = null;
  if (boss) {
    const candidates = Object.keys(inventory).filter(id => inventory[id] > 0 && !['fossil-helix', 'fossil-dome'].includes(id));
    if (candidates.length) {
      stolenItemId = candidates[Math.min(candidates.length - 1, Math.floor(randomValue * candidates.length))];
      inventory[stolenItemId] -= 1;
    }
  }
  return { profile: { ...profile, money: Math.max(0, (profile.money || 0) - moneyLost), inventory }, moneyLost, stolenItemId };
}
