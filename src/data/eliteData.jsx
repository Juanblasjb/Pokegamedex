import { GYM_DATA } from './gymsData';

const ELITE_MEMBERS = [
  {
    id: 'elite-lorelei',
    name: 'Lorelei',
    leader: 'Lorelei',
    type: 'Hielo',
    role: 'Alto Mando · Hielo',
    portrait: '/assets/gym_leaders/lorelei_full_art.png',
    description: 'La primera integrante del Alto Mando domina el campo con sus Pokémon de tipo Hielo.',
  },
  {
    id: 'elite-bruno',
    name: 'Bruno',
    leader: 'Bruno',
    type: 'Lucha',
    role: 'Alto Mando · Lucha',
    portrait: '/assets/gym_leaders/bruno_full_art.png',
    description: 'Un combatiente disciplinado que confía en la fuerza y resistencia de sus Pokémon.',
  },
  {
    id: 'elite-agatha',
    name: 'Agatha',
    leader: 'Agatha',
    type: 'Fantasma',
    role: 'Alto Mando · Fantasma',
    portrait: '/assets/gym_leaders/agatha_full_art.png',
    description: 'Una veterana impredecible especializada en tácticas de tipo Fantasma y Veneno.',
  },
  {
    id: 'elite-lance',
    name: 'Lance',
    leader: 'Lance',
    type: 'Dragón',
    role: 'Alto Mando · Dragón',
    portrait: '/assets/gym_leaders/lance_full_art.png',
    description: 'El maestro de los dragones aguarda al final del recorrido del Alto Mando.',
  },
  {
    id: 'elite-blue',
    name: 'Campeón Blue',
    leader: 'Blue',
    type: 'Campeón',
    role: 'Campeón de Kanto',
    portrait: '/assets/gym_leaders/blue_full_art.png',
    description: 'El Campeón de Kanto representa la quinta y última prueba de la Liga Pokémon.',
  },
];

export const ELITE_DATA = ELITE_MEMBERS.map((member, index) => {
  const battleTemplate = GYM_DATA[Math.min(index + 1, GYM_DATA.length - 1)];
  return {
    ...battleTemplate,
    ...member,
    x: 10 + (index * 20),
    y: 50,
    required: index,
    minCaptures: 80,
    isGym: true,
    isTutorial: false,
    leaderImg: member.portrait,
    leaderPortrait: member.portrait,
    minions: [],
  };
});
