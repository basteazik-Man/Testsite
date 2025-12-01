// src/pages/Store.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Store() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");

  // Категории товаров
  const categories = [
    { id: "all", title: "Все товары", emoji: "🛒" },
    { id: "smartphones", title: "Смартфоны", emoji: "📱" },
    { id: "laptops", title: "Ноутбуки", emoji: "💻" },
    { id: "tablets", title: "Планшеты", emoji: "📱" },
    { id: "accessories", title: "Аксессуары", emoji: "🎧" },
    { id: "used", title: "Б/У техника", emoji: "🔧" },
  ];

  // Пример товаров (пока заглушка)
  const products = [
    {
      id: 1,
      name: "iPhone 14 Pro 256GB",
      category: "smartphones",
      brand: "Apple",
      price: 89900,
      originalPrice: 99900,
      condition: "new",
      image: "/images/products/iphone14-pro.jpg",
      description: "Новый iPhone 14 Pro в идеальном состоянии",
      stock: 3,
      featured: true,
    },
    {
      id: 2,
      name: "Samsung Galaxy S23 Ultra",
      category: "smartphones",
      brand: "Samsung",
      price: 79900,
      originalPrice: 89900,
      condition: "new",
      image: "/images/products/s23-ultra.jpg",
      description: "Флагман Samsung с мощной камерой",
      stock: 5,
      featured: true,
    },
    {
      id: 3,
      name: "MacBook Air M2",
      category: "laptops",
      brand: "Apple",
      price: 109900,
      originalPrice: 119900,
      condition: "new",
      image: "/images/products/macbook-air.jpg",
      description: "Ультрабук для работы и творчества",
      stock: 2,
      featured: true,
    },
    {
      id: 4,
      name: "AirPods Pro 2",
      category: "accessories",
      brand: "Apple",
      price: 19900,
      originalPrice: 24900,
      condition: "new",
      image: "/images/products/airpods-pro.jpg",
      description: "Наушники с активным шумоподавлением",
      stock: 10,
      featured: false,
    },
    {
      id: 5,
      name: "iPhone 12 128GB",
      category: "smartphones",
      brand: "Apple",
      price: 44900,
      originalPrice: 59900,
      condition: "used",
      image: "/images/products/iphone12.jpg",
      description: "Отличное состояние, батарея 92%",
      stock: 1,
      featured: true,
    },
    {
      id: 6,
      name: "Samsung Tab S9",
      category: "tablets",
      brand: "Samsung",
      price: 69900,
      originalPrice: 79900,
      condition: "new",
      image: "/images/products/tab-s9.jpg",
      description: "Планшет для работы и развлечений",
      stock: 4,
      featured: false,
    },
  ];

  // Фильтрация товаров по категории
  const filteredProducts = activeCategory === "all" 
    ? products 
    : activeCategory === "used"
    ? products.filter(product => product.condition === "used")
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
            Купите новую или б/у технику с гарантией. Доставка по всему региону!
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              {/* Бэдж "Хит" или "Б/У" */}
              <div className="absolute top-3 left-3 z-10">
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
              </div>

              {/* Изображение товара */}
              <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
                <img
                  src={product.image || "/images/default-product.jpg"}
                  alt={product.name}
                  className="h-full object-contain"
                  onError={(e) => {
                    e.target.src = "/images/default-product.jpg";
                  }}
                />
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
                  {product.description}
                </p>

                {/* Цена */}
                <div className="mb-4">
                  {product.originalPrice > product.price ? (
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
                    onClick={() => navigate(`/product/${product.id}`)}
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

        {/* Сообщение, если нет товаров */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <p className="text-gray-500 text-lg mb-2">Товары не найдены</p>
            <p className="text-gray-400">
              В этой категории пока нет товаров
            </p>
          </div>
        )}

        {/* Информационный блок */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">ℹ️ О магазине</h3>
          <p className="text-blue-700 mb-3">
            Все товары проходят проверку и имеют гарантию от 3 до 12 месяцев. 
            Мы предоставляем официальные чеки и договор купли-продажи.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-xl mb-2">🚚</div>
              <h4 className="font-semibold text-gray-800 mb-1">Бесплатная доставка</h4>
              <p className="text-sm text-gray-600">По всему региону</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-xl mb-2">🛡️</div>
              <h4 className="font-semibold text-gray-800 mb-1">Гарантия</h4>
              <p className="text-sm text-gray-600">От 3 до 12 месяцев</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-xl mb-2">💳</div>
              <h4 className="font-semibold text-gray-800 mb-1">Рассрочка</h4>
              <p className="text-sm text-gray-600">До 12 месяцев</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}