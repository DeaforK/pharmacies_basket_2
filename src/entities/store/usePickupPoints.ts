import { create } from 'zustand'

interface PickupPointsState {
    items: [],
    status: string,
    pendingPickupPoints: () => void,
    fulfilledPickupPoints: (items: []) => void,
    rejectedPickupPoints: () => void,
}

export const usePickupPoints = create<PickupPointsState>((set) => ({
    items: [],
    status: 'loading',
    pendingPickupPoints: () => set(() => ({items: [], status: 'loading'})),
    fulfilledPickupPoints: (items: []) => set(() => ({items: items, status: 'loaded'})),
    rejectedPickupPoints: () => set(() => ({items: [], status: 'error'})),
}))