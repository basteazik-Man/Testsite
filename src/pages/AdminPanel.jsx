// AdminPanel.jsx - ТЕСТОВАЯ ВЕРСИЯ ДЛЯ ДИАГНОСТИКИ
import React, { useState, useEffect, useRef } from "react";
import BrandEditor from "../components/admin/BrandEditor";
import CategoryServicesEditor from "../components/admin/CategoryServicesEditor";
import DeliveryEditor from "../components/admin/DeliveryEditor";
import AdminAuth from "../components/AdminAuth";
import { getBrandStatus } from "../utils/priceUtils";
import { BRANDS } from "../data/brands";
import { brandData } from "../data/brandData";
import { syncData, saveToCloud, loadFromCloud } from "../utils/syncUtils";

// Вспомогательная функция для получения всех моделей из brandData
const getAllModelsFromBrandData = (brandKey) => {
  const brandInfo = brandData[brandKey];
  if (!brandInfo || !brandInfo.categories) return [];
  
  const models = [];
  Object.values(brandInfo.categories).forEach((category) => {
    if (Array.isArray(category)) {
      category.forEach((model) => {
        models.push(model.id);
      });
    }
  });
  return models;
};

const buildInitialData = () => {
  const data = {};
  
  // Пробуем загрузить из localStorage
  const saved = localStorage.getItem("chipgadget_prices");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return parsed;
    } catch (e) {
      console.error("Ошибка загрузки из localStorage:", e);
      localStorage.removeItem("chipgadget_prices");
    }
  }

  // Используем все бренды из BRANDS
  BRANDS.forEach((brand) => {
    const key = brand.id;
    const modelsObj = {};
    const allModels = getAllModelsFromBrandData(key);
    
    allModels.forEach((model) => {
      const modelKey = typeof model === 'string' ? model : (model.id || "unknown-model");
      modelsObj[modelKey] = [];
    });

    data[key] = {
      brand: brand.title,
      currency: "₽",
      discount: { type: "none", value: 0 },
      models: modelsObj,
    };
  });

  return data;
};

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(() => {
    return localStorage.getItem('admin_authenticated') === 'true';
  });
  const [data, setData] = useState(() => buildInitialData());
  const [categoryServices, setCategoryServices] = useState(() => {
    const saved = localStorage.getItem("chipgadget_category_services");
    return saved ? JSON.parse(saved) : {};
  });
  const [brandKey, setBrandKey] = useState("");
  const [message, setMessage] = useState("");
  const [syncStatus, setSyncStatus] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  console.log("🔄 AdminPanel компонент загружен");

  // Простая тестовая функция
  const testFunction = () => {
    console.log("✅ Тестовая функция вызвана!");
    alert("Тестовая функция работает!");
  };

  // Упрощенная функция загрузки в облако
  const handleForceUpload = async () => {
    console.log("🔼 Кнопка 'Загрузить в облако' нажата");
    
    try {
      setIsSyncing(true);
      setSyncStatus('Загрузка в облако...');
      
      // Собираем данные
      const uploadData = {
        prices: JSON.parse(localStorage.getItem('chipgadget_prices') || '{}'),
        categoryServices: JSON.parse(localStorage.getItem('chipgadget_category_services') || '{}'),
        delivery: JSON.parse(localStorage.getItem('chipgadget_delivery') || '{}'),
        lastSync: new Date().toISOString(),
      };

      console.log("📦 Данные для загрузки:", uploadData);
      
      // Отправляем в облако
      const result = await saveToCloud(uploadData);
      console.log("✅ Результат сохранения:", result);
      
      setSyncStatus('✅ Данные загружены в облако');
      
    } catch (error) {
      console.error("❌ Ошибка:", error);
      setSyncStatus('❌ Ошибка: ' + error.message);
    } finally {
      setIsSyncing(false);
    }
  };

  // Упрощенная функция загрузки из облака
  const handleForceDownload = async () => {
    console.log("🔽 Кнопка 'Загрузить из облака' нажата");
    
    try {
      setIsSyncing(true);
      setSyncStatus('Загрузка из облака...');
      
      // Загружаем из облака
      const cloudData = await loadFromCloud();
      console.log("☁️ Данные из облака:", cloudData);
      
      // Сохраняем в localStorage
      localStorage.setItem('chipgadget_prices', JSON.stringify(cloudData.prices || {}));
      localStorage.setItem('chipgadget_category_services', JSON.stringify(cloudData.categoryServices || {}));
      localStorage.setItem('chipgadget_delivery', JSON.stringify(cloudData.delivery || {}));
      
      // Обновляем состояние
      setData(buildInitialData());
      setCategoryServices(cloudData.categoryServices || {});
      
      setSyncStatus('✅ Данные загружены из облака');
      
    } catch (error) {
      console.error("❌ Ошибка:", error);
      setSyncStatus('❌ Ошибка: ' + error.message);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!authenticated) {
    return <AdminAuth onAuthenticate={setAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-8">
      <div className="bg-gradient-to-r from-cyan-700 to-purple-700 text-white text-sm py-2 px-4 rounded-b-lg shadow-md mb-6 text-center">
        ⚙️ Админка Chip&Gadget — ТЕСТ СИНХРОНИЗАЦИИ
      </div>

      {/* ТЕСТОВЫЕ КНОПКИ */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {/* Тестовая кнопка */}
        <button
          onClick={testFunction}
          className="px-4 py-2 rounded-lg text-white font-medium bg-green-600 hover:bg-green-700"
        >
          🧪 Тестовая кнопка
        </button>

        {/* Кнопки синхронизации */}
        <button
          onClick={handleForceUpload}
          disabled={isSyncing}
          className={`px-4 py-2 rounded-lg text-white font-medium ${
            isSyncing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          ☁️ Загрузить в облако
        </button>
        
        <button
          onClick={handleForceDownload}
          disabled={isSyncing}
          className={`px-4 py-2 rounded-lg text-white font-medium ${
            isSyncing ? 'bg-gray-400' : 'bg-orange-600 hover:bg-orange-700'
          }`}
        >
          📥 Загрузить из облака
        </button>
      </div>

      {/* Статус */}
      {syncStatus && (
        <div className={`text-center font-medium mb-4 ${
          syncStatus.includes('❌') ? 'text-red-700' : 'text-green-700'
        }`}>
          {syncStatus}
        </div>
      )}

      {/* Простой контент для теста */}
      <div className="max-w-md mx-auto bg-white/90 rounded-2xl shadow p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Тест синхронизации
        </h2>
        <p className="text-gray-600 mb-4">
          Нажмите кнопки выше для проверки синхронизации.
        </p>
        <div className="text-sm text-gray-500">
          <p>• 🧪 Тестовая кнопка - должна показать alert</p>
          <p>• ☁️ Загрузить в облако - отправит данные</p>
          <p>• 📥 Загрузить из облака - получит данные</p>
        </div>
      </div>
    </div>
  );
}