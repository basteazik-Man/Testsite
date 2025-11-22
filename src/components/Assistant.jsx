import React from "react";
import { motion } from "framer-motion";
import "../styles/assistant.css";

// Новый размер по умолчанию (был 180, стал 360)
export default function Assistant({ size = 360, onClick }) {
  
  // Статический контент для облачка
  const bubble = { 
    title: "Банана? Ой!", 
    subtitle: "Нужен ремонт? Нажми на меня" 
  };
  
  // Статический путь к твоему загруженному GIF-файлу
  const GIF_SOURCE = "/1000259609-unscreen.gif";

  return (
    <motion.div 
      className="relative flex flex-col items-center justify-end cursor-pointer group" 
      // Устанавливаем размер контейнера
      style={{ width: size, height: size * 1.2 }} 
      onClick={onClick}
      // Добавляем интерактивные эффекты
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* --- ОБЛАЧКО С ТЕКСТОМ (Теперь статично) --- */}
      <motion.div 
        className="absolute -top-24 z-50 pointer-events-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }} // Постоянно видимое
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-white border-4 border-yellow-400 rounded-3xl p-4 shadow-xl relative min-w-[200px] text-center">
           <p className="font-bold text-gray-800 text-lg">{bubble.title}</p>
           <p className="text-sm text-gray-500 mt-1 font-medium">{bubble.subtitle}</p>
           {/* Треугольник снизу */}
           <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-yellow-400"></div>
        </div>
      </motion.div>

      {/* --- МИНЬОН (Статический GIF) --- */}
      <div className="relative w-full h-full flex items-end justify-center">
         <motion.img
           src={GIF_SOURCE} 
           alt="Minion Animation"
           className="w-full h-full object-contain drop-shadow-2xl"
           // Добавляем анимацию появления
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5 }}
         />
      </div>
    </motion.div>
  );
}