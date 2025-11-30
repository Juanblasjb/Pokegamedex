// src/data/gymData.js

export const GYM_DATA = [
  {
    id: 'pallet-town',
    name: 'Pueblo Paleta', // Nombre para el nodo del mapa
    city: 'Pueblo Paleta', // Nombre para la tarjeta
    description: 'El inicio de tu aventura. Aprende las mecánicas básicas de combate y conocimiento con el Profesor Oak.',
    
    // Configuración de "Jefe" (Tutorial)
    leader: 'Prof. Oak',
    leaderImg: '/assets/gym_leaders/oak.png', // Asegúrate de tener una imagen de Oak
    leaderPortrait: '/assets/gym_leaders/oak1.png',
    type: 'Tutorial',
    introQuote: "¡Bienvenido al mundo Pokémon! Antes de iniciar tu viaje, repasemos los conceptos básicos de batalla.",
    threatLevel: 1, // Nivel bajo, es un tutorial
    music: '/assets/sounds/tutorial.mp3',
    // Configuración del Mapa
    x: 10, y: 50, // Posición inicial
    isGym: false, // Mantenemos false para que el icono del mapa sea un Pin, no espadas
    isTutorial: true, // NUEVA FLAG IMPORTANTE
    minCaptures: 0,
    required: 0,
    background: '/assets/backgrounds/pallet.png',
    badge: 'Licencia', // Nombre del premio

    // SIN MINIONS (Saltará directo al Líder/Tutorial)
    minions: [],

    // --- NUEVO: GUIONES DEL TUTORIAL ---
    tutorialScripts: {
        intro: [
            { text: "¡Hola! Soy el Profesor Oak. Bienvenido al Simulador de Batalla de Gimnasio.", emotion: "default" },
            { text: "Aquí pondrás a prueba tus conocimientos y estrategias antes de enfrentar a los Líderes.", emotion: "explain" },
            { text: "Un combate de Gimnasio consta de 3 Fases distintas.", emotion: "explain" },
            { text: "¡Empecemos con la teoría!", emotion: "happy" }
        ],
        phase1: [
            { text: "FASE 1: CONOCIMIENTO TÉCNICO.", emotion: "default" },
            { text: "Un buen entrenador debe conocer la teoría. Responderás preguntas sobre tipos y objetos.", emotion: "explain" },
            { text: "¡Demuéstrame lo que sabes!", emotion: "serious" }
        ],
        phase2: [
            { text: "FASE 2: LA ARENA DE COMBATE (ESTADIO).", emotion: "default" },
            { text: "Aquí es donde tu equipo Pokémon entra en acción. Seleccionarás 3 Pokémon de tu PC.", emotion: "happy" },
            { text: "El sistema girará una ruleta eligiendo una Estadística (Ataque, Velocidad, HP...) y una condición (Mayor o Menor).", emotion: "explain" },
            { text: "Debes elegir al Pokémon de tu equipo que mejor se adapte a esa condición para vencer al mío.", emotion: "explain" },
            { text: "¡Es una batalla de estrategia y conocimiento de tus propias criaturas!", emotion: "serious" }
        ],
        phase3: [
            { text: "FASE 3: ANÁLISIS DE CAMPO (ESCENA).", emotion: "default" },
            { text: "Un entrenador debe ser observador. Te mostraré una imagen de una situación real o del anime.", emotion: "explain" },
            { text: "Tendrás que analizarla y responder una pregunta específica sobre lo que estás viendo.", emotion: "explain" },
            { text: "A veces la respuesta está en un detalle pequeño. ¡Abre bien los ojos!", emotion: "serious" }
        ],
        // --- NUEVO: GUION FINAL ---
        victory: [
            { text: "¡Excelente trabajo! Has completado el entrenamiento básico con éxito.", emotion: "happy" },
            { text: "Has demostrado tener el potencial necesario para convertirte en un gran Maestro Pokémon.", emotion: "default" },
            { text: "Ahora comienza tu verdadero viaje. Viaja por todo Kanto y desafía a los 8 Líderes de Gimnasio.", emotion: "default" },
            { text: "Si logras reunir las 8 medallas, obtendrás el derecho de acceder a la Liga Pokémon...", emotion: "explain" },
            { text: "...y ¡Tendrás la oportunidad de desafiar al Alto Mando para coronarte Campeón!.", emotion: "happy" },
            { text: "¡Buena suerte en tu aventura! El mundo Pokémon te espera.", emotion: "happy" }
        ]
    },
    leaderPhase1: [
      {
        question: "¿Cuál de estos NO es un Pokémon inicial de Kanto?",
        options: ["Charmander", "Squirtle", "Pikachu", "Chikorita"],
        correct: 3 // Riolu
      },
      {
        question: "¿Qué objeto se usa para capturar Pokémon?",
        options: ["Poción", "Poké Ball", "Mapa", "Bicicleta"],
        correct: 1
      },
      {
        question: "¿A qué lugar debes ir para curar a tus Pokémon heridos totalmente gratis?",
        options: ["Centro Pokémon", "Tienda", "Hierba", "Gimnasios"],
        correct: 0
      },
    ],

    // FASE 2: Equipo de Oak (Básico)
    leaderTeam: [1, 4, 7], // Bulbasaur, Charmander, Squirtle

    // FASE 3: Escena (Imagen fácil)
    scenePhase: {
      image: '/assets/scenes/tutorial.png', // Una imagen de Ash recibiendo a Pikachu o algo icónico
      question: "¿Qué Pokémon le entrega el Profesor Oak a Ash al inicio del anime?",
      options: ["Bulbasaur", "Charmander", "Squirtle", "Pikachu"],
      correct: 3
    }
  },
  {
    id: 'pewter',
    name: 'Ciudad Plateada',
    type: 'Roca',
    leader: 'Brock',
    x: 20, y: 50,
    isGym: true,
    badge: '/assets/badges/roca.png',
    leaderImg: '/assets/gym_leaders/brock1.png',
    leaderPortrait: '/assets/gym_leaders/brock.png', 
    introQuote: "¡Soy BROCK! ¡Creo en la gran resistencia de la roca y en la determinación! ¡Enséñame lo que vales!",
    threatLevel: 3,
    required: 0, 
    minCaptures: 10,
    background: '/assets/backgrounds/pewter.png',
    description: "Especialistas en Roca. Líder: Brock.",
    
    // --- DATOS DE BATALLA ---
    minions: [
      {
        id: 'm_brock_1',
        name: 'Campista Angelito',
        image: '/assets/trainers/camper.png',
        introQuote: "¡Alto ahí, enclenque! ¡Todavía estás a años luz de retar a BROCK!",
        threatLevel: 1,
        quiz: [
            // Aquí irían tus 15 preguntas
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué hace el movimiento 'Rizo Defensa' que usa su Geodude?", options: ["Sube el Ataque", "Sube la Defensa", "Baja la Velocidad", "Sube la Precisión"], correct: 1 },
            { question: "¿Tiene nombre propio 'Angelito' en la versión original de Game Boy (Rojo/Azul)?", options: ["Sí, se llama Joaquín", "No, solo se llama Joven", "Sí, se llama Gary", "Sí, se llama Bob"], correct: 1 },
            { question: "¿Qué movimiento aprende su Diglett (en Gen 1) a nivel bajo?", options: ["Magnitud", "Arañazo", "Gruñido", "Excavar"], correct: 1 },
            { question: "¿Qué estadística base es más alta en su Geodude?", options: ["Velocidad", "Defensa", "Ataque Especial", "PS"], correct: 1 },
            { question: "¿Aparece Angelito en el anime de Pokémon (temporada 1)?", options: ["Sí, pelea contra Ash", "No, Ash pelea directo con Brock", "Sí, es el árbitro", "Sí, vende piedras"], correct: 1 },
            { question: "¿Qué relación tiene con Brock dentro del gimnasio?", options: ["Es su hermano", "Es un entrenador subordinado", "Es su rival", "Es su hijo"], correct: 1 },
            { question: "¿Tiene alguna poción para usar en combate?", options: ["Sí, una", "Sí, dos", "No", "Solo en modo difícil"], correct: 2 },
            { question: "¿Cuál es el nombre en inglés de Angelito?", options: ["Camper Liam", "Youngster Joey", "Hiker Kevin", "Camper Jerry"], correct: 0 },
            { question: "¿Qué ataque de estado molesto usa su Sandshrew?", options: ["Ataque Arena", "Hipnosis", "Paralizador", "Polvo Veneno"], correct: 0 },
            { question: "¿En Pokémon Amarillo, cambia su equipo?", options: ["Sí, tiene niveles más bajos", "No, es idéntico a Rojo/Azul", "Sí, tiene un Rattata", "Sí, tiene un Mankey"], correct: 0 },
            { question: "¿Qué objeto lleva equipado su Sandshrew normalmente?", options: ["Baya Aranja", "Polvo Suave", "Ninguno", "Arena Fina"], correct: 2 },
            { question: "¿Qué consejo te da el hombre de las gafas en la entrada sobre este entrenador?", options: ["¡Cuidado con el chico!", "El primero es pan comido", "Es el aprendiz de Brock", "No dice nada específico sobre él, habla sobre Brock"], correct: 3 },
            { question: "¿Qué color de gorra lleva en su sprite de Campista en Rojo Fuego?", options: ["Roja", "Verde", "Azul", "Amarilla"], correct: 1 },
            { question: "¿Qué habilidad tiene su Sandshrew en la Generación 3?", options: ["Velo Arena", "Corte Fuerte", "Impulso", "Electricidad Estática"], correct: 0 },
            { question: "¿Dónde está ubicado exactamente dentro del gimnasio?", options: ["Justo en la entrada", "En medio del camino hacia Brock", "Al lado de Brock", "Escondido detrás de una estatua"], correct: 1 },
            { question: "¿A qué tipo de ataque son inmunes sus dos Pokémon (Geodude/Sandshrew o Diglett)?", options: ["Normal", "Eléctrico", "Veneno", "Lucha"], correct: 1 },
            { question: "¿Qué Pokémon utiliza el Joven en la Generación 1 (Rojo/Azul) en lugar de Geodude?", options: ["Diglett", "Onix", "Cubone", "Kabuto"], correct: 0 },
            { question: "¿En qué nivel está su Sandshrew en Rojo Fuego/Verde Hoja?", options: ["9", "11", "13", "15"], correct: 1 },
            { question: "¿En qué nivel está su Geodude en Rojo Fuego/Verde Hoja?", options: ["8", "10", "12", "14"], correct: 1 },
            { question: "¿Cuántos Pokémon tiene Angelito en su equipo?", options: ["1", "2", "3", "4"], correct: 1 },
            { question: "¿Qué corrección hace él mismo sobre su frase tras ser derrotado?", options: ["Años luz mide distancia, no tiempo", "Me equivoqué de número", "Brock no es tan fuerte", "Debería haber dicho parsecs"], correct: 0 },
            // ... rellenar resto
        ]
      }
    ],
    leaderPhase1: [ // 25 Preguntas de Brock
       { question: "¿Cuál es el Pokémon insignia de Brock?", options: ["Onix", "Geodude", "Zubat", "Vulpix"], correct: 0 },
       { question: "¿En qué tipo de Pokémon se especializa Brock?", options: ["Tierra", "Lucha", "Roca", "Acero"], correct: 2 },
       { question: "¿Cuál es el nombre del padre de Brock?", options: ["Flint", "Stone", "Rocko", "Boulder"], correct: 0 },
       { question: "¿Cuál es el nombre de la madre de Brock?", options: ["Misty", "Lola", "Sarah", "Delia"], correct: 1 },
       { question: "¿Cuántos hermanos y hermanas tiene Brock (sin contarse a él)?", options: ["5", "7", "9", "10"], correct: 2 },
       { question: "¿Qué hermano de Brock se hace cargo del gimnasio en su ausencia?", options: ["Forrest", "Tommy", "Billy", "Timmy"], correct: 0 },
       { question: "¿Cuál fue el primer Pokémon que Brock atrapó en el anime?", options: ["Vulpix", "Geodude", "Zubat", "Onix"], correct: 2 },
       { question: "¿Qué sueño profesional tenía Brock al inicio de la serie?", options: ["Maestro Pokémon", "Criador Pokémon", "Investigador Pokémon", "Coordinador Pokémon"], correct: 1 },
       { question: "¿Cuál es el objetivo profesional de Brock al final de la serie?", options: ["Doctor Pokémon", "Líder de Gimnasio", "Profesor Pokémon", "Cocinero"], correct: 0 },
       { question: "¿Qué personaje reemplazó a Brock durante la saga de las Islas Naranja?", options: ["Cilan", "Tracey", "Max", "Clemont"], correct: 1 },
       { question: "¿Quién solía jalar la oreja de Brock en la región de Kanto y Johto?", options: ["Ash", "Misty", "Jessie", "May"], correct: 1 },
       { question: "¿Quién jalaba la oreja de Brock en la región de Hoenn?", options: ["May", "Max", "Misty", "Dawn"], correct: 1 },
       { question: "¿Qué MT entrega Brock en los juegos Pokémon Rojo y Azul (Gen 1)?", options: ["Avalancha", "Venganza", "Terremoto", "Tumba Rocas"], correct: 1 },
       { question: "¿Qué MT entrega Brock en Pokémon Rojo Fuego y Verde Hoja (Gen 3)?", options: ["Venganza", "Lanzarrocas", "Tumba Rocas", "Pulimento"], correct: 2 },
       { question: "¿Qué Pokémon le regaló la criadora Suzy a Brock?", options: ["Vulpix", "Ponyta", "Growlithe", "Ninetales"], correct: 0 },
       { question: "¿A qué región NO viajó Brock como compañero principal de Ash?", options: ["Johto", "Hoenn", "Sinnoh", "Teselia (Unova)"], correct: 3 },
       { question: "¿Qué edad tiene Brock cuando debuta en el anime?", options: ["10", "12", "15", "18"], correct: 2 },
       { question: "¿Qué Pokémon bebé nació de un huevo cuidado por Brock en Sinnoh?", options: ["Togepi", "Happiny", "Bonsly", "Mime Jr."], correct: 1 },
       { question: "¿Qué Pokémon de agua atrapó Brock en Hoenn?", options: ["Mudkip", "Lotad", "Wingull", "Corphish"], correct: 1 },
       { question: "¿Quién es el actor de doblaje latino original de Brock?", options: ["Gabriel Gama", "Gerardo Vázquez", "Mario Castañeda", "José Antonio Macías"], correct: 0 },
       { question: "¿Qué Pokémon de Alola se le regaló a Brock?", options: ["Comfey", "Rockruff", "Cutiefly", "Bewear"], correct: 0 },
       { question: "¿Qué Mega Evolución utiliza Brock en el anime?", options: ["Mega-Tyranitar", "Mega-Aggron", "Mega-Steelix", "Mega-Aerodactyl"], correct: 2 },
       { question: "¿Qué frase dice Brock cuando lanza una Poké Ball en el doblaje latino?", options: ["¡Ve!", "¡Yo te elijo!", "¡A la carga!", "¡Sal ahora!"], correct: 0 },
       { question: "¿Qué profesora dejó traumado a Brock en las Islas Naranja?", options: ["Juniper", "Ivy", "Magnolia", "Burnet"], correct: 1 },
       { question: "¿De qué color es el chaleco que Brock usa en la serie original?", options: ["Naranja", "Verde", "Azul", "Marrón"], correct: 1 },
       { question: "¿Qué Pokémon le regaló Brock a su hermano Forrest antes de irse a Hoenn?", options: ["Geodude", "Onix", "Crobat", "Vulpix"], correct: 1 },
       { question: "¿Cómo se llama Brock en japonés?", options: ["Satoshi", "Takeshi", "Kasumi", "Shigeru"], correct: 1 },
       { question: "¿Qué Pokémon de Brock evolucionó por felicidad?", options: ["Onix", "Golbat", "Geodude", "Pineco"], correct: 1 },
       { question: "¿Cuál es la debilidad x4 de los dos Pokémon principales de Brock en Gen 1?", options: ["Hielo", "Lucha", "Planta", "Volador"], correct: 2 },
       { question: "¿Qué Pokémon usa Brock en Pokémon Masters EX como compañero principal?", options: ["Onix", "Geodude", "Zubat", "Kabutops"], correct: 0 },
       { question: "¿En qué episodio debuta Brock en el anime?", options: ["Episodio 1", "Episodio 5", "Episodio 10", "Episodio 3"], correct: 1 },
       { question: "¿Cómo vestía Brock en su sprite original de Pokémon Rojo y Azul?", options: ["Con camiseta naranja", "Con chaleco verde", "Sin camisa", "Con traje de baño"], correct: 2 },
       // ... rellenar
    ],
    leaderTeam: [74, 95, 111], // Geodude, Onix, Rhyhorn (IDs Pokédex)
    scenePhase: {
        image: '/assets/scenes/brock_scene.png',
        question: "¿Qué le dice Brock a Ash en esta escena?",
        options: ["Tu Pikachu es muy débil", "¿Ya te rindes?", "Una descarga tan débil no daña a Onix", "Onix, ¡asfíxialo!"],
        correct: 1
    }
  },
  {
    id: 'cerulean',
    name: 'Ciudad Celeste',
    type: 'Agua',
    leader: 'Misty',
    x: 30, y: 50,
    isGym: true,
    badge: '/assets/badges/cascada.png',
    leaderImg: '/assets/gym_leaders/misty1.png',
    leaderPortrait: '/assets/gym_leaders/misty.png',
    introQuote: "¡Hola!¿Qué táctica sigues tú para atrapar y entrenar POKéMON? ¡Mi táctica es la ofensiva total con los POKéMON del tipo AGUA!",
    threatLevel: 3, 
    required: 1, 
    minCaptures: 20,
    background: '/assets/backgrounds/cerulean.png', 
    description: "Especialistas en Agua. Líder: Misty.",
    
    minions: [
      {
        id: 'm_misty_1',
        name: 'Nadador Luis',
        image: '/assets/trainers/nadador.png',
        introQuote: "¡Splash! ¡Soy el primero! ¡Al ataque!",
        threatLevel: 1,
        quiz: [
            // Aquí irían tus 15 preguntas
            { question: "¿Cuántos Pokémon tiene Luis en su equipo en Pokémon Rojo Fuego y Verde Hoja?", options: ["1", "2", "3", "4"], correct: 1 },
            { question: "¿Cuál es el primer Pokémon que saca a combatir?", options: ["Shellder", "Horsea", "Goldeen", "Staryu"], correct: 1 },            
            { question: "¿Cuál es el segundo Pokémon de su equipo?", options: ["Staryu", "Psyduck", "Shellder", "Krabby"], correct: 2 },
            { question: "¿De qué nivel es su Horsea en la Primera Generación (Rojo/Azul)?", options: ["14", "16", "18", "20"], correct: 1 },            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿De qué nivel es su Shellder en la Primera Generación (Rojo/Azul)?", options: ["15", "16", "17", "19"], correct: 1 },
            { question: "¿Qué accesorio lleva el Nadador Luis en su sprite de combate en Rojo Fuego?", options: ["Un salvavidas", "Gafas de natación y gorro", "Un tubo de buceo", "Aletas"], correct: 1 },
            { question: "¿Qué movimiento molesto de bajada de precisión usa su Horsea?", options: ["Ataque Arena", "Pantalla de Humo", "Destello", "Reducción"], correct: 1 },
            { question: "¿Qué movimiento defensivo usa su Shellder para subir su defensa?", options: ["Refugio", "Fortaleza", "Rizo Defensa", "Barrera"], correct: 0 },
            { question: "¿Cuánto dinero (aprox) entrega al vencerlo en Rojo Fuego/Verde Hoja?", options: ["64 monedas", "128 monedas", "200 monedas", "500 monedas"], correct: 0 },
            { question: "¿Qué debilidad x4 tiene su Horsea?", options: ["Planta", "Eléctrico", "Ninguna (solo x2)", "Hielo"], correct: 2 },
            { question: "¿Dónde está ubicado Luis dentro del gimnasio?", options: ["En la entrada, en tierra firme", "En el primer carril de agua", "Detrás de Misty", "En el trampolín"], correct: 1 },
            { question: "¿Qué consejo táctico da Luis antes de combatir en algunas versiones?", options: ["Misty es muy fuerte", "El agua es mi elemento", "Primero debes vencerme a mí", "Cuidado con las burbujas"], correct: 2 },
            { question: "¿Qué ataque ofensivo básico conocen sus dos Pokémon?", options: ["Pistola Agua", "Rayo Burbuja", "Surf", "Hidrobomba"], correct: 0 },
            { question: "¿Cuál de sus Pokémon tiene la Defensa física más alta?", options: ["Horsea", "Shellder", "Son iguales", "Ninguno destaca"], correct: 1 },
            { question: "¿Qué objeto lleva equipado su Shellder en Rojo Fuego (si usas Ladrón)?", options: ["Perla", "Perla Grande", "Ninguno", "Agua Mística"], correct: 2 },
            { question: "¿Qué dice Luis después de ser derrotado?", options: ["¡No puede ser!", "¡Glu, glu, glu!", "¡Eso ha dolido!", "¡Me he ahogado!"], correct: 0 },
            { question: "¿Qué color de bañador lleva en el arte oficial de Rojo Fuego?", options: ["Rojo", "Negro", "Azul", "Verde"], correct: 1 },
            { question: "¿Qué estadística base es más alta en su Horsea?", options: ["Ataque", "Ataque Especial", "Velocidad", "Defensa Especial"], correct: 1 },
            { question: "¿En Pokémon Amarillo, cambia su equipo respecto a Rojo y Azul?", options: ["Sí, tiene un Seel", "Sí, niveles más bajos", "No, mantiene Horsea y Shellder", "Sí, solo tiene a Horsea"], correct: 2 },
            { question: "¿Qué habilidad tiene su Horsea en la Gen 3?", options: ["Nado Rápido", "Francotirador", "Humedad", "Torrente"], correct: 0 },
            { question: "¿Qué habilidad tiene su Shellder en la Gen 3?", options: ["Caparazón", "Encadenado", "Armadura Frágil", "Robustez"], correct: 0 },
            { question: "¿Cuál es el nombre en inglés de este entrenador?", options: ["Swimmer Luis", "Swimmer Matt", "Swimmer Jack", "Swimmer Tom"], correct: 0 },
            { question: "¿Qué entrenador está más cerca de Luis en el gimnasio?", options: ["La Dominguera Diana", "El Joven Chano", "Misty", "Nadie, está solo"], correct: 0 },
            { question: "¿En Pokémon Let's Go, existe el 'Nadador Luis' con ese nombre?", options: ["Sí", "No, ahora todos los entrenadores son mujeres modelos", "Sí, pero con un nombre distinto", "Sí, pero tiene 6 Pokémon"], correct: 1 },
            { question: "¿Qué entrenador sustituye a Luis en el gimnasio en Pokémon Oro HeartGold y Plata SoulSilver?", options: ["Marinero Pascual", "Nadador Simón", "Modelo Alejandra", "Nadie, solo está Diana"], correct: 0 },
          ]
      },{
        id: 'm_misty_2',
        name: 'Dominguera Diana',
        image: '/assets/trainers/camperw.png',
        introQuote: "¡Soy demasiado buena para ti! ¡MISTY puede esperar!",
        threatLevel: 1,
        quiz: [
            // Aquí irían tus 15 preguntas
            { question: "¿Cuántos Pokémon tiene Diana en su equipo en el primer combate?", options: ["1", "2", "3", "4"], correct: 0 },
            { question: "¿Cuál es el único Pokémon que posee Diana?", options: ["Staryu", "Goldeen", "Horsea", "Psyduck"], correct: 1 },
            { question: "¿De qué nivel es su Goldeen en Pokémon Rojo Fuego y Verde Hoja?", options: ["16", "18", "19", "21"], correct: 2 },
            { question: "¿Dónde está ubicada Diana dentro del gimnasio?", options: ["En el agua", "En la entrada, en tierra firme", "Junto a Misty", "Escondida tras una estatua"], correct: 2 },
            { question: "¿Cuál es el nombre en inglés de esta entrenadora?", options: ["Picnicker Diana", "Lass Diana", "Beauty Diana", "Swimmer Diana"], correct: 0 },
            { question: "¿Qué ataque físico básico usa su Goldeen que hace daño normal?", options: ["Cornada", "Placaje", "Golpe Cabeza", "Doble Filo"], correct: 0 },
            { question: "¿Qué movimiento de estado usa su Goldeen para confundir a tus Pokémon?", options: ["Rayo Confuso", "Supersónico", "Danza Caos", "Beso Dulce"], correct: 1 },
            { question: "¿Cuál es la evolución del Pokémon de Diana?", options: ["Seadra", "Seaking", "Gyarados", "Lumineon"], correct: 1 },
            { question: "¿Qué objeto lleva Diana en la mano en su sprite de combate (Gen 3)?", options: ["Una Poké Ball", "Una cesta de picnic", "Un mapa", "Nada"], correct: 3 },
            { question: "¿Qué frase suele decir antes de empezar el combate?", options: ["¡Soy demasiado buena para ti!", "¡Perdona, te ganaré!", "¡Misty es la mejor!", "¡Me encanta el agua!"], correct: 0 },
            { question: "¿En qué se diferencia Diana del Nadador Luis?", options: ["Diana está en tierra y Luis en el agua", "Diana tiene 2 Pokémon", "Diana usa un Staryu", "Luis es el líder"], correct: 0 },
            { question: "¿Qué ataque volador conoce su Goldeen que sorprende a los tipo Planta?", options: ["Picotazo", "Golpe Aéreo", "Ataque Ala", "Pico Taladro"], correct: 0 },
            { question: "¿Qué habilidad tiene su Goldeen en la Generación 3?", options: ["Nado Rápido o Velo Agua", "Intimidación", "Torrente", "Llovizna"], correct: 0 },
            { question: "¿Cuál es la experiencia base que da su Goldeen (Nivel 19)?", options: ["Muy baja (aprox 200)", "Media (aprox 450)", "Alta (800)", "Cero"], correct: 1 },
            { question: "¿Qué consejo te da Diana después de vencerla?", options: ["Luchar contra otros entrenadores", "Que vayas al Centro Pokémon", "Que uses ataques eléctricos", "Que te rindas"], correct: 0 },
            { question: "¿Cambia su equipo en Pokémon Amarillo?", options: ["Sí, tiene un Psyduck", "No, sigue siendo un Goldeen Nivel 19", "Sí, evoluciona a Seaking", "Sí, tiene dos Goldeen"], correct: 1 },
            { question: "¿Qué color predomina en la ropa de una Dominguera en Rojo Fuego?", options: ["Verde", "Rojo", "Azul", "Amarillo"], correct: 0 },
            { question: "¿Por qué el ataque 'Picotazo' de su Goldeen es efectivo contra Bulbasaur?", options: ["Porque es tipo Volador", "Porque es tipo Veneno", "Porque es tipo Bicho", "No es efectivo"], correct: 0 },
            { question: "¿Aparece Diana en el anime de Pokémon como personaje con nombre?", options: ["Sí, en el episodio del gimnasio", "No, es un NPC genérico", "Sí, es hermana de Misty", "Sí, es la árbitro"], correct: 1 },
            { question: "¿Qué hace el movimiento 'Látigo' que usa su Goldeen?", options: ["Baja la Defensa", "Baja el Ataque", "Baja la Velocidad", "Sube el Ataque"], correct: 0 },
            { question: "¿Cuántos PS base (aprox) tiene un Goldeen de nivel 19?", options: ["30-40", "50-60", "80-90", "100+"], correct: 1 },
            { question: "¿En Pokémon Let's Go, existe la Dominguera Diana?", options: ["No, ha sido reemplazada por otra clase", "Sí, idéntica", "Sí, pero tiene un Magikarp", "Sí, es una líder"], correct: 0 },
            { question: "¿Qué significa 'Dominguera' en el contexto de Pokémon?", options: ["Que solo pelea los domingos", "Traducción de Picnicker (Excursionista/Campista femenina)", "Que le gusta dormir", "Que usa Pokémon solares"], correct: 1 },
            { question: "¿Cuál es la categoría de su Pokémon en la Pokédex?", options: ["Pokémon Pez Colores", "Pokémon Sirena", "Pokémon Pez Dorado", "Pokémon Reina"], correct: 0 },
            { question: "¿Qué stat es más alto en su Goldeen?", options: ["Ataque", "Defensa", "Velocidad", "PS"], correct: 0 },
            { question: "¿Qué accesorio lleva Diana en el pelo (sprite Gen 3)?", options: ["Una gorra", "Coletas", "Un lazo", "El pelo suelto"], correct: 0 },
            // ... rellenar resto
        ]
      }
    ],
    leaderPhase1: [ // 25 Preguntas de Misty
       { question: "¿Cómo se llama la medalla que entrega Misty a los entrenadores?", options: ["Medalla Roca", "Medalla Cascada", "Medalla Trueno", "Medalla Alma"], correct: 1 },
       { question: "¿Cuál es el Pokémon insignia de Misty en los videojuegos (Gen 1)?", options: ["Staryu", "Goldeen", "Starmie", "Lapras"], correct: 2 },
       { question: "¿Cuántas hermanas tiene Misty?", options: ["1", "2", "3", "4"], correct: 2 },
       { question: "¿Cómo se llaman las hermanas de Misty?", options: ["Daisy, Violet, Lily", "May, Dawn, Serena", "Jessie, Cassidy, Domino", "Joy, Jenny, Delia"], correct: 0 },
       { question: "¿Por qué razón Misty comenzó a seguir a Ash Ketchum en el anime?", options: ["Le gustaba Ash", "Quería la Pokédex", "Ash le debía una bicicleta", "Para volver juntos a Ciudad Celeste"], correct: 2 },
       { question: "¿A qué tipo de Pokémon le tiene fobia Misty?", options: ["Fantasma", "Bicho", "Siniestro", "Eléctrico"], correct: 1 },
       { question: "¿Qué Pokémon de Misty sufre de dolores de cabeza constantes?", options: ["Psyduck", "Slowpoke", "Poliwag", "Togepi"], correct: 0 },
       { question: "¿Qué Pokémon nació de un huevo que Misty cuidaba?", options: ["Togepi", "Pichu", "Azurill", "Cleffa"], correct: 0 },
       { question: "¿Qué Pokémon de Misty evolucionó hasta convertirse en Politoed?", options: ["Poliwag", "Poliwhirl", "Poliwrath", "Poliswirl"], correct: 1 },
       { question: "¿Qué MT entrega Misty en los juegos originales Rojo y Azul?", options: ["Rayo Burbuja", "Hidrobomba", "Surf", "Pistola Agua"], correct: 0 },
       { question: "¿Qué MT entrega Misty en Rojo Fuego y Verde Hoja?", options: ["Salmuera", "Hidropulso", "Rayo Burbuja", "Escaldar"], correct: 1 },
       { question: "¿En qué región viaja Misty junto a Ash y Tracey?", options: ["Kanto", "Johto", "Islas Naranja", "Hoenn"], correct: 2 },
       { question: "¿Qué Pokémon utiliza Misty para salir del agua o luchar en tierra frecuentemente al inicio?", options: ["Goldeen", "Staryu", "Horsea", "Seel"], correct: 1 },
       { question: "¿Qué cebo de pesca especial tiene Misty basado en ella?", options: ["Mini-Misty", "Sirena-Cebo", "Misty-Señuelo", "Anzuelo-Celeste"], correct: 0 },
       { question: "¿Dónde está Misty cuando el jugador interrumpe su cita en los juegos de Johto?", options: ["Puente Pepita", "Cabo Celeste", "Túnel Roca", "Monte Moon"], correct: 1 },
       { question: "¿Qué Pokémon de la región de Johto capturó Misty que es tipo Agua/Roca?", options: ["Corsola", "Quagsire", "Shuckle", "Larvitar"], correct: 0 },
       { question: "¿Quién es la actriz de doblaje latino original de Misty?", options: ["Diana Pérez", "Xóchitl Ugarte", "Cristina Hernández", "Rossy Aguirre"], correct: 1 },
       { question: "¿Qué Pokémon se enamoró del Corsola de Misty?", options: ["Totodile", "Corphish", "Psyduck", "Politoed"], correct: 0 },
       { question: "¿Cuál es el nombre japonés de Misty?", options: ["Haruka", "Hikari", "Kasumi", "Iris"], correct: 2 },
       { question: "¿Qué Pokémon usa Misty para Mega-Evolucionar en el anime (Sol y Luna)?", options: ["Blastoise", "Slowbro", "Gyarados", "Swampert"], correct: 2 },
       { question: "¿Qué Pokémon de Misty conoce el ataque Metrónomo?", options: ["Psyduck", "Togepi", "Poliwag", "Corsola"], correct: 1 },
       { question: "¿Por qué Misty no soporta las zanahorias y los pimientos?", options: ["Es alérgica", "Simplemente los odia", "Le recuerdan a los bichos", "Prefiere solo carne"], correct: 1 },
       { question: "¿Qué Pokémon de agua con forma de corazón atrapó Misty?", options: ["Alomomola", "Luvdisc", "Woobat", "Clefairy"], correct: 1 },
       { question: "¿Cómo llamó Misty a su Luvdisc?", options: ["Caserin", "Luvi", "Corazón", "Amor"], correct: 0 },
       { question: "¿Qué Pokémon legendario elige a Misty como su 'amiga' en el manga?", options: ["Articuno", "Suicune", "Kyogre", "Manaphy"], correct: 1 },
       { question: "¿En qué temporada del anime Misty deja de ser protagonista principal?", options: ["Al final de Kanto", "Al final de las Islas Naranja", "Al final de Johto", "Al final de Hoenn"], correct: 2 },
       { question: "¿Qué hace el Psyduck de Misty cuando sale de la Poké Ball sin permiso?", options: ["Ataca", "Se confunde", "Baila", "Duerme"], correct: 1 },
       { question: "¿Cuál es el nivel de Starmie cuando te enfrentas a Misty en Pokémon Rojo/Azul?", options: ["18", "21", "24", "26"], correct: 1 },
       { question: "¿Qué disfraz usó Misty en el Festival de la Princesa?", options: ["De Goldeen", "De Sirena", "De Kimono tradicional", "De Bruja"], correct: 2 },
       { question: "¿Cuál de estos Pokémon NO ha tenido Misty en el anime?", options: ["Goldeen", "Seaking", "Horsea", "Staryu"], correct: 1 },
       { question: "¿Qué ropa usa Misty en los juegos Oro HeartGold y Plata SoulSilver?", options: ["Tirantes amarillos y short", "Traje de baño blanco", "Vestido azul", "Traje de neopreno"], correct: 1 },
       { question: "¿Cómo se llama la canción dedicada a Misty en el álbum '2.B.A. Master'?", options: ["Misty's Song", "Water Girl", "Cerulean Blue", "Mermaid Dreams"], correct: 0 },

       // ... rellenar
    ],
    leaderTeam: [120, 54, 121], // Staryu, Psyduck, Starmie
    scenePhase: {
        image: '/assets/scenes/misty_scene1.png',
        question: "En el episodio ¡Princesa contra princesa!, ¿Qué Pokémon le da la victoria en el festival?",
        options: ["Starmie", "Bulbasaur de Ash", "Vulpix de Brock", "Psyduck"],
        correct: 3
    }
  },
  {
    id: 'vermilion',
    name: 'Ciudad Carmín',
    type: 'Eléctrico',
    leader: 'Lt. Surge',
    x: 40, y: 50,
    isGym: true,
    badge: '/assets/badges/trueno.png',
    leaderImg: '/assets/gym_leaders/surge1.png',
    leaderPortrait: '/assets/gym_leaders/surge.png', 
    introQuote: "¡Bienvenido al mundo Pokémon! Antes de iniciar tu viaje, repasemos los conceptos básicos de batalla.",
    threatLevel: 3,
    required: 2,
    minCaptures: 30,
    background: '/assets/backgrounds/vermilion.png',
    description: "Especialistas en Eléctrico. Líder: Lt. Surge.",
    
    // SURGE: 3 Súbditos
    minions: [
      {
        id: 'm_surge_1',
        name: 'Marinero Dimas',
        image: '/assets/trainers/marinero.png',
        introQuote: "¡Este lugar no es para niños! ¡Por muy fuerte que seas!",
        threatLevel: 1,
        quiz: [
            // Aquí irían tus 15 preguntas
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            // ... rellenar resto
        ]
      },{
        id: 'm_surge_2',
        name: 'Mecánico Manolo',
        image: '/assets/trainers/mecanico.png',
        threatLevel: 2,
        quiz: [
            // Aquí irían tus 15 preguntas
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            // ... rellenar resto
        ]
      },{
        id: 'm_surge_3',
        name: 'Caballero Tito',
        image: '/assets/trainers/caballero.png',
        threatLevel: 2,
        quiz: [
            // Aquí irían tus 15 preguntas
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            { question: "¿Qué tipo es Geodude?", options: ["Roca/Tierra", "Roca", "Tierra", "Acero"], correct: 0 },
            // ... rellenar resto
        ]
      }
    ],
   leaderPhase1: [ // 25 Preguntas de Misty
       { question: "¿Cuál es el Pokémon insignia de Brock?", options: ["Onix", "Geodude", "Zubat", "Vulpix"], correct: 0 },
       { question: "¿Cuál es el Pokémon insignia de Brock?", options: ["Onix", "Geodude", "Zubat", "Vulpix"], correct: 0 },
       { question: "¿Cuál es el Pokémon insignia de Brock?", options: ["Onix", "Geodude", "Zubat", "Vulpix"], correct: 0 },
       { question: "¿Cuál es el Pokémon insignia de Brock?", options: ["Onix", "Geodude", "Zubat", "Vulpix"], correct: 0 },
       { question: "¿Cuál es el Pokémon insignia de Brock?", options: ["Onix", "Geodude", "Zubat", "Vulpix"], correct: 0 },
       { question: "¿Cuál es el Pokémon insignia de Brock?", options: ["Onix", "Geodude", "Zubat", "Vulpix"], correct: 0 },
       { question: "¿Cuál es el Pokémon insignia de Brock?", options: ["Onix", "Geodude", "Zubat", "Vulpix"], correct: 0 },
       { question: "¿Cuál es el Pokémon insignia de Brock?", options: ["Onix", "Geodude", "Zubat", "Vulpix"], correct: 0 },
       { question: "¿Cuál es el Pokémon insignia de Brock?", options: ["Onix", "Geodude", "Zubat", "Vulpix"], correct: 0 },
       { question: "¿Cuál es el Pokémon insignia de Brock?", options: ["Onix", "Geodude", "Zubat", "Vulpix"], correct: 0 },
       { question: "¿Cuál es el Pokémon insignia de Brock?", options: ["Onix", "Geodude", "Zubat", "Vulpix"], correct: 0 },
       { question: "¿Cuál es el Pokémon insignia de Brock?", options: ["Onix", "Geodude", "Zubat", "Vulpix"], correct: 0 },
       { question: "¿Cuál es el Pokémon insignia de Brock?", options: ["Onix", "Geodude", "Zubat", "Vulpix"], correct: 0 },
       { question: "¿Cuál es el Pokémon insignia de Brock?", options: ["Onix", "Geodude", "Zubat", "Vulpix"], correct: 0 },
       { question: "¿Cuál es el Pokémon insignia de Brock?", options: ["Onix", "Geodude", "Zubat", "Vulpix"], correct: 0 },
       { question: "¿Cuál es el Pokémon insignia de Brock?", options: ["Onix", "Geodude", "Zubat", "Vulpix"], correct: 0 },
       { question: "¿Cuál es el Pokémon insignia de Brock?", options: ["Onix", "Geodude", "Zubat", "Vulpix"], correct: 0 },
       { question: "¿Cuál es el Pokémon insignia de Brock?", options: ["Onix", "Geodude", "Zubat", "Vulpix"], correct: 0 },
       { question: "¿Cuál es el Pokémon insignia de Brock?", options: ["Onix", "Geodude", "Zubat", "Vulpix"], correct: 0 },
       { question: "¿Cuál es el Pokémon insignia de Brock?", options: ["Onix", "Geodude", "Zubat", "Vulpix"], correct: 0 },
       { question: "¿Cuál es el Pokémon insignia de Brock?", options: ["Onix", "Geodude", "Zubat", "Vulpix"], correct: 0 },
       { question: "¿Cuál es el Pokémon insignia de Brock?", options: ["Onix", "Geodude", "Zubat", "Vulpix"], correct: 0 },
       { question: "¿Cuál es el Pokémon insignia de Brock?", options: ["Onix", "Geodude", "Zubat", "Vulpix"], correct: 0 },
       { question: "¿Cuál es el Pokémon insignia de Brock?", options: ["Onix", "Geodude", "Zubat", "Vulpix"], correct: 0 },
       { question: "¿Cuál es el Pokémon insignia de Brock?", options: ["Onix", "Geodude", "Zubat", "Vulpix"], correct: 0 },
       // ... rellenar
    ],
    leaderTeam: [100, 81, 26], // Voltorb, Magnemite, Raichu
    scenePhase: {
        image: '/assets/scenes/brock_scene.png',
        question: "¿Qué le dice Brock a Ash en esta escena?",
        options: ["Tu Pikachu es muy débil", "¿Ya te rindes?", "Una descarga tan débil no daña a Onix", "Onix, ¡asfíxialo!"],
        correct: 1
    }
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
    leaderPortrait: '/assets/gym_leaders/erika.png', 
    required: 3,
    minCaptures: 40,
    background: '/assets/backgrounds/celadon.png',
    description: "Especialistas en Planta. Líder: Erika.",
    
    // ERIKA: 7 Súbditos
    minions: Array(7).fill({ id: 'p', name: 'Damisela', image: '', quiz: [] }),
    leaderPhase1: [],
    leaderTeam: [44, 114, 45], // Gloom, Tangela, Vileplume
    scenePhase: { image: '', question: '', options: [], correct: 0 }
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
    leaderPortrait: '/assets/gym_leaders/koga.png', 
    required: 4,
    minCaptures: 50,
    background: '/assets/backgrounds/fuchsia.png',
    description: "Especialistas en Veneno. Líder: Koga.",
    
    // KOGA: 6 Súbditos
    minions: Array(6).fill({ id: 'p', name: 'Malabarista', image: '', quiz: [] }),
    leaderPhase1: [],
    leaderTeam: [109, 89, 110], // Koffing, Muk, Weezing
    scenePhase: { image: '', question: '', options: [], correct: 0 }
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
    leaderPortrait: '/assets/gym_leaders/sabrina.png', 
    required: 5,
    minCaptures: 60,
    background: '/assets/backgrounds/saffron.png',
    description: "Especialistas en Psíquico. Líder: Sabrina.",
    
    // SABRINA: 7 Súbditos
    minions: Array(7).fill({ id: 'p', name: 'Médium', image: '', quiz: [] }),
    leaderPhase1: [],
    leaderTeam: [64, 122, 65], // Kadabra, Mr. Mime, Alakazam
    scenePhase: { image: '', question: '', options: [], correct: 0 }
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
    leaderPortrait: '/assets/gym_leaders/blaine.png', 
    required: 6,
    minCaptures: 70,
    background: '/assets/backgrounds/cinnabar.png',
    description: "Especialistas en Fuego. Líder: Blaine.",
    
    // BLAINE: 7 Súbditos
    minions: Array(7).fill({ id: 'p', name: 'Supernecio', image: '', quiz: [] }),
    leaderPhase1: [],
    leaderTeam: [58, 77, 126], // Growlithe, Ponyta, Magmar (varía según versión)
    scenePhase: { image: '', question: '', options: [], correct: 0 }
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
    leaderPortrait: '/assets/gym_leaders/giovanni.png', 
    required: 7,
    minCaptures: 80,
    background: '/assets/backgrounds/viridian.png',
    description: "Especialistas en Tierra. Líder: Giovanni.",
    
    // GIOVANNI: 8 Súbditos
    minions: Array(8).fill({ id: 'p', name: 'Cooltrainer', image: '', quiz: [] }),
    leaderPhase1: [],
    leaderTeam: [111, 31, 34], // Rhyhorn, Nidoqueen, Nidoking
    scenePhase: { image: '', question: '', options: [], correct: 0 }
  }
];