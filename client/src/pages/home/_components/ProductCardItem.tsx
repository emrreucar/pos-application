import { Product } from "../../../store/useProductsStore";
import { formatCurrency } from "../../../lib/utils";
import { FiPlus } from "react-icons/fi";
import { useCartStore } from "../../../store/useCartStore";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaCircleExclamation, FaMinus, FaPlus } from "react-icons/fa6";

const ProductCardItem = ({ product }: { product: Product }) => {
  const { addToCart, cartItems, changeQuantity, removeFromCart } =
    useCartStore();

  const insertedProduct = cartItems.find((item) => item.id === product.id);

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
      </div>

      {/* Başlık */}
      <h2 className="font-semibold text-gray-600 text-base mt-4 line-clamp-2 min-h-[48px]">
        {product.title}
      </h2>

      {/* Fiyat + Stok */}
      <div className="flex items-center justify-between text-xs font-medium mt-2">
        <span
          className={`text-base text-gray-900 font-bold ${
            insertedProduct ? "mb-4" : ""
          }`}
        >
          {formatCurrency(product.price)}
        </span>
        {product.stock > 5 ? (
          <span className="flex items-center gap-1 font-semibold absolute right-2 top-2 shadow-md rounded-full px-2 py-1 bg-green-500 text-white">
            <FaRegCheckCircle size={15} />
            Stokta Var
          </span>
        ) : (
          <>
            {product.stock === 0 ? (
              <span className="flex items-center gap-1 font-semibold absolute right-2 top-2 shadow-md rounded-full px-2 py-1 bg-gray-500 text-white">
                Stokta Yok
              </span>
            ) : (
              <span className="flex items-center gap-1 font-semibold absolute right-2 top-2 shadow-md rounded-full px-2 py-1 bg-red-500 text-white">
                <FaCircleExclamation size={13} />
                Son {product.stock} Adet
              </span>
            )}
          </>
        )}
        {/*  */}
      </div>

      {/* + Butonu */}
      {!insertedProduct && (
        <div
          className={`mt-auto flex items-center justify-between pt-4 select-none w-full`}
        >
          {!insertedProduct && (
            <span className="text-xs font-bold">
              Stok Sayısı: {product.stock}
            </span>
          )}
          <div
            className="w-9 h-9 flex items-center justify-center rounded-md bg-primary text-white cursor-pointer hover:bg-primary-dark transition-colors duration-300 ease-in-out"
            onClick={() => addToCart(product)}
          >
            <FiPlus size={20} />
          </div>
        </div>
      )}

      {insertedProduct && (
        <div className="w-full h-9 mt-auto flex items-center justify-between rounded-lg bg-transparent text-black border border-primary-light cursor-pointer transition-colors duration-300 ease-in-out select-none">
          <div
            className="bg-primary-light hover:bg-primary transition-all duration-200 h-9 w-9 rounded-l-lg flex items-center justify-center"
            onClick={() => {
              if (insertedProduct.quantity > 1) {
                changeQuantity(
                  insertedProduct.id,
                  insertedProduct.quantity - 1
                );
              } else {
                removeFromCart(insertedProduct.id);
              }
            }}
          >
            <FaMinus size={15} color="white" />
          </div>
          <span className="font-semibold text-[15px]">
            {insertedProduct.quantity} Adet
          </span>
          <div
            className="bg-primary-light hover:bg-primary transition-all duration-200 h-9 w-9 rounded-r-lg flex items-center justify-center"
            onClick={() => {
              changeQuantity(insertedProduct.id, insertedProduct.quantity + 1);
            }}
          >
            <FaPlus size={15} color="white" />
          </div>
        </div>
      )}
    </li>
  );
};

export default ProductCardItem;
