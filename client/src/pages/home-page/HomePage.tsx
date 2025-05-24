import { useEffect } from "react";
import { useProductsStore } from "../../store/useProductsStore";
import ProductCardItem from "./_components/ProductCardItem";
import { useCategoriesStore } from "../../store/useCategoriesStore";
import { useUIContext } from "../../context/UIContext";

const HomePage = () => {
  const { fetchCategories } = useCategoriesStore();
  const { fetchProducts, products, loading } = useProductsStore();
  const { showSidebar, showCart } = useUIContext();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const productGridCols =
    !showSidebar &&
    !showCart &&
    "3xl:grid-cols-7 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1";

  // 3xl -> 1750px ve üstü
  // 2xl -> 1536 ve üstü
  // xl -> 1280 ve üstü
  // lg -> 1024 ve üstü
  // md -> 768 ve üstü
  // sm -> 640 ve üstü
  // xs -> 480 ve üstü

  const activeProducts = products.filter((product) => product.status);

  return (
    <>
      {loading && <p>Yükleniyor...</p>}
      {!loading && products.length === 0 && (
        <p className="text-center">Tüh, Aradığınız ürünü bulamadık!</p>
      )}

      {!loading && products.length > 0 && (
        <ul
          className={`grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 pb-20 xl:pb-0 ${productGridCols} gap-4`}
        >
          {activeProducts.map((product) => (
            <ProductCardItem key={product.id} product={product} />
          ))}
        </ul>
      )}
    </>
  );
};

export default HomePage;
