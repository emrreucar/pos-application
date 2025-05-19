import { useAuthStore } from "../store/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";

const GuestRoute = () => {
  const { user } = useAuthStore();

  return !user ? <Outlet /> : <Navigate to="/" replace />;
};

export default GuestRoute;
