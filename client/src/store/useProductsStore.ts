import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";

export interface Product {
  id: number;
  image_url: string;
  category_id: number;
  title: string;
  price: number;
  category_name: string;
  stock: number;
  status: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  fetchLoading: boolean;
  error: string | null;
  isSearchMode?: boolean;
  fetchProducts: () => Promise<void>;
  createProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product, id: number) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  getProductsByCategoryId: (categoryId: number) => Promise<Product | null>;
  getProductsBySearch: (search: string) => Promise<void>;
}

const debouncedFetch = debounce(async (search: string, set: any) => {
  try {
    set({ loading: true, error: null });

    const response = await axiosInstance.get(
      `/search-products?search=${search}`
    );

    const formattedProducts = response.data.map((product: Product) => ({
      ...product,
      price: Number(product.price),
      created_at: dayjs(product.created_at).format("DD.MM.YYYY"),
      updated_at: dayjs(product.updated_at).format("DD.MM.YYYY"),
    }));

    set({ products: formattedProducts, loading: false, isSearchMode: true });
  } catch (error) {
    console.log("Ürünleri ararken hata oluştu:", error);
    set({
      loading: false,
      error: "Ürünleri ararken hata oluştu.",
      products: [],
      isSearchMode: true,
    });
  }
}, 500);

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  loading: false,
  error: null,
  fetchLoading: false,

  // Fetch all products
  fetchProducts: async () => {
    try {
      set({ fetchLoading: true, error: null });
      const response = await axiosInstance.get("/products");

      const formattedProducts = response.data.map((product: Product) => ({
        ...product,
        price: Number(product.price),
        created_at: dayjs(product.created_at).format("DD.MM.YYYY"),
        updated_at: dayjs(product.updated_at).format("DD.MM.YYYY"),
      }));

      set({
        products: formattedProducts,
        fetchLoading: false,
        isSearchMode: false,
      });
    } catch (error) {
      console.log("Ürünleri getirirken hata oluştu:", error);
      set({ fetchLoading: false, error: "Ürünleri getirirken hata oluştu." });
    }
  },

  // Create a new product
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
        products: [formattedData, ...state.products],
        loading: false,
        isSearchMode: false,
      }));

      toast.success("Ürün başarıyla eklendi.");
    } catch (error: any) {
      console.log("Ürün eklerken hata oluştu:", error);
      set({ loading: false, error: "Ürün eklerken hata oluştu." });
      toast.error(
        error?.response?.data?.message ||
          "Ürün eklerken hata oluştu. catch bloğu"
      );
    }
  },

  // Update a product by ID
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
        isSearchMode: false,
      }));

      toast.success("Ürün başarıyla güncellendi.");
    } catch (error: any) {
      console.log("Ürün güncellerken hata oluştu:", error);
      set({ loading: false, error: "Ürün güncellerken hata oluştu." });
      toast.error(
        error?.response?.data?.message || "Ürün güncellerken hata oluştu."
      );
    }
  },

  // Status: passive
  deleteProduct: async (id: number) => {
    try {
      set({ loading: true, error: null });

      await axiosInstance.delete(`/products/${id}`);

      set((state) => ({
        products: state.products.map((item) =>
          item.id === id ? { ...item, status: false } : item
        ),
        loading: false,
        isSearchMode: false,
      }));

      toast.success("Ürün durumu pasife çekildi.");
    } catch (error: any) {
      console.log("Ürün pasife çekilirken hata oluştu:", error);
      set({ loading: false, error: "Ürün pasife çekilirken hata oluştu." });
      toast.error(
        error?.response?.data?.message || "Ürün pasife çekilirken hata oluştu."
      );
    }
  },

  // Fetch products by category ID
  getProductsByCategoryId: async (categoryId: number) => {
    try {
      set({ loading: true, error: null });

      const response = await axiosInstance.get(
        `/products/category/${categoryId}`
      );

      const formattedProducts = response.data.map((product: Product) => ({
        ...product,
        price: Number(product.price),
        created_at: dayjs(product.created_at).format("DD.MM.YYYY"),
        updated_at: dayjs(product.updated_at).format("DD.MM.YYYY"),
      }));

      set({ products: formattedProducts, loading: false });

      return formattedProducts;
    } catch (error) {
      console.log("Ürünleri kategoriye göre getirirken hata oluştu:", error);
      set({
        products: [],
        loading: false,
        error: "Ürünleri kategoriye göre getirirken hata oluştu.",
        isSearchMode: true,
      });
    }
  },

  // Fetch products by search term
  getProductsBySearch: async (search: string) => {
    debouncedFetch(search, set);
  },
}));
