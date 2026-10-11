const ROCKET_RECRUIT_ART = [
  '/assets/rocket_bosses/recluta1.png',
  '/assets/rocket_bosses/recluta2.png',
];

const bossArt = number => `/assets/rocket_bosses/bossrocket${number}.png`;

const recruit = (name, team, reward, index, role = 'Recluta del Team Rocket') => ({
  name,
  team,
  reward,
  role,
  image: ROCKET_RECRUIT_ART[index % ROCKET_RECRUIT_ART.length],
  threatLevel: 2,
});

const boss = (name, team, reward, number, role = 'Mando de operación') => ({
  name,
  team,
  reward,
  role,
  image: bossArt(number),
  boss: true,
  threatLevel: 5,
});

const TEAMS = [
  [19, 41], [23, 27], [20, 42], [24, 56], [21, 52], [42, 88],
  [66, 109], [67, 93], [92, 104], [93, 105], [94, 109], [81, 100],
  [82, 101], [89, 97], [105, 112], [87, 91], [119, 124], [121, 131],
  [101, 125], [112, 137], [100, 135], [34, 31],
];

const buildRecruits = (amount, start, options = {}) => Array.from({ length: amount }, (_, index) => recruit(
  typeof options.name === 'function' ? options.name(index) : options.name || 'Recluta del Team Rocket',
  TEAMS[(start + index) % TEAMS.length],
  (options.reward || 700) + index * (options.rewardStep || 85),
  index,
  typeof options.role === 'function' ? options.role(index) : options.role,
));

export const ROCKET_DATA = [
  {
    id: 'rocket-moon', name: 'Monte Luna', minCaptures: 15, x: 8,
    background: '/assets/backgrounds/moon.png',
    description: 'La primera célula Rocket busca apoderarse de los fósiles del Monte Luna.',
    reward: 'Elección de Fósil Helix o Fósil Domo',
    opponents: [
      ...buildRecruits(4, 0, { reward: 600 }),
      boss('Supernecio Miguel', [20, 42], 1500, 1),
    ],
  },
  {
    id: 'rocket-cerulean', name: 'Ciudad Celeste', minCaptures: 25, x: 20,
    background: '/assets/backgrounds/cerulean.png',
    description: 'Cinco entrenadores encubiertos protegen la operación Rocket al norte de Ciudad Celeste.',
    opponents: [
      ...buildRecruits(5, 4, {
        name: index => `Entrenador encubierto ${index + 1}`,
        role: 'Entrenador encubierto',
        reward: 850,
      }),
      boss('Jefe Flagrum', [53, 89], 1900, 2),
    ],
  },
  {
    id: 'rocket-casino', name: 'Casino Rocket', minCaptures: 35, x: 32,
    background: '/assets/backgrounds/casino.png',
    description: 'Una base clandestina funciona bajo el Casino de Ciudad Azulona.',
    opponents: [
      ...buildRecruits(9, 6, { reward: 1100, rewardStep: 95 }),
      boss('Soldados Lydia y Erick', [95, 115], 2500, 3, 'Dúo de élite Rocket'),
    ],
  },
  {
    id: 'rocket-tower', name: 'Torre Pokémon', minCaptures: 45, x: 44,
    background: '/assets/backgrounds/torre.png',
    description: 'El Team Rocket ocupa la Torre Pokémon y mantiene retenido al señor Fuji.',
    opponents: [
      ...buildRecruits(6, 9, {
        name: index => `Exorcista ${index + 1}`,
        role: 'Exorcista',
        reward: 1400,
      }),
      ...buildRecruits(3, 15, { reward: 1900, role: 'Recluta del Team Rocket' }),
      boss('Ejecutivo Protón', [94, 110], 3000, 4),
    ],
  },
  {
    id: 'rocket-silph', name: 'Silph S. A.', minCaptures: 55, x: 56,
    background: '/assets/backgrounds/silph.png',
    description: 'La corporación Silph ha sido tomada para controlar la tecnología de Poké Balls.',
    opponents: Array.from({ length: 12 }, (_, index) => recruit(
      index % 2 === 0 ? `Científico ${index / 2 + 1}` : `Recluta del Team Rocket ${Math.ceil(index / 2)}`,
      TEAMS[(12 + index) % TEAMS.length],
      1750 + index * 90,
      index,
      index % 2 === 0 ? 'Científico de Silph' : 'Recluta del Team Rocket',
    )).concat(boss('Ejecutivo Petrel', [31, 34], 3800, 5)),
  },
  {
    id: 'rocket-foam', name: 'Islas Espuma', minCaptures: 65, x: 68,
    background: '/assets/backgrounds/espuma.png',
    description: 'Los Rocket intentan capturar al ave legendaria que duerme entre el hielo.',
    reward: 'Desbloqueo del Quiz de Articuno',
    opponents: [
      ...buildRecruits(7, 16, { reward: 2100, rewardStep: 110, role: 'Recluta Rocket de élite' }),
      boss('Ejecutivo Atenea', [91, 130], 4500, 6),
    ],
  },
  {
    id: 'rocket-power', name: 'Central Energía', minCaptures: 75, x: 80,
    background: '/assets/backgrounds/central.png',
    description: 'Una operación Rocket amenaza la Central Energía y el hábitat de Zapdos.',
    reward: 'Desbloqueo del Quiz de Zapdos',
    opponents: [
      ...buildRecruits(5, 19, { reward: 2500, rewardStep: 135, role: 'Recluta Rocket de élite' }),
      boss('Ejecutivo Atlas', [82, 135], 5200, 7),
    ],
  },
  {
    id: 'rocket-viridian', name: 'Gimnasio de Ciudad Verde', minCaptures: 85, x: 92,
    background: '/assets/backgrounds/finalviridian.png',
    description: 'La confrontación final contra Giovanni decidirá el futuro del Team Rocket.',
    reward: 'Desbloqueo del Quiz de Moltres',
    opponents: [boss('Giovanni', [31, 34], 6500, 8, 'Líder del Team Rocket')],
  },
].map((node, index) => ({
  ...node,
  isGym: true,
  isTutorial: false,
  required: index,
  minLevel: 0,
  type: 'Batalla doble',
  leader: node.opponents.at(-1).name,
  leaderPortrait: node.opponents.at(-1).image,
}));

export const ROCKET_FOSSIL_SPECIES = Object.freeze([138, 139, 140, 141, 142]);
export const ROCKET_SPECIAL_UNLOCKS = Object.freeze({
  'rocket-foam': 144,
  'rocket-power': 145,
  'rocket-viridian': 146,
});
