import { useAuthStore } from "../store/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";
import Layout from "./layout/Layout";
import { useState } from "react";
import { UIContext } from "../context/UIContext";

const ProtectedRoute = () => {
  const { user } = useAuthStore();
  const [showSidebar, setShowSidebar] = useState(true);
  const [showCart, setShowCart] = useState(true);

  return (
    <UIContext.Provider
      value={{ showSidebar, setShowSidebar, showCart, setShowCart }}
    >
      <Layout
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        showCart={showCart}
        setShowCart={setShowCart}
      >
        {user ? <Outlet /> : <Navigate to="/giris-yap" replace />}
      </Layout>
    </UIContext.Provider>
  );
};

export default ProtectedRoute;
