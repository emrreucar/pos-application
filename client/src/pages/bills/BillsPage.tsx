import { useEffect, useState } from "react";
import Table from "../../components/ui/Table";
import Actions from "../../components/ui/Actions";
import { toast } from "react-toastify";
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal";
import { useBillsStore } from "../../store/useBillsStore";
import PrintModal from "./_components/PrintModal";
import PageLoader from "../../components/ui/PageLoader";
import { useAuthStore } from "../../store/useAuthStore";

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

  const { fetchBills, bills, fetchLoading, deleteBill } = useBillsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.role === "admin") {
      fetchBills();
    }
  }, []);

  const handleRowClick = (row: any) => {
    setSelectedRow(row);
  };

  const handleDeleteClick = () => {
    if (user?.role !== "admin") {
      return toast.error("Bu işlemi gerçekleştirmek için yeterli izniniz yok.");
    }
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
    if (user?.role !== "admin") {
      return toast.error("Bu işlemi gerçekleştirmek için yeterli izniniz yok.");
    }
    if (!selectedRow) return toast.error("Lütfen bir fatura seçin.");

    setVisibleModal(true);
  };

  return (
    <>
      <h2 className="lg:hidden block mb-5 text-3xl font-bold">Faturalar</h2>

      <Actions onPrint={handlePrintClick} onDelete={handleDeleteClick} />

      {fetchLoading ? (
        <PageLoader />
      ) : (
        <>
          {user?.role === "admin" ? (
            <Table
              columns={columns}
              data={bills}
              selectedRow={selectedRow}
              onRowClick={handleRowClick}
            />
          ) : (
            <p className="text-center">
              Bu sayfayı görüntülemek için yeterli izniniz yok.
            </p>
          )}
        </>
      )}

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
