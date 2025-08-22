import { create } from 'zustand'

interface ListScrollState {
    scrollListPosition: number,
    onScrollList: (pos: number) => void;
}

export const useListScrollState = create<ListScrollState>((set) => ({
    scrollListPosition: 0,
    onScrollList: (pos) => set(() => ({ scrollListPosition: pos })),
}))