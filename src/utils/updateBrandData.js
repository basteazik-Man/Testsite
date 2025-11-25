// src/utils/updateBrandData.js
// ИСПРАВЛЕНО: Учитывает удаленные модели как изменения

import { brandData as existingBrandData } from '../data/brandData';

/**
 * Генерирует обновленный brandData.js с учетом удаленных моделей
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

    // Получаем все модели из админки для этого бренда
    const adminModels = new Set(Object.keys(brandInfo.models || {}));

    // Перебираем все категории бренда в существующих данных
    Object.entries(updatedBrandData[brandKey].categories).forEach(([categoryName, categoryModels]) => {
      const modelsToKeep = [];
      const currentModelIds = new Set();

      // Сначала обрабатываем существующие модели в категории
      categoryModels.forEach(existingModel => {
        currentModelIds.add(existingModel.id);
        
        // Если модель есть в админке - оставляем её
        if (adminModels.has(existingModel.id)) {
          modelsToKeep.push(existingModel);
        } else {
          // Если модели нет в админке, но она была добавлена через админку - удаляем
          const modelData = brandInfo.models[existingModel.id];
          if (modelData && typeof modelData === 'object' && modelData._customName) {
            removedModels.push({
              brand: brandKey,
              model: existingModel.id,
              name: existingModel.name,
              category: categoryName
            });
            console.log(`🗑️ Помечена на удаление: ${brandKey} -> ${existingModel.id}`);
          } else {
            // Модель из исходного brandData - оставляем
            modelsToKeep.push(existingModel);
          }
        }
      });

      // Теперь добавляем новые модели из админки
      adminModels.forEach(modelKey => {
        if (!currentModelIds.has(modelKey)) {
          const modelData = brandInfo.models[modelKey];
          
          // Определяем категорию для новой модели
          let targetCategory = categoryName;
          if (modelData && typeof modelData === 'object' && modelData._category) {
            targetCategory = modelData._category;
          }
          
          // Добавляем только если это текущая категория
          if (targetCategory === categoryName) {
            const modelName = getModelDisplayName(modelKey, modelData);
            
            modelsToKeep.push({
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
          }
        }
      });

      // Обновляем категорию
      updatedBrandData[brandKey].categories[categoryName] = modelsToKeep;
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

  const hasChanges = addedModels.length > 0 || removedModels.length > 0;

  return {
    content,
    addedModels,
    removedModels,
    hasChanges
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