const POKEMON_IMAGES = {
    default: '/assets/pokemon/normal/38.png', // Jigglypuff o tu preferido
    new_game: '/assets/pokemon/normal/3.png', // Venusaur
    continue_game: '/assets/pokemon/normal/6.png', // Charizard
    trainer_card: '/assets/pokemon/normal/9.png', // Blastoise
    options: '/assets/pokemon/normal/137.png', // Porygon
    help: '/assets/pokemon/normal/65.png', // Alakazam
    shop: '/assets/pokemon/normal/52.png', // Meowth
};

export const menuOptions = [
    {
        id: 'new_game',
        label: 'Nueva Partida',
        mainTitle: 'COMENZAR AVENTURA',
        subtitle: 'Inicializa una nueva secuencia de simulación. Elige tu compañero y explora Kanto.',
        modeTitle: 'SISTEMA DE INICIO',
        pokemonImage: POKEMON_IMAGES.new_game,
    },
    {
        id: 'continue_game',
        label: 'Continuar',
        mainTitle: 'CARGAR DATOS',
        subtitle: 'Recupera tu progreso desde el último punto de guardado en la memoria del sistema.',
        modeTitle: 'MEMORIA',
        pokemonImage: POKEMON_IMAGES.continue_game,
    },
    {
        id: 'trainer_card',
        label: 'Ficha Entrenador',
        mainTitle: 'PERFIL DE USUARIO',
        subtitle: 'Accede a tus estadísticas, medallas obtenidas y gestión del equipo Pokémon.',
        modeTitle: 'IDENTIFICACIÓN',
        pokemonImage: POKEMON_IMAGES.trainer_card,
    },
    {
        id: 'options',
        label: 'Opciones',
        mainTitle: 'CONFIGURACIÓN',
        subtitle: 'Ajusta los parámetros del sistema, audio y visualización de la interfaz.',
        modeTitle: 'AJUSTES',
        pokemonImage: POKEMON_IMAGES.options,
    },
    {
        id: 'help',
        label: 'Ayuda',
        mainTitle: 'BASE DE CONOCIMIENTO',
        subtitle: 'Consulta la guía de operaciones y mecánicas de combate.',
        modeTitle: 'INFORMACIÓN',
        pokemonImage: POKEMON_IMAGES.help,
    },
    {
        id: 'shop',
        label: 'Tienda',
        mainTitle: 'SUMINISTROS',
        subtitle: 'Adquiere objetos y mejoras para tu aventura.',
        modeTitle: 'COMERCIO',
        pokemonImage: POKEMON_IMAGES.shop,
    },
];

export const defaultContent = {
    mainTitle: 'POKÉDEX v.0.6.0',
    subtitle: 'Sistema operativo listo. Selecciona un módulo para comenzar.',
    modeTitle: 'ESPERANDO COMANDO',
    pokemonImage: POKEMON_IMAGES.default,
};