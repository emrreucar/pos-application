import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone_number: string;
  company_name: string;
  username: string;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  authReady: boolean;
  error: string | null;
  login: (data: { username: string; password: string }) => Promise<boolean>;
  signUp: (data: {
    name: string;
    surname: string;
    company_name: string;
    phone_number: string;
    username: string;
    email: string;
    password: string;
  }) => Promise<boolean>; // kayıt formuna göre tip tanımlayacağım.
  logout: () => void;
  checkAuth: () => Promise<User | null>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  authReady: false,
  error: null,

  login: async ({ username, password }) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.post("/auth/login", {
        username,
        password,
      });

      const token = response.data.token; // backend'den token döndüreceğim
      const user = response.data.user; // backend'den user döndüreceğim

      localStorage.setItem("token", token);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      toast.success("Giriş Başarılı!");

      set({ user, token, loading: false });

      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Bir hata oluştu",
        loading: false,
      });
      toast.error(error.response?.data?.message || "Bir hata oluştu");

      return false;
    }
  },

  signUp: async ({
    name,
    surname,
    company_name,
    phone_number,
    username,
    email,
    password,
  }) => {
    try {
      set({ loading: true, error: null });
      await axiosInstance.post("/auth/register", {
        name,
        surname,
        company_name,
        phone_number,
        username,
        email,
        password,
      });

      toast.success("Kayıt Başarılı!");

      set({ loading: false });

      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Bir hata oluştu",
        loading: false,
      });
      toast.error(error.response?.data?.message || "Bir hata oluştu");
      return false;
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });
      await axiosInstance.post("/auth/logout");
      localStorage.removeItem("token");
      delete axiosInstance.defaults.headers.common["Authorization"];
      set({ user: null, token: null, loading: false });
      toast.success("Çıkış Başarılı!");
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Bir hata oluştu",
        loading: false,
      });
      toast.error(error.response?.data?.message || "Bir hata oluştu");
    }
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        set({ user: null, token: null, authReady: true });
        return;
      }

      const res = await axiosInstance.get("/check-auth");
      set({ user: res.data, token, authReady: true });
      return res.data;
    } catch (error) {
      set({ user: null, token: null, authReady: true });
    }
  },
}));
