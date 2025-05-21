import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/home-page/HomePage";
import GuestRoute from "./GuestRoute";
import LoginPage from "../pages/login-page/LoginPage";
import RegisterPage from "../pages/register-page/RegisterPage";
import ProductsPage from "../pages/products-page/ProductsPage";
import CategoriesPage from "../pages/categories-page/CategoriesPage";
import CustomersPage from "../pages/customers-page/CustomersPage";
import UsersPage from "../pages/users-page/UsersPage";
import CartPage from "../pages/cart-page/CartPage";
import BillsPage from "../pages/bills-page/BillsPage";

const Router = () => {
  return (
    <Routes>
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/urunler" element={<ProductsPage />} />
        <Route path="/kategoriler" element={<CategoriesPage />} />
        <Route path="/musteriler" element={<CustomersPage />} />
        <Route path="/kullanicilar" element={<UsersPage />} />
        <Route path="/sepetim" element={<CartPage />} />
        <Route path="/faturalar" element={<BillsPage />} />
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
