import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { brandData } from "../data/brandData";
import { PRICES } from "../data/prices";

export default function BrandPage() {
  const { brand } = useParams();
  const navigate = useNavigate();
  
  // Получаем сохраненную категорию из localStorage или используем первую
  const getInitialCategory = () => {
    const saved = localStorage.getItem(`selectedCategory_${brand}`);
    const data = brandData[brand?.toLowerCase()];
    const categories = data?.categories ? Object.keys(data.categories) : [];
    return saved && categories.includes(saved) ? saved : (categories[0] || null);
  };

  const [selectedCategory, setSelectedCategory] = useState(getInitialCategory);

  const data = brandData[brand?.toLowerCase()];
  const brandPrices = PRICES[brand?.toLowerCase()];

  // Обработка ошибок - проверка наличия бренда
  if (!brand) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Бренд не найден</h1>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            На главную
          </button>
        </div>
      </div>
    );
  }

  // Обработка ошибок - проверка наличия данных о бренде
  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Бренд "{brand}" не поддерживается</h1>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            На главную
          </button>
        </div>
      </div>
    );
  }

  const hasCategories = data?.categories !== undefined;
  const categories = hasCategories ? Object.keys(data.categories) : [];

  // Сохраняем выбранную категорию в localStorage
  useEffect(() => {
    if (selectedCategory) {
      localStorage.setItem(`selectedCategory_${brand}`, selectedCategory);
    }
  }, [selectedCategory, brand]);

  // НОВАЯ ФУНКЦИЯ: Получить ВСЕ модели для отображения (из brandData + из PRICES)
  const getAllModelsForCategory = () => {
    if (!selectedCategory) return [];

    // Модели из brandData для выбранной категории
    const modelsFromBrandData = hasCategories && selectedCategory
      ? data.categories[selectedCategory] || []
      : [];

    // Модели из PRICES (данных цен) для этого бренда
    const modelsFromPrices = brandPrices?.models ? Object.keys(brandPrices.models) : [];

    // Объединяем модели, убираем дубликаты
    const allModelsMap = new Map();

    // Сначала добавляем модели из brandData
    modelsFromBrandData.forEach(model => {
      allModelsMap.set(model.id, {
        id: model.id,
        name: model.name,
        image: model.image,
        from: 'brandData'
      });
    });

    // Затем добавляем модели из PRICES, которых нет в brandData
    modelsFromPrices.forEach(modelKey => {
      if (!allModelsMap.has(modelKey)) {
        // Создаем человеко-читаемое название из ключа модели
        const modelName = modelKey
          .replace(/-/g, ' ')
          .replace(/\b\w/g, letter => letter.toUpperCase());
        
        allModelsMap.set(modelKey, {
          id: modelKey,
          name: modelName,
          image: "/logos/default-phone.jpg",
          from: 'prices'
        });
      }
    });

    return Array.from(allModelsMap.values());
  };

  const modelsToDisplay = getAllModelsForCategory();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4" style={{ position: 'relative', zIndex: 1 }}>
      <div className="max-w-6xl mx-auto" style={{ position: 'relative', zIndex: 2 }}>
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 font-medium relative z-10"
        >
          ← Назад
        </button>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 capitalize relative z-10">
          {data?.brand || brand}
        </h1>

        {hasCategories && categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-8 relative z-20">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-3 rounded-2xl font-semibold transition-all relative z-30 shadow-lg hover:shadow-xl ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-blue-50 hover:border-blue-200"
                }`}
                style={{ cursor: 'pointer' }}
              >
                {cat.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                {getCategoryModelCount(cat) > 0 && ` (${getCategoryModelCount(cat)})`}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 relative z-10">
          {modelsToDisplay.length > 0 ? (
            modelsToDisplay.map((model) => (
              <button
                key={model.id}
                onClick={() => navigate(`/brand/${brand}/model/${encodeURIComponent(model.id)}`)}
                className="bg-white rounded-2xl py-4 px-6 text-gray-800 font-semibold border border-gray-200 shadow-md hover:shadow-xl transition-all text-base md:text-lg w-full text-center relative z-10 hover:border-blue-300 hover:bg-blue-50 group"
                style={{ cursor: 'pointer' }}
                title={model.from === 'prices' ? "Модель из данных цен" : "Модель из каталога"}
              >
                <div className="flex flex-col items-center">
                  <span>{model.name}</span>
                  {model.from === 'prices' && (
                    <span className="text-xs text-green-600 mt-1 bg-green-100 px-2 py-1 rounded-full">
                      ✓ с ценами
                    </span>
                  )}
                </div>
              </button>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 relative z-10">
              {hasCategories && categories.length > 0
                ? "В этой категории пока нет моделей с данными."
                : "Модели не найдены."}
            </p>
          )}
        </div>

        {/* Информация о количестве моделей */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Всего моделей: {modelsToDisplay.length} 
          {modelsToDisplay.filter(m => m.from === 'prices').length > 0 && 
            ` (${modelsToDisplay.filter(m => m.from === 'prices').length} с ценами)`
          }
        </div>

        {/* БЛОК ДОСТАВКИ */}
        <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl text-center">
          <h3 className="text-xl font-semibold text-green-800 mb-3">
            🚚 Нужна доставка устройства?
          </h3>
          <p className="text-green-700 mb-4">
            Мы бесплатно заберем ваш {data?.brand || brand} на ремонт и доставим обратно после выполнения работ
          </p>
          <button
            onClick={() => navigate('/delivery-order', { 
              state: { 
                brand: brand,
                deviceType: 'smartphone'
              }
            })}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
          >
            Заказать доставку
          </button>
        </div>
      </div>
    </div>
  );

  // Вспомогательная функция для подсчета моделей в категории
  function getCategoryModelCount(category) {
    const modelsFromBrandData = data.categories[category]?.length || 0;
    const modelsFromPrices = brandPrices?.models ? 
      Object.keys(brandPrices.models).filter(modelKey => {
        // Проверяем, относится ли модель к этой категории (простая эвристика)
        const modelName = modelKey.toLowerCase();
        const categoryName = category.toLowerCase();
        
        // Для Samsung
        if (brand.toLowerCase() === 'samsung') {
          if (categoryName.includes('galaxy_s') && modelName.match(/s\d+/)) return true;
          if (categoryName.includes('galaxy_a') && modelName.match(/a\d+/)) return true;
          if (categoryName.includes('galaxy_m') && modelName.match(/m\d+/)) return true;
          if (categoryName.includes('galaxy_note') && modelName.includes('note')) return true;
          if (categoryName.includes('galaxy_z') && (modelName.includes('flip') || modelName.includes('fold'))) return true;
          if (categoryName.includes('galaxy_tab') && modelName.includes('tab')) return true;
        }
        
        // Общая проверка по названию
        return modelName.includes(categoryName.replace('galaxy_', '').replace('_', ''));
      }).length : 0;
    
    return modelsFromBrandData + modelsFromPrices;
  }
}