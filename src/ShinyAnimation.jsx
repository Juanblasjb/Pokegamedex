import React from 'react';

const ShinyAnimation = () => {
  // Generamos posiciones más centradas (20% a 80% en lugar de 0-100)
  // para que no salgan en los bordes extremos
  const sparkles = Array.from({ length: 6 }).map((_, i) => {
    const top = Math.random() * 60 + 20; // 20% a 80% vertical
    const left = Math.random() * 60 + 20; // 20% a 80% horizontal
    const delay = Math.random() * 0.5;
    const size = Math.random() * 20 + 30; 

    return { id: i, top, left, delay, size };
  });

  return (
    // Usamos w-full h-full pero el padre limitará el tamaño real
    <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
        {/* Destello central */}
        <div className="absolute w-[80%] h-[80%] bg-cyan-400/20 blur-3xl animate-pulse-fast rounded-full"></div>

        {sparkles.map((s) => (
            <div
                key={s.id}
                className="absolute animate-shiny-pop"
                style={{
                    top: `${s.top}%`,
                    left: `${s.left}%`,
                    width: `${s.size}px`,
                    height: `${s.size}px`,
                    animationDelay: `${s.delay}s`
                }}
            >
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_10px_rgba(34,211,238,1)]">
                    <path 
                        d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" 
                        fill="url(#shiny-gradient)" 
                    />
                    <defs>
                        <linearGradient id="shiny-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="50%" stopColor="#22d3ee" />
                            <stop offset="100%" stopColor="#00ffff" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        ))}
    </div>
  );
};

export default ShinyAnimation;