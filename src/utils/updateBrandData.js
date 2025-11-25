// src/utils/updateBrandData.js
// ДОБАВЛЕНО: Удаление моделей при экспорте

import { brandData as existingBrandData } from '../data/brandData';

/**
 * Генерирует обновленный brandData.js с новыми моделями из админки
 * @param {Object} pricesData - Данные цен из админки
 * @returns {Object} { content: string, addedModels: array, removedModels: array, hasChanges: boolean }
 */
export const generateUpdatedBrandData = (pricesData) => {
  const updatedBrandData = JSON.parse(JSON.stringify(existingBrandData));
  let addedModels = [];
  let removedModels = [];

  // Перебираем все бренды из цен
  Object.entries(pricesData).forEach(([brandKey, brandInfo]) => {
    // Пропускаем бренды, которых нет в основном каталоге
    if (!updatedBrandData[brandKey]) {
      console.log(`Пропускаем бренд ${brandKey} - нет в основном каталоге`);
      return;
    }

    // Создаем список моделей, которые есть в админке
    const adminModels = new Set(Object.keys(brandInfo.models || {}));

    // Перебираем все категории бренда
    Object.entries(updatedBrandData[brandKey].categories).forEach(([categoryName, categoryModels]) => {
      const originalCount = categoryModels.length;
      
      // Фильтруем модели - оставляем только те, которые есть в админке ИЛИ не из админки
      const filteredModels = categoryModels.filter(model => {
        const existsInAdmin = adminModels.has(model.id);
        
        // Если модели нет в админке, но она была добавлена через админку (имеет _customName) - удаляем
        const modelData = brandInfo.models[model.id];
        if (!existsInAdmin && modelData && typeof modelData === 'object' && modelData._customName) {
          removedModels.push({
            brand: brandKey,
            model: model.id,
            name: model.name,
            category: categoryName
          });
          return false; // Удаляем модель
        }
        
        return true; // Сохраняем модель
      });

      // Обновляем категорию
      updatedBrandData[brandKey].categories[categoryName] = filteredModels;

      // Добавляем новые модели из админки
      adminModels.forEach(modelKey => {
        const modelExists = filteredModels.some(model => model.id === modelKey);
        if (!modelExists) {
          const modelData = brandInfo.models[modelKey];
          const modelName = getModelDisplayName(modelKey, modelData);
          
          // Определяем категорию для новой модели
          let targetCategory = categoryName; // По умолчанию используем текущую категорию
          
          if (modelData && typeof modelData === 'object' && modelData._category) {
            targetCategory = modelData._category;
          }
          
          // Если категория существует, добавляем модель
          if (updatedBrandData[brandKey].categories[targetCategory]) {
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
          }
        }
      });
    });
  });

  // Формируем содержимое нового файла
  const content = `// === brandData.js ===
// Автоматически обновлено через админку Chip&Gadget
// Сгенерировано: ${new Date().toLocaleString()}
// Новые модели: ${addedModels.length}
// Удаленные модели: ${removedModels.length}

export const brandData = ${JSON.stringify(updatedBrandData, null, 2)};
`;

  return {
    content,
    addedModels,
    removedModels,
    hasChanges: addedModels.length > 0 || removedModels.length > 0
  };
};

/**
 * Получить отображаемое название модели
 */
const getModelDisplayName = (modelKey, modelData) => {
  if (modelData && typeof modelData === 'object' && modelData._customName) {
    return modelData._customName;
  }
  
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