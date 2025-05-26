import { FiMenu } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { useProductsStore } from "../../../store/useProductsStore";
import { useEffect, useRef, useState } from "react";
import { useCategoriesStore } from "../../../store/useCategoriesStore";
import { useOutsideClick } from "../../../hooks/useOutsideClick";
import { useCartStore } from "../../../store/useCartStore";
import { FaBasketShopping } from "react-icons/fa6";
import SelectCategory from "./SelectCategory";
import CartModal from "./CartModal";

const Header = ({
  showSidebar,
  setShowSidebar,
  showCart,
  setShowCart,
}: {
  showSidebar?: boolean;
  setShowSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
  showCart?: boolean;
  setShowCart?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { cartItems } = useCartStore();
  const { fetchCategories } = useCategoriesStore();
  const { getProductsBySearch } = useProductsStore();

  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null | any>(
    null
  );
  const [visibleCartModal, setVisibleCartModal] = useState(false);

  const [lastPage, setLastPage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/";
  const isCartPage = location.pathname === "/sepetim";
  const isSelectedCategoryPage = location.pathname.includes("/kategori/");

  const dropdownRef = useRef<HTMLDivElement | any | null>(null);
  useOutsideClick(dropdownRef, () => setOpenDropdown(false));

  const handleMenuClick = () => {
    setShowSidebar && setShowSidebar(!showSidebar);
  };

  const handleCartClick = () => {
    setShowCart && setShowCart(!showCart);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      if (location.pathname !== "/") {
        setLastPage(location.pathname);
        if (searchTerm.length < 3) return;
        navigate("/");
      }
    } else {
      if (lastPage && lastPage !== "/") {
        navigate(lastPage);
        setLastPage(null);
      }
    }
    getProductsBySearch(value);
  };

  return (
    <header className="flex items-center justify-between gap-4 p-4 bg-[#f6f6f6]">
      {/* menu icon */}
      <div
        className="bg-white rounded-xl w-12 h-12 xl:flex items-center justify-center shadow-lg text-black cursor-pointer hover:bg-gray-100 transition-all duration-300 hidden"
        onClick={handleMenuClick}
      >
        <FiMenu size={25} />
      </div>

      {/* search input */}
      {(isHomePage || isCartPage || isSelectedCategoryPage) && (
        <div className="relative flex items-center justify-center w-full shadow-md rounded-xl">
          <input
            type="text"
            placeholder="Ürün Ara..."
            className="w-full h-12 px-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            value={searchTerm}
            onChange={handleSearch}
          />

          <IoIosSearch
            size={20}
            className="absolute left-4 text-black cursor-pointer hover:text-blue-500 transition-all duration-300"
          />

          {/* categories */}
          {!isCartPage && (
            <SelectCategory
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
            />
          )}
        </div>
      )}

      {/* cart icon */}
      {(isHomePage || isCartPage || isSelectedCategoryPage) && (
        <div
          onClick={handleCartClick}
          className="bg-white rounded-xl w-12 h-12 xl:flex items-center justify-center shadow-lg text-black cursor-pointer hover:bg-gray-100 transition-all duration-300 relative select-none hidden"
        >
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

      {/* cart icon for mobile */}
      {(isHomePage || isCartPage) && (
        <div
          onClick={() => {
            setVisibleCartModal((prev) => !prev);
          }}
          className="bg-white rounded-xl w-12 h-12 flex items-center justify-center shadow-lg text-black cursor-pointer hover:bg-gray-100 transition-all duration-300 relative select-none xl:hidden"
        >
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
      {visibleCartModal && (
        <CartModal setVisibleCartModal={setVisibleCartModal} />
      )}
    </header>
  );
};

export default Header;
