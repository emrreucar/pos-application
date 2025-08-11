import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useProductsStore } from "../../../store/useProductsStore";
import { useCategoriesStore } from "../../../store/useCategoriesStore";

type Category = { id: number; name: string };
type Props = {
  selectedCategory: Category | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<Category | null>>;
  className?: string; // opsiyonel: dış sarmalayıcı için ekstra class
};

const SelectCategoryChips = ({
  selectedCategory,
  setSelectedCategory,
  className = "",
}: Props) => {
  const { categories } = useCategoriesStore();
  const { fetchProducts, getProductsByCategoryId } = useProductsStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (cat: Category | null) => {
    if (!cat && !selectedCategory) return true;
    if (!cat || !selectedCategory) return false;
    return cat.id === selectedCategory.id;
  };

  const goAll = () => {
    if (location.pathname !== "/") navigate("/");
    fetchProducts();
    setSelectedCategory(null);
  };

  const goCat = (cat: Category) => {
    if (location.pathname !== `/kategori/${cat.id}`) {
      navigate(`/kategori/${cat.id}`);
    }
    getProductsByCategoryId(cat.id);
    setSelectedCategory(cat);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Scrollable chips row */}
      <div
        className="
          flex items-center gap-2 w-[calc(100vw_-_50px)] lg:w-[calc(100vw_-_200px)] xl:w-[calc(100vw_-_700px)] overflow-x-auto no-scrollbar
          whitespace-nowrap py-2
        "
      >
        {/* Tüm Kategoriler chip */}
        <button
          type="button"
          onClick={goAll}
          className={[
            "px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
            isActive(null)
              ? "border-[#1967d2] text-[#1967d2] bg-[#1967d2]/10"
              : "border-gray-300 text-gray-700 hover:bg-gray-100",
          ].join(" ")}
        >
          Tüm Kategoriler
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => goCat(cat)}
            className={[
              "px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
              isActive(cat)
                ? "border-[#1967d2] text-[#1967d2] bg-[#1967d2]/10"
                : "border-gray-300 text-gray-700 hover:bg-gray-100",
            ].join(" ")}
            title={cat.name}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* opsiyonel: küçük bir alt çizgi */}
      <div className="h-px w-full bg-gray-200" />
    </div>
  );
};

export default SelectCategoryChips;
