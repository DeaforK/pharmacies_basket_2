import { create } from 'zustand'

interface ToastState {
    IsOpen: boolean;
    setOpen: (IsOpen: boolean) => void;

    content: any,
    setContent: (content: any) => void;
}

export const useToastState = create<ToastState>((set) => ({
    IsOpen: false,
    setOpen: (IsOpen) => set(() => ({ IsOpen: IsOpen })),

    content: '',
    setContent: (content) => set(() => ({ content: content })),
}))