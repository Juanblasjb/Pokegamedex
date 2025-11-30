import React, { useState, useEffect } from 'react';
// import { Check, X } from 'lucide-react'; // No se estaban usando en tu código, pero puedes dejarlos si quieres.

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const GymQuizPhase = ({ questions, requiredToWin, onPhaseComplete, title, maxQuestions }) => {
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    if (questions && questions.length > 0) {
      let randomOrderQuestions = shuffleArray(questions);
      
      // CAMBIO 2: Si hay un límite definido, recortamos el array
      if (maxQuestions && maxQuestions > 0) {
          randomOrderQuestions = randomOrderQuestions.slice(0, maxQuestions);
      }
      const processed = randomOrderQuestions.map(q => {
        const optionsWithData = q.options.map((opt, index) => ({
          text: opt,
          isCorrect: index === q.correct
        }));
        const shuffledOptions = shuffleArray(optionsWithData);
        const newCorrectIndex = shuffledOptions.findIndex(o => o.isCorrect);
        return {
          question: q.question,
          options: shuffledOptions.map(o => o.text),
          correct: newCorrectIndex
        };
      });
      
      setShuffledQuestions(processed);
      setIsReady(true);
    }
  }, [questions, maxQuestions]); // Agregamos maxQuestions a la dependencia

  if (!isReady) return <div className="p-10 text-center text-slate-500 animate-pulse">Cargando preguntas...</div>;

  const currentQ = shuffledQuestions[currentIndex];
  const progress = ((currentIndex) / shuffledQuestions.length) * 100;

  const handleOptionClick = (optionIndex) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedOption(optionIndex);

    const isCorrect = optionIndex === shuffledQuestions[currentIndex].correct;
    
    let newScore = score;
    if (isCorrect) {
      newScore = score + 1;
      setScore(newScore);
    }

    setTimeout(() => {
      if (currentIndex + 1 < shuffledQuestions.length) {
        setCurrentIndex(prev => prev + 1);
        setIsAnswered(false);
        setSelectedOption(null);
      } else {
        const passed = newScore >= requiredToWin;
        
        const stats = {
            correct: newScore,
            total: shuffledQuestions.length // Esto ahora será 15 o 25
        };

        onPhaseComplete(passed, stats);
      }
    }, 1000);
  };

  return (
    <div className="w-full h-full flex flex-col p-6 animate-fade-in relative">
        
        {/* HEADER */}
        <div className="flex justify-between items-end mb-4 border-b border-slate-700 pb-2">
            <div>
                <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-1">{title}</h3>
                <div className="text-xl font-black italic text-white">PREGUNTA {currentIndex + 1} <span className="text-slate-500 text-sm not-italic">/ {shuffledQuestions.length}</span></div>
            </div>
            <div className="text-xs font-mono text-slate-400">
                Score: <span className="text-cyan-400 font-bold">{score}</span>
            </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full h-1 bg-slate-800 rounded-full mb-6 overflow-hidden">
            <div 
                className="h-full bg-cyan-500 transition-all duration-300 shadow-[0_0_10px_cyan]" 
                style={{ width: `${progress}%` }}
            ></div>
        </div>

        {/* PREGUNTA */}
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 mb-6 flex-grow flex items-center justify-center text-center shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
                {currentQ.question}
            </h2>
        </div>

        {/* OPCIONES */}
        <div className="grid grid-cols-1 gap-3">
            {currentQ.options.map((opt, idx) => {
                let btnClass = "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-cyan-500 hover:text-cyan-200";
                
                if (isAnswered) {
                    if (idx === currentQ.correct) {
                        btnClass = "bg-green-900/50 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]";
                    } else if (idx === selectedOption) {
                        btnClass = "bg-red-900/50 border-red-500 text-white";
                    } else {
                        btnClass = "opacity-30 border-slate-800 grayscale";
                    }
                }

                return (
                    <button
                        key={idx}
                        onClick={() => handleOptionClick(idx)}
                        disabled={isAnswered}
                        className={`w-full p-4 rounded-lg border-2 text-left font-bold transition-all duration-200 flex items-center gap-3 ${btnClass}`}
                    >
                        <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-black ${isAnswered ? 'bg-black/30' : 'bg-black/20'}`}>
                            {String.fromCharCode(65 + idx)}
                        </div>
                        {opt}
                    </button>
                );
            })}
        </div>
    </div>
  );
};

export default GymQuizPhase;