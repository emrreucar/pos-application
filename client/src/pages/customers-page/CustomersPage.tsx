import { useEffect, useState } from "react";
import DataTable from "../../components/ui/Table";
import Actions from "../../components/ui/Actions";
import { toast } from "react-toastify";
import CustomersModal from "./_components/CustomersModal";
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal";
import { Customer, useCustomersStore } from "../../store/useCustomersStore";

const columns: {
  key:
    | "id"
    | "name"
    | "surname"
    | "email"
    | "phone_number"
    | "address"
    | "tc_no"
    | "created_at"
    | "updated_at";
  label: string;
  isImage?: boolean;
}[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Müşteri Adı" },
  { key: "surname", label: "Müşteri Soyadı" },
  { key: "email", label: "E-posta" },
  { key: "phone_number", label: "Telefon Numarası" },
  { key: "address", label: "Adres" },
  { key: "tc_no", label: "TC Kimlik No" },
  { key: "created_at", label: "Oluşturulma Tarihi" },
  { key: "updated_at", label: "Güncellenme Tarihi" },
];

const CustomersPage = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
  const [isAddOperation, setIsAddOperation] = useState(true);
  const [selectedRow, setSelectedRow] = useState<Customer | null>(null);

  const { fetchCustomers, customers, loading, deleteCustomer } =
    useCustomersStore();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleRowClick = (row: any) => {
    setSelectedRow(row);
  };

  const handleAddClick = () => {
    setVisibleModal(true);
    setIsAddOperation(true);
  };

  const handleEditClick = () => {
    if (!selectedRow) return toast.error("Lütfen bir müşteri seçin.");

    setVisibleModal(true);
    setIsAddOperation(false);
  };

  const handleDeleteClick = () => {
    if (!selectedRow) return toast.error("Lütfen bir müşteri seçin.");

    setVisibleDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedRow) {
      deleteCustomer(selectedRow?.id);
      setVisibleDeleteModal(false);
      setSelectedRow(null);
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <>
      <h2 className="lg:hidden block mb-5 text-3xl font-bold">Müşteriler</h2>
      <Actions
        onAdd={handleAddClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />
      <DataTable
        columns={columns}
        data={customers}
        selectedRow={selectedRow}
        onRowClick={handleRowClick}
      />

      <CustomersModal
        visible={visibleModal}
        onClose={() => setVisibleModal(false)}
        isAddOperation={isAddOperation}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
      <ConfirmDeleteModal
        open={visibleDeleteModal}
        onClose={() => setVisibleDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        message="Dikkat! Bu müşteri kaydını sildiğinizde, bu müşteri ile ilişkili tüm veriler de silinecektir. Devam etmek istediğinize emin misiniz?"
      />
    </>
  );
};

export default CustomersPage;
