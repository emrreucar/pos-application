import { useEffect, useState } from "react";
import DataTable from "../../components/ui/Table";
import Actions from "../../components/ui/Actions";
import { toast } from "react-toastify";
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal";
import { useBillsStore } from "../../store/useBillsStore";
import PrintModal from "./_components/PrintModal";

const columns: {
  key:
    | "id"
    | "customer_name_surname"
    | "payment_method"
    | "total_amount"
    | "created_at";
  label: string;
  isImage?: boolean;
}[] = [
  { key: "id", label: "ID" },
  { key: "customer_name_surname", label: "Müşteri Adı Soyadı" },
  { key: "payment_method", label: "Ödeme Yöntemi" },
  { key: "total_amount", label: "Toplam Tutar" },
  { key: "created_at", label: "Oluşturulma Tarihi" },
];

const BillsPage = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<null | any>(null);

  const { fetchBills, bills, loading, deleteBill } = useBillsStore();

  useEffect(() => {
    fetchBills();
  }, []);

  const handleRowClick = (row: any) => {
    setSelectedRow(row);
  };

  const handleDeleteClick = () => {
    if (!selectedRow) return toast.error("Lütfen bir fatura seçin.");

    setVisibleDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedRow) {
      deleteBill(selectedRow?.id);
      setVisibleDeleteModal(false);
      setSelectedRow(null);
    }
  };

  const handlePrintClick = () => {
    if (!selectedRow) return toast.error("Lütfen bir fatura seçin.");

    setVisibleModal(true);
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <>
      <Actions onPrint={handlePrintClick} onDelete={handleDeleteClick} />
      <DataTable
        columns={columns}
        data={bills}
        selectedRow={selectedRow}
        onRowClick={handleRowClick}
      />

      <PrintModal
        visible={visibleModal}
        onClose={() => setVisibleModal(false)}
        selectedRow={selectedRow}
      />

      <ConfirmDeleteModal
        open={visibleDeleteModal}
        onClose={() => setVisibleDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        message="Bu faturayı silmek istediğinize emin misiniz?"
      />
    </>
  );
};

export default BillsPage;
