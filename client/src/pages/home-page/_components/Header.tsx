import { FiMenu } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { useLocation } from "react-router-dom";
import { useProductsStore } from "../../../store/useProductsStore";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCategoriesStore } from "../../../store/useCategoriesStore";
import { useOutsideClick } from "../../../hooks/useOutsideClick";
import { useCartStore } from "../../../store/useCartStore";
import { FaBasketShopping } from "react-icons/fa6";

const Header = ({
  showSidebar,
  setShowSidebar,
}: {
  showSidebar?: boolean;
  setShowSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { cartItems } = useCartStore();
  const { categories, fetchCategories } = useCategoriesStore();
  const { getProductsBySearch, getProductsByCategoryId, fetchProducts } =
    useProductsStore();

  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null | any>(
    null
  );

  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const dropdownRef = useRef<HTMLDivElement | any | null>(null);

  useOutsideClick(dropdownRef, () => setOpenDropdown(false));

  const handleMenuClick = () => {
    setShowSidebar && setShowSidebar(!showSidebar);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
            onChange={(e) => {
              getProductsBySearch(e.target.value);
            }}
          />

          <IoIosSearch
            size={20}
            className="absolute left-4 text-black cursor-pointer hover:text-blue-500 transition-all duration-300"
          />

          {/* categories */}
          <div
            ref={dropdownRef}
            className="absolute right-4 bg-[#f2f2f2] text-sm text-gray-800 rounded-full px-4 py-2 flex items-center gap-1 cursor-pointer hover:bg-[#d9d9d9] transition-all duration-300"
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            <div className="flex items-center gap-1 select-none">
              <span>
                {selectedCategory ? selectedCategory.name : "Tüm Kategoriler"}
              </span>{" "}
              <ChevronDown
                size={15}
                className={`transition-all duration-300 text-gray-800 
                ${openDropdown ? "rotate-180" : "rotate-0"}
                
                `}
              />{" "}
            </div>

            {/* dropdown */}
            <div
              className={`absolute right-0 top-14 bg-white shadow-lg rounded-lg w-40 overflow-y-auto h-auto transition-all duration-300 z-40 ${
                openDropdown ? "block" : "hidden"
              }`}
            >
              <ul className="flex flex-col gap-2 select-none">
                <li
                  className="text-sm text-gray-800 pl-4 py-1 cursor-pointer hover:bg-[#1967d2] hover:text-white font-semibold"
                  onClick={() => {
                    fetchProducts();
                    setOpenDropdown(false);
                    setSelectedCategory(null);
                  }}
                >
                  Tüm Kategoriler
                </li>
                {categories.map((category) => (
                  <li
                    key={category.id}
                    className="text-sm text-start pl-4 py-1 text-gray-800 font-semibold cursor-pointer hover:bg-[#1967d2] hover:text-white"
                    onClick={() => {
                      getProductsByCategoryId(category.id);
                      setOpenDropdown(false);
                      setSelectedCategory(category);
                    }}
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* menu icon */}
      {isHomePage && (
        <div className="bg-white rounded-xl w-12 h-12 flex items-center justify-center shadow-lg text-black cursor-pointer hover:bg-gray-100 transition-all duration-300 relative select-none">
          <span>
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
                {cartItems.length}
              </span>
            )}
          </span>
          <FaBasketShopping size={22} />
        </div>
      )}
    </header>
  );
};

export default Header;
