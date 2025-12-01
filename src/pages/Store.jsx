// Store.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Store() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Категории товаров
  const categories = [
    { id: "all", title: "Все товары", emoji: "🛒" },
    { id: "smartphones", title: "Смартфоны", emoji: "📱" },
    { id: "laptops", title: "Ноутбуки", emoji: "💻" },
    { id: "tablets", title: "Планшеты", emoji: "📱" },
    { id: "accessories", title: "Аксессуары", emoji: "🎧" },
    { id: "used", title: "Б/У техника", emoji: "🔧" },
  ];

  // Загрузка товаров из localStorage
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setLoading(true);
    
    try {
      const saved = localStorage.getItem("chipgadget_products");
      const productsData = saved ? JSON.parse(saved) : {};
      
      // Преобразуем объект в массив
      const productsArray = Object.values(productsData);
      
      // Сортируем: сначала хиты, затем по дате добавления
      const sortedProducts = productsArray.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
      
      setProducts(sortedProducts);
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
      setProducts([]);
    }
    
    setLoading(false);
  };

  // Фильтрация товаров по категории
  const filteredProducts = activeCategory === "all" 
    ? products 
    : activeCategory === "used"
    ? products.filter(product => product.condition === "used" || product.condition === "refurbished")
    : products.filter(product => product.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Кнопка назад как на других страницах */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Назад
        </button>

        {/* Заголовок */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🛒 Магазин техники
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            В магазине представлены товары магазина партнера
          </p>
          <p className="text-red-600 font-bold mt-3 max-w-2xl mx-auto">
            ⚠️ На б/у либо восстановленную технику гарантия не распространяется
          </p>
        </div>

        {/* Категории */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow"
                }`}
              >
                <span className="text-lg">{category.emoji}</span>
                <span>{category.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Сетка товаров */}
        {loading ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">⏳</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Загрузка товаров...
            </h3>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">📦</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Товары скоро появятся!
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Мы работаем над наполнением магазина. Администратор добавляет товары через панель управления.
            </p>
            
            {/* КНОПКА ДОСТАВКИ ВМЕСТО "Что будет в магазине" */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 max-w-2xl mx-auto">
              <h4 className="text-lg font-semibold text-green-800 mb-3">🚚 Бесплатная доставка техники на ремонт!</h4>
              <p className="text-green-700 mb-4">
                Пока в магазине нет товаров, вы можете воспользоваться нашей услугой доставки для ремонта вашей техники
              </p>
              <button
                onClick={() => navigate('/delivery-order')}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
              >
                📦 Заказать доставку для ремонта
              </button>
            </div>

            {/* Кнопка для администратора */}
            <div className="mt-6">
              <button
                onClick={() => navigate('/admin')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700"
              >
                ⚙️ Перейти в админку для добавления товаров
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                {/* Бэдж "Хит" или "Б/У" */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                  {product.featured && (
                    <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      🔥 ХИТ
                    </span>
                  )}
                  {product.condition === "used" && (
                    <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      Б/У
                    </span>
                  )}
                  {product.condition === "refurbished" && (
                    <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      Восстановленный
                    </span>
                  )}
                </div>

                {/* Изображение товара */}
                <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full object-contain"
                    />
                  ) : (
                    <div className="text-gray-400 text-6xl">📱</div>
                  )}
                </div>

                {/* Информация о товаре */}
                <div className="p-5">
                  <div className="mb-2">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {product.brand}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    {product.name}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description || "Описание товара отсутствует"}
                  </p>

                  {/* Цена */}
                  <div className="mb-4">
                    {product.originalPrice && product.originalPrice > product.price ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-gray-800">
                            {product.price.toLocaleString()}₽
                          </span>
                          <span className="text-lg text-gray-400 line-through">
                            {product.originalPrice.toLocaleString()}₽
                          </span>
                          <span className="text-sm font-bold text-green-600">
                            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-2xl font-bold text-gray-800">
                        {product.price.toLocaleString()}₽
                      </div>
                    )}
                  </div>

                  {/* Кнопки действий */}
                  <div className="space-y-2">
                    <button
                      onClick={() => alert(`Подробности о ${product.name}. Позвоните: +7 953 087-00-71`)}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
                    >
                      📞 Узнать подробнее
                    </button>
                    
                    <button
                      onClick={() => alert(`Товар "${product.name}" добавлен в корзину`)}
                      disabled={product.stock === 0}
                      className={`w-full py-2.5 rounded-lg font-medium transition-all ${
                        product.stock > 0
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {product.stock > 0 ? "🛒 В корзину" : "😔 Нет в наличии"}
                    </button>
                  </div>

                  {/* Остаток на складе */}
                  <div className="mt-3 text-center text-sm text-gray-500">
                    {product.stock > 0 ? (
                      <span>В наличии: {product.stock} шт.</span>
                    ) : (
                      <span className="text-red-500">Нет в наличии</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Кнопка доставки (если есть товары) */}
        {filteredProducts.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-green-800 mb-3">🚚 Бесплатная доставка!</h3>
            <p className="text-green-700 mb-6 text-lg">
              Доставляем товары по всему региону. Для ремонта техники - забираем неисправную и привозим отремонтированную!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/delivery')}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
              >
                📋 Условия доставки
              </button>
              <button
                onClick={() => navigate('/delivery-order')}
                className="px-6 py-3 bg-white border-2 border-green-500 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-all"
              >
                📦 Заказать доставку
              </button>
            </div>
          </div>
        )}

        {/* Уведомление о партнерском магазине */}
        <div className="mt-12 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">ℹ️ Важная информация</h3>
          <p className="text-yellow-700 mb-3">
            <strong>Внимание!</strong> Данный раздел содержит товары магазина-партнера. 
            Все вопросы по наличию, характеристикам и доставке товаров уточняйте у продавца.
          </p>
          <p className="text-yellow-700">
            <strong>Гарантия:</strong> На новую технику предоставляется гарантия продавца. 
            <strong> На б/у или восстановленную технику гарантия не распространяется.</strong>
          </p>
        </div>
      </div>
    </div>
  );
}