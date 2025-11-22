import React, { useEffect, useState } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import "../styles/assistant.css";

// Иконки для падающих элементов (SVG)
const GiftIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 12V22H4V12" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 7H2V12H22V7Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 22V7" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DiscountIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#FBBF24" stroke="#D97706" strokeWidth="2"/>
      <path d="M16 8L8 16" stroke="#B45309" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="9.5" cy="9.5" r="1.5" fill="#B45309"/>
      <circle cx="14.5" cy="14.5" r="1.5" fill="#B45309"/>
    </svg>
);

export default function Assistant({ size = 180, onClick }) {
  const controls = useAnimation();
  const [items, setItems] = useState([]);

  useEffect(() => {
    controls.start("shake");
  }, [controls]);

  // Генератор падающих подарков
  useEffect(() => {
      const interval = setInterval(() => {
          const id = Date.now();
          const type = Math.random() > 0.5 ? 'gift' : 'discount';
          // Случайная позиция вылета из кроны дерева (примерно от 120 до 180 по X)
          const startX = 120 + Math.random() * 60; 
          setItems(prev => [...prev, { id, type, startX }]);
      }, 600); // Каждые 600мс падает новый предмет

      return () => clearInterval(interval);
  }, []);

  const remove Item = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };


  // Анимация ТРЯСКИ (быстрая вибрация)
  const shakeVariant = {
    shake: {
      x: [0, -3, 3, -2, 2, 0],
      y: [0, 2, -2, 1, -1, 0],
      rotate: [0, -2, 2, -1, 1, 0],
      transition: {
        duration: 0.4,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "linear"
      }
    },
    click: {
        scale: [1, 1.2, 0.1],
        y: [0, -20, -200],
        opacity: [1, 1, 0],
        transition: { duration: 0.5, ease: "backIn" }
      }
  };
  
  const treeShakeVariant = {
    shake: {
        rotate: [0, 2, -2, 1, -1, 0],
        originX: "150px", originY: "220px", // Точка вращения у основания ствола
        transition: { duration: 0.4, repeat: Infinity, repeatType: "mirror", ease: "linear" }
    }
  }

  const handleClick = async () => {
    await controls.start("click");
    if (onClick) onClick();
  };

  return (
    <div 
      className="relative group cursor-pointer" 
      onClick={handleClick}
      style={{ width: size, height: size }}
    >
      {/* Облачко */}
      <div className="speech-bubble-container">
        <div className="speech-bubble-text">
          🎄 <strong>Трясу ёлку!</strong><br/>
          Смотри, сколько подарков и скидок!
          <strong>Жми сюда!</strong>
        </div>
      </div>

      {/* Падающие элементы */}
      <AnimatePresence>
        {items.map(item => (
            <motion.div
                key={item.id}
                className="falling-item"
                style={{ left: item.startX, top: 60 }}
                initial={{ y: 0, opacity: 1, rotate: 0 }}
                animate={{ y: 180, opacity: 0, rotate: Math.random() * 360 }}
                transition={{ duration: 2, ease: "easeIn" }}
                onAnimationComplete={() => remove Item(item.id)}
            >
                {item.type === 'gift' ? <GiftIcon/> : <DiscountIcon/>}
            </motion.div>
        ))}
      </AnimatePresence>

      {/* Основная сцена */}
      <div className="w-full h-full relative z-20">
        <svg viewBox="0 0 240 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="yellowSkin" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FACC15"/>
              <stop offset="100%" stopColor="#EAB308"/>
            </linearGradient>
            <linearGradient id="bluePants" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6"/>
              <stop offset="100%" stopColor="#1D4ED8"/>
            </linearGradient>
             <linearGradient id="treeGreen" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22c55e"/>
              <stop offset="100%" stopColor="#15803d"/>
            </linearGradient>
          </defs>

          {/* Тень общая */}
          <ellipse cx="120" cy="230" rx="70" ry="8" fill="rgba(0,0,0,0.2)" />

          {/* === ЁЛКА (Трясется) === */}
          <motion.g variants={treeShakeVariant} animate={controls}>
              {/* Ствол */}
              <rect x="140" y="180" width="20" height="50" fill="#78350f" />
              {/* Крона */}
              <path d="M150 20 L110 100 L130 100 L100 180 L200 180 L170 100 L190 100 Z" fill="url(#treeGreen)" stroke="#166534" strokeWidth="2" strokeLinejoin="round" />
              {/* Украшения на елке */}
              <circle cx="130" cy="120" r="5" fill="#ef4444" />
              <circle cx="170" cy="150" r="5" fill="#facc15" />
              <circle cx="150" cy="60" r="5" fill="#3b82f6" />
          </motion.g>

          {/* === МИНЬОН (Трясется всем телом) === */}
          <motion.g variants={shakeVariant} animate={controls}>
            
            {/* Ноги */}
            <path d="M35 200 L35 225" stroke="#1D4ED8" strokeWidth="12" strokeLinecap="round" />
            <path d="M65 200 L65 225" stroke="#1D4ED8" strokeWidth="12" strokeLinecap="round" />
            <path d="M25 225 L42 225" stroke="#1F2937" strokeWidth="10" strokeLinecap="round" />
            <path d="M58 225 L75 225" stroke="#1F2937" strokeWidth="10" strokeLinecap="round" />

            {/* Тело */}
            <rect x="10" y="60" width="80" height="150" rx="40" fill="url(#yellowSkin)" />

            {/* Штаны */}
            <path d="M10 160 L10 180 A40 40 0 0 0 90 180 L90 160 L10 160 Z" fill="url(#bluePants)" />
            <rect x="25" y="140" width="50" height="40" fill="url(#bluePants)" />
            <path d="M15 110 L25 140" stroke="#1D4ED8" strokeWidth="8" strokeLinecap="round"/>
            <path d="M85 110 L75 140" stroke="#1D4ED8" strokeWidth="8" strokeLinecap="round"/>

            {/* Левая рука (отведена назад для баланса) */}
            <path d="M10 120 Q-10 150 5 170" stroke="#EAB308" strokeWidth="10" strokeLinecap="round" fill="none" />
             <circle cx="5" cy="170" r="8" fill="#1F2937" />

            {/* Правая рука (ДЕРЖИТСЯ ЗА СТВОЛ) - Исправлено крепление */}
            <path d="M90 120 C 110 120, 120 140, 145 190" stroke="#EAB308" strokeWidth="10" strokeLinecap="round" fill="none" />
            <circle cx="145" cy="190" r="8" fill="#1F2937" /> {/* Перчатка на стволе */}

            {/* Лицо (напряженное от тряски) */}
            <g transform="translate(-40, 20)">
                <rect x="48" y="65" width="84" height="12" fill="#1F2937" rx="2" />
                <circle cx="70" cy="72" r="18" fill="#9CA3AF" stroke="#4B5563" strokeWidth="2" />
                <circle cx="110" cy="72" r="18" fill="#9CA3AF" stroke="#4B5563" strokeWidth="2" />
                <circle cx="70" cy="72" r="13" fill="white" />
                <circle cx="110" cy="72" r="13" fill="white" />
                {/* Зрачки бегают */}
                <motion.g animate={{ x: [-1, 1, -1], y:[-1, -1, 0] }} transition={{duration: 0.2, repeat: Infinity}}>
                    <circle cx="70" cy="72" r="5" fill="#4B2C20" />
                    <circle cx="110" cy="72" r="5" fill="#4B2C20" />
                </motion.g>
                {/* Рот (напряженный) */}
                 <path d="M75 105 Q90 100 105 105" stroke="#4B2C20" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
            
            <path d="M40 60 Q45 40 50 60 Q55 40 60 60" stroke="#1F2937" strokeWidth="2" fill="none" />
          </motion.g>
        </svg>
      </div>
    </div>
  );
}