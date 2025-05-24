import { ROUTES } from "./Sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";
import { useAuthStore } from "../../store/useAuthStore";

const Navigation = () => {
  const { logout } = useAuthStore();
  const location = useLocation();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/giris-yap");
  };

  return (
    <div className="xl:hidden flex gap-5 fixed bottom-0 left-0 right-0 bg-white shadow-lg z-10 p-4">
      {ROUTES.map((route) => (
        <Link
          to={route.route}
          className={`flex-1 flex items-center justify-center cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-all duration-300 ${
            route.route === location.pathname
              ? "bg-primary text-white hover:bg-primary/90 font-semibold"
              : "text-gray-700"
          }`}
          key={route.id}
        >
          {route.icon}
          <span className="text-sm font-semibold ml-2 hidden lg:block">
            {route.name}
          </span>
        </Link>
      ))}

      <button
        className="flex-1 flex items-center justify-center cursor-pointer hover:bg-danger/90 p-2 rounded-lg transition-all duration-300 text-white bg-danger font-semibold"
        onClick={handleLogout}
      >
        <AiOutlineLogout size={15} />
      </button>
    </div>
  );
};

export default Navigation;
