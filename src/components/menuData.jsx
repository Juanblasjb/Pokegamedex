const POKEMON_IMAGES = {
    default: '/assets/pokemon/normal/38.png', // Jigglypuff o tu preferido
    new_game: '/assets/pokemon/normal/3.png', // Venusaur
    continue_game: '/assets/pokemon/normal/6.png', // Charizard
    trainer_card: '/assets/pokemon/normal/9.png', // Blastoise
<<<<<<< HEAD
    profile: '/assets/pokemon/normal/133.png', // Eevee
    albums: '/assets/pokemon/normal/65.png', // Alakazam
=======
    options: '/assets/pokemon/normal/137.png', // Porygon
    help: '/assets/pokemon/normal/65.png', // Alakazam
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
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
<<<<<<< HEAD
        mainTitle: 'FICHA DE ENTRENADOR',
=======
        mainTitle: 'PERFIL DE USUARIO',
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
        subtitle: 'Accede a tus estadísticas, medallas obtenidas y gestión del equipo Pokémon.',
        modeTitle: 'IDENTIFICACIÓN',
        pokemonImage: POKEMON_IMAGES.trainer_card,
    },
    {
<<<<<<< HEAD
        id: 'profile',
        label: 'Mi Perfil',
        mainTitle: 'MI PERFIL',
        subtitle: 'Consulta tu identidad, título y progreso como entrenador Pokémon.',
        modeTitle: 'IDENTIDAD',
        pokemonImage: POKEMON_IMAGES.profile,
    },
    {
        id: 'albums',
        label: 'Álbumes',
        mainTitle: 'ÁLBUMES POKÉMON',
        subtitle: 'Organiza y consulta tus colecciones de láminas Pokémon.',
        modeTitle: 'COLECCIÓN',
        pokemonImage: POKEMON_IMAGES.albums,
=======
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
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
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
<<<<<<< HEAD
    mainTitle: 'POKÉDEX v.0.7.0',
    subtitle: 'Sistema operativo listo. Selecciona un módulo para comenzar.',
    modeTitle: 'ESPERANDO COMANDO',
    pokemonImage: POKEMON_IMAGES.default,
};
=======
    mainTitle: 'POKÉDEX v.0.6.0',
    subtitle: 'Sistema operativo listo. Selecciona un módulo para comenzar.',
    modeTitle: 'ESPERANDO COMANDO',
    pokemonImage: POKEMON_IMAGES.default,
};
>>>>>>> 9ea0f48765a23acf8ea8b3642cc3f8efd8f186b1
