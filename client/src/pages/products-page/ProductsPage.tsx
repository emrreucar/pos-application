import { useEffect, useState } from "react";
import DataTable from "../../components/ui/Table";
import { Product, useProductsStore } from "../../store/useProductsStore";
import Actions from "../../components/ui/Actions";
import { toast } from "react-toastify";
import ProductsModal from "./_components/ProductsModal";
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal";

const columns: {
  key:
    | "id"
    | "image_url"
    | "title"
    | "price"
    | "category_name"
    | "created_at"
    | "updated_at";
  label: string;
  isImage?: boolean;
}[] = [
  { key: "image_url", label: "Görsel", isImage: true },
  //   { key: "id", label: "ID" },
  { key: "title", label: "Ürün Adı" },
  { key: "price", label: "Fiyat" },
  { key: "category_name", label: "Kategori" },
  { key: "created_at", label: "Oluşturulma Tarihi" },
  { key: "updated_at", label: "Güncellenme Tarihi" },
];

const ProductsPage = () => {
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
  const [visibleProductsModal, setVisibleProductsModal] = useState(false);
  const [isAddOperation, setIsAddOperation] = useState(true);
  const [selectedRow, setSelectedRow] = useState<Product | null>(null);

  const { products, deleteProduct, fetchProducts, loading } =
    useProductsStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRowClick = (row: any) => {
    setSelectedRow(row);
  };

  const handleAddClick = () => {
    setVisibleProductsModal(true);
    setIsAddOperation(true);
  };

  const handleEditClick = () => {
    if (!selectedRow) return toast.error("Lütfen bir ürün seçin.");

    setVisibleProductsModal(true);
    setIsAddOperation(false);
  };

  const handleDeleteClick = () => {
    if (!selectedRow) return toast.error("Lütfen bir ürün seçin.");

    setVisibleDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedRow) {
      deleteProduct(selectedRow?.id);
      setVisibleDeleteModal(false);
      setSelectedRow(null);
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <>
      <h2 className="lg:hidden block mb-5 text-3xl font-bold">Ürünler</h2>
      <Actions
        onAdd={handleAddClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />
      <DataTable
        columns={columns}
        data={products}
        selectedRow={selectedRow}
        onRowClick={handleRowClick}
      />

      <ProductsModal
        visible={visibleProductsModal}
        onClose={() => setVisibleProductsModal(false)}
        isAddOperation={isAddOperation}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
      <ConfirmDeleteModal
        open={visibleDeleteModal}
        onClose={() => setVisibleDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        message="Bu ürünü silmek istediğinize emin misiniz?"
      />
    </>
  );
};

export default ProductsPage;
