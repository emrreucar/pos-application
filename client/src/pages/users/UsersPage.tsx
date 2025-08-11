import { useEffect, useState } from "react";
import Table from "../../components/ui/Table";
import Actions from "../../components/ui/Actions";
import { toast } from "react-toastify";
import UsersModal from "./_components/UsersModal";
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal";
import { User, useUsersStore } from "../../store/useUsersStore";
import PageLoader from "../../components/ui/PageLoader";
import { useAuthStore } from "../../store/useAuthStore";

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

  const { fetchUsers, users, fetchLoading, deleteUser } = useUsersStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.role === "admin") {
      fetchUsers();
    }
  }, []);

  const handleRowClick = (row: any) => {
    setSelectedRow(row);
  };

  const handleEditClick = () => {
    if (user?.role !== "admin") {
      return toast.error("Bu işlemi gerçekleştirmek için yeterli izniniz yok.");
    }

    if (!selectedRow) return toast.error("Lütfen bir kullanıcı seçin.");

    setVisibleModal(true);
    setIsAddOperation(false);
  };

  const handleDeleteClick = () => {
    if (user?.role !== "admin") {
      return toast.error("Bu işlemi gerçekleştirmek için yeterli izniniz yok.");
    }
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

  return (
    <>
      <h2 className="lg:hidden block mb-5 text-3xl font-bold">Kullanıcılar</h2>
      <Actions onEdit={handleEditClick} onDelete={handleDeleteClick} />
      {fetchLoading ? (
        <PageLoader />
      ) : (
        <>
          {user?.role === "admin" ? (
            <Table
              columns={columns}
              data={users}
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
