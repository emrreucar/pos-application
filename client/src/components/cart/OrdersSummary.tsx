import { useCartStore } from "../../store/useCartStore";
import { formatCurrency } from "../../lib/utils";
import { FaRegTrashAlt } from "react-icons/fa";
import { CheckCheckIcon, Minus, Plus, Trash } from "lucide-react";
import { useState } from "react";
import ConfirmDeleteModal from "../ui/ConfirmDeleteModal";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const OrdersSummary = ({ showCart }: { showCart?: boolean }) => {
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
  const { cartItems, totalPrice, removeFromCart, changeQuantity, clearCart } =
    useCartStore();

  return (
    <>
      <div
        className={`overflow-hidden bg-white shadow-lg rounded-xl h-full transition-all duration-300 ease-in-out ${
          showCart
            ? "2xl:w-[25rem] w-[23rem] hidden xl:block px-4 py-6 opacity-100 scale-100"
            : "w-0 p-0 opacity-0 scale-50"
        } `}
      >
        <span className="text-xl font-semibold block bg-secondary text-center text-white rounded-md py-2 mb-4">
          Mevcut Sipariş
        </span>

        <>
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)] text-center p-4">
              <img
                src="/images/empty-cart.gif"
                alt="Boş sepet"
                className="w-full h-96 mb-4 object-contain"
              />
              <p className="text-gray-500 text-lg font-semibold">
                Sepetinde hâlâ bir şey yok 🤔 <br />
                Hadi birkaç ürün eklemeye ne dersin?
              </p>
            </div>
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
                  <span className="text-gray-600 font-medium">
                    Toplam Tutar:
                  </span>
                  <span className="font-extrabold text-gray-800">
                    {formatCurrency(totalPrice())}
                  </span>
                </div>

                {/* buttons */}
                <div className="flex items-center justify-between mt-4 text-sm">
                  <Link
                    to={"/sepetim"}
                    className="flex items-center gap-2 cursor-pointer bg-[#6460ce] text-white rounded-md py-2 px-3 hover:bg-[#0a0171] transition-colors duration-200 ease-in-out"
                  >
                    <CheckCheckIcon size={18} />
                    <span>Siparişi Onayla</span>
                  </Link>
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
        </>
      </div>
      <ConfirmDeleteModal
        open={visibleDeleteModal}
        onClose={() => setVisibleDeleteModal(false)}
        onConfirm={() => {
          clearCart();
          toast.success("Sepetiniz temizlendi!");
          setVisibleDeleteModal(false);
        }}
        message="Sepeti temizlemek istediğinize emin misiniz?"
        buttonText="Evet, Temizle"
      />
    </>
  );
};

export default OrdersSummary;
