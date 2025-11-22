import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../styles/assistant.css";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Assistant({ size = 160, onClick }) {
  const [phase, setPhase] = useState("greeting"); // greeting | repair | oops | eye_contact | kick

  useEffect(() => {
    let isMounted = true;
    const runSequence = async () => {
      while (isMounted) {
        // 1. Привет (3 сек)
        setPhase("greeting");
        await wait(3000);
        if (!isMounted) break;

        // 2. Ремонт (2.5 сек)
        setPhase("repair");
        await wait(2500);
        if (!isMounted) break;

        // 3. Упс (1 сек)
        setPhase("oops");
        await wait(1000);
        if (!isMounted) break;

        // 4. Взгляд (2 сек)
        setPhase("eye_contact");
        await wait(2000);
        if (!isMounted) break;

        // 5. Пинок (1.5 сек)
        setPhase("kick");
        await wait(1500);
      }
    };
    runSequence();
    return () => { isMounted = false; };
  }, []);

  // --- АНИМАЦИИ ---

  // ТЕЛО (Прыгает)
  const bodyAnim = {
    greeting: { y: [0, -5, 0], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } },
    repair: { y: [0, 3, 0], scaleY: [1, 0.95, 1], transition: { duration: 0.15, repeat: Infinity } }, // Пружинит при ударах
    oops: { y: 0, scaleY: 1 },
    eye_contact: { y: 0 },
    kick: { x: 10, rotate: 5, transition: { duration: 0.4 } }
  };

  // ПРАВАЯ РУКА (Молоток)
  const rightArmAnim = {
    greeting: { rotate: [0, 20, -5, 20, 0], transition: { duration: 1.5, repeat: Infinity } },
    repair: { rotate: [-45, 80, -45], transition: { duration: 0.15, repeat: Infinity } }, // Бьет
    oops: { rotate: 0 },
    eye_contact: { rotate: 0 },
    kick: { rotate: -20 }
  };

  // ЛЕВАЯ РУКА (Телефон)
  const leftArmAnim = {
    greeting: { rotate: 0 },
    repair: { rotate: [0, -10, 0], x: [0, -2, 0], transition: { duration: 0.15, repeat: Infinity } }, // Трясется
    oops: { rotate: -10 },
    eye_contact: { rotate: -10 },
    kick: { rotate: 0 }
  };

  // ПРАВАЯ НОГА (Пинок)
  const rightLegAnim = {
    greeting: { x: 0, rotate: 0 },
    repair: { x: 0 },
    oops: { x: 0 },
    kick: { 
      x: [0, -10, 20, 0], // Замах и удар
      rotate: [0, -20, 20, 0],
      transition: { duration: 0.6, delay: 0.2 }
    }
  };

  // ГЛАЗА (Веки)
  const eyelidAnim = {
    greeting: { height: 0 }, // Открыты
    repair: { height: 12 }, // Прищур сверху
    oops: { height: 0 },
    eye_contact: { height: [0, 25, 0, 0, 25, 0], transition: { duration: 0.6, delay: 0.5 } }, // Моргание
    kick: { height: 0 }
  };

  // ЗРАЧКИ
  const pupilAnim = {
    greeting: { x: 0, y: 0 },
    repair: { y: 5, x: 0 }, // Смотрит вниз
    oops: { y: 5, x: 0 },
    eye_contact: { y: 0, x: 0 }, // Прямо
    kick: { x: 4, y: 2 } // Косит вбок
  };

  return (
    <div className="relative flex flex-col items-center justify-end cursor-pointer group" 
         style={{ width: size, height: size * 1.4 }} 
         onClick={onClick}>

      {/* --- ОБЛАЧКО С ТЕКСТОМ --- */}
      <motion.div 
        className="absolute -top-24 z-50 pointer-events-none"
        animate={{ 
           opacity: phase === 'greeting' ? 1 : 0, 
           y: phase === 'greeting' ? 0 : 10,
           scale: phase === 'greeting' ? 1 : 0.8
        }}
      >
        <div className="bg-white border-4 border-yellow-400 rounded-3xl p-4 shadow-xl relative min-w-[140px] text-center">
           <p className="font-bold text-gray-800 text-sm">👋 Банана?</p>
           <p className="text-xs text-gray-500 mt-1">Ой... <strong className="text-blue-600">РЕМОНТ!</strong></p>
           {/* Треугольник снизу */}
           <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-yellow-400"></div>
        </div>
      </motion.div>

      {/* --- КОНТЕЙНЕР МИНЬОНА --- */}
      <div className="relative w-32 h-48">
        
        {/* Летящие частицы (за спиной, чтобы не мешали) */}
        {phase === 'repair' && (
          <>
             {[...Array(5)].map((_, i) => (
               <motion.div 
                 key={i}
                 className="absolute left-1/2 top-1/2 w-2 h-2 bg-gray-600 rounded-full z-0"
                 initial={{ scale: 0 }}
                 animate={{ 
                   x: (Math.random() - 0.5) * 150, 
                   y: -Math.random() * 100, 
                   opacity: [1, 0],
                   rotate: Math.random() * 360 
                 }}
                 transition={{ duration: 0.6, repeat: Infinity, repeatDelay: Math.random() * 0.2 }}
               />
             ))}
          </>
        )}

        {/* ТЕЛО (Желтая капсула) */}
        <motion.div 
          className="absolute inset-0 bg-yellow-400 rounded-[50px] shadow-lg overflow-hidden z-20 border-2 border-yellow-500"
          variants={bodyAnim}
          animate={phase}
        >
           {/* КОМБИНЕЗОН (Синий низ) */}
           <div className="absolute bottom-0 w-full h-16 bg-blue-600 border-t-4 border-blue-700"></div>
           {/* Нагрудник */}
           <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-16 h-10 bg-blue-600 rounded-t-lg border-x-4 border-t-4 border-blue-700"></div>
           {/* Карман */}
           <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-500 rounded border-2 border-blue-700 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-gray-800 flex items-center justify-center">
                 <div className="w-2 h-[1px] bg-white"></div>
              </div>
           </div>
           {/* Лямки */}
           <div className="absolute bottom-24 left-2 w-20 h-4 bg-blue-600 rotate-[20deg] shadow-sm"></div>
           <div className="absolute bottom-24 right-2 w-20 h-4 bg-blue-600 -rotate-[20deg] shadow-sm"></div>
           {/* Пуговицы */}
           <div className="absolute bottom-24 left-8 w-3 h-3 bg-gray-800 rounded-full"></div>
           <div className="absolute bottom-24 right-8 w-3 h-3 bg-gray-800 rounded-full"></div>

           {/* ЛИЦО */}
           <div className="absolute top-10 w-full flex justify-center items-center z-30">
              {/* Ремешок очков */}
              <div className="absolute w-full h-4 bg-gray-800 top-4"></div>
              
              {/* ГЛАЗА (Оправа) */}
              <div className="relative flex gap-1">
                 {/* Левый глаз */}
                 <div className="w-12 h-12 bg-white rounded-full border-[6px] border-gray-400 shadow-md relative overflow-hidden flex items-center justify-center">
                    <motion.div className="w-4 h-4 bg-amber-900 rounded-full relative" variants={pupilAnim} animate={phase}>
                       <div className="absolute w-2 h-2 bg-black rounded-full top-1 left-1"></div>
                       <div className="absolute w-1 h-1 bg-white rounded-full top-1 left-2 opacity-80"></div>
                    </motion.div>
                    {/* Веко */}
                    <motion.div className="absolute top-0 w-full bg-yellow-400 z-10 border-b border-yellow-600" variants={eyelidAnim} animate={phase} />
                 </div>

                 {/* Правый глаз */}
                 <div className="w-12 h-12 bg-white rounded-full border-[6px] border-gray-400 shadow-md relative overflow-hidden flex items-center justify-center">
                    <motion.div className="w-4 h-4 bg-amber-900 rounded-full relative" variants={pupilAnim} animate={phase}>
                       <div className="absolute w-2 h-2 bg-black rounded-full top-1 left-1"></div>
                       <div className="absolute w-1 h-1 bg-white rounded-full top-1 left-2 opacity-80"></div>
                    </motion.div>
                    {/* Веко */}
                    <motion.div className="absolute top-0 w-full bg-yellow-400 z-10 border-b border-yellow-600" variants={eyelidAnim} animate={phase} />
                 </div>
              </div>
           </div>

           {/* РОТ (CSS-рисование) */}
           <div className="absolute top-28 w-full flex justify-center">
              {phase === 'greeting' && (
                <div className="w-8 h-4 border-b-4 border-amber-900 rounded-full"></div> // Улыбка
              )}
              {phase === 'repair' && (
                <div className="w-6 h-2 bg-amber-900 rounded-full mt-2"></div> // Сжат
              )}
              {phase === 'oops' && (
                <div className="w-2 h-2 bg-amber-900 rounded-full mt-2 ring-2 ring-amber-900"></div> // "о"
              )}
              {(phase === 'eye_contact' || phase === 'kick') && (
                 <div className="w-8 h-2 bg-amber-900 rounded-full rotate-6 mt-2"></div> // Кривая ухмылка
              )}
           </div>
        </motion.div>

        {/* НОГИ (Слой 1 - Самые нижние) */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 flex justify-between z-10">
            {/* Левая нога (Статичная) */}
            <div className="flex flex-col items-center">
               <div className="w-4 h-6 bg-blue-700"></div>
               <div className="w-8 h-4 bg-gray-900 rounded-md"></div>
            </div>
            {/* Правая нога (Анимированная) */}
            <motion.div 
              className="flex flex-col items-center origin-top"
              variants={rightLegAnim} 
              animate={phase}
            >
               <div className="w-4 h-6 bg-blue-700"></div>
               <div className="w-8 h-4 bg-gray-900 rounded-md"></div>
            </motion.div>
        </div>

        {/* РУКИ (Слой 3 - Поверх тела) */}
        
        {/* ЛЕВАЯ РУКА (Телефон) */}
        <motion.div 
           className="absolute top-24 -left-2 origin-top-right z-30"
           variants={leftArmAnim}
           animate={phase}
        >
           <div className="w-3 h-12 bg-yellow-400 rounded-full border border-yellow-600 -rotate-12 absolute"></div>
           <div className="w-6 h-6 bg-gray-800 rounded-full absolute top-10 -left-2 border-2 border-gray-600"></div> {/* Перчатка */}
           
           {/* ТЕЛЕФОН */}
           <motion.div 
             className="absolute top-8 -left-4 w-8 h-12 bg-gray-800 rounded border border-gray-600 flex items-center justify-center"
             animate={{ opacity: (phase === 'repair' || phase === 'oops' || phase === 'eye_contact') ? 1 : 0 }}
           >
              <div className={`w-6 h-10 rounded-sm ${phase === 'repair' ? 'bg-red-500' : 'bg-black'}`}>
                 {phase === 'oops' && ( // Трещина
                    <div className="w-full h-[1px] bg-white rotate-45 mt-4 shadow-[0_0_2px_white]"></div>
                 )}
              </div>
           </motion.div>
        </motion.div>

        {/* ПРАВАЯ РУКА (Молоток) */}
        <motion.div 
           className="absolute top-24 -right-2 origin-top-left z-30"
           variants={rightArmAnim}
           animate={phase}
        >
            <div className="w-3 h-12 bg-yellow-400 rounded-full border border-yellow-600 rotate-12 absolute right-0"></div>
            <div className="w-6 h-6 bg-gray-800 rounded-full absolute top-10 -right-2 border-2 border-gray-600"></div>
            
            {/* МОЛОТОК */}
            <motion.div 
              className="absolute top-6 -right-6 w-12 h-12"
              animate={{ opacity: phase === 'repair' ? 1 : 0 }}
            >
               <div className="absolute left-4 top-0 w-2 h-12 bg-amber-800 rounded"></div> {/* Ручка */}
               <div className="absolute top-0 left-0 w-10 h-4 bg-gray-600 rounded shadow-sm"></div> {/* Боек */}
            </motion.div>
        </motion.div>

        {/* ЛЕТЯЩИЙ СЛОМАННЫЙ ТЕЛЕФОН (При пинке) */}
        {phase === 'kick' && (
           <motion.div 
              className="absolute bottom-0 right-0 w-6 h-10 bg-gray-700 rounded z-0"
              initial={{ x: 0, opacity: 1, rotate: 0 }}
              animate={{ x: 60, opacity: 0, rotate: 180 }}
              transition={{ duration: 0.5 }}
           />
        )}

      </div>
    </div>
  );
}