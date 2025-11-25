// src/utils/updateBrandData.js
// УЛУЧШЕННАЯ ВЕРСИЯ - учитывает категории из админки

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
      let existingCategory = null;
      
      // Ищем модель во всех категориях бренда
      Object.entries(updatedBrandData[brandKey].categories).forEach(([categoryName, category]) => {
        if (category.find(model => model.id === modelKey)) {
          modelExists = true;
          existingCategory = categoryName;
        }
      });

      // Если модели нет - определяем куда её добавить
      if (!modelExists) {
        // Пытаемся определить категорию из данных админки
        let targetCategory = null;
        
        // Если в данных модели есть информация о категории - используем её
        if (modelData && typeof modelData === 'object' && modelData._category) {
          targetCategory = modelData._category;
        } else {
          // Иначе определяем категорию по названию модели
          targetCategory = determineCategoryByModelName(modelKey, brandKey, updatedBrandData[brandKey].categories);
        }
        
        if (targetCategory && updatedBrandData[brandKey].categories[targetCategory]) {
          // Создаем человеко-читаемое название
          const modelName = getModelDisplayName(modelKey, modelData);
          
          // Добавляем модель в определенную категорию
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
          
          console.log(`Добавлена модель: ${brandKey} -> ${targetCategory} -> ${modelName}`);
        } else {
          console.log(`Не удалось определить категорию для модели: ${brandKey} -> ${modelKey}`);
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
 * Определяет категорию для модели по её названию (резервный метод)
 */
const determineCategoryByModelName = (modelKey, brandKey, categories) => {
  const modelName = modelKey.toLowerCase();
  
  // Для Samsung
  if (brandKey === 'samsung') {
    if (modelName.includes('s') && /s\d+/.test(modelName)) return 'galaxy_s';
    if (modelName.includes('a') && /a\d+/.test(modelName)) return 'galaxy_a';
    if (modelName.includes('m') && /m\d+/.test(modelName)) return 'galaxy_m';
    if (modelName.includes('note')) return 'galaxy_note';
    if (modelName.includes('z') || modelName.includes('flip') || modelName.includes('fold')) return 'galaxy_z';
    if (modelName.includes('tab')) return 'galaxy_tab';
  }
  
  // Для Apple
  if (brandKey === 'apple') {
    if (modelName.includes('iphone')) return 'iphone';
    if (modelName.includes('ipad')) return 'ipad';
    if (modelName.includes('mac')) return 'macbook';
  }
  
  // Для Xiaomi
  if (brandKey === 'xiaomi') {
    if (modelName.includes('note') || modelName.includes('redmi-note')) return 'redmi_note';
    if (modelName.includes('redmi')) return 'redmi';
    if (modelName.includes('mi-')) return 'mi_series';
    if (modelName.includes('xiaomi')) return 'xiaomi';
    if (modelName.includes('mix')) return 'mix';
    if (modelName.includes('k')) return 'redmi_k';
  }
  
  // Для Honor
  if (brandKey === 'honor') {
    if (modelName.includes('honor-')) return 'honor_series';
    if (modelName.includes('x')) return 'x_series';
    if (modelName.includes('magic')) return 'magic_series';
  }
  
  // Для Huawei
  if (brandKey === 'huawei') {
    if (modelName.includes('p')) return 'p_series';
    if (modelName.includes('mate')) return 'mate_series';
    if (modelName.includes('pura')) return 'pura_series';
    if (modelName.includes('nova')) return 'nova_series';
  }
  
  // Для Realme
  if (brandKey === 'realme') {
    if (/realme-\d+/.test(modelName)) return 'number_series';
    if (modelName.includes('gt')) return 'gt_series';
    if (modelName.includes('c')) return 'c_series';
    if (modelName.includes('narzo')) return 'narzo_series';
    if (modelName.includes('x')) return 'x_series';
  }
  
  // Для Infinix
  if (brandKey === 'infinix') {
    if (modelName.includes('note')) return 'note_series';
    if (modelName.includes('hot')) return 'hot_series';
    if (modelName.includes('smart')) return 'smart_series';
    if (modelName.includes('zero')) return 'zero_series';
    if (modelName.includes('gt')) return 'gt_series';
  }
  
  // Для Tecno
  if (brandKey === 'tecno') {
    if (modelName.includes('camon')) return 'camon_series';
    if (modelName.includes('spark')) return 'spark_series';
    if (modelName.includes('pova')) return 'pova_series';
    if (modelName.includes('phantom')) return 'phantom_series';
  }

  // Если не удалось определить - возвращаем первую доступную категорию
  const availableCategories = Object.keys(categories);
  return availableCategories.length > 0 ? availableCategories[0] : null;
};

/**
 * Простая проверка новых моделей без генерации файла
 */
export const checkForNewModels = (pricesData) => {
  const result = generateUpdatedBrandData(pricesData);
  return result.addedModels;
};