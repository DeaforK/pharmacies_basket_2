import { create } from 'zustand'

interface SelectFilterModalState {
    selectShopsOpen: boolean;
    selectShopsCount: number;
    onSelectShopsModal: () => void;
    onSelectShopsModalClose: () => void;

    selectPrice: boolean;
    onSelectPriceShops: () => void;
    onSelectPriceShopsClose: () => void;

    isMobileOpen: boolean;
    onToggleMobileOpen: () => void;
    onMobileClose: () => void;
}

export const useSelectFilterModal = create<SelectFilterModalState>((set) => ({
    selectShopsOpen: false,
    selectShopsCount: 0,
    onSelectShopsModal: () => set((state) => ({selectShopsOpen: !state.selectShopsOpen})),
    onSelectShopsModalClose: () => set(() => ({selectShopsOpen:false})),

    selectPrice: false,
    onSelectPriceShops: () => set((state) => ({selectPrice: !state.selectPrice})),
    onSelectPriceShopsClose: () => set(() => ({selectPrice: false})),

    isMobileOpen: false,
    onMobileClose: () => set(() => ({isMobileOpen: false})),
    onToggleMobileOpen: () => set((state) => ({isMobileOpen: !state.isMobileOpen})),
}))