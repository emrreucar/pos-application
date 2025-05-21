import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";

export interface Customer {
  id: number;
  name: string;
  surname: string;
  email?: string;
  phone_number?: string;
  address?: string;
  tc_no?: string;
  created_at: string;
  updated_at: string;
}

interface CustomersState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
  createCustomer: (customer: Customer) => Promise<void>;
  updateCustomer: (customer: Customer, id: number) => Promise<void>;
  deleteCustomer: (customerId: number) => Promise<void>;
}

export const useCustomersStore = create<CustomersState>((set) => ({
  customers: [],
  loading: false,
  error: null,

  fetchCustomers: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get("/customers");

      const formattedCustomers = response.data.map((customer: Customer) => ({
        ...customer,
        created_at: dayjs(customer.created_at).format("DD.MM.YYYY"),
        updated_at: dayjs(customer.updated_at).format("DD.MM.YYYY"),
      }));

      set({ customers: formattedCustomers });
      set({ loading: false });
    } catch (error) {
      console.log("Müşterileri getirirken hata oluştu:", error);
      set({ loading: false, error: "Müşterileri getirirken hata oluştu." });
    }
  },

  createCustomer: async (customer: Customer) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.post("/customers", customer);

      const newCustomer = {
        ...response.data,
        created_at: dayjs(response.data.created_at).format("DD.MM.YYYY"),
        updated_at: dayjs(response.data.updated_at).format("DD.MM.YYYY"),
      };

      set((state) => ({
        customers: [...state.customers, newCustomer],
        loading: false,
      }));
      toast.success("Müşteri başarıyla eklendi.");
    } catch (error: any) {
      console.log("Müşteri eklerken hata oluştu:", error);
      set({ loading: false, error: "Müşteri eklerken hata oluştu." });
      toast.error(
        error?.response?.data?.message || "Müşteri eklerken hata oluştu."
      );
    }
  },

  updateCustomer: async (customer: Customer, id: number) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.put(`/customers/${id}`, customer);

      const updatedCustomer = {
        ...response.data,
        created_at: dayjs(response.data.created_at).format("DD.MM.YYYY"),
        updated_at: dayjs(response.data.updated_at).format("DD.MM.YYYY"),
      };

      set((state) => ({
        customers: state.customers.map((customer) =>
          customer.id === updatedCustomer.id ? updatedCustomer : customer
        ),
        loading: false,
      }));
      toast.success("Müşteri başarıyla güncellendi.");
    } catch (error: any) {
      console.log("Müşteri güncellerken hata oluştu:", error);
      set({ loading: false, error: "Müşteri güncellerken hata oluştu." });
      toast.error(
        error?.response?.data?.message || "Müşteri güncellerken hata oluştu."
      );
    }
  },

  deleteCustomer: async (customerId: number) => {
    try {
      set({ loading: true, error: null });
      await axiosInstance.delete(`/customers/${customerId}`);

      set((state) => ({
        customers: state.customers.filter((cat) => cat.id !== customerId),
        loading: false,
      }));
      toast.success("Müşteri başarıyla silindi.");
    } catch (error: any) {
      console.log("Müşteri silerken hata oluştu:", error);
      set({ loading: false, error: "Müşteri silerken hata oluştu." });
      toast.error(
        error?.response?.data?.message || "Müşteri silerken hata oluştu."
      );
    }
  },
}));
