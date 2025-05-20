import { useCartStore } from "../../store/useCartStore";
import { formatCurrency } from "../../lib/utils";
import { FaRegTrashAlt } from "react-icons/fa";
import { CheckCheckIcon, Minus, Plus, Trash } from "lucide-react";
import { useState } from "react";
import ConfirmDeleteModal from "../ui/ConfirmDeleteModal";

const OrdersSummary = () => {
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
  const { cartItems, totalPrice, removeFromCart, changeQuantity, clearCart } =
    useCartStore();

  return (
    <div className="w-[450px] bg-[#fff] p-4 h-full border-l border-gray-300 rounded-l-2xl">
      <span className="text-xl font-semibold block bg-secondary text-center text-white rounded-md py-2 mb-4">
        Mevcut Sipariş
      </span>

      <div className="flex flex-col">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">
            Sepetinizde hiç ürün yok.
          </p>
        ) : (
          <div className="flex flex-col h-[calc(100vh_-_100px)] overflow-y-auto">
            <ul className="mt-4 h-[calc(100vh_-_100px)] overflow-y-auto">
              {cartItems.map((item, idx) => (
                <li
                  key={item.id}
                  className="flex justify-between items-start mb-2 border border-gray-200 p-2 rounded-md"
                >
                  <div className="flex items-start gap-2 h-full">
                    <img
                      src={
                        item.product.image_url
                          ? import.meta.env.VITE_BASE_IMAGE_URL +
                            item.product.image_url
                          : "/images/no-image.jpg"
                      }
                      className="w-16 h-16 object-cover rounded-md"
                      alt={`${item.product.title}-${idx}`}
                    />
                    <div className="flex flex-col justify-between items-start">
                      <span className="font-semibold">
                        {item.product.title.length > 20
                          ? item.product.title.slice(0, 20) + "..."
                          : item.product.title}
                      </span>
                      <span className="font-semibold text-sm mt-5">
                        {formatCurrency(item.product.price)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <FaRegTrashAlt
                      color="#ff0000"
                      size={18}
                      onClick={() => {
                        removeFromCart(item.id);
                      }}
                      className="cursor-pointer hover:text-red-600 transition-colors duration-200 ease-in-out"
                      title="Ürünü Sepetten Çıkar"
                    />
                    <div className="flex items-center justify-between gap-5 mt-5 select-none">
                      <span
                        onClick={() => {
                          if (item.quantity > 1) {
                            changeQuantity(item.id, item.quantity - 1);
                          } else {
                            removeFromCart(item.id);
                          }
                        }}
                        className="cursor-pointer border border-gray-300 rounded-md p-1 bg-white hover:bg-gray-100 transition-colors duration-200 ease-in-out w-8 h-8 flex items-center justify-center"
                      >
                        {item.quantity > 1 ? (
                          <Minus size={15} />
                        ) : (
                          <Trash size={15} />
                        )}
                      </span>
                      <span> {item.quantity} </span>
                      <span
                        onClick={() => {
                          changeQuantity(item.id, item.quantity + 1);
                        }}
                        className="cursor-pointer border border-[#0a0171] rounded-md p-1 bg-[#6460ce] hover:bg-[#0a0171] transition-colors duration-200 ease-in-out w-8 h-8 flex items-center justify-center text-white"
                      >
                        <Plus size={15} />
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-2 mt-auto border border-gray-200 p-2 rounded-md">
              <div className="text-lg flex items-center justify-between">
                <span className="text-gray-600 font-medium">Toplam Tutar:</span>
                <span className="font-extrabold text-gray-800">
                  {formatCurrency(totalPrice())}
                </span>
              </div>

              {/* buttons */}
              <div className="flex items-center justify-between mt-4 text-sm">
                <div className="flex items-center gap-2 cursor-pointer bg-[#6460ce] text-white rounded-md py-2 px-3 hover:bg-[#0a0171] transition-colors duration-200 ease-in-out">
                  <CheckCheckIcon size={18} />
                  <span>Sepeti Onayla</span>
                </div>
                <div
                  className="flex items-center gap-2 cursor-pointer bg-red-500 text-white rounded-md py-2 px-3 hover:bg-red-600 transition-colors duration-200 ease-in-out"
                  onClick={() => setVisibleDeleteModal(true)}
                >
                  <FaRegTrashAlt color="#fff" size={18} />
                  <span>Sepeti Temizle</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        open={visibleDeleteModal}
        onClose={() => setVisibleDeleteModal(false)}
        onConfirm={() => {
          clearCart();
          setVisibleDeleteModal(false);
        }}
        message="Sepeti temizlemek istediğinize emin misiniz?"
        buttonText="Evet, Temizle"
      />
    </div>
  );
};

export default OrdersSummary;
