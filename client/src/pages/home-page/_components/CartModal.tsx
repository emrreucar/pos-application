import { FaRegTrashAlt } from "react-icons/fa";
import { formatCurrency } from "../../../lib/utils";
import { useCartStore } from "../../../store/useCartStore";
import { FaRegCircleXmark } from "react-icons/fa6";
import { CheckCheckIcon, Minus, Plus, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import ConfirmDeleteModal from "../../../components/ui/ConfirmDeleteModal";
import { toast } from "react-toastify";

interface CartModalProps {
  setVisibleCartModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const CartModal: React.FC<CartModalProps> = ({ setVisibleCartModal }) => {
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
  const { cartItems, removeFromCart, changeQuantity, totalPrice, clearCart } =
    useCartStore();

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-white/50 backdrop-blur-sm flex items-center justify-center z-50 shadow-lg"
      style={{ backdropFilter: "blur(5px)" }}
    >
      <FaRegCircleXmark
        className="absolute top-5 right-5 text-red-500 cursor-pointer hover:text-red-800 transition-colors duration-200 ease-in-out"
        size={30}
        onClick={() => setVisibleCartModal(false)}
      />

      {/* orders summary  */}
      <article className="sm:w-2/3 w-full px-10 sm:px-0">
        {/* <span className="text-xl font-semibold block bg-secondary text-center text-white rounded-md py-2 mb-4">
          Mevcut Sipariş
        </span> */}

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)] text-center p-4">
            <p className="text-gray-800 text-lg font-semibold">
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
                  className="flex justify-between items-start mb-2 border border-secondary-light p-4 rounded-md bg-secondary-dark text-white"
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
                        className="cursor-pointer p-1 bg-secondary-light rounded transition-colors duration-200 ease-in-out w-8 h-8 flex items-center justify-center"
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
                        className="cursor-pointer rounded bg-secondary-light transition-colors duration-200 ease-in-out w-8 h-8 flex items-center justify-center text-white"
                      >
                        <Plus size={15} />
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-2 mt-auto border bg-secondary-dark p-4 !text-white rounded-md">
              <div className="text-lg flex items-center justify-between">
                <span className="font-medium">Toplam Tutar:</span>
                <span className="font-extrabold">
                  {formatCurrency(totalPrice())}
                </span>
              </div>

              {/* buttons */}
              <div className="flex items-center justify-between mt-4 text-sm">
                <Link
                  to={"/sepetim"}
                  onClick={() => setVisibleCartModal(false)}
                  className="flex items-center gap-2 cursor-pointer bg-secondary-light text-white rounded-md py-2 px-3 hover:bg-secondary transition-colors duration-200 ease-in-out"
                >
                  <CheckCheckIcon size={18} />
                  <span>Siparişi Onayla</span>
                </Link>
                <div
                  className="flex items-center gap-2 cursor-pointer bg-danger-dark text-white rounded-md py-2 px-3 hover:bg-danger transition-colors duration-200 ease-in-out"
                  onClick={() => setVisibleDeleteModal(true)}
                >
                  <FaRegTrashAlt color="#fff" size={15} />
                  <span>Sepeti Temizle</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </article>

      <ConfirmDeleteModal
        open={visibleDeleteModal}
        onClose={() => setVisibleDeleteModal(false)}
        onConfirm={() => {
          clearCart();
          toast.success("Sepetiniz temizlendi!");
          setVisibleDeleteModal(false);
          setVisibleCartModal(false);
        }}
        message="Sepeti temizlemek istediğinize emin misiniz?"
        buttonText="Evet, Temizle"
      />
    </div>
  );
};

export default CartModal;
