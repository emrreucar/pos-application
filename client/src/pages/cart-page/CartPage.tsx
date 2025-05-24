import { useCartStore } from "../../store/useCartStore";
import { formatCurrency } from "../../lib/utils";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import ConfirmOrderModal from "./_components/ConfirmOrderModal";
import { CiTrash } from "react-icons/ci";

const CartPage = () => {
  const [visibleModal, setVisibleModal] = useState(false);

  const {
    cartItems,
    changeQuantity,
    removeFromCart,
    getTotalQuantity,
    totalPrice,
  } = useCartStore();

  return (
    <div className="p-6 bg-gray-50 pb-20 xl:pb-0">
      <h1 className="text-2xl font-bold mb-6">Sepetim</h1>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          Sepetinizde ürün bulunmamaktadır.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Cart Items */}
          <div className="col-span-2 flex flex-col gap-4 p-4 bg-white shadow-md rounded-lg overflow-y-auto max-h-[70vh]">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center bg-white shadow-md rounded-lg p-4 gap-4"
              >
                <img
                  src={
                    item.product.image_url
                      ? import.meta.env.VITE_BASE_IMAGE_URL +
                        item.product.image_url
                      : "/images/no-image.jpg"
                  }
                  alt={item.product.title}
                  className="w-24 h-24 object-contain rounded-md border"
                />
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">
                    {item.product.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Birim Fiyat: {formatCurrency(item.product.price)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
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
                          <CiTrash size={20} />
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
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                  <span
                    title="Ürünü Sepetten Çıkar"
                    onClick={() => {
                      removeFromCart(item.id);
                    }}
                  >
                    <CiTrash
                      color="#ff0000"
                      size={20}
                      className="cursor-pointer hover:text-red-600 transition-colors duration-200 ease-in-out"
                    />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between h-fit">
            <h2 className="text-xl font-bold mb-4">Sipariş Özeti</h2>
            <div className="flex justify-between mb-2">
              <span>Toplam</span>
              <span>{getTotalQuantity()} adet</span>
            </div>

            <div className="font-bold flex flex-col gap-2 mb-4 text-sm items-end text-gray-500 h-96 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id}>
                  <span> {item.quantity} </span>
                  <span>x</span>
                  <span>
                    {" "}
                    {item.product.title.length > 35
                      ? item.product.title.slice(0, 35) + "..."
                      : item.product.title}{" "}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-semibold text-lg">
              <span>Toplam Tutar:</span>
              <span>{formatCurrency(totalPrice())}</span>
            </div>

            <button
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
              onClick={() => setVisibleModal(true)}
            >
              Siparişi Tamamla
            </button>
          </div>
        </div>
      )}

      <ConfirmOrderModal
        visible={visibleModal}
        onClose={() => setVisibleModal(false)}
      />
    </div>
  );
};

export default CartPage;
