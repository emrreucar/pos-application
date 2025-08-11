import { useCartStore } from "../../store/useCartStore";
import { formatCurrency } from "../../lib/utils";
import { FaRegTrashAlt } from "react-icons/fa";
import {
  Check,
  CheckCheckIcon,
  ChevronDown,
  Minus,
  Plus,
  Trash,
} from "lucide-react";
import { useState } from "react";
import ConfirmDeleteModal from "../ui/ConfirmDeleteModal";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useProductsStore } from "../../store/useProductsStore";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

const OrdersSummary = ({ showCart }: { showCart?: boolean }) => {
  const [draftPrices, setDraftPrices] = useState<Record<number, string>>({});
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
  const [showChangePrice, setShowChangePrice] = useState<number | null>(null);

  const {
    cartItems,
    totalPrice,
    removeFromCart,
    changeQuantity,
    clearCart,
    changePrice,
  } = useCartStore();

  const { products } = useProductsStore();

  const activeProducts = products.filter((product) => product.status);
  const findProductPrice = (id: number) => {
    const product = activeProducts.find((item) => item.id === id);
    return product ? product.price : 0;
  };

  const applyPrice = (itemId: number) => {
    const raw = draftPrices[itemId];

    // input hiç değişmemiş ya da boşsa -> orijinal fiyatı dön
    if (!raw || raw.trim() === "") {
      changePrice(itemId, findProductPrice(itemId)); // store'a orijinal fiyatı yazdım.
      setDraftPrices((p) => {
        const { [itemId]: _, ...rest } = p;
        return rest; // taslağı temizledim
      });
      toast.info("Fiyat orijinale döndü");
      return;
    }

    const parsed = parseFloat(raw.replace(",", "."));
    if (isNaN(parsed) || parsed < 0) {
      toast.error("Geçerli bir fiyat gir.");
      return;
    }

    changePrice(itemId, parsed);
    toast.success("Fiyat güncellendi!");
  };

  const calculatePercentage = (itemId: number) => {
    const originalPrice = findProductPrice(itemId); // orijinal back-end fiyatı

    // 1. Orijinal fiyatı yoksa,  sıfır veya küçükse hesaplama yapma
    if (!originalPrice || originalPrice <= 0) return 0;

    // 2. Mevcut fiyat: draft varsa onu al, yoksa sepet item fiyatını, o da yoksa orijinal
    const raw = draftPrices[itemId];
    const draftParsed =
      raw && raw.trim() !== "" ? parseFloat(raw.replace(",", ".")) : NaN;

    const item = cartItems.find((x) => x.id === itemId);
    const currentFromCart = item?.product.price ?? originalPrice; // item.product.price null veya undefined ise originalPrice kullan

    const currentPrice = !isNaN(draftParsed) ? draftParsed : currentFromCart;

    // 3. Hatalı değer guard’ı
    if (isNaN(currentPrice) || currentPrice <= 0) return 0;

    // 4) + zam, - indirim
    const delta = currentPrice - originalPrice;
    const pct = (delta / originalPrice) * 100;

    return Number(pct.toFixed(1)); // 1 basamak
  };

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

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)] text-center p-4">
            <img
              src="/images/empty-cart.gif"
              alt="Boş sepet"
              className="w-full h-96 mb-4 object-contain"
            />
            <p className="text-gray-500 text-lg font-semibold">
              Sepetinizde hiç ürün yok.
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
                  {/* left side */}
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

                      <div
                        className="text-sm font-semibold text-red-600 flex items-center gap-1 cursor-pointer select-none"
                        onClick={() => {
                          setShowChangePrice(
                            showChangePrice === item.id ? null : item.id
                          );
                        }}
                      >
                        Fiyat Değiştir{" "}
                        <ChevronDown
                          size={15}
                          className={`transition-all duration-300 ${
                            showChangePrice === item.id ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {showChangePrice === item.id ? (
                        <div className="flex items-center gap-2 mt-3 ">
                          <input
                            type="number"
                            value={draftPrices[item.id] ?? ""} // ürüne özgü değeri atadım.
                            onChange={(e) => {
                              const v = e.target.value;
                              // sadece sayı yazacak.
                              if (/^[0-9]*[.,]?[0-9]*$/.test(v) || v === "") {
                                setDraftPrices((prev) => ({
                                  ...prev,
                                  [item.id]: v,
                                }));
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") applyPrice(item.id);
                              if (e.key === "Escape") {
                                // iptal -> taslağı temizle
                                setDraftPrices((p) => {
                                  const { [item.id]: _, ...rest } = p;
                                  return rest;
                                });
                                setShowChangePrice(null);
                              }
                            }}
                            className="border border-gray-300 rounded-md p-1 w-2/3 text-sm placeholder:text-xs"
                            placeholder="Yeni fiyat"
                          />
                          <Check
                            size={18}
                            color="#28a745"
                            className="cursor-pointer hover:text-green-600 transition-colors duration-200 ease-in-out"
                            onClick={() => {
                              applyPrice(item.id);
                              setShowChangePrice(null);
                            }}
                          />
                        </div>
                      ) : (
                        <span className="font-semibold text-sm mt-3">
                          {/* Geçerli fiyat ile orijinal fiyatı kıyaslayacağım */}
                          {(() => {
                            const original = findProductPrice(item.id);
                            const current = item.product.price ?? original; // store, item.product.price'ı güncelliyor olmalı

                            const pct = calculatePercentage(item.id);

                            return current !== original ? (
                              <div className="flex gap-4 items-center">
                                <div className="flex flex-col gap-px">
                                  <span className="line-through text-gray-500">
                                    {formatCurrency(original)}
                                  </span>
                                  <span>{formatCurrency(current)}</span>
                                </div>
                                {pct !== 0 && (
                                  <span className="flex items-center gap-1 text-sm font-semibold">
                                    {pct > 0 ? (
                                      <ArrowUpCircle
                                        size={15}
                                        className="text-red-500"
                                      />
                                    ) : (
                                      <ArrowDownCircle
                                        size={15}
                                        className="text-green-500"
                                      />
                                    )}
                                    <span
                                      className={
                                        pct > 0
                                          ? "text-red-500"
                                          : "text-green-500"
                                      }
                                    >
                                      %{pct}
                                    </span>
                                  </span>
                                )}
                              </div>
                            ) : (
                              <>{formatCurrency(original)}</>
                            );
                          })()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* right side */}
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
