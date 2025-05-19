import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";

export interface Product {
  id: number;
  image_url: string;
  category_id: number;
  title: string;
  price: number;
  category_name: string;
  created_at: string;
  updated_at: string;
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  createProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product, id: number) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  getProductsByCategoryId: (categoryId: number) => Promise<Product | null>;
  getProductsBySearch: (search: string) => Promise<Product[]>;
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get("/products");

      const formattedProducts = response.data.map((product: Product) => ({
        ...product,
        price: Number(product.price),
        created_at: dayjs(product.created_at).format("DD.MM.YYYY"),
        updated_at: dayjs(product.updated_at).format("DD.MM.YYYY"),
      }));

      set({ products: formattedProducts });
      set({ loading: false });
    } catch (error) {
      console.log("Ürünleri getirirken hata oluştu:", error);
      set({ loading: false, error: "Ürünleri getirirken hata oluştu." });
    }
  },

  createProduct: async (product: Product) => {
    try {
      set({ loading: true, error: null });

      const formData = new FormData();

      Object.keys(product).forEach((key) => {
        const typedKey = key as keyof Product;

        const value: any = product[typedKey];

        if (key === "productImage" && value instanceof File) {
          formData.append("productImage", value);
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      const response = await axiosInstance.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const formattedData = {
        ...response.data,
        price: Number(response.data.price),
        created_at: dayjs(response.data.created_at).format("DD.MM.YYYY"),
        updated_at: dayjs(response.data.updated_at).format("DD.MM.YYYY"),
      };

      set((state) => ({
        products: [...state.products, formattedData],
        loading: false,
      }));

      toast.success("Ürün başarıyla eklendi.");
    } catch (error) {
      console.log("Ürün eklerken hata oluştu:", error);
      set({ loading: false, error: "Ürün eklerken hata oluştu." });
      toast.error("Ürün eklerken hata oluştu. catch bloğu");
    }
  },

  updateProduct: async (product: Product, id: number) => {
    try {
      set({ loading: true, error: null });

      const formData = new FormData();

      Object.keys(product).forEach((key) => {
        const typedKey = key as keyof Product;

        const value: any = product[typedKey];

        if (key === "productImage" && value instanceof File) {
          formData.append("productImage", value);
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      const response = await axiosInstance.put(`/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const formattedData = {
        ...response.data,
        price: Number(response.data.price),
        created_at: dayjs(response.data.created_at).format("DD.MM.YYYY"),
        updated_at: dayjs(response.data.updated_at).format("DD.MM.YYYY"),
      };

      set((state) => ({
        products: state.products.map((item) =>
          item.id === id ? formattedData : item
        ),
        loading: false,
      }));

      toast.success("Ürün başarıyla güncellendi.");
    } catch (error) {
      console.log("Ürün güncellerken hata oluştu:", error);
      set({ loading: false, error: "Ürün güncellerken hata oluştu." });
      toast.error("Ürün güncellerken hata oluştu. catch bloğu");
    }
  },

  deleteProduct: async (id: number) => {},
  getProductsByCategoryId: async (categoryId: number) => {},
  getProductsBySearch: async (search: string) => {},
}));
