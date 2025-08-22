import {useEffect, useRef, useState, useCallback, useMemo} from 'react';
import {
    YMap,
    YMapDefaultSchemeLayer,
    YMapDefaultFeaturesLayer,
    YMapMarker,
    YMapListener,
    YMapZoomControl,
    YMapControls
} from 'ymap3-components';
import {BehaviorType, LngLat} from '@yandex/ymaps3-types';
import {Feature} from '../../libs/clusterer';
import {useModalState} from '../../entities/store/useModalState.ts';
import {useMapState} from '../../entities/store/useMapState.ts';
import {postPointsClusters} from '../../entities/clusters/api.ts';
import styles from './MapPickupPoints.module.scss';
import {useFilterState} from '../../entities/store/useModalFilter.ts';
import clsx from 'clsx';
//import { convertPrice } from '../../features/lib/convertPrice.ts';
import useWindowDimensions from '../../features/hooks/useWindowDimensions.ts';
import {usePosition} from '../../features/hooks/usePosition.tsx';

import Supercluster from 'supercluster';
import type {Feature as GeoJSONFeature, Point} from 'geojson';

type Props = Record<string, any>;


export const BEHAVIOR: BehaviorType[] = ['drag', 'scrollZoom', 'dblClick', 'mouseRotate', 'mouseTilt', 'pinchZoom', 'oneFingerZoom'];

export const MapPickupPoints = () => {
    const modalState = useModalState();

    const [isSelect, setSelect] = useState({index: '', select: false});

    const [viewed, setViewed] = useState([]) as any;

    const [center, setCenter] = useState<LngLat>([37.617644, 55.755819]);

    const mapState = useMapState();

    const [zoom, setZoom] = useState(9);

    const [hoveredId, setHoveredId] = useState<string | number | null>(null);

    const programmaticMoveRef = useRef(false);

    const prevSelect = useRef(0);

    const [errors, setErrors] = useState(false);

    const [errorsFilter, setErrorsFilters] = useState(false);

    const [isLoading, setLoading] = useState(true);

    const filterState = useFilterState();

    const position = usePosition();


    useEffect(() => {
        if (!modalState.isOpen) {
            setSelect({index: '', select: false});
        }
    }, [modalState.isOpen]);


    const ymap3Ref = useRef(null) as any;

    useEffect(() => {
        if (
            mapState?.coordinates &&
            mapState.coordinates.length === 2 &&
            (center[0] !== mapState.coordinates[0] || center[1] !== mapState.coordinates[1])
        ) {
            setCenter([mapState.coordinates[0], mapState.coordinates[1]]);
        }
    }, [mapState.coordinates]);

    useEffect(() => {
        const id = requestAnimationFrame(() => {
            const b = ymap3Ref.current?.location?.bounds;
            if (b) setMapBounds(b);
        });
        return () => cancelAnimationFrame(id);
    }, []);


    const onMapUpdate = useCallback((ymap: any) => {
        const z = (ymap.location.zoom ?? 10) as number;
        // не отбрасываем дробную часть и не перерисовываем без нужды
        setZoom(prev => (Math.abs(prev - z) > 1e-3 ? z : prev));

        if (ymap.location.bounds) setMapBounds(ymap.location.bounds);

        const c = ymap.location?.center as LngLat | undefined;
        if (!c) return;

        if (programmaticMoveRef.current) {
            programmaticMoveRef.current = false;
        } else {
            setCenter(prev => (prev[0] !== c[0] || prev[1] !== c[1]) ? [c[0], c[1]] as LngLat : prev);
        }
    }, []);


    useEffect(() => {
        if (mapState?.coordinatesBallon !== undefined && mapState?.coordinatesBallon !== null && mapState?.coordinatesBallon.length > 0 && mapState?.coordinatesBallon[0] !== 0 && mapState?.coordinatesBallon[1] !== 1) {
            setCenter([mapState.coordinatesBallon[0], mapState.coordinatesBallon[1]]);
        }
        //console.log(mapState.coordinates)
        mapState.onCenterMap(null as any)
    }, [mapState?.coordinatesBallon])

    useEffect(() => {
        if (mapState.selectBallonIndex !== null) {
            if (mapState?.selectBallonIndex !== undefined && mapState?.selectBallonIndex !== null) {
                //    console.log(mapState.selectBallonIndex)
                setSelect({
                    index: mapState.selectBallonIndex as any,
                    select: true,
                });
            }

            modalState.setPharmacyId(mapState?.selectBallonIndex as any);
            modalState.toggleModalState();
        }

    }, [mapState?.selectBallonIndex])

    useEffect(() => {
        if (filterState.features.length > 0) {
            const isPickUpToday = filterState.pickUpToday;
            const isMinAmount = filterState.withoutMinAmount;
            const inStock = filterState.inStock;
            const isOpenNow = filterState.isOpenNow;
            const is24Hours = filterState.is24Hours;
            const IsSelectToday = filterState.IsTodaySelect;
            let data = filterState.features as any;

            var maxItem = data.reduce(function (max: any, obj: any) {
                const result = obj.properties.price > max.properties.price ? obj : max
                return result;
            }).properties.price;

            filterState.setMaxPrice(maxItem);

            if (isPickUpToday) {
                data = data.filter((item: any) => item.properties.deliveryTime === 'Забрать сегодня')
            }
            if (isMinAmount) {
                data = data.filter((item: any) => item.properties.minOrderAmount === null)
            }
            if (inStock) {
                data = data.filter((item: any) => item.properties.availabilityStatus === 'Всё в наличии')
            }

            if (isOpenNow) {
                data = data.filter((item: any) => item.properties.isOpenNow === true);
            }
            if (is24Hours) {
                data = data.filter((item: any) => item.properties.is24Hours === true);
            }

            if (IsSelectToday) {
                data = data.filter((item: any) => item.properties.deliveryTime !== 'Нет доставки' && item.properties.deliveryTime === 'Забрать сегодня');
            }

            data = data.filter((item: any) => item.properties.price >= filterState.price[0] && item.properties.price <= filterState.price[1]);

            if (data.length > 0) {
                mapState.loadingFeatures(data);
            }
            if (data.length === 0) {
                mapState.loadingFeatures([]);
            }


        }

    }, [filterState.features, filterState.inStock, filterState.maxPrice, filterState.pickUpToday, filterState.price, filterState.withoutMinAmount, filterState.IsAssembledReplacement, filterState.IsTodaySelect, filterState.is24Hours, filterState.isOpenNow])


    const [mapBounds, setMapBounds] = useState<[[number, number], [number, number]] | null>(null);


    // 2) точки -> GeoJSON
    const points: GeoJSONFeature<Point, Props>[] = useMemo(() => {
        const src = Array.isArray(mapState.features) ? mapState.features : [];
        return src.map(f => ({
            type: 'Feature',
            geometry: {type: 'Point', coordinates: f.geometry.coordinates as [number, number]},
            properties: {id: f.id, ...(f.properties ?? {})} // <<— никогда не null
        }));
    }, [mapState.features]);


    // 3) индекс supercluster
    const clusterIndex = useMemo(() => {
        const idx = new Supercluster({
            radius: 100,
            maxZoom: 20,
            minPoints: 2,
            // агрегируем долю "всё в наличии"
            map: (props: any) => ({
                full: props.availabilityStatus === 'Всё в наличии' ? 1 : 0,
                total: 1,
            }),
            reduce: (acc: any, props: any) => {
                acc.full += props.full;
                acc.total += props.total;
            },
        } as any); // иногда типы суперстрогие — можно оставить any

        idx.load(points);
        return idx;
    }, [points]);

    // клик по кластеру
    const zoomToCluster = useCallback((clusterId: number, lon: number, lat: number) => {
        const nextZoom = clusterIndex.getClusterExpansionZoom(clusterId);
        setCenter([lon, lat]);
        setZoom(nextZoom);
    }, [clusterIndex]);

    const renderClusterMarker = useCallback((c: any) => {
        const [lon, lat] = c.geometry.coordinates as [number, number];
        const id = c.id as number;
        const count = c.properties.point_count as number;

        // наши агрегаты от supercluster.reduce
        const full = Number(c.properties.full ?? 0);
        const total = Number(c.properties.total ?? count ?? 1);
        const pct = total > 0 ? full / total : 0;

        const size = 40;           // общая «рамка» SVG
        const stroke = 4;          // толщина кольца
        const r = (size / 2) - stroke; // радиус прогресс-кольца
        const cx = size / 2;
        const cy = size / 2;
        const C = 2 * Math.PI * r; // длина окружности
        const dash = C * pct;

        // Цвета
        const baseRing = '#FF7E3A';     // базовое кольцо (оранжевое)
        const progRing = '#30C087';     // прогресс (зелёный)
        const bg = '#fff';
        const text = '#333';


        return (
            <YMapMarker key={`cl_${id}`} coordinates={[lon, lat]}>
                <div onClick={() => zoomToCluster(id, lon, lat)} className="cursor-pointer">
                    <svg width={size} height={size} style={{display: 'block'}}>
                        {/* фон */}
                        <circle cx={cx} cy={cy} r={r} fill={bg}/>

                        {/* базовое кольцо */}
                        <circle
                            cx={cx}
                            cy={cy}
                            r={r}
                            fill="none"
                            stroke={baseRing}
                            strokeWidth={stroke}
                            opacity={0.35}
                        />

                        {/* прогресс (старт сверху, поэтому rotate(-90) */}
                        {pct > 0 && (
                            <circle
                                cx={cx}
                                cy={cy}
                                r={r}
                                fill="none"
                                stroke={progRing}
                                strokeWidth={stroke}
                                strokeLinecap="round"
                                strokeDasharray={`${dash} ${C}`}
                                style={{transform: `rotate(-90deg)`, transformOrigin: '50% 50%'}}
                            />
                        )}

                        {/* число в центре */}
                        <text
                            x={cx}
                            y={cy}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize="14"
                            fontWeight="700"
                            fill={text}
                        >
                            {count}
                        </text>
                    </svg>
                </div>
            </YMapMarker>
        );
    }, [zoomToCluster]);

    // кластеры текущего окна
    const clusters = useMemo(() => {
        // fallback: весь мир (чуть ужат по широте)
        const fallback: [[number, number], [number, number]] = [[-180, 85], [180, -85]];
        const b = mapBounds ?? fallback;
        const bbox: [number, number, number, number] = [b[0][0], b[1][1], b[1][0], b[0][1]];
        return clusterIndex.getClusters(bbox, zoom);
    }, [clusterIndex, mapBounds, zoom]);


    const handleMapChange = () => {
        const requestData = {
            view: {zoomLevel: 10, region: 77},
            filters: {
                inViewOnly: true,
                pickupOnly: false,
                fullCartOnly: false,
                pickupTomorrowOnly: false,
                favoritesOnly: false
            },
        };

        waitUntilComplete(requestData).then((items) => {
            mapState.loadingFeatures(items);
            filterState.loadingFeatures(items);
        }).catch(console.error);
    };

    const waitUntilComplete = async (params: any, maxWait = 5000, pollInterval = 300) => {
        const start = Date.now();
        return new Promise<any>((resolve, reject) => {
            const check = async () => {
                try {
                    const res = await postPointsClusters(params);

                    if (!res || !Array.isArray(res.map.items)) {
                        return reject(new Error('Некорректный ответ сервера'));
                    }

                    if (res.map.items.length >= res.count) {


                        return resolve(res.map.items);
                    }

                    if (Date.now() - start > maxWait) {
                        return reject(new Error(`Истекло время ожидания: получено ${res.map.items.length} из ${res.count}`));
                    }

                    setTimeout(check, pollInterval);
                } catch (err) {
                    reject(err);
                }
            };

            check();
        });
    };

    useEffect(() => {
        handleMapChange();
        setLoading(true);

        if (filterState.features.length === 0 || filterState.features === null || filterState.features === undefined) {
            const timeout = setTimeout(onCancelLoadingData, 1500)

            return () => clearTimeout(timeout);
        } else {
            setLoading(false)
        }
    }, []);


    const userCoords = useMemo<[number, number] | null>(() => {
        const c = mapState?.coordinates;
        return Array.isArray(c) && c.length === 2
        && typeof c[0] === 'number' && typeof c[1] === 'number'
            ? [c[0], c[1]]
            : null;
    }, [mapState?.coordinates]);


    const Loader = (() => {
        return (
            <svg className='absolute loade-path' width="145" height="145" viewBox="0 0 48 48">
                <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#00B88B"
                    strokeWidth="1.5px"
                    fill="transparent"
                />
            </svg>
        )
    })

    const marker = useCallback((feature: Feature) => {
        if (!feature || !feature.geometry || !feature.properties) return null;

        const [lon, lat] = feature.geometry.coordinates;
        const {price, pharmacyId} = feature.properties;

        const isViewed = viewed.find((item: string) => item === feature.id);

        const InComplete = feature.properties.availableCount as any <= 25;

        return (
            <YMapMarker
                key={pharmacyId as any}
                coordinates={[lon, lat]}
                zIndex={
                    (isSelect.index === feature.id && isSelect.select) ? 300000 :
                        (hoveredId === feature.id) ? 200000 : 1000
                }
            >
                <div
                    onClick={() => {
                        // setCenter([lon  + 0.07, lat  - 0.008]);
                        programmaticMoveRef.current = true;
                        setCenter([lon, lat]);


                        setSelect((prev) => {
                            setViewed((prev: any) => {
                                if (prev.index === pharmacyId && prev.select) {
                                    return prev.filter((item: string) => item === feature.id)
                                }

                                if (!prev.includes(feature.id)) {
                                    return [...prev, feature.id]
                                }
                                return prev;
                            })

                            const shouldClose = prev.select !== false && prevSelect.current === pharmacyId && prev !== undefined;

                            prevSelect.current = feature.id as any;

                            if (shouldClose) {
                                modalState.close()
                                modalState.setPharmacyId(pharmacyId as any);
                            } else {
                                modalState.open();
                                modalState.setPharmacyId(pharmacyId as any);
                            }

                            return {index: feature.id, select: shouldClose ? !prev.select : true};
                        });
                    }}
                    onPointerEnter={() => setHoveredId(feature.id)}
                    onPointerLeave={() => setHoveredId(null)}
                    className="relative flex justify-center w-[114px] items-center"
                    // className={clsx(`${styles.map__marker} z-[1000] top-0 flex justify-center items-center gap-[3px] relative ${feature.properties.availableCount as any < 25 && styles.map__marker_incomplete}`,
                    // {
                    //     [` ${feature.properties.image !== null ? '' : '!px-[10px]'}`]: InComplete,
                    //     [`!min-h-[32px] ${feature.properties.image !== null ? 'min-w-[97px] !px-[1px]' : ''} flex !justify-start items-center !text-[16px]`]:isSelect.index === feature.id && InComplete === true  && feature.properties.availableCount as any < 25,
                    //     [`!min-h-[28px] ${feature.properties.image !== null ? ' min-w-[93px] gap-[6px] !px-[1px]' : '!px-[10px]'} flex items-center !text-[14px]`]:isSelect.index !== feature.id && InComplete !== true,
                    //     [`!min-h-[28px] ${feature.properties.image !== null ? ' min-w-[93px] gap-[6px] !px-[1px] !justify-start' : '!px-[10px]'} flex items-center !text-[14px]`]:isSelect.index !== feature.id && InComplete === true && feature.properties.availableCount as any < 25,
                    //     [`!min-h-[32px] ${feature.properties.image !== null ? 'max-w-[114px] px-[2px] gap-[6px]' : '!px-[10px]'} !justify-start  flex items-center !text-[16px]`]:isSelect.index === feature.id && feature.properties.availableCount as any === 25,
                    //     [`!min-h-[28px] ${feature.properties.image !== null ? 'max-w-[101px] px-[2px] gap-[6px]' : '!px-[10px]'} flex items-center !text-[14px]`]:isSelect.index !== feature.id && feature.properties.availableCount as any === 25,
                    //     ['!bg-[#7ADFC6]']: (isViewed === feature.id && isSelect.index !== pharmacyId) && feature.properties.availableCount as any === 25,
                    //     ['!bg-[white] !border-[#FFCA7A] !text-[#FFCA7A]']: (isViewed === feature.id && isSelect.index !== pharmacyId) && feature.properties.availableCount as any < 25,
                    // })}

                >


                    <div
                        className={clsx(`${styles.map__marker} !rounded-[99px] z-[1000] !absolute bottom-0 flex !justify-center !items-center gap-[3px]  ${feature.properties.availableCount as any < 25 && styles.map__marker_incomplete}`,
                            {
                                [` ${feature.properties.image !== null ? '' : '!px-[10px]'}`]: InComplete,
                                [`!min-h-[32px] ${feature.properties.image !== null ? '!gap-[4px] !text-[16px]' : '!text-[16px]'} flex !justify-start items-center `]: isSelect.index === feature.id && InComplete === true && feature.properties.availableCount as any < 25,
                                [`!min-h-[28px] ${feature.properties.image !== null ? '  !gap-[4px] ' : '!px-[10px]'} flex items-center !text-[14px]`]: isSelect.index !== feature.id && InComplete !== true,
                                [`!min-h-[28px] ${feature.properties.image !== null ? '  !gap-[4px] !justify-start' : '!px-[10px]'} flex items-center !text-[14px]`]: isSelect.index !== feature.id && InComplete === true && feature.properties.availableCount as any < 25,
                                [`!min-h-[32px] ${feature.properties.image !== null ? 'max-w-[114px] px-[2px] !gap-[4px]' : '!px-[10px]'} !justify-start  flex items-center !text-[16px]`]: isSelect.index === feature.id && feature.properties.availableCount as any === 25,
                                [`!min-h-[28px] ${feature.properties.image !== null ? 'max-w-[101px] px-[2px] !gap-[4px]' : '!px-[10px]'} flex items-center !text-[14px]`]: isSelect.index !== feature.id && feature.properties.availableCount as any === 25,
                                ['!bg-[#7ADFC6]']: (isViewed === feature.id && isSelect.index !== pharmacyId) && feature.properties.availableCount as any === 25,
                                ['!bg-[white] !border-[#FFCA7A] !text-[#FFCA7A]']: (isViewed === feature.id && isSelect.index !== pharmacyId) && feature.properties.availableCount as any < 25,
                            })}>
                        {
                            feature.properties.availableCount as any !== 25 ? <>
                                    {
                                        <>
                                            <div className={` 
                                            w-[24px]
                                           
                                            z-[100]
                                            rounded-full
                                            object-cover
                                            h-[24px]
                                            object-center
                                            bg-[#FFFFFF66]
                                            inset-0
                                            absolute
                                            top-[2px]
                                            left-[2px]
                                            ${isSelect.index === feature.id && 'h-[28px] w-[28px]'}
                                            ${isViewed === feature.id && isSelect.index !== pharmacyId ? '' : 'hidden'}

                                `}/>
                                            {feature.properties.image !== null && <img
                                                className={clsx(`h-[24px] object-center object-cover w-[24px] ${isSelect.index === feature.id && 'h-[28px] w-[28px]'} flex justify-center items-center relative border-[3px] border-white rounded-full  
                                        `)} alt='' src={'/logo_ballon.png'}/>}
                                            <span className='flex items-center justify-center mr-[8px]'>
                                            {feature.properties.availableCount + ' из 25'}
                                        </span>

                                        </>
                                    }
                                </>
                                :
                                <>
                                    {feature.properties.image !== null &&
                                        <div className={`flex !justify-center !h-full !items-center  `}>
                                            <div className={` 
                                            w-[24px]
                                           
                                            
                                            rounded-full
                                            object-cover
                                            h-[24px]
                                            object-center
                                            bg-[#FFFFFF66]
                                            inset-0
                                            absolute
                                            top-[2px]
                                            left-[2px]
                                            ${isSelect.index === feature.id && 'h-[28px] w-[28px]'}
                                            ${isViewed === feature.id && isSelect.index !== pharmacyId ? '' : 'hidden'}
                                `}/>
                                            <img className={` 
                                            w-[24px]
                                            border-[2px] 
                                            border-white 
                                            rounded-full
                                            object-cover
                                            h-[24px]
                                            object-center
                                            bg-blue-500/30
                                            inset-0
                                            ${isSelect.index === feature.id && 'h-[28px] w-[28px]'}
                                `} alt='' src={'/logo_ballon.png'}/>
                                        </div>
                                    }

                                    <span className='mr-[8px] flex items-center'>
                                        {price as number} ₽
                                    </span>
                                </>
                        }
                    </div>
                    <div className={clsx(`shrink-0 fixed w-full flex  justify-center bottom-[1px]`
                    )}>
                        <svg
                            className={clsx(`${isSelect && feature.properties.availableCount as any < 25 && ''} !w-[12px] !h-[5px] absolute`)}
                            xmlns="http://www.w3.org/2000/svg" width="13" height="4" viewBox="0 0 13 4" fill="none">
                            <path
                                d="M7.91422 3.54692C7.13317 4.15103 5.86684 4.15103 5.08579 3.54692L0.5 8.11415e-07L12.5 0L7.91422 3.54692Z"
                                fill={`${feature.properties.availableCount as any < 25 ? isViewed === feature.id && isSelect.index !== pharmacyId ? '#FFCA7A' : '#FF9900' : isViewed === feature.id && isSelect.index !== pharmacyId ? '#7ADFC6' : '#00C293'}`}/>
                        </svg>
                        {isSelect.index === pharmacyId && isSelect.select &&
                            <div className={`${styles.map__marker_shadow} !bottom-[-12px] 
                    ${feature.properties.availableCount as any < 25 && styles.map__marker_incomplete_shadow} 

                    ${price as any >= 1 && feature.properties.image !== null && '!w-[33px]'}  
                    ${price as any >= 10 && feature.properties.image !== null && '!w-[42px]'}  
                    ${price as any >= 100 && feature.properties.image !== null && '!w-[51px]'}  
                    ${price as any >= 1000 && feature.properties.image !== null && '!w-[64px]'}  
                    ${price as any >= 10000 && feature.properties.image !== null && '!w-[73px]'}  
                    ${price as any >= 100000 && feature.properties.image !== null && '!w-[82px]'}  
                    
                    ${price as any >= 1 && feature.properties.image === null && '!w-[7px]'}  
                    ${price as any >= 10 && feature.properties.image === null && '!w-[16px]'}  
                    ${price as any >= 100 && feature.properties.image === null && '!w-[25px]'}  
                    ${price as any >= 1000 && feature.properties.image === null && '!w-[38px]'}  
                    ${price as any >= 10000 && feature.properties.image === null && '!w-[47px]'}  
                    ${price as any >= 100000 && feature.properties.image === null && '!w-[56px]'}  
                    
                    ${feature.properties.availableCount as any >= 0 && feature.properties.availableCount as any !== 25 && '!w-[49px]'} 
                    ${feature.properties.availableCount as any >= 10 && feature.properties.availableCount as any !== 25 && '!w-[57px]'} 
                    `}/>}

                        {/* ${feature.properties.availableCount as any >= 15 && feature.properties.availableCount as any !== 25 && '!w-[65px]'}  */}
                    </div>

                </div>
            </YMapMarker>
        );
    }, [setCenter, setSelect, setZoom, modalState, isSelect, viewed, hoveredId]);

    const onCancelLoadingData = function () {
        setLoading(false);
        // не ставим   setErrors(true);
    }

    const handleUserMarkerClick = () => {
        position.initialPosition();
        if (mapState.coordinates?.length === 2) {
            programmaticMoveRef.current = true;
            setCenter([mapState.coordinates[0], mapState.coordinates[1]]);
        }
    }

    useEffect(() => {
        setErrorsFilters(filterState.errorsFilter)
    }, [filterState.errorsFilter])


    const LayerMap = () => {
        return (
            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "#FFFFFF7A",
                mixBlendMode: "lighten",
                zIndex: isLoading || errorsFilter || errors ? 1000 : 100,
                pointerEvents: "none"
            }}/>
        )
    }

    const {width} = useWindowDimensions();

    return (
        <div className={styles.map__container}>
            {
                isLoading && <section
                    className='absolute h-[100%] w-[100%] bg-[#FFFFFF] z-[300] flex justify-center items-center flex-col'></section>
            }
            {
                errors && <section
                    className='absolute h-[100%] w-[100%] bg-[#FFFFFF] z-[300] flex justify-center items-center flex-col'></section>
            }
            {
                errorsFilter && <section
                    className='absolute h-[100%] w-[100%] bg-[#FFFFFFEB] z-[300] flex justify-center items-center flex-col'></section>
            }
            <div
                className={`absolute !h-full w-full z-[10] ${(isLoading || errors || errorsFilter) && 'z-[1001]'}  ${(!isLoading && !errors && !errorsFilter) && 'hidden'}`}>
                {
                    errors && <div
                        className='absolute h-full  w-[100%] bg-[#FFFFFF] z-[1001] flex justify-center items-center flex-col'>
                        <h2 className='text-[18px] font-semibold text-[#000000]'>К сожалению, карта не загрузилась</h2>
                        <span className='font-normal text-[14px]'>Повторите попытку</span>

                        <button onClick={() => {
                            setErrors(false);
                        }}
                                className='cursor-pointer mt-[16px] px-[24px] py-[10px] bg-[#00C293] rounded-[99px] font-semibold text-[white]'>Обновить
                            страницу
                        </button>
                    </div>
                }
                {

                    isLoading && <section
                        className='absolute pointer-events-none h-[100%] w-[100%] z-[1001]  flex justify-center items-center flex-col'>
                        <div className='  h-initial flex justify-center items-center w-[124px] h-[124px] overflow-hidden '>
                            <img src="/Loader.svg" alt=""/>
                            <img className='absolute' src='/Pin.svg' alt=''/>
                            {
                                Loader()
                            }
                        </div>
                        <h2 className='text-[18px] font-semibold text-[#000000] mt-[12px]'>Ищем аптеки..</h2>
                    </section>
                }
                {
                    errorsFilter &&
                    <div className='absolute h-full w-[100%]  z-[1001]  flex justify-center items-center flex-col'>
                        <h2 className='wide_text_2 z-[1004] text-[16px] font-semibold text-[#000000]  tracking-[-2%]'>
                            {
                                width > 900 ? 'К сожалению, аптеки не найдены' : 'Аптеки не найдены'
                            }
                        </h2>
                        <span
                            className='font-normal text-[14px] tracking-[0px] leading-[16px]'>Измените критерии поиска</span>

                        <button onClick={() => {
                            filterState.resetFilter(true)
                            setErrorsFilters(false)
                        }}
                                className='cursor-pointer mt-[16px] px-[24px] py-[10px] bg-[#00C293] duration-200 hover:bg-[#00B88B] rounded-[99px] font-semibold text-[white] '>Сбросить
                            фильтры
                        </button>
                    </div>
                }
            </div>

            {LayerMap()}

            <div
                className={`${(!isLoading && !errorsFilter && !errors) && 'z-[1001]'} z-[900] absolute w-full h-full flex justify-center items-center pt-[92px] pointer-events-none  max-[900px]:pt-[0px] max-[900px]:pt-[33px]`}>
                <button onClick={handleUserMarkerClick}
                        className={`absolute z-[100]  ${isLoading || errorsFilter && 'z-[1002]'}  pointer-events-auto  flex items-center justify-center  right-[24px] max-[900px]:!h-[40px] max-[900px]:!w-[40px]  max-[900px]:right-[8px] cursor-pointer bg-[#FFFFFF] rounded-[99px] !h-[48px] !w-[48px] shadow-[0px_2px_4px_0px_#0000001A]`}>
                    <img src="/markUser.svg" alt=""/>
                </button>
            </div>

            <YMap
                zoomRange={{max: 100, min: 4}}
                behaviors={BEHAVIOR}
                ref={ymap3Ref}
                key="map"
                className="w-[100svh]"
                theme="light"
                location={{center, zoom}}
            >

                <YMapDefaultSchemeLayer/>
                <YMapDefaultFeaturesLayer/>


                <YMapControls position="right">
                    <YMapZoomControl easing="ease"/>
                </YMapControls>

                <YMapListener onUpdate={onMapUpdate}/>


                {userCoords && (
                    <YMapMarker coordinates={userCoords}>
                    </YMapMarker>)}


                {/* Кластеры и одиночки */}
                {clusters.map((c: any) => {
                    if (c.properties.cluster) {
                        return renderClusterMarker(c);
                    }

                    // одиночка — как у тебя уже сделано
                    const fakeFeature = {
                        id: c.properties.id,
                        geometry: {coordinates: c.geometry.coordinates},
                        properties: c.properties
                    } as unknown as Feature;

                    return marker(fakeFeature);
                })}
            </YMap>
        </div>
    );

};
