import { FiMenu } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { useLocation } from "react-router-dom";

const Header = ({
  showSidebar,
  setShowSidebar,
}: {
  showSidebar?: boolean;
  setShowSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const location = useLocation();

  const handleMenuClick = () => {
    setShowSidebar && setShowSidebar(!showSidebar);
  };

  const isHomePage = location.pathname === "/";

  return (
    <header className="flex items-center justify-between gap-4 p-4 bg-[#f6f6f6]">
      {/* menu icon */}
      <div
        className="bg-white rounded-xl w-12 h-12 flex items-center justify-center shadow-lg text-black cursor-pointer hover:bg-gray-100 transition-all duration-300"
        onClick={handleMenuClick}
      >
        <FiMenu size={25} />
      </div>

      {/* search input */}
      {isHomePage && (
        <div className="relative flex items-center justify-center w-full shadow-md rounded-xl">
          <input
            type="text"
            placeholder="Ürün Ara..."
            className="w-full h-12 px-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
          <IoIosSearch
            size={20}
            className="absolute left-4 text-black cursor-pointer hover:text-blue-500 transition-all duration-300"
          />
        </div>
      )}
    </header>
  );
};

export default Header;
