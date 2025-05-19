import { Controller, useForm } from "react-hook-form";
import Input from "../../../components/ui/Input";
import Modal from "../../../components/ui/Modal";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Product, useProductsStore } from "../../../store/useProductsStore";
import Select from "../../../components/ui/Select";
import { useCategoriesStore } from "../../../store/useCategoriesStore";
import PreviewCard from "./PreviewCard";

const schema = yup.object({
  title: yup.string().required("Ürün adı zorunludur"),
  price: yup.number().required("Fiyat zorunludur"),
  productImage: yup.string().optional(),
  category_id: yup.number().required("Kategori seçimi zorunludur"),
});

type FormData = {
  title: string;
  price: number | null;
  productImage?: string;
  category_id: number | null;
};

const ProductsModal = ({
  visible,
  onClose,
  isAddOperation,
  selectedRow,
  setSelectedRow,
}: {
  visible: boolean;
  onClose: () => void;
  isAddOperation: boolean;
  selectedRow: Product | null;
  setSelectedRow: (row: Product | null | any) => void;
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { fetchCategories, categories } = useCategoriesStore();
  const { createProduct, updateProduct, loading } = useProductsStore();

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData | any>({
    resolver: yupResolver(schema),
  });

  const watchTitle = watch("title");
  const watchPrice = watch("price");

  useEffect(() => {
    if (!isAddOperation && selectedRow) {
      setValue("title", selectedRow.title);
      setValue("price", selectedRow.price);
      setValue("productImage", selectedRow.image_url);
      setValue("category_id", selectedRow.category_id);
      setPreviewImage(
        selectedRow.image_url
          ? import.meta.env.VITE_BASE_IMAGE_URL + selectedRow.image_url
          : null
      );
    } else {
      setValue("title", "");
      setValue("price", null);
      setValue("productImage", "");
      setValue("category_id", null);
    }
  }, [selectedRow, isAddOperation]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const categoriesOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const onSubmit = async (data: FormData) => {
    const payload = {
      title: data.title,
      price: data.price,
      category_id: data.category_id,
      productImage: selectedImage,
    };

    console.log("Payload:", payload);

    if (!isAddOperation) {
      await updateProduct(payload as any, selectedRow?.id as number);
    } else {
      await createProduct(payload as any);
    }

    try {
      onClose();
      setSelectedRow(null);
    } catch (error) {
      console.error("Kategori ekleme hatası:", error);
    }
  };

  // Handle image change
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }

    if (isAddOperation) {
      setValue("productImage", file, { shouldValidate: true });
    }

    // if (file && file.size > 2 * 1024 * 1024) {
    //   alert("Dosya boyutu 2MB'den büyük olamaz.");
    //   setValue("productImage", "");
    // }
  };

  // Reset form values
  const resetValues = () => {
    setValue("title", "");
    setValue("price", null);
    setValue("productImage", "");
    setValue("category_id", null);
    errors.title = undefined;
    errors.price = undefined;
    errors.category_id = undefined;
    errors.productImage = undefined;

    setSelectedRow(null);
  };

  return (
    <Modal
      open={visible}
      title={isAddOperation ? "Ürün Ekle" : "Ürün Düzenle"}
      onClose={() => {
        onClose();
        resetValues();
      }}
      onConfirm={() => {
        handleSubmit(onSubmit)();
      }}
      loading={loading}
      height="h-[50vh]"
      width="max-w-[50%]"
    >
      <section className="flex justify-between gap-10">
        <PreviewCard
          image={previewImage}
          title={watchTitle}
          price={watchPrice}
        />

        <form className="space-y-4 w-full" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Ürün Adı"
            value={watchTitle}
            {...register("title")}
            errorMessage={errors.title?.message as string}
          />
          <Input
            label="Ürün Fiyatı"
            value={watchPrice}
            {...register("price")}
            errorMessage={errors.price?.message as string}
          />

          <Controller
            name="category_id"
            control={control}
            render={({ field }) => (
              <Select
                label="Kategori Seçiniz"
                value={field.value}
                onChange={field.onChange}
                options={categoriesOptions}
                placeholder="Kategori Ara.."
                errorMessage={errors.category_id?.message as string}
              />
            )}
          />

          {/* Image Upload */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ürün Görseli
            </label>

            <div className="flex items-center gap-4">
              <label
                htmlFor={
                  isAddOperation ? "productImageAdd" : "productImageEdit"
                }
                className="flex flex-col items-center justify-center w-full max-w-xs h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors duration-200 bg-gray-50"
              >
                <input
                  type="file"
                  id={isAddOperation ? "productImageAdd" : "productImageEdit"}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <span className="text-sm text-gray-500">
                  Resim yüklemek için tıklayın
                </span>
              </label>

              {/* Önizleme */}
              {previewImage && (
                <div className="relative w-28 h-28 rounded overflow-hidden border shadow-sm">
                  <img
                    src={previewImage}
                    alt="Yüklenen görsel"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </form>
      </section>
    </Modal>
  );
};

export default ProductsModal;
