import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../hooks/useSearch";
import { BRANDS } from "../data/brands";
import Assistant from "../components/Assistant";
import Diagnosis from "./Diagnosis";

const FALLBACK_BRANDS = [
  { id: "apple", title: "Apple", logo: "/logos/apple.svg" },
  { id: "samsung", title: "Samsung", logo: "/logos/samsung.svg" },
  { id: "xiaomi", title: "Xiaomi", logo: "/logos/xiaomi.svg" },
  { id: "honor", title: "Honor", logo: "/logos/honor.svg" },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [assistantMode, setAssistantMode] = useState(false); // Режим диагностики

  const navigate = useNavigate();
  const searchHook = useSearch || (() => ({ searchResults: [] }));
  const { searchResults: results = [] } = searchHook(query);
  const searchRef = useRef(null);

  // Закрытие поиска при клике вне
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (brand, model) => {
    setQuery("");
    setShowSuggestions(false);
    navigate(`/brand/${brand}/model/${encodeURIComponent(model)}`);
  };

  const handleSearchAll = () => {
    setShowSuggestions(false);
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.trim().length > 0);
  };

  const hasQuery = query.trim().length > 0;
  const hasResults = results.length > 0;
  const brandsToShow = BRANDS && BRANDS.length > 0 ? BRANDS : FALLBACK_BRANDS;

  const categories = [
    { 
      id: "laptops", 
      title: "Ноутбуки", 
      icon: "💻", 
      gradient: "from-purple-500 to-blue-600",
      hoverGradient: "from-purple-600 to-blue-700"
    },
    { 
      id: "tv", 
      title: "Телевизоры", 
      icon: "📺", 
      gradient: "from-green-500 to-teal-600",
      hoverGradient: "from-green-600 to-teal-700"
    },
  ];

  const handleCategoryClick = (categoryId) => {
    navigate(`/services?category=${categoryId}`);
  };

  // Запуск режима ассистента
  const handleAssistantClick = () => {
    setAssistantMode(true);
  };

  return (
    <div className="flex flex-col items-center text-center px-4 sm:px-6 relative z-10 pt-16 min-h-screen">
      
      {/* === ОВЕРЛЕЙ ДИАГНОСТИКИ (Появляется при клике на ассистента) === */}
      <AnimatePresence>
        {assistantMode && (
          <motion.div 
            className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
             <div className="absolute top-4 right-4 z-50">
                <button 
                  onClick={() => setAssistantMode(false)}
                  className="bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-500 px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Закрыть ✕
                </button>
             </div>
             
             {/* Контейнер для скролла */}
             <div className="diagnosis-modal-scroll p-4">
                <div className="w-full max-w-3xl mt-10">
                   <Diagnosis />
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === ОСНОВНОЙ КОНТЕНТ (Скрывается при assistantMode) === */}
      <motion.div
         className="w-full flex flex-col items-center"
         animate={{ 
           opacity: assistantMode ? 0 : 1,
           filter: assistantMode ? "blur(8px)" : "blur(0px)",
           scale: assistantMode ? 0.95 : 1
         }}
         transition={{ duration: 0.4 }}
      >

        {/* === Поиск === */}
        <div ref={searchRef} className="w-full max-w-4xl mb-8 relative">
          <div className="flex">
            <input
              type="text"
              placeholder="🔍 Поиск модели или бренда..."
              value={query}
              onChange={handleInputChange}
              onFocus={() => query.trim().length > 0 && setShowSuggestions(true)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchAll()}
              className="w-full p-4 rounded-l-2xl border border-gray-300 shadow-md focus:ring-2 focus:ring-blue-400 outline-none text-gray-800 text-lg"
            />
            <button
              onClick={handleSearchAll}
              disabled={!query.trim()}
              className={`px-6 py-4 font-semibold rounded-r-2xl ${
                query.trim() ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Поиск
            </button>
          </div>

          <AnimatePresence>
            {showSuggestions && hasQuery && (
              <motion.ul
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-80 overflow-auto"
              >
                {hasResults ? (
                  <>
                    {results.slice(0, 10).map((item, index) => (
                      <li
                        key={index}
                        onClick={() => handleSelect(item.brandKey, item.model)}
                        className="px-4 py-3 text-left hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex justify-between"
                      >
                         <div>
                            <span className="font-semibold">{item.model}</span>
                            <span className="text-gray-500 text-sm ml-2">({item.brand})</span>
                         </div>
                      </li>
                    ))}
                  </>
                ) : (
                  <li className="px-4 py-3 text-center text-gray-600">Ничего не найдено</li>
                )}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* === Блок Приветствия с Ассистентом === */}
        <section className="w-full max-w-5xl mb-8 relative">
          <div className="rounded-3xl bg-gradient-to-r from-blue-500 to-blue-600 p-8 shadow-lg relative overflow-visible min-h-[200px] flex items-center justify-center">
            
            {/* Текст строго по центру */}
            <div className="z-10 text-center max-w-2xl px-4">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 leading-tight">
                Добро пожаловать в <br/>
                <span className="text-blue-100">Чип&Гаджет</span>
              </h1>
              <p className="text-white/90 mt-2 text-lg">
                Ремонт смартфонов, планшетов и ноутбуков всех брендов
              </p>
            </div>

            {/* Ассистент - Позиционирован абсолютно справа внизу блока */}
            <div className="absolute right-[-10px] bottom-[-20px] md:right-8 md:bottom-[-30px] z-20 hidden sm:block">
               <Assistant size={160} onClick={handleAssistantClick} />
            </div>
            
            {/* Ассистент для мобильных (под текстом, чтобы не перекрывал) */}
            <div className="absolute bottom-[-50px] right-0 sm:hidden z-20">
               <Assistant size={120} onClick={handleAssistantClick} />
            </div>

          </div>
          {/* Отступ снизу, чтобы ноги ассистента не наезжали на кнопки */}
          <div className="h-8 sm:h-0"></div>
        </section>

        {/* === Кнопки брендов (Восстановлено) === */}
        {brandsToShow && brandsToShow.length > 0 ? (
          <section className="w-full max-w-5xl bg-white p-6 md:p-8 rounded-3xl shadow-xl mb-6 z-10 relative">
            <h2 className="text-2xl font-semibold mb-6 md:mb-8 text-gray-800 text-left">Выберите бренд</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
              {brandsToShow.map((brand) => (
                <motion.button
                  key={brand.id}
                  onClick={() => navigate(`/brand/${brand.id}`)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-col items-center p-4 md:p-6 rounded-2xl bg-white shadow-lg hover:shadow-2xl cursor-pointer transition-all border border-gray-100"
                >
                  <img
                    src={brand.logo}
                    alt={brand.title}
                    className="w-14 h-14 md:w-20 md:h-20 mb-3 object-contain"
                  />
                  <p className="font-medium text-gray-700 text-sm md:text-base">{brand.title}</p>
                </motion.button>
              ))}
            </div>
          </section>
        ) : (
          <div className="w-full max-w-5xl bg-yellow-50 p-6 rounded-3xl border border-yellow-200 mb-6">
            <h2 className="text-xl font-semibold text-yellow-800">Бренды не загружены</h2>
          </div>
        )}

        {/* === Категории === */}
        <section className="w-full max-w-5xl bg-white p-6 md:p-8 rounded-3xl shadow-xl mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl bg-gradient-to-r ${cat.gradient} shadow-xl hover:shadow-2xl text-white min-h-[140px]`}
              >
                <span className="text-3xl md:text-4xl mb-3">{cat.icon}</span>
                <span className="text-xl font-bold">{cat.title}</span>
                <span className="text-white/80 text-sm mt-2">Посмотреть услуги и цены</span>
              </motion.button>
            ))}
          </div>
        </section>

      </motion.div>
    </div>
  );
}