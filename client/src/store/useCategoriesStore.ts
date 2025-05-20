import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";

export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  createCategory: (category: Category) => Promise<void>;
  updateCategory: (category: Category, id: number) => Promise<void>;
  deleteCategory: (categoryId: number) => Promise<void>;
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get("/categories");

      const formattedCategories = response.data.map((cat: Category) => ({
        ...cat,
        created_at: dayjs(cat.created_at).format("DD.MM.YYYY"),
        updated_at: dayjs(cat.updated_at).format("DD.MM.YYYY"),
      }));

      set({ categories: formattedCategories });
      set({ loading: false });
    } catch (error) {
      console.log("Kategorileri getirirken hata oluştu:", error);
      set({ loading: false, error: "Kategorileri getirirken hata oluştu." });
    }
  },

  createCategory: async (category: Category) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.post("/categories", category);

      const newCategory = {
        ...response.data,
        created_at: dayjs(response.data.created_at).format("DD.MM.YYYY"),
        updated_at: dayjs(response.data.updated_at).format("DD.MM.YYYY"),
      };

      set((state) => ({
        categories: [...state.categories, newCategory],
        loading: false,
      }));
      toast.success("Kategori başarıyla eklendi.");
    } catch (error: any) {
      console.log("Kategori eklerken hata oluştu:", error);
      set({ loading: false, error: "Kategori eklerken hata oluştu." });
      toast.error(
        error?.response?.data?.message || "Kategori eklerken hata oluştu."
      );
    }
  },

  updateCategory: async (category: Category, id: number) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.put(`/categories/${id}`, category);

      const updatedCategory = {
        ...response.data,
        created_at: dayjs(response.data.created_at).format("DD.MM.YYYY"),
        updated_at: dayjs(response.data.updated_at).format("DD.MM.YYYY"),
      };

      set((state) => ({
        categories: state.categories.map((cat) =>
          cat.id === updatedCategory.id ? updatedCategory : cat
        ),
        loading: false,
      }));
      toast.success("Kategori başarıyla güncellendi.");
    } catch (error: any) {
      console.log("Kategori güncellerken hata oluştu:", error);
      set({ loading: false, error: "Kategori güncellerken hata oluştu." });
      toast.error(
        error?.response?.data?.message || "Kategori güncellerken hata oluştu."
      );
    }
  },

  deleteCategory: async (categoryId: number) => {
    try {
      set({ loading: true, error: null });
      await axiosInstance.delete(`/categories/${categoryId}`);

      set((state) => ({
        categories: state.categories.filter((cat) => cat.id !== categoryId),
        loading: false,
      }));
      toast.success("Kategori başarıyla silindi.");
    } catch (error: any) {
      console.log("Kategori silerken hata oluştu:", error);
      set({ loading: false, error: "Kategori silerken hata oluştu." });
      toast.error(
        error?.response?.data?.message || "Kategori silerken hata oluştu."
      );
    }
  },
}));
