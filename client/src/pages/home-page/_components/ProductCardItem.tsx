import { Check } from "lucide-react";
import { Product } from "../../../store/useProductsStore";
import { formatCurrency } from "../../../lib/utils";
import { FiPlus } from "react-icons/fi";
import { useCartStore } from "../../../store/useCartStore";

const ProductCardItem = ({ product }: { product: Product }) => {
  const { addToCart, cartItems } = useCartStore();

  return (
    <li className="bg-white shadow-md rounded-2xl p-4 relative hover:shadow-lg transition-shadow duration-300 ease-in-out flex flex-col">
      {/* Ürün görseli */}
      <div className="relative w-full h-40 flex items-center justify-center">
        <img
          src={
            product.image_url
              ? import.meta.env.VITE_BASE_IMAGE_URL + product.image_url
              : "/images/no-image.jpg"
          }
          alt={product.title}
          className="max-h-full max-w-full object-contain"
        />

        {/* Kategori etiketi */}
        {/* <span className="absolute top-0 right-0 bg-primary text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <IoIosCheckmarkCircleOutline size={14} />
          {product.category_name}
        </span> */}
      </div>

      {/* Başlık */}
      <h2 className="font-bold text-base mt-4 line-clamp-2 min-h-[48px]">
        {product.title}
      </h2>

      {/* Fiyat + Stok */}
      <div className="flex items-center justify-between text-sm font-medium mt-2">
        <span>{formatCurrency(product.price)}</span>
        <span className="flex items-center gap-1 text-green-500 font-semibold">
          <Check size={15} />
          Stokta Var
        </span>
      </div>

      {/* + Butonu */}
      <div
        className="mt-auto flex justify-end pt-4 select-none w-fit ml-auto"
        onClick={() => addToCart(product)}
      >
        {cartItems.some((item) => item.id === product.id) ? (
          <button
            className="w-9 h-9 flex items-center justify-center rounded-md bg-green-500 text-white cursor-not-allowed"
            disabled
          >
            <Check size={20} />
          </button>
        ) : (
          <div className="w-9 h-9 flex items-center justify-center rounded-md bg-primary text-white cursor-pointer hover:bg-primary-dark transition-colors duration-300 ease-in-out">
            <FiPlus size={20} />
          </div>
        )}
      </div>
    </li>
  );
};

export default ProductCardItem;
