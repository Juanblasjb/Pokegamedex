import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, SkipForward } from 'lucide-react';

// 1. MAPA DE IMÁGENES
const OAK_IMAGES = {
    default: '/assets/gym_leaders/oak_default.png',
    explain: '/assets/gym_leaders/oak_explain.png',
    happy:   '/assets/gym_leaders/oak_happy.png',
    serious: '/assets/gym_leaders/oak_serious.png',
    undefined: '/assets/gym_leaders/oak_default.png' 
};

const sfx = new Audio('/assets/sounds/professor-oaks-lab.mp3');

const ProfessorOakOverlay = ({ messages, onFinished }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const [currentImage, setCurrentImage] = useState(OAK_IMAGES['default']);
  const [fadeImage, setFadeImage] = useState(false);

  const typingIntervalRef = useRef(null);

  const currentData = messages[currentLineIndex];
  const fullText = typeof currentData === 'string' ? currentData : currentData.text;
  const currentEmotion = typeof currentData === 'string' ? 'default' : (currentData.emotion || 'default');

  // --- NUEVO: PRECARGA DE IMÁGENES (Soluciona el lag) ---
  useEffect(() => {
    Object.values(OAK_IMAGES).forEach((src) => {
        const img = new Image();
        img.src = src;
    });
  }, []);

  // EFECTO DE CAMBIO DE IMAGEN
  useEffect(() => {
      const newImg = OAK_IMAGES[currentEmotion];
      if (newImg !== currentImage) {
          setFadeImage(true);
          // Reducimos el tiempo de fade para que se sienta más rápido (100ms)
          setTimeout(() => {
              setCurrentImage(newImg);
              setFadeImage(false); 
          }, 100); 
      }
  }, [currentEmotion]);

  // EFECTO DE ESCRITURA
  useEffect(() => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    setDisplayedText(""); 
    setIsTyping(true);
    
    let charIndex = 0;
    
    typingIntervalRef.current = setInterval(() => {
      if (charIndex < fullText.length) {
        const nextText = fullText.slice(0, charIndex + 1);
        setDisplayedText(nextText);
        charIndex++;
      } else {
        clearInterval(typingIntervalRef.current);
        setIsTyping(false);
      }
    }, 30);

    return () => {
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, [fullText]);

  const handleNext = () => {
    if (isTyping) {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      setDisplayedText(fullText);
      setIsTyping(false);
    } else {
      if (currentLineIndex < messages.length - 1) {
        setCurrentLineIndex(prev => prev + 1);
      } else {
        onFinished();
      }
    }
  };

  return (
    <div className="absolute inset-0 z-[200] flex flex-col justify-end items-center pb-12 px-4 md:px-20 bg-black/10 backdrop-blur-sm animate-fade-in select-none overflow-hidden">
        
        {/* IMAGEN DEL PROFESOR (AGRANDADA) */}
        <div className={`
            absolute bottom-28 left-1/2 transform -translate-x-1/2 
            w-[280px] md:w-[500px] lg:w-[350px] /* AUMENTO SIGNIFICATIVO DE TAMAÑO */
            z-10 pointer-events-none 
            transition-opacity duration-200 ease-linear /* Transición más rápida */
            ${fadeImage ? 'opacity-70' : 'opacity-100'} /* No desaparece del todo para evitar parpadeo */
        `}>
            <img 
                src={currentImage}
                alt="Prof. Oak" 
                className="w-full h-auto drop-shadow-[0_0_50px_rgba(0,0,0,0.5)] filter brightness-110"
                onError={(e) => {
                    if (e.target.src !== OAK_IMAGES.default) e.target.src = OAK_IMAGES.default;
                }} 
            />
        </div>

        {/* CAJA DE DIÁLOGO */}
        <div 
            onClick={handleNext}
            className="relative z-20 w-full max-w-3xl mx-auto bg-slate-900/95 border-2 border-green-500/50 rounded-xl p-6 shadow-[0_0_50px_rgba(34,197,94,0.15)] cursor-pointer group hover:border-green-400 transition-colors"
        >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-1 rounded-full font-black italic uppercase tracking-widest text-sm shadow-lg border border-green-400">
                Prof. Oak
            </div>

            <p className="text-lg md:text-xl font-mono text-center text-green-100 leading-relaxed drop-shadow-md min-h-[4.5rem] flex items-center justify-center">
                {displayedText}
                <span className="animate-pulse inline-block ml-1 font-bold text-green-400">_</span>
            </p>

            <div className="absolute bottom-4 right-4 text-green-500 animate-bounce">
                {isTyping ? <SkipForward size={20} className="opacity-50" /> : <ChevronRight size={24} strokeWidth={3} />}
            </div>

            {/* Decoraciones */}
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-500 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-500 rounded-bl-lg"></div>
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500 rounded-tl-lg"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500 rounded-br-lg"></div>
        </div>
    </div>
  );
};

export default ProfessorOakOverlay;