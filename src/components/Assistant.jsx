import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../styles/assistant.css";

// Функция задержки для сценария (паузы между действиями)
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Assistant({ size = 160, onClick }) {
  // Фазы анимации: 
  // 'greeting' (привет) -> 'repair' (ремонт) -> 'oops' (сломал) -> 'eye_contact' (взгляд) -> 'kick' (пинок)
  const [phase, setPhase] = useState("greeting");
  
  // Счетчик циклов, чтобы анимация частиц каждый раз запускалась заново
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const runSequence = async () => {
      while (isMounted) {
        // 1. ПРИВЕТСТВИЕ (3 секунды)
        // Миньон просто стоит и машет рукой
        setPhase("greeting");
        await wait(3000);
        if (!isMounted) break;

        // 2. РЕМОНТ (2.5 секунды)
        // Достает телефон и начинает его колотить
        setCycleCount(c => c + 1);
        setPhase("repair");
        await wait(2500);
        if (!isMounted) break;

        // 3. ОСОЗНАНИЕ / OOPS (1 секунда)
        // Замирает и смотрит на сломанный телефон
        setPhase("oops");
        await wait(1000);
        if (!isMounted) break;

        // 4. ЗРИТЕЛЬНЫЙ КОНТАКТ (2 секунды)
        // Поднимает глаза на пользователя, моргает "луп-луп"
        setPhase("eye_contact");
        await wait(2000);
        if (!isMounted) break;

        // 5. СКРЫТИЕ УЛИКИ (1.5 секунды)
        // Отводит ногу и пинает телефон назад, улыбаясь
        setPhase("kick");
        await wait(1500);
        // После этого цикл начинается заново с Greeting
      }
    };

    runSequence();

    // Очистка при уходе со страницы
    return () => { isMounted = false; };
  }, []);

  // --- НАСТРОЙКИ АНИМАЦИЙ (ВАРИАНТЫ ДВИЖЕНИЙ) ---

  // Тело: дышит при приветствии, трясется при ремонте
  const bodyVariants = {
    greeting: { y: [0, -3, 0], rotate: 0, transition: { duration: 2, repeat: Infinity } },
    repair: { 
      y: [0, 2, -2, 1, 0], 
      x: [0, 1, -1, 0], 
      rotate: [0, -1, 1, 0],
      transition: { duration: 0.1, repeat: Infinity } 
    },
    oops: { y: 0, rotate: 0 },
    eye_contact: { y: 0, rotate: 0 },
    kick: { y: 0, rotate: 5, transition: { duration: 0.5 } }
  };

  // Правая рука: машет -> бьет молотком -> прячет за спину
  const rightArmVariants = {
    greeting: { 
      rotate: [0, 25, -5, 25, 0], 
      transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" } 
    },
    repair: { 
      rotate: [-20, 40, -20], // Удары
      transition: { duration: 0.15, repeat: Infinity } 
    },
    oops: { rotate: 0, transition: { type: "spring", bounce: 0.4 } },
    eye_contact: { rotate: 0 },
    kick: { rotate: -10 }
  };

  // Левая рука: держит телефон
  const leftArmVariants = {
    greeting: { rotate: 0 },
    repair: { 
      rotate: [0, -5, 5, 0], // Трясется от ударов
      transition: { duration: 0.1, repeat: Infinity }
    },
    oops: { rotate: 0 },
    eye_contact: { rotate: 0 },
    kick: { rotate: 0 }
  };

  // Формы рта (SVG path) для разных эмоций
  const mouthPaths = {
    smile: "M85 105 Q100 115 115 105",   // Улыбка
    rage: "M90 110 Q100 100 110 110",    // Злость/Усилие
    oops: "M95 110 Q100 112 105 110",    // Маленький рот "оу"
    awkward: "M85 108 Q100 100 115 112"  // Кривая ухмылка
  };

  const getCurrentMouth = () => {
    if (phase === 'repair') return mouthPaths.rage;
    if (phase === 'oops') return mouthPaths.oops;
    if (phase === 'eye_contact' || phase === 'kick') return mouthPaths.awkward;
    return mouthPaths.smile;
  };

  // Движение зрачков
  const pupilsVariants = {
    greeting: { x: 0, y: 0 },
    repair: { x: 0, y: 2 },      // Смотрит вниз на работу
    oops: { x: 0, y: 5 },        // Смотрит на поломку
    eye_contact: { x: 0, y: 0 }, // Смотрит на тебя
    kick: { x: 2, y: -2 }        // Косит вбок
  };

  // Веки (моргание и эмоции)
  const eyelidVariants = {
    greeting: { scaleY: 1 },
    repair: { scaleY: 0.7 }, // Прищурен
    oops: { scaleY: 1 },     // Глаза по 5 копеек
    eye_contact: { scaleY: [1, 0.1, 1, 1, 0.1, 1], transition: { duration: 1, delay: 0.5 } }, // Двойное моргание
    kick: { scaleY: 1 }
  };

  // Правая нога (для пинка)
  const rightLegVariants = {
    greeting: { rotate: 0, x: 0 },
    repair: { rotate: 0, x: 0 },
    oops: { rotate: 0, x: 0 },
    eye_contact: { rotate: 0, x: 0 },
    kick: { 
      rotate: [0, -45, 0], // Замах назад
      x: [0, 10, 0],
      transition: { duration: 0.8, ease: "easeInOut", delay: 0.2 } 
    }
  };

  // Компонент разлетающихся деталей
  const Debris = () => (
    <>
      {[...Array(5)].map((_, i) => (
        <motion.path
          key={i}
          d={["M0 0 L5 5", "M0 0 L-5 5", "M0 0 Circle 2"][i % 3]}
          stroke={["#555", "#333", "#777"][i % 3]}
          strokeWidth="2"
          fill="none"
          initial={{ x: 100, y: 150, opacity: 1, scale: 0 }}
          animate={{ 
            x: 100 + (Math.random() * 100 - 50), 
            y: 150 + (Math.random() * -100),
            rotate: Math.random() * 360,
            opacity: 0,
            scale: 1
          }}
          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: Math.random() * 0.2 }}
        />
      ))}
    </>
  );

  return (
    <div 
      className="relative group cursor-pointer" 
      onClick={onClick}
      style={{ width: size, height: size * 1.2 }}
    >
      {/* --- МУЛЬТЯШНОЕ ОБЛАЧКО С ТЕКСТОМ --- */}
      <motion.div 
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-56 z-50 pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: phase === 'greeting' ? 1 : 0,
          scale: phase === 'greeting' ? 1 : 0.8,
          y: phase === 'greeting' ? 0 : 10
        }}
      >
        <svg viewBox="0 0 220 120" className="w-full drop-shadow-xl">
           <path 
             d="M20,50 Q10,20 50,15 Q70,5 110,15 Q150,5 180,20 Q210,30 200,60 Q210,90 170,100 Q150,110 110,100 L110,115 L100,100 Q60,110 30,90 Q5,70 20,50 Z" 
             fill="white" 
             stroke="#FACC15" 
             strokeWidth="3"
           />
           <text x="110" y="45" textAnchor="middle" fontSize="14" fill="#1F2937" fontFamily="sans-serif" fontWeight="bold">
             👋 Банана?
           </text>
           <text x="110" y="65" textAnchor="middle" fontSize="13" fill="#4B5563" fontFamily="sans-serif">
             Ой, то есть... <tspan fontWeight="bold" fill="#1F2937">Ремонт?</tspan>
           </text>
           <text x="110" y="85" textAnchor="middle" fontSize="11" fill="#3B82F6" fontWeight="bold" fontFamily="sans-serif">
             Жми сюда!
           </text>
        </svg>
      </motion.div>

      {/* --- ТЕЛО МИНЬОНА (SVG) --- */}
      <motion.div
        variants={bodyVariants}
        animate={phase}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full h-full relative z-20"
      >
        <svg viewBox="0 0 200 240" width="100%" height="100%" overflow="visible">
          <defs>
            <linearGradient id="minionSkin" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FACC15"/>
              <stop offset="100%" stopColor="#EAB308"/>
            </linearGradient>
            <linearGradient id="denim" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6"/>
              <stop offset="100%" stopColor="#1E40AF"/>
            </linearGradient>
            <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="5" stdDeviation="4" floodOpacity="0.3"/>
            </filter>
          </defs>

          {/* Тень на земле */}
          <ellipse cx="100" cy="235" rx="50" ry="10" fill="rgba(0,0,0,0.2)" />

          {/* Левая нога (статичная сзади) */}
          <g transform="translate(85, 200)">
             <path d="M0 0 L0 25" stroke="#1E40AF" strokeWidth="14" strokeLinecap="round" />
             <path d="M-10 25 L10 25 L10 28 L-10 28 Z" fill="#1F2937" /> 
             <path d="M-10 25 Q-10 15 5 15 Q20 15 20 25" fill="#1F2937" /> 
          </g>

          {/* Правая нога (Анимируемая для пинка) */}
          <motion.g 
            style={{ originX: "115px", originY: "200px" }} 
            variants={rightLegVariants}
            animate={phase}
          >
             <path d="M115 200 L115 225" stroke="#1E40AF" strokeWidth="14" strokeLinecap="round" />
             <g transform="translate(115, 225)">
               <path d="M-10 0 L10 0 L10 3 L-10 3 Z" fill="#1F2937" />
               <path d="M-10 0 Q-10 -10 5 -10 Q20 -10 20 0" fill="#1F2937" />
             </g>
          </motion.g>

          {/* ТЕЛО */}
          <rect x="50" y="40" width="100" height="170" rx="45" fill="url(#minionSkin)" filter="url(#dropShadow)" />

          {/* КОМБИНЕЗОН */}
          <path d="M50 160 L50 185 A45 45 0 0 0 150 185 L150 160 L50 160 Z" fill="url(#denim)" />
          <rect x="70" y="130" width="60" height="40" fill="url(#denim)" />
          
          {/* Лямки и пуговицы */}
          <path d="M55 100 L70 130" stroke="#1E40AF" strokeWidth="10" strokeLinecap="round"/>
          <path d="M145 100 L130 130" stroke="#1E40AF" strokeWidth="10" strokeLinecap="round"/>
          <circle cx="70" cy="135" r="4" fill="#1F2937"/>
          <circle cx="130" cy="135" r="4" fill="#1F2937"/>

          {/* Карман */}
          <path d="M85 150 H115 L110 170 H90 Z" fill="#2563EB" stroke="#60A5FA" strokeWidth="1" />
          <circle cx="100" cy="160" r="6" fill="#1F2937" />
          <path d="M98 160 L102 160 M100 158 L100 162" stroke="white" strokeWidth="1.5" />

          {/* --- РУКИ --- */}

          {/* Левая Рука (Держит телефон) */}
          <motion.g 
             style={{ originX: "52px", originY: "120px" }} 
             variants={leftArmVariants}
             animate={phase}
          >
            <path d="M52 120 Q30 150 60 160" stroke="#EAB308" strokeWidth="12" strokeLinecap="round" fill="none" />
            <circle cx="60" cy="160" r="10" fill="#1F2937" />
            
            {/* ТЕЛЕФОН (Появляется только когда нужен) */}
            <motion.g 
               animate={{ opacity: (phase === 'repair' || phase === 'oops' || phase === 'eye_contact') ? 1 : 0 }}
               transform="translate(50, 145) rotate(-10)"
            >
               <rect x="0" y="0" width="25" height="40" rx="2" fill="#374151" stroke="#9CA3AF" strokeWidth="1" />
               <rect x="2" y="2" width="21" height="36" fill={phase === 'repair' ? "#EF4444" : "#111"} />
               {/* Трещины */}
               {phase !== 'greeting' && phase !== 'kick' && (
                  <path d="M5 10 L15 20 L10 30 M20 5 L5 35" stroke="white" strokeWidth="1" opacity="0.6" />
               )}
            </motion.g>
          </motion.g>
          
          {/* ЛЕТЯЩИЕ ЗАПЧАСТИ */}
          {phase === 'repair' && (
             <g key={cycleCount}>
                <Debris />
             </g>
          )}

          {/* Правая Рука (Машет / Бьет) */}
          <motion.g 
             style={{ originX: "148px", originY: "120px" }} 
             variants={rightArmVariants}
             animate={phase}
          >
             <path d="M148 120 Q170 150 140 160" stroke="#EAB308" strokeWidth="12" strokeLinecap="round" fill="none" />
             
             <g transform="translate(140, 160)">
                <circle r="10" fill="#1F2937" />
                {/* Молоток */}
                <motion.g animate={{ opacity: phase === 'repair' ? 1 : 0 }}>
                   <rect x="-4" y="-20" width="8" height="30" fill="#8B4513" rx="1" transform="rotate(-10)" /> 
                   <rect x="-10" y="-25" width="20" height="10" fill="#4B5563" rx="1" transform="rotate(-10)" /> 
                </motion.g>
             </g>
          </motion.g>

           {/* СЛОМАННЫЙ ТЕЛЕФОН НА ЗЕМЛЕ (Вылетает при пинке) */}
           <motion.g 
             initial={{ opacity: 0, x: 100, y: 230 }}
             animate={{ 
               opacity: phase === 'kick' ? 1 : 0,
               x: phase === 'kick' ? [100, 130] : 100, 
               rotate: phase === 'kick' ? [0, 180] : 0
             }}
             transition={{ duration: 0.5 }}
           >
              <rect width="20" height="30" fill="#374151" rx="2" />
              <path d="M0 0 L20 30" stroke="white" opacity="0.5"/>
           </motion.g>

          {/* --- ЛИЦО --- */}
          <g transform="translate(0, 10)">
             <rect x="45" y="68" width="110" height="12" fill="#1F2937" rx="2" />
             
             {/* Очки */}
             <g filter="url(#dropShadow)">
               <circle cx="80" cy="72" r="24" fill="#9CA3AF" stroke="#4B5563" strokeWidth="4" />
               <circle cx="120" cy="72" r="24" fill="#9CA3AF" stroke="#4B5563" strokeWidth="4" />
             </g>

             <circle cx="80" cy="72" r="18" fill="white" />
             <circle cx="120" cy="72" r="18" fill="white" />

             {/* Зрачки */}
             <motion.g variants={pupilsVariants} animate={phase}>
                <g transform="translate(80, 72)">
                  <circle r="7" fill="#5c3a2e" /> 
                  <circle r="3" fill="black" />   
                  <circle cx="2" cy="-2" r="2" fill="white" opacity="0.7" /> 
                </g>
                <g transform="translate(120, 72)">
                  <circle r="7" fill="#5c3a2e" />
                  <circle r="3" fill="black" />
                  <circle cx="2" cy="-2" r="2" fill="white" opacity="0.7" />
                </g>
             </motion.g>

             {/* Веки */}
             <motion.g variants={eyelidVariants} animate={phase}>
                <path d="M56 72 A24 24 0 0 1 104 72 L104 48 L56 48 Z" fill="#FACC15" transform="translate(0, -24)" />
                <path d="M96 72 A24 24 0 0 1 144 72 L144 48 L96 48 Z" fill="#FACC15" transform="translate(0, -24)" />
             </motion.g>

             {/* Рот */}
             <motion.path 
               animate={{ d: getCurrentMouth() }}
               stroke="#4B2C20" 
               strokeWidth="4" 
               fill="none" 
               strokeLinecap="round" 
             />
          </g>

          {/* Волоски */}
          <path d="M90 40 Q95 25 100 40" stroke="#1F2937" strokeWidth="2" fill="none" />
          <path d="M100 40 Q105 20 110 40" stroke="#1F2937" strokeWidth="2" fill="none" />
          <path d="M110 40 Q115 25 120 40" stroke="#1F2937" strokeWidth="2" fill="none" />

        </svg>
      </motion.div>
    </div>
  );
}