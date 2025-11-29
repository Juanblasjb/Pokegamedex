// src/data/gymData.js

export const GYM_DATA = [
  {
    id: 'pallet',
    name: 'Pueblo Paleta',
    type: 'Inicio',
    x: 10, y: 50,
    isGym: false,
    minCaptures: 0,
    background: '/assets/backgrounds/pallet.png', 
    description: "Hogar dulce hogar. Aquí comienza tu viaje Pokémon.",
    // Sin datos de batalla porque no es gym
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
    required: 1, 
    minCaptures: 20,
    background: '/assets/backgrounds/cerulean.png', 
    description: "Especialistas en Agua. Líder: Misty.",
    
    minions: [
      {
        id: 'm_misty_1',
        name: 'Nadador Luis',
        image: '/assets/trainers/nadador.png',
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
        id: 'm_misty_2',
        name: 'Dominguera Diana',
        image: '/assets/trainers/camperw.png',
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
    leaderTeam: [120, 54, 121], // Staryu, Psyduck, Starmie
    scenePhase: {
        image: '/assets/scenes/brock_scene.png',
        question: "¿Qué le dice Brock a Ash en esta escena?",
        options: ["Tu Pikachu es muy débil", "¿Ya te rindes?", "Una descarga tan débil no daña a Onix", "Onix, ¡asfíxialo!"],
        correct: 1
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