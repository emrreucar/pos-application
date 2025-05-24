import React, { useRef } from "react";
import { useOutsideClick } from "../../../hooks/useOutsideClick";
import { useProductsStore } from "../../../store/useProductsStore";
import { useCategoriesStore } from "../../../store/useCategoriesStore";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

interface SelectCategoryProps {
  selectedCategory: { id: number; name: string } | null;
  setSelectedCategory: React.Dispatch<
    React.SetStateAction<{ id: number; name: string } | null>
  >;
  setLastPage?: React.Dispatch<React.SetStateAction<string | null>>;
  openDropdown?: boolean;
  setOpenDropdown?: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelectCategory = ({
  selectedCategory,
  setSelectedCategory,
  setLastPage,
  openDropdown = false,
  setOpenDropdown = () => {},
}: SelectCategoryProps) => {
  const { categories } = useCategoriesStore();
  const { fetchProducts, getProductsByCategoryId } = useProductsStore();

  const dropdownRef = useRef<HTMLDivElement | any | null>(null);
  useOutsideClick(dropdownRef, () => setOpenDropdown(false));

  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: number) => {
    if (location.pathname !== "/") {
      setLastPage && setLastPage(location.pathname);
      navigate("/");
    }
    getProductsByCategoryId(categoryId);
  };

  return (
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
        className={`absolute right-0 top-14 bg-white shadow-lg rounded-lg w-52 overflow-y-auto h-auto transition-all duration-300 z-40 ${
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
                handleCategoryClick(category.id);
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
  );
};

export default SelectCategory;
