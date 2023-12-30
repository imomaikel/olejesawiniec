import { persist, createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand';

export type TCartItem = {
  image: string | null;
  productLabel: string;
  productLink: string;
  quantity: number;
  variantUnit: string;
  variantCapacity: number;
  variantPrice: number;
  variantId: string;
};

type TUseCart = {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;

  cartData: TCartItem[];
  addProduct: (variantData: TCartItem) => void;
  removeProduct: (variantId: string) => void;

  increaseQuantity: (variantId: string) => void;
  decreaseQuantity: (variantId: string) => void;
};
export const useCart = create<TUseCart>()(
  persist(
    (set, get) => ({
      isOpen: false,
      onOpen: () => set(() => ({ isOpen: true })),
      onOpenChange: () => set(() => ({ isOpen: false })),

      cartData: [],

      addProduct: (variantData) => {
        const isAdded = get().cartData.find((entry) => entry.variantId === variantData.variantId);
        if (isAdded) {
          set((state) => ({
            cartData: state.cartData.map((entry) => {
              if (entry.variantId === variantData.variantId) {
                return {
                  ...entry,
                  quantity: entry.quantity + 1,
                };
              }
              return entry;
            }),
          }));
        } else {
          set((state) => ({
            cartData: [...state.cartData, variantData],
          }));
        }
      },

      removeProduct: (variantId) =>
        set((state) => ({
          cartData: state.cartData.filter((entry) => entry.variantId !== variantId),
        })),

      increaseQuantity: (variantId) =>
        set((state) => ({
          cartData: state.cartData.map((entry) => {
            if (entry.variantId === variantId) {
              return { ...entry, quantity: entry.quantity + 1 };
            }
            return entry;
          }),
        })),

      decreaseQuantity: (variantId) => {
        const product = get().cartData.find((entry) => entry.variantId === variantId);
        if (!product) return;
        if (product.quantity === 1) {
          set((state) => ({
            cartData: state.cartData.filter((entry) => entry.variantId !== variantId),
          }));
        } else {
          set((state) => ({
            cartData: state.cartData.map((entry) => {
              if (entry.variantId === variantId) {
                return { ...entry, quantity: entry.quantity - 1 };
              }
              return entry;
            }),
          }));
        }
      },
    }),
    {
      name: 'cart',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
