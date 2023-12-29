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
};
export const useCart = create<TUseCart>()((set) => ({
  isOpen: false,
  onOpenChange: () => set(() => ({ isOpen: false })),
  onOpen: () => set(() => ({ isOpen: true })),

  cartData: [],
  addProduct: (variantData) =>
    set((state) => ({
      cartData: [...state.cartData, variantData],
    })),

  removeProduct: (variantId) =>
    set((state) => ({
      cartData: state.cartData.filter((entry) => entry.variantId !== variantId),
    })),
}));
