import { ROUTES } from "./Sidebar";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

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
    </div>
  );
};

export default Navigation;
