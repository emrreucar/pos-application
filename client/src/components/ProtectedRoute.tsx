import { useAuthStore } from "../store/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";
import Layout from "./layout/Layout";
import { useState } from "react";

const ProtectedRoute = () => {
  const { user } = useAuthStore();
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <Layout showSidebar={showSidebar} setShowSidebar={setShowSidebar}>
      {user ? <Outlet /> : <Navigate to="/giris-yap" replace />}
    </Layout>
  );
};

export default ProtectedRoute;
