import { useCartStore } from "../../store/useCartStore";
import { formatCurrency } from "../../lib/utils";
import { Minus, Plus, Trash } from "lucide-react";
import { useState } from "react";
import ConfirmOrderModal from "./_components/ConfirmOrderModal";
import { CiTrash } from "react-icons/ci";
import Button from "../../components/ui/Button";

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
        <div className="flex flex-col-reverse lg:flex-row gap-5 rounded-lg shadow-md overflow-hidden p-4">
          {/* left side */}
          <div className="flex-[2]">
            <ul className="space-y-4 overflow-y-auto h-[calc(100vh_-_250px)]">
              {cartItems.map((item, idx) => (
                <li key={item.id} className="bg-white rounded-lg shadow p-4">
                  {/* left side - image, title, unit price and quantities */}
                  <div className="flex items-start gap-4">
                    {/* image */}
                    <div className="w-24 h-24 border border-gray-200 rounded-md overflow-hidden mb-4">
                      <img
                        src={
                          item.product.image_url
                            ? import.meta.env.VITE_BASE_IMAGE_URL +
                              item.product.image_url
                            : "/images/no-image.jpg"
                        }
                        className="w-full h-full object-contain rounded-md"
                        alt={`${item.product.title}-${idx + 1}`}
                      />
                    </div>

                    {/* content */}
                    <div className="flex flex-col justify-between">
                      <span className="text-lg font-bold">
                        {" "}
                        {item.product.title}{" "}
                      </span>
                      <span className="text-gray-600">
                        Birim Fiyat: {formatCurrency(item.product.price)}{" "}
                      </span>

                      <div className="flex items-center justify-start gap-5 mt-5 select-none">
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
                  </div>

                  {/* right side - price, delete icon */}
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                    <CiTrash
                      size={24}
                      color="#ff0000"
                      onClick={() => removeFromCart(item.id)}
                      className="cursor-pointer hover:text-red-600 transition-colors duration-200 ease-in-out"
                      title="Ürünü Sepetten Çıkar"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* right side */}
          <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col justify-between h-fit">
            {/* top */}
            <article className="space-y-4">
              <span className="text-lg font-bold">Sipariş Özeti</span>

              <div className="flex items-start justify-between font-semibold">
                <span>Toplam</span>

                <div className="flex flex-col justify-end items-end">
                  <span> {getTotalQuantity()} adet</span>

                  <div className="text-gray-500 flex flex-col items-end gap-1 font-bold text-sm mt-2 overflow-y-auto max-h-64">
                    {cartItems.map((item) => (
                      <div key={item.id}>
                        <span>{item.quantity}</span> x{" "}
                        <span className="">
                          {item.product.title.length > 30
                            ? item.product.title.slice(0, 30) + "..."
                            : item.product.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            {/* bottom */}
            <article className="border-t border-gray-200 pt-4 mt-4 space-y-4">
              <div className="flex items-center justify-between font-semibold text-lg">
                <span>Toplam Tutar: </span>
                <span>{formatCurrency(totalPrice())}</span>
              </div>
              <Button fullWidth onClick={() => setVisibleModal(true)}>
                Siparişi Tamamla
              </Button>
            </article>
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
