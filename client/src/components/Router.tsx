import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/home-page/HomePage";
import GuestRoute from "./GuestRoute";
import LoginPage from "../pages/login-page/LoginPage";
import RegisterPage from "../pages/register-page/RegisterPage";
import ProductsPage from "../pages/products-page/ProductsPage";
import CategoriesPage from "../pages/categories-page/CategoriesPage";

const Router = () => {
  return (
    <Routes>
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/urunler" element={<ProductsPage />} />
        <Route path="/kategoriler" element={<CategoriesPage />} />
        <Route path="/ayarlar" element={<div>ayarlar sayfası</div>} />
      </Route>

      {/* Guest Routes */}
      <Route element={<GuestRoute />}>
        <Route path="/giris-yap" element={<LoginPage />} />
        <Route path="/uye-ol" element={<RegisterPage />} />
      </Route>

      {/* Fallback Routes */}
      <Route path="*" element={<div>404 Sayfa Bulunamadı</div>} />
    </Routes>
  );
};

export default Router;
