import Modal from "../../../components/ui/Modal";
import { formatCurrency } from "../../../lib/utils";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import { useUsersStore } from "../../../store/useUsersStore";

const PrintModal = ({
  visible,
  onClose,
  selectedRow,
}: {
  visible: boolean;
  onClose: () => void;
  selectedRow: any | null;
}) => {
  const { user } = useAuthStore();
  const { users } = useUsersStore();
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  const findUser = users.find((u) => u.id === user?.id);

  if (!selectedRow) return null;

  return (
    <Modal
      open={visible}
      onPrint={handlePrint}
      onClose={onClose}
      title="Fatura Yazdır"
      width="max-w-4xl"
      height="h-[95vh]"
      showConfirmButton={false}
    >
      <div
        ref={printRef}
        className="p-4 bg-white text-black print:text-black print:bg-white"
      >
        {/* Fatura Başlık */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold mb-1 text-primary">
              {findUser?.company_name || user?.company_name} <br />
            </span>
            <span className="text-2xl font-bold mb-1">FATURA</span>
          </div>
          <p>
            <strong>Tarih:</strong> {selectedRow.created_at}
          </p>
          <p>
            <strong>Müşteri:</strong> {selectedRow.customer_name_surname}
          </p>
          <p>
            <strong>Ödeme Yöntemi:</strong> {selectedRow.payment_method}
          </p>
        </div>

        {/* Ürün Listesi */}
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1 text-left">Ürün</th>
              <th className="border px-2 py-1 text-center">Adet</th>
              <th className="border px-2 py-1 text-center">Birim Fiyat</th>
              <th className="border px-2 py-1 text-center">Toplam</th>
            </tr>
          </thead>
          <tbody>
            {selectedRow.cart_items.map((item: any, index: number) => (
              <tr key={index} className="border-b">
                <td className="border px-2 py-2 flex items-center gap-2">
                  <img
                    src={import.meta.env.VITE_BASE_IMAGE_URL + item.image_url}
                    alt={item.title}
                    className="w-10 h-10 object-contain border rounded"
                  />
                  <span>{item.title}</span>
                </td>
                <td className="border text-center">{item.quantity}</td>
                <td className="border text-center">
                  {formatCurrency(item.unit_price)}
                </td>
                <td className="border text-center">
                  {formatCurrency(item.total_price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Toplam Tutar */}
        <div className="text-right mt-4">
          <p className="text-lg font-bold">
            Toplam: {formatCurrency(selectedRow.total_amount)}
          </p>
        </div>

        {/* Uyarı Notu */}
        <p className="text-sm text-gray-500 mt-4 italic text-center print:text-gray-700">
          Bu belge yalnızca bilgi amaçlıdır. Vergi Usul Kanunu uyarınca geçerli
          bir fatura yerine geçmez.
        </p>
      </div>
    </Modal>
  );
};

export default PrintModal;
