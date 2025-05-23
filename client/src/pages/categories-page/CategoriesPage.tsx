import { useEffect, useState } from "react";
import DataTable from "../../components/ui/Table";
import Actions from "../../components/ui/Actions";
import { toast } from "react-toastify";
import CategoriesModal from "./_components/CategoriesModal";
import { Category, useCategoriesStore } from "../../store/useCategoriesStore";
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal";

const columns: {
  key: "id" | "name" | "created_at" | "updated_at";
  label: string;
  isImage?: boolean;
}[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Kategori Adı" },
  { key: "created_at", label: "Oluşturulma Tarihi" },
  { key: "updated_at", label: "Güncellenme Tarihi" },
];

const CategoriesPage = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
  const [isAddOperation, setIsAddOperation] = useState(true);
  const [selectedRow, setSelectedRow] = useState<Category | null>(null);

  const { fetchCategories, categories, loading, deleteCategory } =
    useCategoriesStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleRowClick = (row: any) => {
    setSelectedRow(row);
  };

  const handleAddClick = () => {
    setVisibleModal(true);
    setIsAddOperation(true);
  };

  const handleEditClick = () => {
    if (!selectedRow) return toast.error("Lütfen bir kategori seçin.");

    setVisibleModal(true);
    setIsAddOperation(false);
  };

  const handleDeleteClick = () => {
    if (!selectedRow) return toast.error("Lütfen bir kategori seçin.");

    setVisibleDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedRow) {
      deleteCategory(selectedRow?.id);
      setVisibleDeleteModal(false);
      setSelectedRow(null);
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <>
      <h2 className="lg:hidden block mb-5 text-3xl font-bold">Kategoriler</h2>
      <Actions
        onAdd={handleAddClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />
      <DataTable
        columns={columns}
        data={categories}
        selectedRow={selectedRow}
        onRowClick={handleRowClick}
      />

      <CategoriesModal
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
        message="Bu kategoriyi silmek istediğinize emin misiniz? Sildiğinizde bu kategoriye ait tüm veriler silinecektir."
      />
    </>
  );
};

export default CategoriesPage;
