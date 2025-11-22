import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../styles/assistant.css";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Assistant({ size = 160, onClick }) {
  const [phase, setPhase] = useState("greeting");
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const runSequence = async () => {
      while (isMounted) {
        // 1. ПРИВЕТСТВИЕ (3 сек) - Радостные прыжки
        setPhase("greeting");
        await wait(3000);
        if (!isMounted) break;

        // 2. РЕМОНТ (3 сек) - Тряска и работа
        setCycleCount(c => c + 1);
        setPhase("repair");
        await wait(3000);
        if (!isMounted) break;

        // 3. ОСОЗНАНИЕ (1 сек) - Замирание и наклон
        setPhase("oops");
        await wait(1000);
        if (!isMounted) break;

        // 4. ВЗГЛЯД (2 сек) - Смотрит на тебя (увеличение)
        setPhase("eye_contact");
        await wait(2000);
        if (!isMounted) break;

        // 5. ПИНОК (1.5 сек) - Резкий поворот корпуса
        setPhase("kick");
        await wait(1500);
      }
    };

    runSequence();
    return () => { isMounted = false; };
  }, []);

  // --- АНИМАЦИИ ДЛЯ КАРТИНКИ (СТИКЕРА) ---

  const minionVariants = {
    // Прыгает вверх-вниз (радость)
    greeting: { 
      y: [0, -15, 0], 
      scaleY: [1, 1.05, 0.95, 1],
      rotate: 0,
      transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" } 
    },
    // Бешеная тряска (ремонт)
    repair: { 
      x: [-2, 2, -2, 2], 
      y: [0, 2, 0],
      rotate: [-2, 2, -2],
      transition: { duration: 0.1, repeat: Infinity } 
    },
    // Наклон вперед (удивление)
    oops: { 
      rotate: -15, 
      y: 10,
      scale: 1,
      transition: { type: "spring" } 
    },
    // Возврат в норму + легкое дыхание
    eye_contact: { 
      rotate: 0, 
      y: 0,
      scale: 1.1, // Чуть ближе к экрану
      transition: { duration: 0.5 }
    },
    // "Пинок" телом (резкий рывок назад и вперед)
    kick: { 
      x: [0, -20, 10, 0], 
      rotate: [0, -10, 10, 0],
      transition: { duration: 0.5, ease: "backInOut" } 
    }
  };

  return (
    <div 
      className="relative flex flex-col items-center justify-end cursor-pointer group" 
      style={{ width: size, height: size * 1.3 }} 
      onClick={onClick}
    >
      {/* --- ОБЛАЧКО --- */}
      <motion.div 
        className="absolute -top-20 z-50 pointer-events-none"
        animate={{ 
           opacity: phase === 'greeting' ? 1 : 0, 
           y: phase === 'greeting' ? 0 : 10,
           scale: phase === 'greeting' ? 1 : 0.8
        }}
      >
        <div className="bg-white border-4 border-yellow-400 rounded-3xl p-4 shadow-xl relative min-w-[140px] text-center">
           <p className="font-bold text-gray-800 text-sm">👋 Банана?</p>
           <p className="text-xs text-gray-500 mt-1">Ой... <strong className="text-blue-600">РЕМОНТ!</strong></p>
           <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-yellow-400"></div>
        </div>
      </motion.div>

      {/* --- КОНТЕЙНЕР С КАРТИНКОЙ --- */}
      <div className="relative w-full h-full flex items-end justify-center">
        
        {/* Летящие искры и детали (за спиной) */}
        {phase === 'repair' && (
             [...Array(6)].map((_, i) => (
               <motion.div 
                 key={i}
                 className="absolute bottom-10 left-1/2 w-2 h-2 bg-gray-600 rounded-sm z-0"
                 initial={{ scale: 0 }}
                 animate={{ 
                   x: (Math.random() - 0.5) * 200, 
                   y: -Math.random() * 150, 
                   opacity: [1, 0],
                   rotate: Math.random() * 720 
                 }}
                 transition={{ duration: 0.5, repeat: Infinity, repeatDelay: Math.random() * 0.1 }}
               />
             ))
        )}

        {/* САМ МИНЬОН (Картинка) */}
        <motion.img 
          src="/minion.png" // Убедись, что файл лежит в папке public и называется minion.png
          alt="Minion Assistant"
          className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
          variants={minionVariants}
          animate={phase}
        />

        {/* --- НАКЛАДНЫЕ ЭЛЕМЕНТЫ (Поверх картинки) --- */}
        
        {/* МОЛОТОК (Появляется и бьет) */}
        <motion.div 
           className="absolute bottom-10 -right-4 z-20"
           animate={{ 
             opacity: phase === 'repair' ? 1 : 0,
             rotate: phase === 'repair' ? [-45, 45, -45] : 0 // Анимация удара
           }}
           transition={{ duration: 0.15, repeat: Infinity }}
        >
           {/* Рисуем молоток CSS-ом, чтобы не искать картинку */}
           <div className="w-2 h-12 bg-yellow-700 rounded shadow-sm"></div> {/* Ручка */}
           <div className="absolute -top-2 -left-3 w-8 h-5 bg-gray-600 rounded"></div> {/* Боек */}
        </motion.div>

        {/* ТЕЛЕФОН (Который он чинит) */}
        <motion.div
           className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
           animate={{ 
             opacity: (phase === 'repair' || phase === 'oops') ? 1 : 0,
             y: phase === 'repair' ? [0, 2, -2] : 0 // Трясется вместе с ним
           }}
        >
            <div className="w-10 h-16 bg-black rounded-lg border-2 border-gray-600 flex items-center justify-center bg-gray-800">
                {phase === 'repair' && <div className="w-8 h-12 bg-red-500 rounded animate-pulse"></div>} {/* Горящий экран */}
                {phase === 'oops' && ( // Трещина
                   <div className="relative w-8 h-12 bg-black rounded overflow-hidden">
                      <div className="absolute top-1/2 left-1/2 w-12 h-0.5 bg-white -translate-x-1/2 rotate-45"></div>
                      <div className="absolute top-1/2 left-1/2 w-12 h-0.5 bg-white -translate-x-1/2 -rotate-45"></div>
                   </div>
                )}
            </div>
        </motion.div>

        {/* СЛОМАННЫЙ ТЕЛЕФОН (Улетает при пинке) */}
        {phase === 'kick' && (
           <motion.div 
              className="absolute bottom-5 left-1/2 w-8 h-12 bg-gray-800 rounded border border-gray-500 z-0"
              initial={{ x: 0, opacity: 1, rotate: 0 }}
              animate={{ x: 150, y: -50, opacity: 0, rotate: 360 }} // Улетает вправо
              transition={{ duration: 0.6, ease: "easeOut" }}
           />
        )}

      </div>
    </div>
  );
}