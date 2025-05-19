import { useEffect, useState } from "react";
import DataTable from "../../components/ui/Table";
import { useProductsStore } from "../../store/useProductsStore";
import Actions from "../../components/ui/Actions";
import { toast } from "react-toastify";
import ProductsModal from "./_components/ProductsModal";

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
  const [visibleProductsModal, setVisibleProductsModal] = useState(false);
  const [isAddOperation, setIsAddOperation] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);

  const { products, fetchProducts, loading } = useProductsStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRowClick = (row: any) => {
    setSelectedRow(row);
    // getProductById(row.id);
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
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
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
    </>
  );
};

export default ProductsPage;
