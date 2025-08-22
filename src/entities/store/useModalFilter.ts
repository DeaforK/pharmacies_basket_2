import { create } from 'zustand'

interface FilterState {
    isOpen: boolean;
    inStock: boolean;
    pickUpToday: boolean;
    withoutMinAmount: boolean;
    setStock: () => void;
    setNotStock: () => void;
    setPickUpToday: () => void;
    setMinAmount: () => void;
    setMinAmountSelect: (select:boolean) => void;
    toggleModalState: () => void;
    open: () => void;
    close: () => void;

    features: [],
    featuresPrev: [],
    loadingFeatures: (items:[]) => void;
    loadingFeaturesPrev: (items:[]) => void;

    price: [number,number],
    maxPrice: number,
    setPrice:(price:[number,number]) => void;
    setMaxPrice:(price:number) => void;

    IsAssembledReplacement: boolean,
    setAssembledReplacement: (isReplacement: boolean) => void;

    IsTodaySelect: boolean,
    setTodaySelect: (isReplacement: boolean) => void;

    is24Hours: boolean,
    setIs24Hours: (value: boolean) => void;

    isOpenNow: boolean,
    setIsOpenNow: (isReplacement: boolean) => void;

    resetFilter: (isReplacement: boolean) => void;

    setErrorsFilter: (select: boolean) => void;
    errorsFilter: boolean;

    isBestPrice: boolean,
    setBestPrice: (select: boolean) => void,

    assembleReplace: boolean,
    setAssembleReplace: (select: boolean) => void,
}

export const useFilterState = create<FilterState>((set) => ({
    features: [],
    featuresPrev: [],
    loadingFeatures: (items) => set(() => ({features: items, featuresPrev: items})),
    loadingFeaturesPrev: (items) => set(() => ({featuresPrev: items})),

    isOpen: false,
    inStock: false,
    pickUpToday: false,
    withoutMinAmount: false,
    toggleModalState: () => set((state) => ({
        isOpen: !state.isOpen
    })),
    setStock: () => set((state) => ({inStock: !state.inStock})),
    setNotStock: () => set(() => ({inStock: false})),
    setPickUpToday: () => set((state) => (
        {
            pickUpToday: !state.pickUpToday,
        }
    )),
    setMinAmount: () => set((state) => ({withoutMinAmount: !state.withoutMinAmount})),
    setMinAmountSelect: (select) => set(() => ({withoutMinAmount: select})),
    open: () => set(() => ({isOpen: true})),
    close: () => set(() => ({isOpen: false})),

    price: [0, 500],
    maxPrice: 0,
    setPrice: (price) => set(() => ({price: price})),
    setMaxPrice: (maxPrice) => set(() => ({maxPrice: maxPrice})),

    IsAssembledReplacement: false,
    setAssembledReplacement: (isReplacement) => set(() => ({IsAssembledReplacement: isReplacement})),

    is24Hours: false,
    setIs24Hours: (value) => set(() => ({is24Hours: value})),

    isOpenNow: false,
    setIsOpenNow: (value) => set(() => ({isOpenNow: value})),

    IsTodaySelect: false,
    setTodaySelect: (select) => set(() => ({IsTodaySelect: select})),

    errorsFilter: false,
    setErrorsFilter: (select) => set(() => ({errorsFilter: select})),

    isBestPrice: false,
    setBestPrice: (select) => set(() => ({isBestPrice: select})),

    assembleReplace: false,
    setAssembleReplace: (select) => set(() => ({assembleReplace: select})),

    resetFilter: () => set((state) => ({IsTodaySelect: false, inStock: false,pickUpToday: false, assembleReplace: false, is24Hours: false,isOpenNow: false, price: [0,state.maxPrice],IsAssembledReplacement: false,}))
}))