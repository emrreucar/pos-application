import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";

interface CreateBill {
  customer_id: number;
  payment_method_id: number;
  cart_items: {
    product_id: number;
    title: string;
    quantity: number;
    unit_price: number;
  }[];
}

export interface CartItem {
  bill_id: number;
  title: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Bill {
  id: number;
  total_amount: number;
  created_at: string;
  customer_name_surname: string;
  payment_method: string;
  cart_items: CartItem[];
}

interface BillState {
  bills: any[];
  loading: boolean;
  error: string | null;

  fetchBills: () => Promise<void>;
  createBill: (bill: any) => Promise<void>;
  deleteBill: (billId: number) => Promise<void>;
  // updateBill: (bill: any, id: number) => Promise<void>;
}

export const useBillsStore = create<BillState>((set) => ({
  bills: [],
  loading: false,
  error: null,

  fetchBills: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get("/bills");
      const formattedBills = response.data.map((bill: Bill) => ({
        ...bill,
        created_at: dayjs(bill.created_at).format("DD.MM.YYYY"),
      }));

      set({ bills: formattedBills });
      set({ loading: false });
    } catch (error) {
      console.log("Faturaları getirirken hata oluştu:", error);
      set({ loading: false, error: "Faturaları getirirken hata oluştu." });
    }
  },

  createBill: async (bill: CreateBill) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.post("/bills", bill);

      const newBill = {
        ...response.data,
        created_at: dayjs(response.data.created_at).format("DD.MM.YYYY"),
      };

      set((state) => ({
        bills: [...state.bills, newBill],
        loading: false,
      }));

      toast.success("Fatura başarıyla oluşturuldu.");
    } catch (error) {
      console.log("Fatura oluşturulurken hata oluştu:", error);
      set({ loading: false, error: "Fatura oluşturulurken hata oluştu." });
    }
  },

  deleteBill: async (billId: number) => {
    try {
      set({ loading: true, error: null });
      await axiosInstance.delete(`/bills/${billId}`);

      set((state) => ({
        bills: state.bills.filter((bill) => bill.id !== billId),
        loading: false,
      }));

      toast.success("Fatura başarıyla silindi.");
    } catch (error) {
      console.log("Fatura silinirken hata oluştu:", error);
      set({ loading: false, error: "Fatura silinirken hata oluştu." });
    }
  },
  // updateBill: async (bill: any, id: number) => {},
}));
