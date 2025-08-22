import { createStore } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
interface ScrollState {
    scrollY: any,
    setScroll: (position: any) => void,

    setScrollList: (position: any) => void,
    scrollList: any
}

export const scrollStore = createStore<ScrollState>()(
    subscribeWithSelector((set) => ({
        scrollY: 0,
        setScroll: (position: any) => set({ scrollY: position }),

        scrollList: null,
        setScrollList: (position) => set(() => ({scrollList: position})),
    }))
)
