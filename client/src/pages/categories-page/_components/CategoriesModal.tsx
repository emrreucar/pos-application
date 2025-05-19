import { useForm } from "react-hook-form";
import Input from "../../../components/ui/Input";
import Modal from "../../../components/ui/Modal";
import {
  Category,
  useCategoriesStore,
} from "../../../store/useCategoriesStore";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";

const schema = yup.object({
  name: yup.string().required("Kategori adı zorunludur"),
});

type FormData = yup.InferType<typeof schema>;

const CategoriesModal = ({
  visible,
  onClose,
  isAddOperation,
  selectedRow,
  setSelectedRow,
}: {
  visible: boolean;
  onClose: () => void;
  isAddOperation: boolean;
  selectedRow: Category | null;
  setSelectedRow: (row: Category | null | any) => void;
}) => {
  const { createCategory, updateCategory, loading } = useCategoriesStore();

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const watchCategoryName = watch("name");

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        name: data.name,
      };

      if (isAddOperation) {
        await createCategory(payload as Category);
      } else {
        await updateCategory(payload as Category, selectedRow?.id as number);
      }
      onClose();
      setSelectedRow(null);
      setValue("name", "");
    } catch (error) {
      console.error("Kategori ekleme hatası:", error);
    }
  };

  useEffect(() => {
    if (!isAddOperation && selectedRow) {
      setValue("name", selectedRow.name);
    } else {
      setValue("name", "");
    }
  }, [selectedRow, isAddOperation]);

  return (
    <Modal
      open={visible}
      title={isAddOperation ? "Kategori Ekle" : "Kategori Düzenle"}
      onClose={onClose}
      onConfirm={() => {
        handleSubmit(onSubmit)();
      }}
      loading={loading}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Kategori Adı"
          value={watchCategoryName}
          {...register("name")}
          errorMessage={errors.name?.message}
        />
      </form>
    </Modal>
  );
};

export default CategoriesModal;
