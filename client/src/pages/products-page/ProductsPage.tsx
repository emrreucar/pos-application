import { useEffect, useState } from "react";
import DataTable from "../../components/ui/Table";
import { Product, useProductsStore } from "../../store/useProductsStore";
import { toast } from "react-toastify";
import ProductsModal from "./_components/ProductsModal";
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal";
import Actions from "./_components/Actions";
import Switch from "../../components/ui/Switch";
import PageLoader from "../../components/ui/PageLoader";

const columns: {
  key:
    | "id"
    | "image_url"
    | "title"
    | "price"
    | "category_name"
    | "stock"
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
  { key: "stock", label: "Stok" },
  { key: "created_at", label: "Oluşturulma Tarihi" },
  { key: "updated_at", label: "Güncellenme Tarihi" },
];

const ProductsPage = () => {
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
  const [visibleProductsModal, setVisibleProductsModal] = useState(false);
  const [isAddOperation, setIsAddOperation] = useState(true);
  const [selectedRow, setSelectedRow] = useState<Product | null>(null);

  const [checked, setChecked] = useState(true);

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

  const activeProducts = products.filter((product) => product.status);
  const inactiveProducts = products.filter((product) => !product.status);

  if (loading) return <PageLoader />;

  return (
    <>
      <h2 className="lg:hidden block mb-5 text-3xl font-bold">Ürünler</h2>
      <div className="flex items-center justify-between mb-4 base__card__container">
        <Actions
          onAdd={handleAddClick}
          addTitle="Ürün Ekle"
          onEdit={handleEditClick}
          editTitle="Ürün Düzenle"
          onDelete={handleDeleteClick}
          deleteTitle="Ürün Durumunu Pasifleştir"
        />
        <Switch
          text={`${checked ? "Aktif" : "Pasif"}`}
          isChecked={checked}
          onChange={() => {
            setChecked(!checked);
          }}
        />
      </div>
      <DataTable
        columns={columns}
        data={checked ? activeProducts : inactiveProducts}
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
        message="Ürün durumu pasife çekilecek. Devam etmek istiyor musunuz?"
        buttonText="Pasife Çek"
      />
    </>
  );
};

export default ProductsPage;
