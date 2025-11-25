// src/utils/updateBrandData.js
// УЛУЧШЕННАЯ ВЕРСИЯ - модели добавляются ТОЛЬКО в выбранные категории из админки

import { brandData as existingBrandData } from '../data/brandData';

/**
 * Генерирует обновленный brandData.js с новыми моделями из админки
 * @param {Object} pricesData - Данные цен из админки
 * @returns {Object} { content: string, addedModels: array, hasChanges: boolean }
 */
export const generateUpdatedBrandData = (pricesData) => {
  // Создаем копию существующих данных
  const updatedBrandData = JSON.parse(JSON.stringify(existingBrandData));
  let addedModels = [];

  // Перебираем все бренды из цен
  Object.entries(pricesData).forEach(([brandKey, brandInfo]) => {
    // Пропускаем бренды, которых нет в основном каталоге
    if (!updatedBrandData[brandKey]) {
      console.log(`Пропускаем бренд ${brandKey} - нет в основном каталоге`);
      return;
    }

    // Перебираем все модели этого бренда из цен
    Object.entries(brandInfo.models || {}).forEach(([modelKey, modelData]) => {
      // Проверяем, есть ли уже эта модель в основном каталоге
      let modelExists = false;
      
      // Ищем модель во всех категориях бренда
      Object.entries(updatedBrandData[brandKey].categories).forEach(([categoryName, category]) => {
        if (category.find(model => model.id === modelKey)) {
          modelExists = true;
        }
      });

      // Если модели нет - добавляем в категорию из админки
      if (!modelExists) {
        // Получаем категорию из данных админки
        let targetCategory = null;
        
        // Если в данных модели есть информация о категории - используем её
        if (modelData && typeof modelData === 'object' && modelData._category) {
          targetCategory = modelData._category;
        }
        
        // Проверяем, что категория существует в brandData
        if (targetCategory && updatedBrandData[brandKey].categories[targetCategory]) {
          // Создаем человеко-читаемое название
          const modelName = getModelDisplayName(modelKey, modelData);
          
          // Добавляем модель в указанную категорию
          updatedBrandData[brandKey].categories[targetCategory].push({
            id: modelKey,
            name: modelName,
            image: "/logos/default-phone.jpg"
          });

          addedModels.push({ 
            brand: brandKey, 
            model: modelKey,
            name: modelName,
            category: targetCategory
          });
          
          console.log(`✅ Добавлена модель: ${brandKey} -> ${targetCategory} -> ${modelName}`);
        } else {
          console.log(`❌ Не удалось добавить модель ${modelKey}: категория "${targetCategory}" не найдена в brandData`);
        }
      }
    });
  });

  // Формируем содержимое нового файла
  const content = `// === brandData.js ===
// Автоматически обновлено через админку Chip&Gadget
// Сгенерировано: ${new Date().toLocaleString()}
// Новые модели: ${addedModels.length}

export const brandData = ${JSON.stringify(updatedBrandData, null, 2)};
`;

  return {
    content,
    addedModels,
    hasChanges: addedModels.length > 0
  };
};

/**
 * Получить отображаемое название модели
 */
const getModelDisplayName = (modelKey, modelData) => {
  // Если в данных есть кастомное название - используем его
  if (modelData && typeof modelData === 'object' && modelData._customName) {
    return modelData._customName;
  }
  
  // Иначе генерируем из ключа
  return modelKey
    .replace(/-/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase());
};

/**
 * Простая проверка новых моделей без генерации файла
 */
export const checkForNewModels = (pricesData) => {
  const result = generateUpdatedBrandData(pricesData);
  return result.addedModels;
};