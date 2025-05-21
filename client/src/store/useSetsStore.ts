import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export interface PaymentMethods {
  id: number;
  name: string;
}

interface SetsState {
  paymentMethods: PaymentMethods[];
  loading: boolean;
  error: string | null;

  fetchPaymentMethods: () => Promise<void>;
}

export const useSetsStore = create<SetsState>((set) => ({
  paymentMethods: [],
  loading: false,
  error: null,

  fetchPaymentMethods: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get("/payment-methods");

      set({ paymentMethods: response.data });
    } catch (error) {
      set({ error: "Error fetching payment methods" });
    } finally {
      set({ loading: false });
    }
  },
}));
