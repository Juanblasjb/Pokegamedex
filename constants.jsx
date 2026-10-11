const TYPES = [
  "Todos", "Normal", "Fuego", "Agua", "Planta", "Eléctrico", "Hielo", 
  "Lucha", "Veneno", "Tierra", "Volador", "Psíquico", "Bicho", 
  "Roca", "Fantasma", "Dragón", "Siniestro", "Acero", "Hada"
];

const TYPE_ICONS = {
  "Todos": "/icons/types/todos.png",
  "Normal": "/icons/types/normal.svg",
  "Fuego": "/icons/types/fuego.svg",
  "Agua": "/icons/types/agua.svg",
  "Planta": "/icons/types/planta.svg",
  "Eléctrico": "/icons/types/electrico.svg",
  "Hielo": "/icons/types/hielo.svg",
  "Lucha": "/icons/types/lucha.svg",
  "Veneno": "/icons/types/veneno.svg",
  "Tierra": "/icons/types/tierra.svg",
  "Volador": "/icons/types/volador.svg",
  "Psíquico": "/icons/types/psíquico.svg",
  "Bicho": "/icons/types/bicho.svg",
  "Roca": "/icons/types/roca.svg",
  "Fantasma": "/icons/types/fantasma.svg",
  "Dragón": "/icons/types/dragon.svg",
  "Siniestro": "/icons/types/siniestro.svg",
  "Acero": "/icons/types/acero.svg",
  "Hada": "/icons/types/hada.svg"
};

const RARITY_COLORS = {
  "Común": "text-gray-400",
  "Infrecuente": "text-green-400",
  "Raro": "text-purple-400",
  "Legendario": "text-yellow-400"
};

const RARITY_CAPTURE_RATES = {
  "Común": 0.90,
  "Infrecuente": 0.65,
  "Raro": 0.40,
  "Legendario": 0.15
};

const RARITY_STARS = {
  "Común": 1,
  "Infrecuente": 2,
  "Raro": 3,
  "Legendario": 4
};