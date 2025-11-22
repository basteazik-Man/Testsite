import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/assistant.css";

// --- ССЫЛКИ НА ГИФКИ ---
const GIFS = {
  // Твой загруженный GIF (Машет рукой)
  greeting: "/1000259609-unscreen.gif", 
  
  // Временные ссылки для остальных фаз (ЗАМЕНИ ИХ НА СВОИ)
  repair: "https://media.giphy.com/media/6tHy8UAbv3zgs/giphy.gif",   
  oops: "https://media.giphy.com/media/12dA9Gei6U4in6/giphy.gif",     
  kick: "https://media.giphy.com/media/xT5LMBjGtzwmVNoFvG/giph-y.gif"  
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Assistant({ size = 180, onClick }) {
  const [phase, setPhase] = useState("greeting");

  useEffect(() => {
    let isMounted = true;

    const runSequence = async () => {
      while (isMounted) {
        // 1. ПРИВЕТСТВИЕ (3 сек)
        setPhase("greeting");
        await wait(3000);
        if (!isMounted) break;

        // 2. РЕМОНТ (3 сек)
        setPhase("repair");
        await wait(3000);
        if (!isMounted) break;

        // 3. ОСОЗНАНИЕ / УПС (2 сек)
        setPhase("oops");
        await wait(2000);
        if (!isMounted) break;

        // 4. ПИНОК / УХОД (2 сек)
        setPhase("kick");
        await wait(2000);
        
        // Цикл повторяется
      }
    };

    runSequence();
    return () => { isMounted = false; };
  }, []);

  // Данные для текста в облачке в зависимости от фазы
  const getBubbleContent = () => {
    switch (phase) {
      case "greeting": return { title: "👋 Банана?", subtitle: "Привет!" };
      case "repair": return { title: "🛠️ РЕМОНТ!", subtitle: "Чиним..." };
      case "oops": return { title: "😳 Ой...", subtitle: "Сломалось?" };
      case "kick": return { title: "🤫 Тссс...", subtitle: "Ничего не было" };
      default: return { title: "👋 Банана?", subtitle: "Привет!" };
    }
  };

  const bubble = getBubbleContent();

  return (
    <div 
      className="relative flex flex-col items-center justify-end cursor-pointer group" 
      style={{ width: size, height: size * 1.2 }} 
      onClick={onClick}
    >
      {/* --- ОБЛАЧКО С ТЕКСТОМ --- */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={phase} 
          className="absolute -top-24 z-50 pointer-events-none"
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white border-4 border-yellow-400 rounded-3xl p-4 shadow-xl relative min-w-[140px] text-center">
             <p className="font-bold text-gray-800 text-lg">{bubble.title}</p>
             <p className="text-sm text-gray-500 mt-1 font-medium">{bubble.subtitle}</p>
             {/* Треугольник снизу */}
             <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-yellow-400"></div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* --- ПЛЕЕР ГИФОК --- */}
      <div className="relative w-full h-full flex items-end justify-center">
        <AnimatePresence mode="wait">
           <motion.img
             key={phase}
             src={GIFS[phase]} 
             alt="Minion Animation"
             className="w-full h-full object-contain drop-shadow-2xl"
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 1.1 }}
             transition={{ duration: 0.2 }}
           />
        </AnimatePresence>
      </div>
    </div>
  );
}