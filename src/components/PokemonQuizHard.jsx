import React, { useState, useEffect } from 'react';
import { Heart, Clock, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
// IMPORTA TU DATA Y UTILS AQUÍ (Asumo que tienes una función para obtener preguntas aleatorias)
// import { getRandomQuestions } from '../utils/quizUtils'; 

const TOTAL_QUESTIONS = 15;
const INITIAL_TIME = 180; // 3 Minutos en segundos
const MAX_LIVES = 3;

const PokemonQuizHard = ({ onWin, onLose, onBack }) => {
  // --- ESTADOS DE JUEGO ---
  const [questions, setQuestions] = useState([]); // Aquí cargarías tus 15 preguntas
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [gameState, setGameState] = useState('loading'); // 'loading', 'playing', 'won', 'lost_time', 'lost_lives'
  
  // Simulación de carga de preguntas (REEMPLAZAR CON TU LÓGICA REAL)
  useEffect(() => {
    // Simular carga
    setTimeout(() => {
        // Mock data
        setQuestions(Array(15).fill({ question: "¿Es una prueba?", options: ["Si", "No"], correct: 0 }));
        setGameState('playing');
    }, 1000);
  }, []);

  // --- CRONÓMETRO ---
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('lost_time');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // --- HANDLERS ---
  const handleAnswer = (isCorrect) => {
    if (gameState !== 'playing') return;

    if (isCorrect) {
        // Acierto
        if (currentQIndex + 1 >= TOTAL_QUESTIONS) {
            setGameState('won');
            // Aquí iría tu lógica de captura (onWin)
        } else {
            setCurrentQIndex(prev => prev + 1);
        }
    } else {
        // Error
        if (lives - 1 <= 0) {
            setLives(0);
            setGameState('lost_lives');
        } else {
            setLives(prev => prev - 1);
            // Opcional: ¿Pasas a la siguiente pregunta al fallar o repites? 
            // En modo Hardcore suele ser "Fallas -> Pierdes vida -> Siguiente pregunta"
            // O "Fallas -> Pierdes vida -> Misma pregunta".
            // Asumiré que pasas a la siguiente para mantener el flujo de las 15.
            if (currentQIndex + 1 >= TOTAL_QUESTIONS) {
                 // Si era la última y fallaste, pero te quedan vidas... ¿Ganas?
                 // Depende de tu regla. Asumamos que necesitas 15 aciertos estrictos.
                 // Si fallas una, técnicamente no contestaste las 15 BIEN.
                 // Pero tu regla dice "Si te equivocas 3 veces... pierdes".
                 // Entonces puedes fallar 2 y ganar.
                 setGameState('won'); 
            } else {
                 setCurrentQIndex(prev => prev + 1);
            }
        }
    }
  };

  // Formatear tiempo mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- RENDERIZADO DE PANTALLAS DE FIN ---
  if (gameState === 'lost_lives' || gameState === 'lost_time') {
      return (
        <div className="w-screen h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white relative overflow-hidden">
            {/* Fondo Rojo de Alerta */}
            <div className="absolute inset-0 bg-red-900/20 z-0 animate-pulse"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-40 z-0"></div>

            <div className="z-10 text-center p-8 bg-slate-900/90 border border-red-500 rounded-2xl shadow-2xl max-w-md">
                <div className="flex justify-center mb-4">
                    <XCircle size={64} className="text-red-500" />
                </div>
                <h2 className="text-4xl font-black italic uppercase text-red-500 mb-2">MISIÓN FALLIDA</h2>
                <p className="text-slate-300 font-mono mb-6">
                    {gameState === 'lost_time' ? 'TIEMPO AGOTADO' : 'SISTEMAS CRÍTICOS DAÑADOS (0 VIDAS)'}
                </p>
                <p className="text-sm text-slate-500 mb-8">El Pokémon ha escapado.</p>
                
                <button onClick={onLose} className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded uppercase tracking-widest transition-all">
                    Volver al Menú
                </button>
            </div>
        </div>
      );
  }

  // --- RENDERIZADO JUEGO (UI SUPERIOR HARDCORE) ---
  return (
    <div className="w-screen h-screen bg-[#0f172a] text-white font-sans overflow-hidden flex flex-col">
        
        {/* --- HUD SUPERIOR (Diferente al modo normal) --- */}
        <div className="h-24 bg-slate-900 border-b border-red-900/30 flex items-center justify-between px-8 relative z-20">
            {/* Lado Izquierdo: Vidas */}
            <div className="flex flex-col gap-1">
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Integridad del Sistema</span>
                <div className="flex gap-2">
                    {[...Array(MAX_LIVES)].map((_, i) => (
                        <Heart 
                            key={i} 
                            size={24} 
                            className={`transition-all duration-300 ${i < lives ? 'fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'fill-slate-800 text-slate-700'}`} 
                        />
                    ))}
                </div>
            </div>

            {/* Centro: Progreso */}
            <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
                 <h2 className="text-xl font-black italic uppercase text-slate-600">MODO HARDCORE</h2>
                 <div className="text-xs font-mono text-slate-400">PREGUNTA {currentQIndex + 1} / {TOTAL_QUESTIONS}</div>
            </div>

            {/* Lado Derecho: Cronómetro */}
            <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Tiempo Restante</span>
                <div className={`flex items-center gap-2 text-3xl font-mono font-bold ${timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                    <Clock size={24} />
                    {formatTime(timeLeft)}
                </div>
            </div>
        </div>

        {/* --- ZONA DE PREGUNTAS (Aquí reutilizas o adaptas tu UI de Quiz Normal) --- */}
        <div className="flex-1 flex items-center justify-center relative p-12">
             {/* ... AQUÍ VA TU LÓGICA DE RENDERIZADO DE PREGUNTA ... */}
             {/* Placeholder visual */}
             <div className="text-center">
                <h3 className="text-2xl mb-8">Renderizar Pregunta {currentQIndex + 1} Aquí...</h3>
                <div className="flex gap-4 justify-center">
                    <button onClick={() => handleAnswer(true)} className="px-6 py-2 bg-green-600 rounded">Correcta (Test)</button>
                    <button onClick={() => handleAnswer(false)} className="px-6 py-2 bg-red-600 rounded">Incorrecta (Test)</button>
                </div>
             </div>
        </div>

    </div>
  );
};

export default PokemonQuizHard;