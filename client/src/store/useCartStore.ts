import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "./useProductsStore";
import { toast } from "react-toastify";

interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

interface CartStore {
  cartItems: CartItem[];
  addToCart: (item: Product) => void;
  changeQuantity: (itemId: number, quantity: number) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  getCart: () => CartItem[];
  totalPrice: () => number;
  getTotalQuantity: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],

      // Add item to cart
      addToCart: (product) => {
        const existingItem = get().cartItems.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          set({
            cartItems: get().cartItems.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            cartItems: [
              ...get().cartItems,
              {
                id: product.id,
                quantity: 1,
                product,
              },
            ],
          });
        }

        toast.success("Ürün sepete eklendi!");
      },

      // Change item quantity
      changeQuantity: (itemId, quantity) => {
        set((state) => {
          const existingItem = state.cartItems.find(
            (item) => item.id === itemId
          );
          if (!existingItem) return state;

          if (quantity <= 0) {
            return {
              cartItems: state.cartItems.filter((item) => item.id !== itemId),
            };
          }

          return {
            cartItems: state.cartItems.map((item) =>
              item.id === itemId ? { ...item, quantity } : item
            ),
          };
        });
      },

      // Remove item from cart
      removeFromCart: (itemId) => {
        set({
          cartItems: get().cartItems.filter((item) => item.id !== itemId),
        });
        toast.success("Ürün sepetten çıkarıldı!");
      },

      // Calculate total price
      totalPrice: () => {
        return get().cartItems.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      // Clear cart
      clearCart: () => {
        set({ cartItems: [] });
        toast.success("Sepet temizlendi!");
      },

      // Get cart items
      getCart: () => get().cartItems,

      // Get total quantity
      getTotalQuantity: () => {
        return get().cartItems.reduce(
          (total, item) => total + item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
