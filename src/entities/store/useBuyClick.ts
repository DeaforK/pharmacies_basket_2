import { create } from 'zustand'

interface BuyClickState {
    isOpen: boolean;
    isMobileOpen: boolean;
    setOpen: (open: boolean) => void;
    setMobileOpen: () => void;
}

export const useBuyClick = create<BuyClickState>((set) => ({
    isOpen: false,
    isMobileOpen: false,
    setOpen: (open) => set(() => ({isOpen: open})),
    setMobileOpen: () => set((state) => ({isMobileOpen: !state.isMobileOpen})),
}))