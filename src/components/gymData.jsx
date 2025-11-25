export const GYM_NODES = [
  {
    id: 'pallet',
    name: 'Pueblo Paleta',
    type: 'Inicio',
    x: 10, y: 50,
    isGym: false,
    minCaptures: 0, // No requiere nada para empezar
    background: '/assets/backgrounds/pallet.jpg', 
    description: "Hogar dulce hogar. Aquí comienza tu viaje Pokémon."
  },
  {
    id: 'pewter',
    name: 'Ciudad Plateada',
    type: 'Roca',
    leader: 'Brock',
    x: 20, y: 50,
    isGym: true,
    badge: '/assets/badges/roca.png',
    leaderImg: '/assets/gym_leaders/brock.png',
    required: 0, // Requiere 0 medallas (es el primero)
    minCaptures: 10, // <--- NUEVO: REGLA DE 10 POKÉMON
    background: '/assets/backgrounds/pewter.jpg',
    description: "El Gimnasio de Ciudad Plateada es el primer gimnasio de Kanto. Se especializa en Pokémon de tipo Roca y su líder es Brock."
  },
  {
    id: 'cerulean',
    name: 'Ciudad Celeste',
    type: 'Agua',
    leader: 'Misty',
    x: 30, y: 50,
    isGym: true,
    badge: '/assets/badges/cascada.png',
    leaderImg: '/assets/gym_leaders/misty.png',
    required: 1, // Requiere haber ganado a Brock (1 medalla)
    minCaptures: 20, // <--- NUEVO: REGLA DE 20 POKÉMON
    background: '/assets/backgrounds/cerulean.png', 
    description: "El Gimnasio de Ciudad Celeste es conocido por su gran piscina. Se especializa en Pokémon de tipo Agua y su líder es Misty."
  },
  {
    id: 'vermilion',
    name: 'Ciudad Carmín',
    type: 'Eléctrico',
    leader: 'Lt. Surge',
    x: 40, y: 50,
    isGym: true,
    badge: '/assets/badges/trueno.png',
    leaderImg: '/assets/gym_leaders/surge.png',
    required: 2,
    minCaptures: 30, // Progresión +10
    background: '/assets/backgrounds/vermilion.png',
    description: "Ubicado cerca del puerto. Se especializa en Pokémon de tipo Eléctrico y su líder es el Teniente Surge."
  },
  {
    id: 'celadon',
    name: 'Ciudad Azulona',
    type: 'Planta',
    leader: 'Erika',
    x: 50, y: 50,
    isGym: true,
    badge: '/assets/badges/arcoiris.png',
    leaderImg: '/assets/gym_leaders/erika.png',
    required: 3,
    minCaptures: 40,
    background: '/assets/backgrounds/celadon.png',
    description: "Un gimnasio lleno de naturaleza y flores. Se especializa en Pokémon de tipo Planta y su líder es Erika."
  },
  {
    id: 'fuchsia',
    name: 'Ciudad Fucsia',
    type: 'Veneno',
    leader: 'Koga',
    x: 60, y: 50,
    isGym: true,
    badge: '/assets/badges/alma.png',
    leaderImg: '/assets/gym_leaders/koga.png',
    required: 4,
    minCaptures: 50,
    background: '/assets/backgrounds/fuchsia.png',
    description: "Un laberinto de paredes invisibles. Se especializa en Pokémon de tipo Veneno y su líder es el ninja Koga."
  },
  {
    id: 'saffron',
    name: 'Ciudad Azafrán',
    type: 'Psíquico',
    leader: 'Sabrina',
    x: 70, y: 50,
    isGym: true,
    badge: '/assets/badges/pantano.png',
    leaderImg: '/assets/gym_leaders/sabrina.png',
    required: 5,
    minCaptures: 60,
    background: '/assets/backgrounds/saffron.png',
    description: "El corazón de Kanto. Se especializa en Pokémon de tipo Psíquico y su líder es la poderosa Sabrina."
  },
  {
    id: 'cinnabar',
    name: 'Isla Canela',
    type: 'Fuego',
    leader: 'Blaine',
    x: 80, y: 50,
    isGym: true,
    badge: '/assets/badges/volcan.png',
    leaderImg: '/assets/gym_leaders/blaine.png',
    required: 6,
    minCaptures: 70,
    background: '/assets/backgrounds/cinnabar.png',
    description: "Situado en un volcán activo. Se especializa en Pokémon de tipo Fuego y su líder es el ardiente Blaine."
  },
  {
    id: 'viridian',
    name: 'Ciudad Verde',
    type: 'Tierra',
    leader: 'Giovanni',
    x: 90, y: 50,
    isGym: true,
    badge: '/assets/badges/tierra.png',
    leaderImg: '/assets/gym_leaders/giovanni.png',
    required: 7,
    minCaptures: 80,
    background: '/assets/backgrounds/viridian.png',
    description: "El desafío final antes de la Liga. Se especializa en Pokémon de tipo Tierra y su líder es el jefe del Team Rocket, Giovanni."
  }
];