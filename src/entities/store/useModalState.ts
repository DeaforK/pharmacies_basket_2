import { create } from 'zustand'

interface ModalState {
    isOpen: boolean;
    toggleModalState: () => void;
    setMobileModalState: (select: boolean) => void;
    openMobile: () => void;
    close: () => void;
    open: () => void;
    isMobileOpen: boolean;

    isBackdrop: boolean;
    setBackdrop: (select: boolean) => void;

    pharmacyId: string | null;
    setPharmacyId: (id: string) => void;
    
    items: [];
    setItems: (items: []) => void;
    
    setMobileModalOpen: () => void;
}
export const useModalState = create<ModalState>((set) => ({
    isOpen: false,
    isMobileOpen: false,
    isBackdrop: false,
    toggleModalState: () => set((state) => ({isOpen: !state.isOpen})),
    setMobileModalState: () => set((state) => ({isMobileOpen: !state.isMobileOpen})),
    setMobileModalOpen: () => set(() => ({isMobileOpen: true})),
    close: () => set(() => ({isOpen: false,isMobileOpen: false})),
    open: () => set(() => ({isOpen: true})),
    openMobile: () => set((state) => ({isMobileOpen: !state.isMobileOpen})),    

    setBackdrop: (select) => set(() => ({isBackdrop: select})),

    pharmacyId: null,
    setPharmacyId: (id: string) => set(() => ({ pharmacyId: id })),

    items: [],
    setItems: (items) => set(() => ({ items: items })),
}))