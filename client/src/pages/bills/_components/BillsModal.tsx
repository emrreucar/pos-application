import React, { useEffect, useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { useSetsStore } from "../../../store/useSetsStore";
import { formatCurrency } from "../../../lib/utils";
import { FaCheck, FaCreditCard, FaPlus, FaXmark } from "react-icons/fa6";
import { CiCalendar, CiWarning } from "react-icons/ci";
import { axiosInstance } from "../../../lib/axios";
import { toast } from "react-toastify";

interface BillsModalProps {
  visible: boolean;
  onClose: () => void;
  selectedRow: any | null;
  setVisibleEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const BillsModal: React.FC<BillsModalProps> = ({
  visible,
  onClose,
  selectedRow,
  setVisibleEditModal,
}) => {
  const { fetchPaymentMethods, paymentMethods } = useSetsStore();
  const [payments, setPayments] = useState<
    { amount: number; payment_method_id: number; date: string }[]
  >([]);

  const [pastPayments, setPastPayments] = useState<any[]>([]);

  const paymentMethodsOptions = paymentMethods.map((method) => ({
    label: method.name,
    value: method.id,
  }));

  useEffect(() => {
    if (visible) {
      fetchPaymentMethods();
      setPayments([]);
    }
  }, [visible]);

  const handleAddPayment = () => {
    setPayments([...payments, { amount: 0, payment_method_id: 0, date: "" }]);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...payments];
    updated[index] = { ...updated[index], [field]: value };
    setPayments(updated);
  };

  const handleSave = async () => {
    if (!payments.length) {
      toast.error("Lütfen en az bir ödeme ekleyin.");
      return;
    }

    if (!payments.every((p) => p.amount > 0 && p.payment_method_id && p.date)) {
      toast.error("Lütfen tüm ödeme bilgilerini eksiksiz doldurun.");
      return;
    }

    try {
      await axiosInstance.put(`/bills/${selectedRow.id}`, {
        payments: payments
          .filter((p) => p.amount > 0 && p.payment_method_id && p.date)
          .map((p) => ({
            amount: p.amount,
            payment_method_id: p.payment_method_id,
            date: p.date,
          })),
      });

      toast.success("Ödeme bilgileri başarıyla güncellendi.");
      setVisibleEditModal(false);
      onClose();
    } catch (error) {
      console.error("Error updating bill:", error);
      toast.error("Fatura güncellenirken bir hata oluştu.");
    }
  };

  // const remainingDebt = () => {
  //   if (!selectedRow) return 0;
  //   const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  //   return selectedRow.total_amount - totalPaid;
  // };

  useEffect(() => {
    // back-end'den gelen ödemeleri yükle
    if (selectedRow && selectedRow.payments) {
      selectedRow.payments = selectedRow.payments.map((p: any) => ({
        amount: p.amount,
        payment_method: p.payment_method,
        date: p.payment_date,
      }));

      setPastPayments(selectedRow.payments);
    }
  }, [visible]);

  return (
    <Modal
      open={visible}
      onConfirm={handleSave}
      onClose={onClose}
      title={`
        ${selectedRow ? `#${selectedRow.id} Numaralı Fatura` : "Fatura"}
        ${selectedRow ? ` - ${selectedRow.customer_name_surname}` : ""}
        `}
      width="max-w-7xl"
      height={`
        ${selectedRow?.payment_method_id === 3 ? "h-[90vh]" : "h-auto"}
        `}
    >
      <div className="h-full flex flex-col space-y-6">
        {/* Invoice Header - Customer Information */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${
              selectedRow?.payment_method_id === 3
                ? "xl:grid-cols-4"
                : "xl:grid-cols-3"
            }`}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                İlk Satın Alım Tarihi
              </label>
              <div className="flex items-center gap-2">
                <CiCalendar className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-900">
                  {selectedRow?.created_at}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Ödeme Yöntemi
              </label>
              <div className="flex items-center gap-2">
                <FaCreditCard className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-900">
                  {selectedRow?.payment_method}
                </span>
              </div>
            </div>

            {selectedRow?.payment_method_id === 3 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Toplam Kalan Borç
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-red-600 text-lg">
                    {formatCurrency(
                      +selectedRow?.total_amount -
                        (+selectedRow?.total_paid || 0)
                    )}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Ödeme Durumu
              </label>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    selectedRow?.total_amount <= selectedRow?.total_paid
                      ? "bg-green-500"
                      : selectedRow?.payment_method_id === 3
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
                ></div>
                <span
                  className={`font-semibold px-3 py-1 rounded-full text-sm ${
                    selectedRow?.total_amount <= selectedRow?.total_paid
                      ? "bg-green-100 text-green-800"
                      : selectedRow?.payment_method_id === 3
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {selectedRow?.total_amount <= selectedRow?.total_paid ||
                  selectedRow?.payment_method_id !== 3
                    ? "Tamamlandı"
                    : "Ödenmedi"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Past Payments */}
        {pastPayments.length > 0 && (
          <div className="flex-1 space-y-4">
            <div>
              <h5 className="text-lg font-semibold text-gray-900">
                Geçmiş Ödemeler
              </h5>
              <p className="text-sm text-gray-600">
                Bu faturaya ait geçmiş ödemeler
              </p>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {pastPayments.map((payment, index) => (
                <>
                  <span className="text-gray-600 mt-2 block font-bold uppercase">
                    {index + 1}. Ödeme{" "}
                  </span>
                  <div
                    key={index}
                    className="relative bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Amount */}
                      <div className="space-y-2 text-sm">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          Ödenen Tutar
                        </label>
                        <span>{formatCurrency(payment.amount)}</span>
                      </div>

                      {/* Payment Method */}
                      <div className="space-y-2 text-sm">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          Ödeme Yöntemi
                        </label>
                        <span>{payment.payment_method}</span>
                      </div>

                      {/* Date */}
                      <div className="space-y-2 text-sm">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          Ödeme Tarihi
                        </label>
                        <span>
                          {new Date(payment.date).toLocaleDateString("tr-TR")}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        )}

        {/* Payment Management Section */}
        {selectedRow?.payment_method_id === 3 && (
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-lg font-semibold text-gray-900">
                  Ödeme Yönetimi
                </h5>
                <p className="text-sm text-gray-600">
                  Faturaya ait ödemeleri ekleyin ve düzenleyin
                </p>
              </div>

              <Button
                onClick={handleAddPayment}
                className="text-sm flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FaPlus size={15} />
                Ödeme Ekle
              </Button>
            </div>

            {/* Payment List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {payments.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <h6 className="text-lg font-medium text-gray-900 mb-2">
                    Henüz ödeme eklenmemiş
                  </h6>
                  <p className="text-gray-600 mb-4">
                    Bu fatura için ödeme eklemek üzere yukarıdaki butonu
                    kullanın
                  </p>
                </div>
              ) : (
                payments.map((payment, index) => (
                  <div
                    key={index}
                    className="relative bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                  >
                    {/* Delete Button */}
                    <button
                      type="button"
                      className="absolute left-0 top-0 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                      onClick={() =>
                        setPayments(payments.filter((_, i) => i !== index))
                      }
                      title="Ödemeyi Sil"
                    >
                      <FaXmark size={12} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Amount */}
                      <div className="space-y-2 text-sm">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span className="text-gray-400">₺</span> Tutar
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            ₺
                          </span>
                          <input
                            type="number"
                            value={payment.amount}
                            onChange={(e) =>
                              handleChange(index, "amount", e.target.value)
                            }
                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-500 focus:border-transparent transition-all focus:outline-none"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                          />
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="space-y-2 text-sm">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <FaCreditCard className="w-4 h-4 text-gray-500" />
                          Ödeme Yöntemi
                        </label>
                        <select
                          value={payment.payment_method_id}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "payment_method_id",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-500 focus:border-transparent transition-all bg-white focus:outline-none"
                        >
                          <option value="">Ödeme yöntemi seçin...</option>
                          {paymentMethodsOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Date */}
                      <div className="space-y-2 text-sm">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <CiCalendar className="w-4 h-4 text-gray-500" />
                          Ödeme Tarihi
                        </label>
                        <input
                          type="date"
                          value={payment.date}
                          onChange={(e) =>
                            handleChange(index, "date", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-500 focus:border-transparent transition-all focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          Ödeme #{index + 1}
                        </span>
                        <span className="font-medium text-gray-900">
                          {payment.amount &&
                          payment.payment_method_id &&
                          payment.date ? (
                            <span className="text-green-600 flex items-center gap-1">
                              <FaCheck className="w-4 h-4" />
                              Tamamlandı
                            </span>
                          ) : (
                            <span className="text-amber-600 flex items-center gap-1">
                              <CiWarning className="w-4 h-4" />
                              Eksik bilgi
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BillsModal;
