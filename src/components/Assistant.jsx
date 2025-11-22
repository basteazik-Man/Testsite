import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import "../styles/assistant.css"; 

export default function Assistant({ size = 140, onClick }) {
  const controls = useAnimation();

  useEffect(() => {
    // После загрузки запускаем анимацию "дыхания"
    controls.start("idle");
  }, [controls]);

  // Анимации тела
  const variants = {
    idle: {
      y: [0, -6, 0], // Плавное парение вверх-вниз
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    click: {
      scale: [1, 0.9, 5], // Сжатие и резкое увеличение
      y: [0, 20, -100],
      opacity: [1, 1, 0],
      transition: { duration: 0.6, ease: "easeInOut" }
    }
  };

  // Анимация руки (махание)
  const armVariants = {
    wave: {
      rotate: [0, 20, -10, 20, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: 3, 
        ease: "easeInOut"
      }
    }
  };

  const handleClick = async () => {
    // Сначала проигрываем анимацию клика
    await controls.start("click");
    // Потом вызываем действие (открытие диагностики)
    if (onClick) onClick();
  };

  return (
    <div 
      className="relative group cursor-pointer" 
      onClick={handleClick}
      style={{ width: size, height: size }}
    >
      {/* Облачко с текстом */}
      <div className="speech-bubble-container">
        <div className="speech-bubble-text">
          👋 <strong>Привет!</strong><br/>
          Я Виртуальный помощник. Нажми на меня!
        </div>
      </div>

      <motion.div
        animate={controls}
        initial={{ y: 0 }}
        variants={variants}
        whileHover={{ scale: 1.05 }}
        className="w-full h-full relative z-20"
      >
        {/* SVG РОБОТА */}
        <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="robotBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60A5FA"/>
              <stop offset="100%" stopColor="#2563EB"/>
            </linearGradient>
            <linearGradient id="robotFace" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF"/>
              <stop offset="100%" stopColor="#DBEAFE"/>
            </linearGradient>
          </defs>

          {/* Тень */}
          <ellipse cx="100" cy="190" rx="45" ry="6" fill="rgba(0,0,0,0.2)" />

          {/* Тело */}
          <rect x="65" y="95" width="70" height="60" rx="15" fill="url(#robotBody)" />
          {/* Декор на груди */}
          <circle cx="100" cy="125" r="12" fill="rgba(255,255,255,0.3)" />

          {/* Ноги */}
          <path d="M80 155 L80 180" stroke="#374151" strokeWidth="6" strokeLinecap="round" />
          <path d="M120 155 L120 180" stroke="#374151" strokeWidth="6" strokeLinecap="round" />
          <path d="M72 180 L88 180" stroke="#1F2937" strokeWidth="6" strokeLinecap="round" />
          <path d="M112 180 L128 180" stroke="#1F2937" strokeWidth="6" strokeLinecap="round" />

          {/* Левая рука (статичная) */}
          <path d="M65 110 Q50 130 55 145" stroke="#60A5FA" strokeWidth="8" strokeLinecap="round" fill="none" />
          <circle cx="55" cy="145" r="7" fill="#60A5FA" />

          {/* Правая рука (АНИМИРОВАННАЯ) */}
          <motion.g style={{ originX: "135px", originY: "110px" }} variants={armVariants} animate="wave">
            <path d="M135 110 Q155 90 160 70" stroke="#60A5FA" strokeWidth="8" strokeLinecap="round" fill="none" />
            <circle cx="160" cy="70" r="7" fill="#60A5FA" />
          </motion.g>

          {/* Голова */}
          <g transform="translate(0, -5)">
            <rect x="70" y="40" width="60" height="50" rx="14" fill="url(#robotFace)" stroke="#2563EB" strokeWidth="3" />
            
            {/* Антенна */}
            <line x1="100" y1="40" x2="100" y2="20" stroke="#2563EB" strokeWidth="3" />
            <circle cx="100" cy="20" r="4" fill="#EF4444">
               <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
            </circle>

            {/* Глаза */}
            <ellipse cx="88" cy="62" rx="5" ry="7" fill="#1F2937" />
            <ellipse cx="112" cy="62" rx="5" ry="7" fill="#1F2937" />
            
            {/* Улыбка */}
            <path d="M90 75 Q100 80 110 75" stroke="#2563EB" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        </svg>
      </motion.div>
    </div>
  );
}