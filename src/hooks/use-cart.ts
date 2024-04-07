import { TBasketVariantSchema, TBasketVariantsSchema } from '@/lib/validators/order';
import { persist, createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand';

type TUseCart = {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;

  cartData: TBasketVariantsSchema;
  addProduct: (variantData: TBasketVariantSchema) => void;
  removeProduct: (variantId: string) => void;

  setCart: (cart: TBasketVariantsSchema) => void;

  increaseQuantity: (variantId: string) => void;
  decreaseQuantity: (variantId: string) => void;

  isCustomFeatureMenuOpen: boolean;
  customFeatureVariantId: string | null;
  customFeatureMenuOnOpen: (id: string) => void;
  customFeatureMenuOnOpenChange: () => void;
};
export const useCart = create<TUseCart>()(
  persist(
    (set, get) => ({
      customFeatureVariantId: null,
      isCustomFeatureMenuOpen: false,
      customFeatureMenuOnOpen: (id) => set(() => ({ customFeatureVariantId: id, isCustomFeatureMenuOpen: true })),
      customFeatureMenuOnOpenChange: () => set(() => ({ isCustomFeatureMenuOpen: false })),

      isOpen: false,
      onOpen: () => set(() => ({ isOpen: true })),
      onOpenChange: () => set(() => ({ isOpen: false })),

      cartData: [],

      addProduct: (variantData) => {
        const isAdded = get().cartData.find((entry) => entry.variant.id === variantData.variant.id);
        if (isAdded) {
          set((state) => ({
            cartData: state.cartData.map((entry) => {
              if (entry.variant.id === variantData.variant.id) {
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
          cartData: state.cartData.filter((entry) => entry.variant.id !== variantId),
        })),

      setCart: (cart) =>
        set(() => ({
          cartData: cart,
        })),

      increaseQuantity: (variantId) =>
        set((state) => ({
          cartData: state.cartData.map((entry) => {
            if (entry.variant.id === variantId) {
              return { ...entry, quantity: entry.quantity + 1 };
            }
            return entry;
          }),
        })),

      decreaseQuantity: (variantId) => {
        const product = get().cartData.find((entry) => entry.variant.id === variantId);
        if (!product) return;
        if (product.quantity === 1) {
          set((state) => ({
            cartData: state.cartData.filter((entry) => entry.variant.id !== variantId),
          }));
        } else {
          set((state) => ({
            cartData: state.cartData.map((entry) => {
              if (entry.variant.id === variantId) {
                return { ...entry, quantity: entry.quantity - 1 };
              }
              return entry;
            }),
          }));
        }
      },
    }),
    {
      name: 'oleje-koszyk',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
