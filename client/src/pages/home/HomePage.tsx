import { useEffect, useState } from "react";
import { useProductsStore } from "../../store/useProductsStore";
import ProductCardItem from "./_components/ProductCardItem";
import { useCategoriesStore } from "../../store/useCategoriesStore";
import { useUIContext } from "../../context/UIContext";
import SelectCategoryChips from "./_components/SelectCategoryChips";
import LoadingSkeleton from "./_components/LoadingSkeleton";
import { useSmoothLoading } from "../../hooks/useSmoothLoading";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const location = useLocation();
  const { fetchCategories } = useCategoriesStore();
  const { loading, fetchProducts, products, isSearchMode } = useProductsStore();
  const { showSidebar, showCart } = useUIContext();

  useEffect(() => {
    fetchCategories();

    if (location.pathname === "/") {
      fetchProducts();
    }
  }, [location]);

  // 3xl -> 1750px ve üstü
  // 2xl -> 1536 ve üstü
  // xl -> 1280 ve üstü
  // lg -> 1024 ve üstü
  // md -> 768 ve üstü
  // sm -> 640 ve üstü
  // xs -> 480 ve üstü

  const productGridCols =
    !showSidebar &&
    !showCart &&
    "3xl:grid-cols-7 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1";

  const activeProducts = products.filter((product) => product.status);

  const showSkeleton = useSmoothLoading(loading, {
    showAfter: 200,
    minDuration: 300,
  });

  if (showSkeleton && activeProducts.length === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="relative">
      {showSkeleton && activeProducts.length > 0 && (
        <div className="absolute inset-0 z-10 bg-white backdrop-blur-[1px] pointer-events-none">
          <LoadingSkeleton />
        </div>
      )}

      <SelectCategoryChips
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        className="mt-2"
      />

      {activeProducts.length === 0 && (
        <div className="text-center mt-10">
          {isSearchMode
            ? "Aradığınız ürün bulunamadı. Lütfen farklı bir arama yapın."
            : "Henüz ürün bulunmamaktadır. Lütfen ürün ekleyin."}
        </div>
      )}

      {activeProducts.length > 0 && (
        <ul
          className={`grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 pb-20 xl:pb-0 ${productGridCols} gap-4 mt-5`}
        >
          {activeProducts.map((product) => (
            <ProductCardItem key={product.id} product={product} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomePage;
