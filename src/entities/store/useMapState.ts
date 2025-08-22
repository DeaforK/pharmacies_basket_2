import { LngLat } from '@yandex/ymaps3-types';
import { create } from 'zustand'
import { Feature } from '../../libs/clusterer';

interface MapState {
    coordinates : LngLat | undefined;
    coordinatesBallon : LngLat | undefined;
    onCenterUserMap: (cords: LngLat) => void;
    onCenterMap: (cords: LngLat) => void;
    error: {
        code: string,
    }
    onError: (error: any) => void;
    isOpenModal: boolean,
    closeModal: () => void,
    openModal: () => void,

    points: [],
    loadingPoints: (items: []) => void,

    clusters: [],
    loadingClusters: (items: []) => void,

    features: Feature[];
    loadingFeatures: (items: Feature[]) => void;

    selectBallonIndex: number | null;
    setSelectBallon: (index: number) => void;

    scrollPos: number;
    setScrollPos: (pos:number) => void;
}

export const useMapState = create<MapState>((set) => ({
    coordinates: undefined,
    coordinatesBallon: undefined,
    error: {
        code: ''
    },


    onCenterUserMap: (cords: LngLat) => set(() => ({coordinates: cords})),
    onCenterMap: (cords: LngLat) => set(() => ({coordinatesBallon: cords})),

    selectBallonIndex: null,
    setSelectBallon: (index: number) => set(() => ({selectBallonIndex: index})),

    onError: (error: any) => set(() => ({error: error})),

    isOpenModal: false,
    closeModal: () => set(() => ({isOpenModal: false})),
    openModal: () => set(() => ({isOpenModal: true})),

    points: [],
    loadingPoints: (points:[]) => set(() => ({points: points})),

    scrollPos: 1,
    setScrollPos: (pos) => set(() => ({scrollPos:pos})),

    clusters: [],
    loadingClusters: (clusters:[]) => set(() => ({clusters: clusters})),

    features: [],
    loadingFeatures: (items) =>
        set(() => ({ features: Array.isArray(items) ? items : [] })),
}))
