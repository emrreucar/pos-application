import { ChartArea, ChartBarStacked, Home, ShoppingCart } from "lucide-react";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaUserGear } from "react-icons/fa6";
import { TbFileInvoice } from "react-icons/tb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useUsersStore } from "../../store/useUsersStore";

export const ROUTES = [
  {
    id: 1,
    name: "Anasayfa",
    icon: <Home size={15} />,
    route: "/",
  },
  {
    id: 2,
    name: "Ürünler",
    icon: <ShoppingCart size={15} />,
    route: "/urunler",
  },
  {
    id: 3,
    name: "Kategoriler",
    icon: <ChartBarStacked size={15} />,
    route: "/kategoriler",
  },
  {
    id: 4,
    name: "Müşteriler",
    icon: <BsFillPeopleFill size={15} />,
    route: "/musteriler",
  },
  {
    id: 5,
    name: "Faturalar",
    icon: <TbFileInvoice size={15} />,
    route: "/faturalar",
  },
  {
    id: 6,
    name: "Kullanıcılar",
    icon: <FaUserGear size={15} />,
    route: "/kullanicilar",
  },
  {
    id: 8,
    name: "İstatistikler",
    icon: <ChartArea size={15} />,
    route: "/istatistikler",
  },
];

const Sidebar = ({ showSidebar }: { showSidebar?: boolean }) => {
  const { user } = useAuthStore();
  const { users } = useUsersStore();
  const { logout } = useAuthStore();

  const location = useLocation();
  const { pathname } = location;

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/giris-yap");
  };

  const findUser = users.find((u) => u.id === user?.id);

  return (
    <aside
      className={`bg-white hidden xl:flex flex-col justify-between shadow-lg rounded-xl h-full transition-all duration-300 ease-in-out overflow-hidden ${
        showSidebar
          ? "w-64 px-4 py-6 opacity-100 scale-100"
          : "w-0 px-0 py-0 opacity-0 scale-50"
      } `}
    >
      {/* logo - routes wrapper */}
      <article className="flex flex-col gap-8">
        {/* logo */}
        <Link to={"/"} className="flex items-center gap-1 px-2">
          <img
            src="/images/logo.png"
            alt="Mere Pos Logo"
            className="w-20 h-20 object-cover"
          />
          <span className="font-bold uppercase text-lg text-gray-800">
            MERE POS
          </span>
        </Link>

        {/* routes */}
        <nav className="flex flex-col gap-1">
          {ROUTES.map((item) => (
            <Link
              key={item.id}
              to={item.route}
              className={`flex items-center gap-3 px-4 py-2 rounded-full hover:bg-primary/70 hover:text-white transition-colors duration-200 ${
                pathname === item.route
                  ? "bg-primary/90 text-white font-semibold hover:!bg-primary/90 hover:!text-white"
                  : "bg-white text-gray-700 font-medium"
              }`}
            >
              {item.icon}
              <span className="text-center flex items-center justify-center">
                {item.name}
              </span>
            </Link>
          ))}
          <button
            className="items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 text-danger hover:bg-danger hover:text-white font-bold text-center block mt-5"
            onClick={handleLogout}
          >
            Çıkış Yap
          </button>
        </nav>
      </article>

      {/* footer */}
      <div className="flex flex-col gap-4">
        <div>
          <span className="font-bold text-xl text-center block text-primary">
            {" "}
            {findUser?.company_name || user?.company_name}{" "}
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
