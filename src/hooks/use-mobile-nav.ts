import { create } from 'zustand';

type TUseMobileNav = {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
};
export const useMobileNav = create<TUseMobileNav>()((set) => ({
  isOpen: false,
  onOpenChange: () => set(() => ({ isOpen: false })),
  onOpen: () => set(() => ({ isOpen: true })),
}));
