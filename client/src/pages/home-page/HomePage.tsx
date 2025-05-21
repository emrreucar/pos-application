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
    !showSidebar && !showCart ? "2xl:grid-cols-6" : "2xl:grid-cols-5";

  return (
    <>
      {loading && <p>Yükleniyor...</p>}
      {!loading && products.length === 0 && (
        <p className="text-center">Tüh, Aradığınız ürünü bulamadık!</p>
      )}

      {!loading && products.length > 0 && (
        <ul
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${productGridCols} gap-4`}
        >
          {products.map((product) => (
            <ProductCardItem key={product.id} product={product} />
          ))}
        </ul>
      )}
    </>
  );
};

export default HomePage;
