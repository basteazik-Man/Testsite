// src/components/admin/BrandEditor.jsx
// ИСПРАВЛЕНО: Сохранение категории (_category) при редактировании услуг

import React, { useState, useMemo } from "react";
import ModelEditor from "./ModelEditor";
import { brandData } from "../../data/brandData";
import { getBrandStatus, getModelStatus } from "../../utils/priceUtils";

export default function BrandEditor({ brandKey, data, onChange }) {
  const brand = data[brandKey];
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Получаем категории из brandData
  const brandCategories = useMemo(() => {
    const brandInfo = brandData[brandKey];
    return brandInfo?.categories || {};
  }, [brandKey]);

  const colorMap = {
    red: "border-red-400 bg-red-50",
    yellow: "border-yellow-400 bg-yellow-50", 
    green: "border-green-400 bg-green-50",
  };

  const currencies = ["₽", "$", "€", "¥", "£", "₹"];

  const updateBrand = (changes) => {
    const updated = { ...brand, ...changes };
    onChange(brandKey, updated);
  };

  // ФУНКЦИЯ: Добавление модели в выбранную категорию
  const addModelToCategory = () => {
    if (!selectedCategory) {
      alert("❌ Сначала выберите категорию!");
      return;
    }

    const modelName = prompt("Введите название новой модели:");
    if (!modelName) return;

    const modelId = modelName.toLowerCase().replace(/\s+/g, '-');
    
    // Проверяем уникальность
    if (brand.models[modelId]) {
      alert("❌ Модель с таким ID уже существует!");
      return;
    }

    // Создаем новую модель с явным указанием категории
    const newModel = {
      _customName: modelName,
      _category: selectedCategory, // ВАЖНО: Эта метка нужна для экспорта
      services: []
    };

    const newModels = {
      ...brand.models,
      [modelId]: newModel
    };

    updateBrand({ models: newModels });
    setSelectedModel(modelId);
    
    alert(`✅ Модель "${modelName}" создана!\n\nТеперь заполните услуги и цены.`);
  };

  // ФУНКЦИЯ: Удаление модели
  const deleteModel = (modelKey, e) => {
    if (e) e.stopPropagation();
    
    const modelName = getModelDisplayName(modelKey);
    
    if (!confirm(`❌ УДАЛИТЬ МОДЕЛЬ "${modelName}"?\n\nПосле удаления нужно:\n1. Сделать "📝 Экспорт BrandData"\n2. Сделать "📁 Экспорт ZIP"\n3. Подождать обновления сайта`)) return;
    
    const newModels = { ...brand.models };
    delete newModels[modelKey];
    
    updateBrand({ models: newModels });
    
    if (selectedModel === modelKey) {
      setSelectedModel("");
    }
  };

  // ФУНКЦИЯ: Редактирование названия
  const editModelName = (modelKey, e) => {
    e.stopPropagation();
    const currentName = getModelDisplayName(modelKey);
    const newName = prompt("Введите новое название модели:", currentName);
    if (!newName || newName === currentName) return;

    const modelData = brand.models[modelKey];
    let updatedModel;

    // Проверяем структуру, чтобы не потерять данные
    if (Array.isArray(modelData)) {
        // Если была старая структура (массив), превращаем в объект
        updatedModel = {
            services: modelData,
            _customName: newName
        };
    } else {
        // Если новая (объект), обновляем имя
        updatedModel = {
            ...modelData,
            _customName: newName
        };
    }
    
    const updatedModels = { ...brand.models, [modelKey]: updatedModel };
    updateBrand({ models: updatedModels });
  };

  // ВАЖНОЕ ИСПРАВЛЕНИЕ: Сохраняем метаданные (_category) при обновлении услуг
  const handleModelChange = (modelKey, updatedServices) => {
    const currentModelData = brand.models[modelKey];
    let newModelData;

    if (currentModelData && !Array.isArray(currentModelData) && typeof currentModelData === 'object') {
      // Если это новая модель (объект), сохраняем её свойства (_category, _customName) и обновляем services
      newModelData = {
        ...currentModelData,
        services: updatedServices
      };
    } else {
      // Если это старая модель (просто массив), так и оставляем массивом
      newModelData = updatedServices;
    }

    const newBrand = {
      ...brand,
      models: { ...brand.models, [modelKey]: newModelData },
    };
    onChange(brandKey, newBrand);
  };

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    if (newCurrency) updateBrand({ currency: newCurrency });
  };

  const handleRenameBrand = () => {
    const newName = prompt("Новое название бренда:", brand.brand);
    if (newName) updateBrand({ brand: newName });
  };

  // Статус бренда
  const brandStatusObj = getBrandStatus(brand);
  const statusMap = {
    full: "green",
    partial: "yellow", 
    empty: "red"
  };
  const brandStatus = statusMap[brandStatusObj.status] || "red";

  // Получить статус модели
  const getModelStatusInfo = (modelKey) => {
    const modelData = brand.models[modelKey];
    let services = [];
    
    if (Array.isArray(modelData)) {
      services = modelData;
    } else if (modelData && modelData.services) {
      services = modelData.services;
    }
    
    return getModelStatus(services);
  };

  // Получить цвет статуса
  const getModelStatusColor = (modelKey) => {
    const { status } = getModelStatusInfo(modelKey);
    return status === "full" ? "text-green-600 bg-green-100" :
           status === "partial" ? "text-yellow-600 bg-yellow-100" :
           "text-red-600 bg-red-100";
  };

  // Получить иконку статуса
  const getModelStatusIcon = (modelKey) => {
    const { status } = getModelStatusInfo(modelKey);
    return status === "full" ? "🟢" :
           status === "partial" ? "🟡" :
           "🔴";
  };

  // Получить отображаемое имя модели
  const getModelDisplayName = (modelKey) => {
    const modelData = brand.models[modelKey];
    
    if (modelData && typeof modelData === 'object' && modelData._customName) {
      return modelData._customName;
    }
    
    for (const category of Object.values(brandCategories)) {
      const model = category.find(m => m.id === modelKey);
      if (model) return model.name;
    }
    
    return modelKey.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  // Получить услуги модели
  const getModelServices = (modelKey) => {
    const modelData = brand.models[modelKey];
    if (Array.isArray(modelData)) {
      return modelData;
    } else if (modelData && modelData.services) {
      return modelData.services;
    }
    return [];
  };

  // Получить модели для выбранной категории
  const getModelsForCategory = () => {
    if (!selectedCategory) return [];

    // Модели из brandData для выбранной категории
    const modelsFromBrandData = (brandCategories[selectedCategory] || [])
      .map(model => model.id)
      .filter(modelKey => brand.models[modelKey]);

    // Кастомные модели для этой категории
    const customModels = Object.keys(brand.models || {}).filter(modelKey => {
      const modelData = brand.models[modelKey];
      return modelData && 
             typeof modelData === 'object' && 
             modelData._category === selectedCategory;
    });

    return [...new Set([...modelsFromBrandData, ...customModels])];
  };

  const modelsToShow = getModelsForCategory();

  // Получить отображаемое имя категории
  const getCategoryDisplayName = (category) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className={`p-6 rounded-2xl border shadow-md mb-8 ${colorMap[brandStatus]}`}>
      {/* Заголовок бренда */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          {brand.brand}
          <span className="text-lg">
            {brandStatus === "green" && "🟢"}
            {brandStatus === "yellow" && "🟡"} 
            {brandStatus === "red" && "🔴"}
          </span>
        </h2>
        <div className="flex gap-2 items-center">
          <button
            onClick={handleRenameBrand}
            className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium transition-colors"
          >
            ✏️ Переименовать
          </button>
          
          <select
            value={brand.currency || "₽"}
            onChange={handleCurrencyChange}
            className="px-3 py-2 rounded-lg bg-blue-200 hover:bg-blue-300 text-sm font-medium transition-colors focus:ring-2 focus:ring-blue-500"
          >
            {currencies.map(currency => (
              <option key={currency} value={currency}>
                💱 {currency}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Выбор категории */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Выберите категорию:</h3>
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedModel("");
          }}
          className="w-full max-w-md border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">— Выберите категорию —</option>
          {Object.keys(brandCategories).map(category => (
            <option key={category} value={category}>
              {getCategoryDisplayName(category)} ({getModelsForCategoryCount(category)})
            </option>
          ))}
        </select>
      </div>

      {/* Добавление модели */}
      {selectedCategory && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">
            Добавить модель в: <span className="text-blue-600">{getCategoryDisplayName(selectedCategory)}</span>
          </h3>
          <button
            onClick={addModelToCategory}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
          >
            ➕ Добавить модель в {getCategoryDisplayName(selectedCategory)}
          </button>
        </div>
      )}

      {/* Список моделей */}
      {selectedCategory && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 text-lg mb-4">
            {getCategoryDisplayName(selectedCategory)} ({modelsToShow.length})
          </h3>
          
          {modelsToShow.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modelsToShow.map(modelKey => {
                const isSelected = selectedModel === modelKey;
                const statusColor = getModelStatusColor(modelKey);
                const statusIcon = getModelStatusIcon(modelKey);
                const modelStatus = getModelStatusInfo(modelKey);

                return (
                  <div
                    key={modelKey}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedModel(modelKey)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm">{statusIcon}</span>
                        <h5 className="font-medium text-gray-800 text-sm leading-tight">
                          {getModelDisplayName(modelKey)}
                        </h5>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => editModelName(modelKey, e)}
                          className="text-blue-400 hover:text-blue-600 text-sm"
                          title="Редактировать название"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => deleteModel(modelKey, e)}
                          className="text-red-400 hover:text-red-600 text-sm"
                          title="Удалить модель"
                        >
                          ✖
                        </button>
                      </div>
                    </div>
                    
                    <div className={`text-xs px-2 py-1 rounded-full ${statusColor} text-center`}>
                      {modelStatus.status === "full" && "✓ Все услуги заполнены"}
                      {modelStatus.status === "partial" && `⚠ ${modelStatus.emptyCount} незаполненных`}
                      {modelStatus.status === "empty" && "✗ Нет данных"}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
              Нет моделей в этой категории
            </div>
          )}
        </div>
      )}

      {/* Сообщение когда категория не выбрана */}
      {!selectedCategory && (
        <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-4xl mb-4">📱</div>
          <p className="text-lg font-medium mb-2">Выберите категорию выше</p>
          <p className="text-sm">Чтобы увидеть список моделей для редактирования</p>
        </div>
      )}

      {/* Редактор модели */}
      {selectedModel && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Редактирование: {getModelDisplayName(selectedModel)}
            </h3>
            <button
              onClick={() => setSelectedModel("")}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
            >
              ✕ Закрыть
            </button>
          </div>
          <ModelEditor
            modelKey={selectedModel}
            services={getModelServices(selectedModel)}
            onChange={(updated) => handleModelChange(selectedModel, updated)}
          />
        </div>
      )}
    </div>
  );

  // Вспомогательная функция для подсчета моделей
  function getModelsForCategoryCount(category) {
    if (!category) return 0;
    
    const modelsFromBrandData = (brandCategories[category] || [])
      .map(model => model.id)
      .filter(modelKey => brand.models[modelKey]).length;

    const customModels = Object.keys(brand.models || {}).filter(modelKey => {
      const modelData = brand.models[modelKey];
      return modelData && 
             typeof modelData === 'object' && 
             modelData._category === category;
    }).length;

    return modelsFromBrandData + customModels;
  }
}