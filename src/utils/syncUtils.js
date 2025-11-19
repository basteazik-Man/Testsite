// === src/utils/syncUtils.js ===
// Утилиты для синхронизации данных с Cloudflare Worker

const WORKER_URL = 'https://chipgadget-sync.basteazik.workers.dev';

// Сохранить данные в Worker
export const saveToCloud = async (data) => {
  try {
    const response = await fetch(WORKER_URL, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Ошибка при сохранении в облако');
    }

    return await response.json();
  } catch (error) {
    console.error('Ошибка синхронизации с облаком:', error);
    throw error;
  }
};

// Загрузить данные из Worker
export const loadFromCloud = async () => {
  try {
    const response = await fetch(WORKER_URL);

    if (!response.ok) {
      throw new Error('Ошибка при загрузке из облака');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка загрузки из облака:', error);
    throw error;
  }
};

// Синхронизировать локальные данные с облаком
export const syncData = async () => {
  try {
    // Загружаем данные из облака
    const cloudData = await loadFromCloud();
    
    // Загружаем локальные данные
    const localPrices = localStorage.getItem('chipgadget_prices');
    const localCategoryServices = localStorage.getItem('chipgadget_category_services');
    const localDelivery = localStorage.getItem('chipgadget_delivery');

    const localData = {
      prices: localPrices ? JSON.parse(localPrices) : {},
      categoryServices: localCategoryServices ? JSON.parse(localCategoryServices) : {},
      delivery: localDelivery ? JSON.parse(localDelivery) : {},
      lastSync: new Date().toISOString(),
    };

    // Если в облаке нет данных, сохраняем локальные
    if (!cloudData.prices || Object.keys(cloudData.prices).length === 0) {
      await saveToCloud(localData);
      return { action: 'upload', data: localData };
    }

    // Сравниваем временные метки
    const cloudTime = cloudData.lastSync ? new Date(cloudData.lastSync) : new Date(0);
    const localTime = localData.lastSync ? new Date(localData.lastSync) : new Date(0);

    if (localTime > cloudTime) {
      // Локальные данные новее - заливаем в облако
      await saveToCloud(localData);
      return { action: 'upload', data: localData };
    } else {
      // Облачные данные новее - загружаем в локальное хранилище
      localStorage.setItem('chipgadget_prices', JSON.stringify(cloudData.prices));
      localStorage.setItem('chipgadget_category_services', JSON.stringify(cloudData.categoryServices));
      localStorage.setItem('chipgadget_delivery', JSON.stringify(cloudData.delivery));
      return { action: 'download', data: cloudData };
    }
  } catch (error) {
    console.error('Ошибка синхронизации:', error);
    throw error;
  }
};