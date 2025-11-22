import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Assistant from "../components/Assistant";
import Diagnosis from "./Diagnosis"; // Убедись, что Diagnosis.jsx лежит в этой же папке (pages)

export default function Home() {
  const navigate = useNavigate();
  // Состояние: false = обычный сайт, true = открыт помощник
  const [assistantMode, setAssistantMode] = useState(false);

  // Функция запуска режима помощника
  const handleAssistantClick = () => {
    setAssistantMode(true);
  };

  // Функция выхода из режима помощника
  const closeAssistant = () => {
    setAssistantMode(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen relative overflow-hidden">
      
      {/* --- ЭКРАН ПОМОЩНИКА (Появляется поверх сайта) --- */}
      <AnimatePresence>
        {assistantMode && (
          <motion.div 
            className="fixed inset-0 z-50 bg-white flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Кнопка закрыть */}
            <div className="flex justify-end p-4">
              <button 
                onClick={closeAssistant}
                className="px-4 py-2 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-500 rounded-lg transition-colors font-medium"
              >
                Закрыть ✕
              </button>
            </div>

            {/* Контент диагностики по центру */}
            <div className="flex-grow flex items-center justify-center overflow-y-auto p-4">
              <div className="w-full max-w-3xl">
                <Diagnosis />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* --- ОСНОВНОЙ САЙТ (Анимируется при открытии помощника) --- */}
      <motion.div 
        className="w-full flex flex-col items-center pt-16 px-4"
        animate={{ 
          opacity: assistantMode ? 0 : 1, 
          scale: assistantMode ? 0.95 : 1,
          filter: assistantMode ? "blur(10px)" : "blur(0px)"
        }}
        transition={{ duration: 0.5 }}
      >
        
        {/* Приветственный блок */}
        <div className="w-full max-w-5xl mb-12 relative">
          
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 md:p-12 shadow-2xl relative overflow-visible flex flex-col md:flex-row items-center justify-between min-h-[300px]">
            
            {/* Текст (Строго по центру для мобилок, слева для ПК) */}
            <div className="text-center md:text-left z-10 max-w-lg mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                Добро пожаловать в <br/>
                <span className="text-blue-200">Чип&Гаджет</span>
              </h1>
              <p className="text-blue-100 text-lg md:text-xl font-light">
                Профессиональный ремонт вашей техники. Быстро. Честно. С гарантией.
              </p>
            </div>

            {/* Персонаж-Ассистент */}
            <div className="relative z-20 flex-shrink-0 mt-4 md:mt-0 md:mr-8">
               <Assistant size={180} onClick={handleAssistantClick} />
            </div>

          </div>
        </div>

        {/* Остальной контент (Заглушка, чтобы структура не сломалась) */}
        <div className="w-full max-w-5xl bg-white p-6 md:p-8 rounded-3xl shadow-xl mb-6 text-center text-gray-400">
          <h2 className="text-xl font-semibold mb-4">Каталог брендов и услуг</h2>
          <p>Ниже располагается остальная часть вашего сайта...</p>
        </div>

      </motion.div>

    </div>
  );
}