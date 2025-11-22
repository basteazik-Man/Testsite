// App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BrandPage from "./components/BrandPage";
import ModelPage from "./pages/ModelPage";
import SearchResults from "./pages/SearchResults";
import Services from "./pages/Services";
import DeliveryPage from "./pages/DeliveryPage";
import DeliveryOrderPage from "./pages/DeliveryOrderPage";
import ScrollToTop from "./components/ScrollToTop";
import HeaderMain from "./components/HeaderMain";
import FooterMain from "./components/FooterMain";
import ShareButton from "./components/ShareButton";
import DeliveryButton from "./components/DeliveryButton";
import AdminPanel from "./pages/AdminPanel";
import AdminLayout from "./components/AdminLayout";
import ErrorBoundary from "./components/ErrorBoundary";

// ⬇ добавлено для ассистента и диагностики
import Assistant from "./components/Assistant";
import Diagnosis from "./pages/Diagnosis";

function MainLayout() {
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <HeaderMain />

        <main className="flex-grow relative">
          <ScrollToTop />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/brand/:brand" element={<BrandPage />} />
            <Route path="/brand/:brand/model/:model" element={<ModelPage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/services" element={<Services />} />
            <Route path="/delivery" element={<DeliveryPage />} />
            <Route path="/delivery-order" element={<DeliveryOrderPage />} />

            {/* ⬇ Страница диагностики доступна только здесь */}
            <Route path="/diagnosis" element={<Diagnosis />} />
          </Routes>

          <ShareButton />
          <DeliveryButton />

          {/* ⬇ Ассистент вставлен в правый нижний угол */}
          <div className="fixed bottom-4 right-4 z-50">
            <Assistant />
          </div>
        </main>

        <FooterMain />
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <AdminLayout>
              <AdminPanel />
            </AdminLayout>
          }
        />

        {/* ⬇ основной сайт */}
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
