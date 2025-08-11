import { Link, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/home/HomePage";
import GuestRoute from "./GuestRoute";
import LoginPage from "../pages/login/LoginPage";
import RegisterPage from "../pages/register/RegisterPage";
import ProductsPage from "../pages/products/ProductsPage";
import CategoriesPage from "../pages/categories/CategoriesPage";
import CustomersPage from "../pages/customers/CustomersPage";
import UsersPage from "../pages/users/UsersPage";
import CartPage from "../pages/cart/CartPage";
import BillsPage from "../pages/bills/BillsPage";
import StatisticsPage from "../pages/statistic/StatisticsPage";

const Router = () => {
  return (
    <Routes>
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/urunler" element={<ProductsPage />} />
        <Route path="/kategoriler" element={<CategoriesPage />} />
        <Route path="/kategori/:categoryId" element={<HomePage />} />
        <Route path="/musteriler" element={<CustomersPage />} />
        <Route path="/kullanicilar" element={<UsersPage />} />
        <Route path="/sepetim" element={<CartPage />} />
        <Route path="/faturalar" element={<BillsPage />} />
        <Route path="/istatistikler" element={<StatisticsPage />} />
        {/* <Route path="/ayarlar" element={<div>ayarlar sayfası</div>} /> */}
      </Route>

      {/* Guest Routes */}
      <Route element={<GuestRoute />}>
        <Route path="/giris-yap" element={<LoginPage />} />
        <Route path="/uye-ol" element={<RegisterPage />} />
      </Route>

      {/* Fallback Routes */}
      <Route
        path="*"
        element={
          <div className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 text-2xl font-bold w-full h-full flex flex-col items-center justify-center text-gray-800">
            <p>404 - Sayfa Bulunamadı</p>
            <Link
              to={"/"}
              className="text-blue-500 font-semibold underline my-5 text-base"
            >
              Anasayfaya dön
            </Link>
          </div>
        }
      />
    </Routes>
  );
};

export default Router;
