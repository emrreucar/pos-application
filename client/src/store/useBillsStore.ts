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
  customer_id: number;
  total_amount: number;
  created_at: string;
  customer_name_surname: string;
  payment_method: string;
  cart_items: CartItem[];
}

interface ReportProduct {
  product_id: number;
  title: string;
  total_sold: number;
}
interface BillState {
  bills: Bill[];
  reportProducts: ReportProduct[];
  loading: boolean;
  fetchLoading: boolean;
  error: string | null;

  fetchBills: () => Promise<void>;
  createBill: (bill: any) => Promise<"success" | "error">;
  deleteBill: (billId: number) => Promise<void>;
  // updateBill: (bill: any, id: number) => Promise<void>;

  getReportProducts: () => Promise<void>;
}

export const useBillsStore = create<BillState>((set) => ({
  bills: [],
  reportProducts: [],
  loading: false,
  fetchLoading: false,
  error: null,

  fetchBills: async () => {
    try {
      set({ fetchLoading: true, error: null });
      const response = await axiosInstance.get("/bills");
      const formattedBills = response.data.map((bill: Bill) => ({
        ...bill,
        created_at: dayjs(bill.created_at).format("DD.MM.YYYY"),
      }));

      set({ bills: formattedBills });
      set({ fetchLoading: false });
    } catch (error) {
      console.log("Faturaları getirirken hata oluştu:", error);
      set({ fetchLoading: false, error: "Faturaları getirirken hata oluştu." });
    }
  },

  createBill: async (bill: CreateBill): Promise<"success" | "error"> => {
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
      return "success";
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Fatura oluşturulurken bir hata oluştu."
      );
      console.log("Fatura oluşturulurken hata oluştu:", error);
      set({ loading: false, error: "Fatura oluşturulurken hata oluştu." });
      return "error";
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

  getReportProducts: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get("/bills/report/products");

      set({ reportProducts: response.data });

      set({ loading: false });
    } catch (error) {
      console.log("Ürün raporu alınırken hata oluştu:", error);
      set({ loading: false, error: "Ürün raporu alınırken hata oluştu." });
    }
  },
}));
