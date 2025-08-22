import { create } from 'zustand'

interface HeaderScrollState {
    directionScroll: number,
    onScrollHeaderDirection: (pos: number) => void;

    bannerHidden: boolean,
    onBannerHidden: (select: boolean) => void;
}

export const useHeaderScrollState = create<HeaderScrollState>((set) => ({
    directionScroll: 0,
    onScrollHeaderDirection: (pos) => set(() => ({ directionScroll: pos })),

    bannerHidden: true,
    onBannerHidden: (select) => set(() => ({ bannerHidden: select })),
}))