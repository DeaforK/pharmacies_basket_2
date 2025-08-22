import { create } from 'zustand'

interface SearchModalModalState {
    isOpen: boolean;
    open: () => void;
    close: () => void;

    history: IHistoryAddress[],
    setHistory: (item: IHistoryAddress) => void;
    deleteObjectHistory: (index: number) => void;
}

interface IHistoryAddress {
    address: string,
    region: string,
}

export const useSearchModal = create<SearchModalModalState>((set) => ({
    isOpen: false,
    close: () => set(() => ({isOpen: false})),
    open: () => set(() => ({isOpen: true})),

    history: [],
    setHistory: (item) => set((state) => ({history: [...state.history, item]})),
    deleteObjectHistory: (index) => set((state) => ({history: state.history.filter((_,i) => i !== index)}))
}))