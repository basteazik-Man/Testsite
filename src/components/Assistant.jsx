import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../styles/assistant.css";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Assistant({ size = 180, onClick }) { // Чуть увеличил дефолтный размер
  const [phase, setPhase] = useState("greeting");
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const runSequence = async () => {
      while (isMounted) {
        // 1. Приветствие (3 сек)
        setPhase("greeting");
        await wait(3000);
        if (!isMounted) break;

        // 2. Ремонт (2.5 сек)
        setCycleCount(c => c + 1);
        setPhase("repair");
        await wait(2500);
        if (!isMounted) break;

        // 3. Осознание (1 сек)
        setPhase("oops");
        await wait(1000);
        if (!isMounted) break;

        // 4. Луп-луп (2 сек)
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

  // Тело: при ремонте оно пружинит вниз-вверх от ударов, а не трясется хаотично
  const bodyVariants = {
    greeting: { y: [0, -2, 0], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } },
    repair: { 
      y: [0, 3, 0], // Удар -> Приседание -> Возврат
      scaleY: [1, 0.98, 1], // Сплющивание при ударе
      transition: { duration: 0.25, repeat: Infinity } 
    },
    oops: { y: 0, scaleY: 1 },
    eye_contact: { y: 0 },
    kick: { rotate: 5, x: 5, transition: { duration: 0.4 } }
  };

  // Правая рука (Молоток)
  const rightArmVariants = {
    greeting: { 
      rotate: [0, 20, -5, 20, 0], 
      originX: 0.1, originY: 0.2, // Точка вращения в плече
      transition: { duration: 1.5, repeat: Infinity } 
    },
    repair: { 
      rotate: [-30, 60, -30], // Амплитудный удар
      originX: 0.1, originY: 0.2,
      transition: { duration: 0.25, repeat: Infinity, ease: "easeIn" } // Резкий удар
    },
    oops: { rotate: 0 },
    eye_contact: { rotate: 0 },
    kick: { rotate: -15 }
  };

  // Левая рука (Держит телефон)
  const leftArmVariants = {
    greeting: { rotate: 0 },
    repair: { 
      rotate: [0, -5, 0], // Отдача от удара
      originX: 0.9, originY: 0.2,
      transition: { duration: 0.25, repeat: Infinity }
    },
    oops: { rotate: 0 },
    kick: { rotate: 0 }
  };

  // Правая нога (Пинок)
  const rightLegVariants = {
    greeting: { x: 0, rotate: 0 },
    repair: { x: 0, rotate: 0 },
    kick: {
      x: [0, -20, 10, 0], // Замах назад -> Удар вперед -> Возврат
      rotate: [0, -30, 20, 0],
      transition: { duration: 0.8, times: [0, 0.4, 0.6, 1] }
    }
  };

  // Глаза (Моргание век)
  // Используем scaleY для "шторок" век
  const eyelidVariants = {
    greeting: { scaleY: 0 }, // Глаза открыты
    repair: { scaleY: 0.3 }, // Прищур (30% закрыто)
    oops: { scaleY: 0 },     // Широко открыты
    eye_contact: { scaleY: [0, 1, 0, 0, 1, 0], transition: { duration: 0.5, delay: 0.5 } }, // Быстрое моргание
    kick: { scaleY: 0 }
  };

  // Зрачки
  const pupilVariants = {
    greeting: { x: 0, y: 0 },
    repair: { x: 0, y: 3 }, // Вниз на телефон
    oops: { x: 0, y: 3 },
    eye_contact: { x: 0, y: 0 },
    kick: { x: 4, y: 0 } // Косит в сторону
  };

  const mouthPaths = {
    smile: "M35,65 Q50,75 65,65", 
    rage: "M40,70 Q50,60 60,70", // Дуга вверх (злость)
    oops: "M45,70 Q50,72 55,70", // Маленький рот
    awkward: "M35,68 Q50,65 65,70" // Кривая ухмылка
  };

  return (
    <div className="relative" style={{ width: size, height: size * 1.2 }}>
      {/* Облачко */}
      <motion.div 
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 z-50 pointer-events-none"
        animate={{ 
          opacity: phase === 'greeting' ? 1 : 0, 
          scale: phase === 'greeting' ? 1 : 0.5,
          y: phase === 'greeting' ? 0 : 20
        }}
      >
        <div className="bg-white border-4 border-yellow-400 rounded-2xl p-3 text-center shadow-lg relative">
          <p className="text-xs font-bold text-gray-800">👋 Банана?</p>
          <p className="text-xs text-gray-600 leading-tight mt-1">Ой... <br/><span className="font-black text-blue-600">РЕМОНТ!</span></p>
          {/* Треугольник облачка */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-yellow-400"></div>
        </div>
      </motion.div>
      
      {/* SVG Контейнер */}
      <motion.svg 
        viewBox="0 0 100 120" 
        className="w-full h-full overflow-visible drop-shadow-xl cursor-pointer"
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <defs>
          <linearGradient id="skin" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>
          <linearGradient id="blue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <clipPath id="eyeClip">
            <circle cx="35" cy="40" r="11" />
            <circle cx="65" cy="40" r="11" />
          </clipPath>
        </defs>

        {/* --- НОГИ (Слой 1 - самый нижний) --- */}
        {/* Левая нога (Статичная) */}
        <g transform="translate(35, 95)">
           <path d="M0,0 L0,8" stroke="#1D4ED8" strokeWidth="10" strokeLinecap="round"/>
           <path d="M-6,8 L6,8 L6,12 Q6,15 -6,15 Z" fill="#1F2937" /> {/* Ботинок */}
        </g>

        {/* Правая нога (Анимируется при пинке) */}
        <motion.g 
          variants={rightLegVariants}
          animate={phase}
          initial={{ x: 0, rotate: 0 }}
          style={{ originX: "65px", originY: "95px" }} // Точка вращения в бедре
        >
           <g transform="translate(65, 95)">
             <path d="M0,0 L0,8" stroke="#1D4ED8" strokeWidth="10" strokeLinecap="round"/>
             <path d="M-6,8 L6,8 L6,12 Q6,15 -6,15 Z" fill="#1F2937" />
           </g>
        </motion.g>

        {/* --- ТЕЛО (Слой 2) --- */}
        <motion.g variants={bodyVariants} animate={phase}>
           
           {/* Основа тела (Желтая капсула) */}
           <rect x="20" y="20" width="60" height="80" rx="28" fill="url(#skin)" />

           {/* Комбинезон (Синий) */}
           <path d="M20,75 L20,90 A28,28 0 0,0 80,90 L80,75 L20,75 Z" fill="url(#blue)" /> {/* Низ */}
           <rect x="30" y="60" width="40" height="25" fill="url(#blue)" /> {/* Нагрудник */}
           
           {/* Лямки */}
           <path d="M22,50 L30,60" stroke="#1D4ED8" strokeWidth="6" strokeLinecap="round"/>
           <path d="M78,50 L70,60" stroke="#1D4ED8" strokeWidth="6" strokeLinecap="round"/>
           <circle cx="30" cy="62" r="2" fill="#1F2937"/>
           <circle cx="70" cy="62" r="2" fill="#1F2937"/>

           {/* Карман с логотипом */}
           <path d="M42,75 H58 L56,85 H44 Z" fill="#2563EB" stroke="#60A5FA" strokeWidth="0.5" />
           <circle cx="50" cy="80" r="3" fill="#1F2937"/> 
           <path d="M49,80 L51,80 M50,79 L50,81" stroke="white" strokeWidth="1"/>

           {/* --- ЛИЦО --- */}
           <g transform="translate(0, 5)">
              {/* Ремешок */}
              <rect x="18" y="35" width="64" height="8" fill="#1F2937" rx="2"/>
              
              {/* Очки (Серый контур) */}
              <circle cx="35" cy="40" r="13" fill="#9CA3AF" stroke="#4B5563" strokeWidth="2" />
              <circle cx="65" cy="40" r="13" fill="#9CA3AF" stroke="#4B5563" strokeWidth="2" />
              
              {/* Белки глаз */}
              <circle cx="35" cy="40" r="10" fill="white" />
              <circle cx="65" cy="40" r="10" fill="white" />

              {/* Группа глаз внутри ClipPath (чтобы веки не вылезали) */}
              <g clipPath="url(#eyeClip)">
                 {/* Зрачки */}
                 <motion.g variants={pupilVariants} animate={phase}>
                    <circle cx="35" cy="40" r="3.5" fill="#543A29" />
                    <circle cx="35" cy="40" r="1.5" fill="black" />
                    <circle cx="65" cy="40" r="3.5" fill="#543A29" />
                    <circle cx="65" cy="40" r="1.5" fill="black" />
                 </motion.g>

                 {/* Веки (Верхние) - Анимируются через scaleY */}
                 <motion.rect 
                    x="20" y="20" width="30" height="20" 
                    fill="#EAB308" 
                    style={{ originY: "20px" }} // Растут сверху
                    variants={eyelidVariants}
                    animate={phase}
                 />
                 <motion.rect 
                    x="50" y="20" width="30" height="20" 
                    fill="#EAB308" 
                    style={{ originY: "20px" }}
                    variants={eyelidVariants}
                    animate={phase}
                 />
              </g>

              {/* Рот */}
              <motion.path 
                 d={mouthPaths.smile}
                 animate={{ d: phase === 'repair' ? mouthPaths.rage : (phase === 'oops' ? mouthPaths.oops : (phase === 'eye_contact' || phase === 'kick' ? mouthPaths.awkward : mouthPaths.smile)) }}
                 stroke="#372015" strokeWidth="2" fill="none" strokeLinecap="round"
              />
           </g>
        </motion.g>

        {/* --- РУКИ (Слой 3 - Поверх тела) --- */}

        {/* ЛЕВАЯ РУКА (Держит телефон) */}
        <motion.g 
           initial={{ rotate: 0 }}
           variants={leftArmVariants}
           animate={phase}
           style={{ originX: "25px", originY: "55px" }} // Плечо
        >
           {/* Рука */}
           <path d="M25,55 Q10,70 20,85" stroke="#EAB308" strokeWidth="8" strokeLinecap="round" fill="none" />
           <circle cx="20" cy="85" r="5" fill="#1F2937" />

           {/* Телефон (Появляется) */}
           <motion.g 
             animate={{ opacity: (phase === 'repair' || phase === 'oops' || phase === 'eye_contact') ? 1 : 0 }}
             transform="translate(15, 75) rotate(-20)"
           >
              <rect x="0" y="0" width="14" height="24" rx="2" fill="#1F2937" />
              <rect x="1" y="1" width="12" height="22" rx="1" fill={phase === 'repair' ? "#EF4444" : "#111827"} />
              {/* Трещины */}
              {phase !== 'greeting' && phase !== 'kick' && (
                  <path d="M2,5 L12,15 M10,5 L2,20" stroke="white" strokeWidth="0.5" opacity="0.7" />
              )}
           </motion.g>
        </motion.g>

        {/* ПРАВАЯ РУКА (Молоток) */}
        <motion.g 
           initial={{ rotate: 0 }}
           variants={rightArmVariants}
           animate={phase}
           style={{ originX: "75px", originY: "55px" }} // Плечо
        >
           {/* Рука */}
           <path d="M75,55 Q90,70 80,85" stroke="#EAB308" strokeWidth="8" strokeLinecap="round" fill="none" />
           <circle cx="80" cy="85" r="5" fill="#1F2937" />

           {/* Молоток */}
           <motion.g 
              animate={{ opacity: phase === 'repair' ? 1 : 0 }}
              transform="translate(75, 75) rotate(-10)"
           >
              <rect x="0" y="0" width="4" height="20" fill="#78350F" rx="1" />
              <rect x="-4" y="-5" width="12" height="8" fill="#4B5563" rx="1" />
           </motion.g>
        </motion.g>

        {/* --- ЧАСТИЦЫ (Летают при ремонте) --- */}
        {phase === 'repair' && (
           <g key={cycleCount}>
              {[...Array(4)].map((_, i) => (
                <motion.rect
                   key={i}
                   width="4" height="4" fill={["#666", "#F00", "#FF0"][i%3]}
                   initial={{ x: 50, y: 80, opacity: 1, scale: 0 }}
                   animate={{ 
                     x: 50 + (Math.random() * 60 - 30), 
                     y: 80 - (Math.random() * 50 + 10),
                     rotate: Math.random() * 360,
                     opacity: 0
                   }}
                   transition={{ duration: 0.5, repeat: Infinity, repeatDelay: Math.random() * 0.2 }}
                />
              ))}
           </g>
        )}

        {/* --- ОТЛЕТАЮЩИЙ ТЕЛЕФОН (При пинке) --- */}
        {phase === 'kick' && (
          <motion.g
             initial={{ x: 50, y: 90, opacity: 1, rotate: 0 }}
             animate={{ x: 80, y: 90, opacity: 0, rotate: 180 }}
             transition={{ duration: 0.5 }}
          >
             <rect width="10" height="16" fill="#374151" />
          </motion.g>
        )}

      </motion.svg>
    </div>
  );
}