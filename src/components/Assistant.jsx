import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import "../styles/assistant.css"; 

export default function Assistant({ size = 130, onClick }) {
  const controls = useAnimation();

  useEffect(() => {
    controls.start("idle");
  }, [controls]);

  // Анимация тела (дыхание + легкое покачивание)
  const variants = {
    idle: {
      y: [0, -4, 0],
      rotate: [0, 1, -1, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    click: {
      scale: [1, 1.2, 0.1], // Увеличение -> Исчезновение в точку
      y: [0, -20, -200],
      opacity: [1, 1, 0],
      transition: { duration: 0.5, ease: "backIn" }
    }
  };

  // Анимация махания рукой
  const armVariants = {
    wave: {
      rotate: [0, 20, -10, 20, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatDelay: 2.5,
        ease: "easeInOut"
      }
    }
  };

  const handleClick = async () => {
    await controls.start("click");
    if (onClick) onClick();
  };

  return (
    <div 
      className="relative group cursor-pointer" 
      onClick={handleClick}
      style={{ width: size, height: size * 1.2 }} // Чуть выше пропорции для миньона
    >
      {/* Облачко (анимация в CSS) */}
      <div className="speech-bubble-container">
        <div className="speech-bubble-text">
          👋 <strong>Банана?</strong><br/>
          Ой, то есть... <strong>Ремонт?</strong><br/>
          Жми сюда!
        </div>
      </div>

      <motion.div
        animate={controls}
        initial={{ y: 0 }}
        variants={variants}
        whileHover={{ scale: 1.1 }}
        className="w-full h-full relative z-20"
      >
        <svg viewBox="0 0 200 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="yellowSkin" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FACC15"/> {/* Яркий желтый */}
              <stop offset="100%" stopColor="#EAB308"/>
            </linearGradient>
            <linearGradient id="bluePants" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6"/>
              <stop offset="100%" stopColor="#1D4ED8"/>
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
          </defs>

          {/* Тень на земле */}
          <ellipse cx="100" cy="230" rx="50" ry="8" fill="rgba(0,0,0,0.2)" />

          {/* --- НОГИ (растут из тела) --- */}
          <path d="M85 200 L85 225" stroke="#1D4ED8" strokeWidth="12" strokeLinecap="round" />
          <path d="M115 200 L115 225" stroke="#1D4ED8" strokeWidth="12" strokeLinecap="round" />
          {/* Ботинки */}
          <path d="M75 225 L92 225" stroke="#1F2937" strokeWidth="10" strokeLinecap="round" />
          <path d="M108 225 L125 225" stroke="#1F2937" strokeWidth="10" strokeLinecap="round" />

          {/* --- ТЕЛО (Капсула) --- */}
          <rect x="50" y="40" width="100" height="170" rx="50" fill="url(#yellowSkin)" filter="url(#shadow)" />

          {/* --- ШТАНЫ (Комбинезон) --- */}
          <path d="M50 160 L50 190 A50 50 0 0 0 150 190 L150 160 L50 160 Z" fill="url(#bluePants)" />
          <rect x="70" y="130" width="60" height="40" fill="url(#bluePants)" /> {/* Нагрудник */}
          {/* Лямки */}
          <path d="M55 100 L70 130" stroke="#1D4ED8" strokeWidth="10" strokeLinecap="round"/>
          <path d="M145 100 L130 130" stroke="#1D4ED8" strokeWidth="10" strokeLinecap="round"/>
          <circle cx="70" cy="135" r="4" fill="#1F2937"/> {/* Пуговица */}
          <circle cx="130" cy="135" r="4" fill="#1F2937"/> {/* Пуговица */}
          
          {/* Логотип на кармашке */}
          <circle cx="100" cy="155" r="10" fill="rgba(0,0,0,0.2)" />
          <path d="M96 155 L100 159 L104 151" stroke="#fff" strokeWidth="2" fill="none"/>

          {/* --- РУКИ (растут из тела) --- */}
          {/* Левая (статичная) */}
          <path d="M52 110 Q30 140 40 160" stroke="#EAB308" strokeWidth="12" strokeLinecap="round" fill="none" />
          <circle cx="40" cy="160" r="10" fill="#1F2937" /> {/* Перчатка */}

          {/* Правая (МАШЕТ) */}
          <motion.g style={{ originX: "148px", originY: "110px" }} variants={armVariants} animate="wave">
            <path d="M148 110 Q170 140 175 120" stroke="#EAB308" strokeWidth="12" strokeLinecap="round" fill="none" />
            <circle cx="175" cy="120" r="10" fill="#1F2937" /> {/* Перчатка */}
          </motion.g>

          {/* --- ЛИЦО --- */}
          <g transform="translate(0, 10)">
             {/* Ремешок очков */}
             <rect x="48" y="65" width="104" height="15" fill="#1F2937" rx="2" />
             
             {/* Очки (Два глаза) */}
             <circle cx="80" cy="72" r="22" fill="#9CA3AF" stroke="#4B5563" strokeWidth="2" />
             <circle cx="120" cy="72" r="22" fill="#9CA3AF" stroke="#4B5563" strokeWidth="2" />
             <circle cx="80" cy="72" r="16" fill="white" />
             <circle cx="120" cy="72" r="16" fill="white" />

             {/* Зрачки (Анимация моргания CSS) */}
             <g>
                <circle cx="80" cy="72" r="6" fill="#4B2C20" />
                <circle cx="120" cy="72" r="6" fill="#4B2C20" />
                <circle cx="82" cy="70" r="2" fill="white" opacity="0.8" />
                <circle cx="122" cy="70" r="2" fill="white" opacity="0.8" />
                <animateTransform attributeName="transform" type="scale" values="1 1; 1 0.1; 1 1" keyTimes="0; 0.05; 0.1" dur="4s" repeatCount="indefinite" additive="sum" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" centerY="72" />
             </g>

             {/* Рот (Улыбка) */}
             <path d="M85 105 Q100 115 115 105" stroke="#4B2C20" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>

          {/* Волоски на голове */}
          <path d="M90 40 Q95 20 100 40 Q105 20 110 40" stroke="#1F2937" strokeWidth="2" fill="none" />
        </svg>
      </motion.div>
    </div>
  );
}