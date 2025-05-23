import { useEffect, useState } from "react";
import DataTable from "../../components/ui/Table";
import Actions from "../../components/ui/Actions";
import { toast } from "react-toastify";
import UsersModal from "./_components/UsersModal";
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal";
import { User, useUsersStore } from "../../store/useUsersStore";

const columns: {
  key:
    | "id"
    | "username"
    | "email"
    | "password"
    | "role"
    | "created_at"
    | "updated_at"
    | "name"
    | "surname"
    | "company_name"
    | "phone_number";
  label: string;
  isImage?: boolean;
}[] = [
  { key: "id", label: "ID" },
  { key: "username", label: "Kullanıcı Adı" },
  { key: "email", label: "E-posta" },
  { key: "role", label: "Yetki" },
  { key: "name", label: "İsim" },
  { key: "surname", label: "Soyisim" },
  { key: "company_name", label: "Şirket Adı" },
  { key: "phone_number", label: "Telefon Numarası" },
  { key: "created_at", label: "Oluşturulma Tarihi" },
  { key: "updated_at", label: "Güncellenme Tarihi" },
];

const UsersPage = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
  const [isAddOperation, setIsAddOperation] = useState(true);
  const [selectedRow, setSelectedRow] = useState<User | null>(null);

  const { fetchUsers, users, loading, deleteUser } = useUsersStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRowClick = (row: any) => {
    setSelectedRow(row);
  };

  const handleEditClick = () => {
    if (!selectedRow) return toast.error("Lütfen bir kullanıcı seçin.");

    setVisibleModal(true);
    setIsAddOperation(false);
  };

  const handleDeleteClick = () => {
    if (!selectedRow) return toast.error("Lütfen bir kullanıcı seçin.");

    setVisibleDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedRow) {
      deleteUser(selectedRow?.id);
      setVisibleDeleteModal(false);
      setSelectedRow(null);
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <>
      <h2 className="lg:hidden block mb-5 text-3xl font-bold">Kullanıcılar</h2>
      <Actions onEdit={handleEditClick} onDelete={handleDeleteClick} />
      <DataTable
        columns={columns}
        data={users}
        selectedRow={selectedRow}
        onRowClick={handleRowClick}
      />

      <UsersModal
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
        message="Bu kullanıcı kaydını silmek istediğinize emin misiniz?"
      />
    </>
  );
};

export default UsersPage;
