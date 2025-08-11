import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  created_at: string;
  updated_at: string;
  name: string;
  surname: string;
  company_name: string;
  phone_number: string;
}

interface UsersState {
  users: User[];
  loading: boolean;
  fetchLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  updateUser: (user: User, id: number) => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  loading: false,
  fetchLoading: false,
  error: null,

  fetchUsers: async () => {
    try {
      set({ fetchLoading: true, error: null });
      const response = await axiosInstance.get("/users");

      const formattedUsers = response.data.map((user: User) => ({
        ...user,
        created_at: dayjs(user.created_at).format("DD.MM.YYYY"),
        updated_at: dayjs(user.updated_at).format("DD.MM.YYYY"),
      }));

      set({ users: formattedUsers });
      set({ fetchLoading: false });
    } catch (error) {
      console.log("Kullanıcıları getirirken hata oluştu:", error);
      set({
        fetchLoading: false,
        error: "Kullanıcıları getirirken hata oluştu.",
      });
    }
  },

  updateUser: async (user: User, id: number) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.put(`/users/${id}`, user);

      const updatedUser = {
        ...response.data,
        created_at: dayjs(response.data.created_at).format("DD.MM.YYYY"),
        updated_at: dayjs(response.data.updated_at).format("DD.MM.YYYY"),
      };

      set((state) => ({
        users: state.users.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        ),
        loading: false,
      }));
      toast.success("Kullanıcı başarıyla güncellendi.");
    } catch (error: any) {
      console.log("Kullanıcı güncellerken hata oluştu:", error);
      set({ loading: false, error: "Kullanıcı güncellerken hata oluştu." });
      toast.error(
        error?.response?.data?.message || "Kullanıcı güncellerken hata oluştu."
      );
    }
  },

  deleteUser: async (userId: number) => {
    try {
      set({ loading: true, error: null });
      await axiosInstance.delete(`/users/${userId}`);

      set((state) => ({
        users: state.users.filter((cat) => cat.id !== userId),
        loading: false,
      }));
      toast.success("Kullanıcı başarıyla silindi.");
    } catch (error: any) {
      console.log("Kullanıcı silerken hata oluştu:", error);
      set({ loading: false, error: "Kullanıcı silerken hata oluştu." });
      toast.error(
        error?.response?.data?.message || "Kullanıcı silerken hata oluştu."
      );
    }
  },
}));
