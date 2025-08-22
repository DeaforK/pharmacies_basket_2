import { create } from 'zustand'

interface ReplacementState {
    isDeleteReplacementModal: boolean;
    openModalDelete: (callback: () => void) => void;
    closeModalDelete: () => void;

    isSingleOpen: boolean;
    isReplacementModalOpen: boolean;
    isMobileOpen: boolean;

    openMobileOpen: (open: boolean) => void;

    openModalReplacement: (isSingleOpen: boolean, selectCallback?: (select: boolean) => void, setSuccessProductReplace?: (callback: () => void) => void) => void;
    
    selectCallback: (select: boolean) => void;
    closeModalReplacement: () => void;

    deleteCallback: () => void;

    productId: string,
    setProductId: (productId:string) => void;

    productReplace: any,
    setProductReplace: (product:any) => void;

    productReplaceNew: any,
    setProductReplaceNew: (product:any) => void;

    productsReplaceNew: any,
    setProductsReplaceNew: (products:any) => void;

    setSuccessProductReplace: (callback: any) => void;

    products: [],
    setProducts: (product: []) => void;

    reset: () => void;
}

export const useReplacementState = create<ReplacementState>((set) => ({

    isDeleteReplacementModal: false,
    openModalDelete: (callback) => set(() => ({isDeleteReplacementModal: true, deleteCallback() {
        callback();
    },})),
    closeModalDelete: () => set(() => ({isDeleteReplacementModal: false})),


    openMobileOpen: (open) => set(() => ({isMobileOpen: open})),

    isSingleOpen: false,
    isReplacementModalOpen: false,
    isMobileOpen: false,

    openModalReplacement: (isSingleOpen,selectCallback, setSuccessProductReplace) => set(() => ({isReplacementModalOpen: true,isSingleOpen:isSingleOpen, selectCallback: (select: boolean) => {
        if (selectCallback !== undefined) {
            selectCallback(select);
        }
    },

    setSuccessProductReplace: (callback: () => void) => {
        if (setSuccessProductReplace !== undefined) {
            setSuccessProductReplace(callback)
        }
    }})),

    closeModalReplacement: () => set(() => ({isReplacementModalOpen: false})),
    selectCallback: () => {},

    deleteCallback: () => {},

    productReplace: null,
    setProductReplace: (product) => set(() => ({productReplace: product})),

    productId: '',
    setProductId: (productId) => set(() => ({productId: productId})),

    productReplaceNew: null,
    setProductReplaceNew: (product) => set(() => ({productReplaceNew: product})),

    productsReplaceNew: [],
    setProductsReplaceNew: (products) => set(() => ({productsReplaceNew: products})),

    setSuccessProductReplace: (callback) => set(() => (callback())),

    products: [],
    setProducts: (product) => set(() => ({products:product})),

    reset: () => set(() => ({productsReplaceNew: []}))
}))