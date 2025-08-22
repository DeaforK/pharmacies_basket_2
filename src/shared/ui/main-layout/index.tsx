
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import FilterTabs from "../../../widgets/Header/FilterTabs/FilterTabs";
import { Header } from "../../../widgets";
import { ModalBallon }  from "../../../widgets/ModalBallon/ModalBallon";
import { useModalState } from "../../../entities/store/useModalState.ts";
import clsx from "clsx";
import { useFilterState } from "../../../entities/store/useModalFilter.ts";
import ModalFilter from "../../../widgets/ModalFilter/ModalFilter.tsx";
import { useSelectFilterModal } from "../../../entities/store/useSelectFiltersModal.ts";
import ModalFilterMobile from "../../../widgets/ModalFilter/ModalFilterMobile.tsx";
import Slider from "rc-slider";
import SelectRouteBottom from "../../../widgets/Header/SelectRouteBottom.tsx";
import { useSearchModal } from "../../../entities/store/useSearchModal.ts";
import useWindowDimensions from "../../../features/hooks/useWindowDimensions.ts";
import { Checkbox } from "../../shadcn/components/ui/checkbox.tsx";
import ModalDeleteReplacement from "../../../widgets/ModalDeleteReplacement/ModalDeleteReplacement.tsx";
import { useReplacementState } from "../../../entities/store/useReplacement.ts";
import { useMapState } from "../../../entities/store/useMapState.ts";
import ModalPermissionGeo from "../../../widgets/ModalPermissionGeo/ModalPermissionGeo.tsx";
import { scrollStore } from "../../../entities/store/useScroll.ts";
import ModalReplacement from "../../../widgets/ModalReplacement/ModalReplacement.tsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { Feature } from '../../../libs/clusterer';
import { useQueryClient } from "@tanstack/react-query";
import Toast from "../../components/Toast/Toast.tsx";
import { useBuyClick } from "../../../entities/store/useBuyClick.ts";
import ModalBuyClick from "../../../widgets/ModalBuyClick/ModalBuyClick.tsx";
import { useListScrollState } from "../../../entities/store/useListScroll.ts";
import { useHeaderScrollState } from "../../../entities/store/useHeaderScroll.ts";

export const MainLayout = () => {
    const modalState = useModalState();

    const filterState = useFilterState() as any;

    const selectFilterModal = useSelectFilterModal();

    const searchModal = useSearchModal();

    const location = useLocation();

    const { width } = useWindowDimensions();

    const replacement = useReplacementState();

    const buyClick = useBuyClick();

    const mapState = useMapState();

    const ScrollStore = scrollStore;

    const queryClient = useQueryClient();

    const refScroll = useRef(null) as any;

    const scrollListPos = useRef(0);

    const listScrollState = useListScrollState();

    const headerScroll = useHeaderScrollState();
    const prevHeaderScroll = useRef(0);
    const [, setSelectRetailChains ] = useState([]);

    const [retailChains, setRetailChain] = useState() as any;

    const [maxPrice,setMaxPrice ] = useState({
        focus: false,
        hover: false,
    });

    const [minPrice,setMinPrice ] = useState({
        focus: false,
        hover: false,
    });

    const [, setEmptyData] = useState(false);


    function filteredData(isPickUpToday: boolean, isMinAmount: boolean,isStock: boolean, data: any[]): any[] {
        const assembleReplace = filterState.assembleReplace;

        if (isPickUpToday) {
            data = data.filter((item: any) => item.properties.deliveryTime === 'Забрать сегодня');
        }
        if (isMinAmount) {
            data = data.filter((item: any) => item.properties.minOrderAmount === null)
        }
        if (isStock) {
            data = data.filter((item: any) => item.properties.availabilityStatus === 'Всё в наличии')
        }
        if (assembleReplace) {
            data = data.filter((item: any) => item.properties.assembleReplace === 1);
            console.log(data)
        }

        return data;
    }

    const onHandleScrollEnd = useCallback((pos: any) => {
        listScrollState.onScrollList(pos.target.scrollTop)
        scrollListPos.current = pos.target.scrollHeight - (pos.target.scrollTop + pos.target.clientHeight)
        ScrollStore.getState().setScroll(Math.abs(pos.target.scrollHeight - (pos.target.scrollTop + pos.target.clientHeight)) <= 1)
    },[ScrollStore,window])

    const onHandleScroll = (pos: any) => {
        headerScroll.onScrollHeaderDirection(pos.target.scrollTop)

        const currentPos = pos.target.scrollTop;

        if (currentPos > prevHeaderScroll.current) {
            headerScroll.onScrollHeaderDirection(1);
        } else if (currentPos < prevHeaderScroll.current) {
            headerScroll.onScrollHeaderDirection(0);
        }
        if (pos.target.scrollTop <= 80) {
            headerScroll.onScrollHeaderDirection(0);
        }

        prevHeaderScroll.current = pos.target.scrollTop;
    }

    const scrollPositions = useRef({}) as any;

    useEffect(() => {
      return () => {
        scrollPositions.current[location.pathname] = listScrollState.scrollListPosition;
      };
    }, [location.pathname,scrollPositions,listScrollState]);

    useEffect(() => {
        const savedPosition = listScrollState.scrollListPosition || 0;
        refScroll.current.scrollTo(0, savedPosition + 100);
    }, [location.pathname,scrollPositions]);

    useEffect(() => {

        const result = [] as any;

        for (let index = 0; index < filterState.features.length; index++) {
            let IsInclude = {} as Feature | undefined

            if (result !== undefined) {
                IsInclude = result.find((item: any) => item.name === filterState.features[index].properties.network)
            }

            if(IsInclude === undefined || IsInclude === null)
            {
                result.push({
                    name: filterState.features[index].properties.network,
                    rating: filterState.features[index].properties.rating,
                })
            }
        }

        setRetailChain(result)

    },[filterState.features])

    return (
        <div ref={refScroll} onScrollEnd={onHandleScrollEnd} onScroll={onHandleScroll} className={clsx(`h-full relative w-full flex flex-col`, {
            ['overflow-hidden'] : location.pathname === '/map',
            ['scroll_block'] : location.pathname === '/list',
        }
        )}>
            <ScrollRestoration />
            {
                mapState.isOpenModal && <>
                    <div onClick={() => {
                        mapState.closeModal();
                    }} className="fixed z-[202] w-[100svw] h-[100svh] bg-[#0000008d]"/>
                    <ModalPermissionGeo />
                </>
            }
            {
                replacement.isDeleteReplacementModal && <>
                    <div onClick={() => {
                        replacement.closeModalDelete();
                    }} className="fixed z-[202] w-[100svw] h-[100svh] bg-[#0000008d]"/>
                    <ModalDeleteReplacement />
                </>
            }
            {
                width > 900 && replacement.isReplacementModalOpen && <>
                    <div onClick={() => {
                        replacement.closeModalReplacement();
                    }} className="fixed z-[500] w-[100svw] h-[100svh] bg-[#0000008d]"/>
                    <ModalReplacement/>
                </>
            }
            {
                width < 900 && replacement.isReplacementModalOpen && <>
                    <div onClick={() => {
                        replacement.closeModalReplacement();
                    }} className="fixed z-[500] w-[100svw] h-[100svh] bg-[#0000008d]"/>
                    <ModalReplacement/>
                </>
            }
            {
                (modalState.isMobileOpen || selectFilterModal.selectShopsOpen || selectFilterModal.selectPrice) && <div onClick={() => {
                    modalState.close();
                    selectFilterModal.onSelectPriceShopsClose();
                    selectFilterModal.onSelectShopsModalClose();
                    replacement.closeModalReplacement();
                }} className="min-[900px]:hidden fixed z-[202] w-[100svw] h-[100svh] bg-[#0000008d]"/>
            }
                        {
                (modalState.isBackdrop) && <div onClick={() => {
                    modalState.setBackdrop(false);
                }} className="min-[900px]:hidden fixed z-[202] w-[100svw] h-[100svh] bg-[#0000008d]"/>
            }
            {
                filterState.isOpen &&
                <div className={clsx(`w-full h-full flex items-center absolute`,{
                })}>
                    <div onClick={() => filterState.close()} className="fixed flex items-center justify-end z-[202] w-[100svw] h-[100svh] bg-[#0000008d]"/>
                    <ModalFilter />
                </div>
            }

            <Toast offsetBottom={'bottom-[10px] right-[10px]'} position="bottom" />

            <Header />

            <div className="fixed top-[-130px] bg-[white] w-[99svw] h-[200px] z-[10]" />

            <main onClick={() => searchModal.close()}  className={clsx(`main`, { ['z-[1]'] :searchModal.isOpen} )}>

                {
                    location.pathname === '/list' && filterState.errorsFilter && <div  className='absolute z-[100] items-center justify-center h-full flex w-full '>
                        {
                            <div className="relative w-full h-full">
                                {
                                     <div className='wide_text_2 h-full w-[100%] bg-[#ffffff] z-[200] flex justify-center items-center flex-col'>
                                            <h2 className='text-[18px] font-semibold text-[#000000]'>
                                                {
                                                    width > 900 ? ' К сожалению, аптеки не найдены' : 'Аптеки не найдены'
                                                }

                                            </h2>
                                            <span className='font-normal text-[14px]'>Измените критерии поиска</span>

                                            <button onClick={() => {
                                                filterState.setErrorsFilter(false);
                                                filterState.resetFilter(false);
                                                filterState.setMinAmountSelect(false);
                                                queryClient.setQueryData(['pickup_points'],
                                                    () => {
                                                        const result =  {
                                                            pageParams: [0],
                                                            pages: [{
                                                                data: filterState.features.slice(0, 8),
                                                                nextPage: 1,
                                                            }]
                                                            };
                                                        return result
                                                })
                                            }} className='cursor-pointer mt-[16px] px-[24px] py-[10px] bg-[#00C293] duration-200 hover:bg-[#00B88B] rounded-[99px] font-semibold text-[white]'>Сбросить фильтры</button>
                                        </div>

                                }
                            </div>
                        }
                    </div>
                }
                <FilterTabs />

                {
                    buyClick.isOpen && <>
                        <ModalBuyClick />
                    </>
                }

                {/* Mobile Filter Price */}
                <ModalFilterMobile
                className="h-fit rounded-t-[16px] rounded-none"
                offsetOpen={`bottom-0`}
                isActive={selectFilterModal.selectPrice}>
                    <div className="grow bg-[#FFFFFF] px-[16px] py-[12px] pt-[4px] overflow-auto h-[50%]">
                        <div className="w-full flex justify-between items-center">
                            <h1 className="font-semibold text-[16px]  leading-[24px]">Цена, ₽</h1>
                            <div className='flex gap-[24px] items-center'>
                                <button className="font-normal block text-[14px] mr-[45px] leading-[24px] text-[#78808F] cursor-pointer hover:text-[#444952]">Сбросить</button>
                                <button onClick={
                                    () => {
                                        modalState.close();
                                        selectFilterModal.onMobileClose();
                                        selectFilterModal.onSelectPriceShopsClose()
                                    }
                                } className="w-[34px] h-[34px] block top-[20px] right-[12px] flex justify-center items-center absolute cursor-pointer">
                                    <img className="w-[20px] h-[20px]" src="/cross.svg" alt="cross" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-[16px]">
                            <div className="w-full flex gap-[16px]">
                                <div
                                 onMouseEnter={() => setMinPrice((prev: any) => {
                                    return {
                                        focus: prev.focus,
                                        hover: true
                                    }
                                })}
                                onMouseLeave={() => setMinPrice((prev: any) => {
                                    return {
                                        focus: prev.focus,
                                        hover: false
                                    }
                                })}
                                className="relative  pl-[10px] hover:border-[#ABB6CC] focus-within:border-[#000000] border-[#E1E1E5] border-[1px] flex rounded-[10px] w-[50%] h-[40px] items-center">
                                    <label className="absolute text-[#78808F] font-normal text-[14px] leading-[20px]" htmlFor="range1">от</label>
                                    <input  onFocus={() => setMinPrice((prev: any) => {
                                        return {
                                            focus: true,
                                            hover: prev.hover
                                        }
                                    })}
                                    onBlur={() => setMinPrice((prev: any) => {
                                        return {
                                            focus: false,
                                            hover: prev.hover
                                        }
                                    })} value={filterState.price[0]}
                                    onChange={(e: any) => {
                                        filterState.setPrice([
                                            e.currentTarget.value,
                                            filterState.price[1],
                                        ])

                                        filterState.setErrorsFilter(false)
                                        const isMinAmount = filterState.withoutMinAmount;
                                        const isStock = filterState.inStock;
                                        const IsSelectToday = filterState.IsTodaySelect;
                                        let  data = filterState.features as any;

                                        data = filteredData(isMinAmount,isStock,data,IsSelectToday);
                                        data = data.filter((item: any) => item.properties.price >= filterState.price[0] && item.properties.price < filterState.price[1]);

                                        queryClient.setQueryData(['pickup_points'],
                                            () => {
                                                const result =  {
                                                    pageParams: [0],
                                                    pages: [{
                                                        data: data.slice(0, 8),
                                                        nextPage: 1,
                                                    }]
                                                    };
                                                return result
                                        })
                                        filterState.setErrorsFilter(false)
                                        if (data.length === 0) {
                                            filterState.setErrorsFilter(true)
                                            setEmptyData(true);
                                        }
                                    }} min={49} id="range1" className="focus-within:outline-none pl-[25px]  h-full w-[90%] absolute" />
                                    {
                                        (minPrice.focus || minPrice.hover ) && <button onClick={() => {
                                                filterState.setPrice([
                                                    0,
                                                    filterState.price[1],
                                                ])
                                                const isMinAmount = filterState.withoutMinAmount;
                                                const isStock = filterState.inStock;
                                                const IsSelectToday = filterState.IsTodaySelect;
                                                let  data = filterState.features as any;

                                                data = filteredData(isMinAmount,isStock,data,IsSelectToday);
                                                data = data.filter((item: any) => item.properties.price >= filterState.price[0] && item.properties.price < filterState.price[1]);

                                                queryClient.setQueryData(['pickup_points'],
                                                    () => {
                                                        const result =  {
                                                            pageParams: [0],
                                                            pages: [{
                                                                data: data.slice(0, 8),
                                                                nextPage: 1,
                                                            }]
                                                            };
                                                        return result
                                                })
                                                filterState.setErrorsFilter(false)
                                                if (data.length === 0) {
                                                    filterState.setErrorsFilter(true)
                                                    setEmptyData(true);
                                                }
                                            }} className='cursor-pointer h-[40px] w-[40px] right-0 flex justify-center items-center absolute'>
                                            <img className='w-[16px] h-[16px]' src="/cross.svg"  alt="" />
                                        </button>
                                    }
                                </div>

                                <div onMouseEnter={() => setMaxPrice((prev: any) => {
                                    return {
                                        focus: prev.focus,
                                        hover: true
                                    }
                                })}
                                onMouseLeave={() => setMaxPrice((prev: any) => {
                                    return {
                                        focus: prev.focus,
                                        hover: false
                                    }
                                })}

                                className="relative pl-[10px] hover:border-[#ABB6CC] focus-within:border-[#000000] border-[#E1E1E5] border-[1px] flex rounded-[10px] w-[50%] h-[40px] items-center">
                                    <label className="absolute text-[#78808F] font-normal text-[14px] leading-[20px]" htmlFor="range1">до</label>
                                    <input
                                    onFocus={() => setMaxPrice((prev: any) => {
                                        return {
                                            focus: true,
                                            hover: prev.hover
                                        }
                                    })}
                                    onBlur={() => setMaxPrice((prev: any) => {
                                        return {
                                            focus: false,
                                            hover: prev.hover
                                        }
                                    })}
                                    value={filterState.price[1]}
                                    onChange={(e: any) => {
                                        filterState.setPrice([
                                            filterState.price[0],
                                            e.currentTarget.value,
                                        ])

                                        console.log(e)

                                        filterState.setErrorsFilter(false)
                                        const isMinAmount = filterState.withoutMinAmount;
                                        const isStock = filterState.inStock;
                                        const IsSelectToday = filterState.IsTodaySelect;
                                        let  data = filterState.features as any;

                                        data = filteredData(isMinAmount,isStock,data,IsSelectToday);
                                        data = data.filter((item: any) => item.properties.price >= filterState.price[0] && item.properties.price < filterState.price[1]);

                                        queryClient.setQueryData(['pickup_points'],
                                            () => {
                                                const result =  {
                                                    pageParams: [0],
                                                    pages: [{
                                                        data: data.slice(0, 8),
                                                        nextPage: 1,
                                                    }]
                                                    };
                                                return result
                                        })
                                        filterState.setErrorsFilter(false)

                                    }} min={49} id="range1" className="focus-within:outline-none pl-[25px] h-full w-[90%] absolute" />
                                    {
                                        (maxPrice.focus || maxPrice.hover ) && <button onClick={() =>
                                            {
                                                filterState.setPrice([
                                                    0,
                                                    filterState.maxPrice,
                                                ])

                                                const isMinAmount = filterState.withoutMinAmount;
                                                const isStock = filterState.inStock;
                                                const IsSelectToday = filterState.IsTodaySelect;
                                                let  data = filterState.features as any;

                                                data = filteredData(isMinAmount,isStock,data,IsSelectToday);
                                                data = data.filter((item: any) => item.properties.price >= filterState.price[0] && item.properties.price < filterState.price[1]);

                                                queryClient.setQueryData(['pickup_points'],
                                                    () => {
                                                        const result =  {
                                                            pageParams: [0],
                                                            pages: [{
                                                                data: data.slice(0, 8),
                                                                nextPage: 1,
                                                            }]
                                                            };
                                                        return result
                                                })
                                                filterState.setErrorsFilter(false)
                                                if (data.length === 0) {
                                                    filterState.setErrorsFilter(true)
                                                    setEmptyData(true);
                                                }
                                            }
                                        } className='cursor-pointer h-[40px] w-[40px] right-0 flex justify-center items-center absolute'>
                                            <img className='w-[16px] h-[16px]' src="/cross.svg"  alt="" />
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className='my-[12px]'>
                        <Slider value={[filterState.price[0],filterState.price[1]]} onChange={useCallback((item: any) => {
                                filterState.setPrice(item)

                                const isMinAmount = filterState.withoutMinAmount;
                                const isStock = filterState.inStock;
                                const IsSelectToday = filterState.IsTodaySelect;
                                let  data = filterState.features as any;

                                data = filteredData(isMinAmount,isStock,data,IsSelectToday);
                                data = data.filter((item: any) => item.properties.price >= filterState.price[0] && item.properties.price < filterState.price[1]);

                                queryClient.setQueryData(['pickup_points'],
                                    () => {
                                        const result =  {
                                            pageParams: [0],
                                            pages: [{
                                                data: data.slice(0, 8),
                                                nextPage: 1,
                                            }]
                                            };
                                        return result
                                })
                                filterState.setErrorsFilter(false)
                                if (data.length === 0) {
                                    filterState.setErrorsFilter(true)
                                    setEmptyData(true);
                                }

                            },[filterState.price[0],filterState.price[1]])} range={{
                                maxCount: 4000,
                                minCount: 0,
                            }}  pushable={true}
                                count={1}
                                min={0}
                                max={filterState.maxPrice}
                            />
                        </div>

                        <div className='flex gap-[10px] grow'>
                            <Checkbox checked={filterState.isBestPrice} defaultChecked={filterState.isBestPrice} defaultValue={filterState.is24Hours} onCheckedChange={(select:boolean) => {
                                filterState.setBestPrice(select);
                            }} className='#FFFFFF' id="terms2" />
                            <label
                                htmlFor="terms2"
                                className="text-[14px] gap-[5px] font-normal leading-[20px] flex"
                            >
                                <span>Лучшая цена
                                    <span className='ml-[10px] font-medium text-[16px] text-[#00B88B]'>499 ₽</span>
                                </span>
                            </label>
                        </div>

                        <button onClick={
                            () => {
                                modalState.close();
                                selectFilterModal.onMobileClose();
                                selectFilterModal.onSelectPriceShopsClose()
                            }
                        } className='bg-[#00C293] px-[24px] py-[10px] h-[40px] w-full rounded-[99px] text-[white] text-[14px] font-semibold mt-[25px]'>Применить</button>
                    </div>
                </ModalFilterMobile>

                {/* Mobile Filter Brand */}
                <ModalFilterMobile
                className=""
                offsetOpen={`bottom-0`}
                isActive={selectFilterModal.selectShopsOpen}>
                    <div className="grow bg-[#FFFFFF] overflow-hidden flex flex-col pt-[4px] p-[16px] overflow-auto max-h-[75svh] pb-[12px] h-[100%]">
                        <div className="grow flex flex-col h-full">
                            <div className="w-full flex shrink-0 items-center justify-between">
                                <h1 className="font-semibold text-[16px] leading-[24px]">Сеть
                                    {/* Test <span className='justify-center items-center rounded-full  w-[16px] h-[16px] flex bg-[#F2F2F5] text-[#444952] text-[12px] leading-[16px] font-semibold'>1</span>     */}
                                </h1>
                                <div className='flex gap-[10px]'>
                                    <button className="font-normal block text-[14px] mr-[49px] leading-[24px] text-[#78808F] cursor-pointer hover:text-[#444952]">Сбросить</button>
                                    <button onClick={
                                        () => {
                                            modalState.close();
                                            selectFilterModal.onMobileClose();
                                            selectFilterModal.onSelectShopsModalClose()
                                        }
                                    } className="w-[36px] h-[36px] absolute  flex items-center top-[20px] flex items-center justify-center right-[12px] cursor-pointer">
                                        <img className="w-[20px] h-[20px]" src="/cross.svg" alt="cross" />
                                    </button>
                                </div>
                            </div>

                            <ul className="overflow-auto max-h-[348px] grow w-full mt-[12px]">
                                {
                                    retailChains !== undefined && retailChains.length > 0 && retailChains.map((item: any, i: number) =>
                                        <li key={i} className=' flex gap-[2px] items-center '>
                                            <div className='flex gap-[10px] grow'>
                                                <Checkbox onCheckedChange={(select) => {
                                                    if (select === true) {
                                                        setSelectRetailChains((prev: any) => {
                                                            return [...prev, {
                                                                name: item.name,
                                                                rating: item.rating,
                                                            }] as any
                                                        })
                                                    }
                                                    else {
                                                        setSelectRetailChains((prev: any) => {
                                                            return prev.filter((e: any) => e.name === item.name)
                                                        })
                                                    }
                                                }} className='#FFFFFF' id="terms2" />
                                                <label
                                                    htmlFor="terms2"
                                                    className="text-[14px] gap-[5px] font-normal leading-[20px] flex"
                                                >
                                                    <img src="/logo_shop.png"  alt="" className='h-[20px] w-[20px] object-cover' />
                                                    <span>{item.name}</span>
                                                </label>
                                            </div>

                                            <div className='shrink-0 font-normal text-[14px] leading-[22px] flex gap-[5px] items-center'>
                                                <img src="/star.svg" alt="star" />
                                                <span>{item.rating}</span>
                                            </div>
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                        <button onClick={
                            () => {
                                modalState.close();
                                selectFilterModal.onMobileClose();
                                selectFilterModal.onSelectPriceShopsClose()
                                selectFilterModal.onSelectShopsModalClose()
                            }
                        } className='shrink bg-[#00C293] px-[24px] py-[10px] h-[40px] w-full cursor-pointer rounded-[99px] text-[white] text-[14px] font-semibold mt-[18px]'>Применить</button>
                    </div>
                </ModalFilterMobile>

                {/* Modal Ballon Mobile */}
                {
                    width > 900 && <div className=" w-fit left-0 h-full absolute">
                        <ModalBallon />
                    </div>
                }

                {/* Modal Ballon Desktop */}
                {
                    width <= 900 && modalState.isOpen &&
                    <div className="h-[100svh] absolute w-full top-0 flex flex-col items-center">
                        <ModalBallon />
                    </div>
                }
                <SelectRouteBottom />

                <Outlet />
            </main>
        </div>
    );
}
