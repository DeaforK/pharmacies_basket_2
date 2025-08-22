
import { useEffect, useMemo, useState } from "react";
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
  } from "../../../shared/shadcn/components/ui/select"
import { useFilterState } from "../../../entities/store/useModalFilter";
import clsx from "clsx";
import Slider from "rc-slider";
import { Checkbox } from "../../../shared/shadcn/components/ui/checkbox";
import { useSelectFilterModal } from "../../../entities/store/useSelectFiltersModal";
import useWindowDimensions from "../../../features/hooks/useWindowDimensions";
import { useQueryClient } from "@tanstack/react-query";
import { Feature } from '../../../libs/clusterer';
import { useModalState } from "../../../entities/store/useModalState";
import { useBuyClick } from "../../../entities/store/useBuyClick";
import { useHeaderScrollState } from "../../../entities/store/useHeaderScroll";
import { useDebounce } from "../../../features/hooks/useDebounce";

const FilterTabs = () => {
    const filterState = useFilterState() as any;

    const [, setStock] = useState(false);
    const [, setPickUpToday] = useState(false);
    const [minAmount, setMinAmount] = useState(false);

    const SelectFiltersModal = useSelectFilterModal();

    const { width } = useWindowDimensions();

    const queryClient = useQueryClient();

    const modalState = useModalState();

    const [retailChains, setRetailChain] = useState() as any;

    const [, setSelectRetailChains ] = useState([]);

    const buyClick = useBuyClick();

    const [, setEmptyData] = useState(false);

    const filterCount = useMemo(() => {
        return Number(filterState.IsTodaySelect) + Number(filterState.price[0] !== 0) + Number(filterState.inStock) + Number(filterState.price[1] !== filterState.maxPrice)
        + Number(filterState.is24Hours) + Number(filterState.withoutMinAmount)  + filterState.assembleReplace
    },[filterState.IsTodaySelect, filterState.is24Hours, filterState.inStock, filterState.isOpenNow, filterState.price[0], filterState.assembleReplace, filterState.price[1], filterState.withoutMinAmount]) as any

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
        }
        filterState.setErrorsFilter(false)

        if (data.length === 0) {
            filterState.setErrorsFilter(true)
        }
        return data;
    }

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

    useEffect(() => {
        setMinAmount(filterState.withoutMinAmount)
    },[filterState.withoutMinAmount])

    const headerScrollState = useHeaderScrollState();

    const priceFilter = useMemo(() => {
        if (filterState.price[0] === 0 && filterState.price[1] === 500) {
            return 'Цена'
        }


        if (filterState.price[0] === 0 && filterState.price[1] !== filterState.maxPrice) {
            return `Цена до ${filterState.price[1]} ₽`
        }
        if (filterState.price[0] !== 0 && filterState.price[1] === filterState.maxPrice) {
            return `Цена от ${filterState.price[0]} ₽`
        }
        if (filterState.price[0] !== 0 && filterState.price[1] !== filterState.maxPrice) {
            return `Цена ${filterState.price[0]} – ${filterState.price[1]} ₽`
        }
    },[filterState.price,  filterState.maxPrice])


    const [maxPrice,setMaxPrice ] = useState({
        focus: false,
        hover: false,
    });

    const [minPrice,setMinPrice ] = useState({
        focus: false,
        hover: false,
    });

    const [isLoadingMaxPrice,setLoadingMaxPrice ] = useState(false);

    const [isLoadingMinPrice, setLoadingMinPrice ] = useState(false);

    const [,setCountFilterItems] = useState(0);

        const changeHandlerMinPrice = useDebounce((e: any) =>{
            if(e.target.value === undefined || e.target.value === '') {
                setLoadingMinPrice(false)
            }
            else {
                setLoadingMinPrice(false)
            }
        },500)

        const changeHandlerMaxPrice = useDebounce((e: any) =>{
            if(e.target.value === undefined || e.target.value === '') {
                setLoadingMaxPrice(false)
            }
            else {
                setLoadingMaxPrice(false)
            }
        },500)


    return (
        <>
            {/* Desktop */}
            <div className={`max-[900px]:hidden w-full flex justify-center items-center fixed z-[150]`}>
                <div className={` w-full max-w-[1440px]  flex z-[150] gap-[6px] overflow-x-auto  fixed top-[0px] 
                ${headerScrollState.directionScroll >= 1 && 'top-[-120px]'} 
                ${headerScrollState.directionScroll >= 1 && headerScrollState.bannerHidden === true && '!top-[48px]'} 
                ${headerScrollState.directionScroll <= 0 && headerScrollState.bannerHidden === true && '!top-[120px]'}  
                ${headerScrollState.directionScroll <= 0 && headerScrollState.bannerHidden !== true && '!top-[72px]'}  
                duration-600 transition-all  overflow-visible max-[800px]:w-full min-[800px]:justify-end py-[12px] pr-[24px] max-[800px]:pl-[20px]`}>
                    <Select  name="name1" onOpenChange={() =>
                        {
                            SelectFiltersModal.onSelectPriceShops();
                            SelectFiltersModal.onToggleMobileOpen();
                        }}
                        open={SelectFiltersModal.selectPrice === true && width >= 900}>
                        <SelectTrigger   data-size={SelectFiltersModal.selectPrice === true} className={`filter__tabs shrink-0 w-[83px] text-[14px] max-h-[48px] ${SelectFiltersModal.selectPrice && '!bg-[#DBF6F0] !text-[#000000]'} hover:text-[#444952] text-[#78808F] 
                        ${(filterState.price[0] === 0 && filterState.price[1] === 500) && '!w-[83px]'}
                        ${(filterState.price[0] === 0 && filterState.price[1] !== filterState.maxPrice) && 'w-[155px]'}
                        ${(filterState.price[0] !== 0 && filterState.price[1] === filterState.maxPrice) && 'w-[154px]'}
                        ${(filterState.price[0] !== 0 && filterState.price[1] !== filterState.maxPrice) && 'w-[182px] !text-[14px]'}
                        cursor-pointer relative justify-center items-center rounded-full border-none bg-[#FFFFFF] shadow-[0px_2px_4px_0px_#0000001A]  z-[100]`}>
                            <SelectValue className="font-normal text-[14px]   leading-[20px] ]" placeholder={priceFilter} />
                            {
                                SelectFiltersModal.selectPrice !== true  ?
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.5 1.5L5 4.5L1.5 1.5" stroke="#78808F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>

                                :
                                <svg className="rotate-[180deg]" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path  d="M8.5 1.5L5 4.5L1.5 1.5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            }

                        </SelectTrigger>

                        <SelectContent className="absolute p-[24px] top-[4px] left-[0] z-[100] w-[375px] rounded-[24px]">
                            <div className="w-full flex justify-between">
                                <h1 className="font-semibold text-[16px]  leading-[24px]">Цена, ₽</h1>
                                <button onClick={() => filterState.setPrice([0, filterState.maxPrice])} className="font-normal text-[14px] leading-[24px] text-[#78808F] cursor-pointer hover:text-[#444952]">Сбросить</button>
                            </div>

                            <div className="mt-[10px]">
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
                                            data = data.filter((item: any) => item.properties.price >= e.currentTarget.value && item.properties.price < filterState.price[1]);

                                            setCountFilterItems(data.length)

                                            setLoadingMinPrice(true)

                                            changeHandlerMinPrice(e)

                                            if (data.length === 0) {
                                                filterState.setErrorsFilter(true)
                                                setEmptyData(true);
                                            }

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
                                        }} min={49} id="range1" className="focus-within:outline-none pl-[25px]  h-full w-[90%] absolute" />
                                        {
                                            ((minPrice.focus || minPrice.hover) && !isLoadingMinPrice ) && <button onClick={() => {
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
                                                    setCountFilterItems(data.length)

                                                    setLoadingMinPrice(true)

                                                    setTimeout(() => {
                                                        setLoadingMinPrice(false)
                                                    },500)

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

                                        {
                                            isLoadingMinPrice && <svg className='right-[10px] absolute animate-spin' width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 10C3 11.4834 3.43987 12.9334 4.26398 14.1668C5.08809 15.4001 6.25943 16.3614 7.62987 16.9291C9.00032 17.4968 10.5083 17.6453 11.9632 17.3559C13.418 17.0665 14.7544 16.3522 15.8033 15.3033C16.8522 14.2544 17.5665 12.918 17.8559 11.4632C18.1453 10.0083 17.9968 8.50032 17.4291 7.12987C16.8614 5.75943 15.9001 4.58809 14.6668 3.76398C13.4334 2.93987 11.9834 2.5 10.5 2.5" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round"/>
                                            </svg>
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
                                            setLoadingMaxPrice(true);

                                            changeHandlerMaxPrice(e);

                                            filterState.setErrorsFilter(false)
                                            const isMinAmount = filterState.withoutMinAmount;
                                            const isStock = filterState.inStock;
                                            const IsSelectToday = filterState.IsTodaySelect;
                                            let  data = filterState.features as any;

                                            data = filteredData(isMinAmount,isStock,data,IsSelectToday);
                                            data = data.filter((item: any) => item.properties.price >= filterState.price[0] && item.properties.price < e.currentTarget.value);
                                            setCountFilterItems(data.length)

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
                                        }} min={49} id="range1" className="focus-within:outline-none pl-[25px] h-full w-[90%] absolute" />
                                        {
                                            ((maxPrice.focus || maxPrice.hover) && !isLoadingMaxPrice ) && <button onClick={() =>
                                                {
                                                     filterState.setPrice([
                                                        filterState.price[0],
                                                        filterState.maxPrice,
                                                    ])

                                                    setLoadingMaxPrice(true)

                                                    setTimeout(() => {
                                                        setLoadingMaxPrice(false)
                                                    },500)


                                                    const isMinAmount = filterState.withoutMinAmount;
                                                    const isStock = filterState.inStock;
                                                    const IsSelectToday = filterState.IsTodaySelect;
                                                    let  data = filterState.features as any;

                                                    data = filteredData(isMinAmount,isStock,data,IsSelectToday);
                                                    data = data.filter((item: any) => item.properties.price >= filterState.price[0] && item.properties.price < filterState.price[1]);
                                                    setCountFilterItems(data.length)

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
                                        {
                                            isLoadingMaxPrice && <svg className='right-[10px] absolute animate-spin' width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 10C3 11.4834 3.43987 12.9334 4.26398 14.1668C5.08809 15.4001 6.25943 16.3614 7.62987 16.9291C9.00032 17.4968 10.5083 17.6453 11.9632 17.3559C13.418 17.0665 14.7544 16.3522 15.8033 15.3033C16.8522 14.2544 17.5665 12.918 17.8559 11.4632C18.1453 10.0083 17.9968 8.50032 17.4291 7.12987C16.8614 5.75943 15.9001 4.58809 14.6668 3.76398C13.4334 2.93987 11.9834 2.5 10.5 2.5" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round"/>
                                            </svg>
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className='my-[20px]'>
                                <Slider value={[filterState.price[0],filterState.price[1]]} onChange={(item) => {
                                    filterState.setPrice(item)

                                    const isMinAmount = filterState.withoutMinAmount;
                                    const isPickUpToday =filterState.pickUpToday;
                                    const isStock = filterState.inStock;

                                    let  data = filterState.features;
                                    data = filteredData(isPickUpToday,isMinAmount,isStock,data);

                                    data = data.filter((item: any) => item.properties.price >= filterState.price[0] && item.properties.price < filterState.price[1]);

                                    filterState.setErrorsFilter(false)

                                    if (data.length === 0) {
                                        filterState.setErrorsFilter(true)
                                    }

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
                                }} range={{
                                    maxCount: 4000,
                                    minCount: 0,
                                }}  pushable={true}
                                    count={1}
                                    min={0}
                                    max={filterState.maxPrice}
                                />
                            </div>

                            <div className='flex gap-[10px] grow'>
                                <Checkbox className='#FFFFFF' id="terms2" />
                                <label
                                    htmlFor="terms2"
                                    className="text-[14px] gap-[5px] font-normal leading-[20px] flex"
                                >
                                    <span>Лучшая цена
                                        <span className='ml-[10px] font-medium text-[16px] text-[#00B88B]'>499 ₽</span>
                                    </span>
                                </label>
                            </div>
                        </SelectContent>
                    </Select>

                    {
                        !buyClick.isOpen &&
                        <button onClick={() => {
                            setStock(prev => !prev)
                            filterState.setStock();

                            const isMinAmount = filterState.withoutMinAmount;
                            const isPickUpToday = filterState.pickUpToday;
                            const isStock = !filterState.inStock;

                            let  data = filterState.features;

                            data = filteredData(isPickUpToday,isMinAmount,isStock,data);

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
                        }} className={clsx("filter__tabs shrink-0 cursor-pointer font-normal text-[14px] px-[20px] py-[14px]  leading-[20px] w-fit h-[48px] justify-center items-center rounded-full border-none  shadow-[0px_2px_4px_0px_#0000001A]  z-[100] relative",
                            {
                                ['bg-[#DBF6F0]']: filterState.inStock,
                                ['bg-[#FFFFFF]']: !filterState.inStock,
                                ['text-[#000000]']: filterState.inStock,
                                ['text-[#78808F]']: ! filterState.inStock,
                            }
                        )}>
                            Всё в наличии
                        </button>
                    }


                    <button onClick={() =>  {
                        setPickUpToday(prev => !prev)
                        filterState.setPickUpToday();

                        const isMinAmount = filterState.withoutMinAmount;
                        const isPickUpToday = !filterState.pickUpToday;
                        const isStock = filterState.inStock;

                        let  data = filterState.features;

                        data = filteredData(isPickUpToday,isMinAmount,isStock,data);

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
                    }}  className={clsx("filter__tabs shrink-0 cursor-pointer font-normal text-[14px] px-[20px] py-[14px] leading-[20px] w-fit h-[48px] justify-center items-center rounded-full border-none shadow-[0px_2px_4px_0px_#0000001A]  z-[100] relative",
                        {
                            ['bg-[#DBF6F0]']: filterState.pickUpToday,
                            ['bg-[#FFFFFF]']: !filterState.pickUpToday,
                            ['text-[#000000]']: filterState.pickUpToday,
                            ['text-[#78808F]']: ! filterState.pickUpToday,
                        }
                    )}>
                        Забрать сегодня
                    </button>

                                        <Select  onOpenChange={() => {
                        SelectFiltersModal.onSelectShopsModal();
                        SelectFiltersModal.onToggleMobileOpen();
                    }} open={SelectFiltersModal.selectShopsOpen === true && width >= 900 }>
                        <SelectTrigger data-size={0} className={`filter__tabs cursor-pointer shrink-0 w-[83px] max-h-[48px] justify-center items-center rounded-full border-none ${SelectFiltersModal.selectShopsOpen && '!bg-[#DBF6F0] !text-[#000000]'} hover:!text-[#444952] text-[#78808F] bg-[#FFFFFF] shadow-[0px_2px_4px_0px_#0000001A]  z-[100] relative`}>
                            <SelectValue className="font-normal text-[14px] text-[#78808F] leading-[20px]" placeholder="Сеть" />
                            {
                                SelectFiltersModal.selectShopsOpen !== true  ?
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.5 1.5L5 4.5L1.5 1.5" stroke="#78808F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>

                                :
                                <svg className="rotate-[180deg]" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path  d="M8.5 1.5L5 4.5L1.5 1.5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>


                            }
                        </SelectTrigger>

                        <SelectContent  className="min-[900px]:hidden relative z-[100] w-[375px] p-[24px] pb-[32px] left-[-295px] top-[4px] rounded-[24px]">
                            <div className='flex justify-between'>
                                <h1 className='flex gap-[5px] font-semibold text-[16px] leading-[24px] items-center'>Сеть
                                    <span className='justify-center items-center rounded-full  w-[16px] h-[16px] flex bg-[#F2F2F5] text-[#444952] text-[12px] leading-[16px] font-semibold'>1</span>
                                </h1>

                                <button className='text-[#78808F] text-[14px] font-normal cursor-pointer hover:text-[#444952]'>Сбросить</button>
                            </div>

                            <ul className="mt-[20px] ">
                                {
                                    retailChains !== undefined && retailChains.length > 0 && retailChains.map((item: any, i: number) =>
                                        <li key={i} className='mt-[5px] flex gap-[10px] items-center '>
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
                        </SelectContent>
                    </Select>

                    <button onClick={() =>  {
                        setMinAmount(prev => !prev)
                        filterState.setMinAmount();

                        const isMinAmount = !filterState.withoutMinAmount;
                        const isPickUpToday = filterState.pickUpToday;
                        const isStock = filterState.inStock;

                        let  data = filterState.features;

                        data = filteredData(isPickUpToday,isMinAmount,isStock,data);

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
                    }}  className={clsx("filter__tabs shrink-0 cursor-pointer font-normal text-[14px] px-[20px] py-[14px] leading-[20px] w-fit h-[48px] justify-center items-center rounded-full border-none shadow-[0px_2px_4px_0px_#0000001A]  z-[100] relative",
                        {
                            ['bg-[#DBF6F0]']: minAmount,
                            ['bg-[#FFFFFF]']: !minAmount,
                            ['text-[#000000]']: minAmount,
                            ['text-[#78808F]']: !minAmount,
                        }
                    )}>
                        Без мин. суммы
                    </button>

                    <button onClick={() =>  {
                        filterState.setAssembleReplace(!filterState.assembleReplace);


                        const isMinAmount = !filterState.withoutMinAmount;
                        const isPickUpToday = filterState.pickUpToday;
                        const isStock = filterState.inStock;

                        let  data = filterState.features;

                        data = filteredData(isPickUpToday,isMinAmount,isStock,data);

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
                    }}  className={clsx("filter__tabs shrink-0 cursor-pointer font-normal text-[14px] px-[20px] py-[14px] leading-[20px] w-fit h-[48px] justify-center items-center rounded-full border-none shadow-[0px_2px_4px_0px_#0000001A]  z-[100] relative",
                        {
                            ['bg-[#DBF6F0]']: filterState.assembleReplace,
                            ['bg-[#FFFFFF]']: !filterState.assembleReplace,
                            ['text-[#000000]']: filterState.assembleReplace,
                            ['text-[#78808F]']: !filterState.assembleReplace,
                        }
                    )}>
                        Собрать с заменой
                    </button>

                    <button onClick={() => {filterState.toggleModalState();modalState.close()}} className="cursor-pointer shrink-0 flex font-normal text-[14px]  text-[#78808F] leading-[20px] w-[48px] h-[48px] justify-center items-center rounded-full border-none bg-[#FFFFFF] shadow-[0px_2px_4px_0px_#0000001A]  z-[100] relative">
                        <div className="h-[20px] w-[20px] relative btn-filter">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.91699 11.6667C9.2977 11.6667 10.417 12.786 10.417 14.1667C10.417 15.5474 9.2977 16.6667 7.91699 16.6667C6.53628 16.6667 5.41699 15.5474 5.41699 14.1667C5.41699 12.786 6.53628 11.6667 7.91699 11.6667Z" stroke="#ABB6CC" strokeWidth="2"/>
                                <path d="M12.083 3.33323C10.7023 3.33323 9.58301 4.45252 9.58301 5.83323C9.58301 7.21394 10.7023 8.33323 12.083 8.33323C13.4637 8.33323 14.583 7.21394 14.583 5.83323C14.583 4.45252 13.4637 3.33323 12.083 3.33323Z" stroke="#ABB6CC" strokeWidth="2"/>
                                <path d="M10.5 14.1321L18.3333 14.1321" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M9.5 5.79883L1.66667 5.79883" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M1.66699 14.1321L5.33366 14.1321" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M18.333 5.79883L14.6663 5.79883" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>
                        {
                            filterCount > 0 &&  <span className=" bg-[#EB1C4E] text-center w-[16px] h-[16px] flex justify-center rounded-full absolute top-0 right-0  leading-[16px] text-[11px] font-semibold text-[#FFFFFF]">
                                {
                                filterCount
                                }
                            </span>
                        }

                    </button>
                </div>
            </div>


            {/* Mobile */}
            <div className={`min-[900px]:hidden max-[425px]:px-[16px] max-[425px]:py-[12px] fixed top-[-100px] 
                ${headerScrollState.directionScroll <= 0 && 'top-[146px]'}
                ${headerScrollState.directionScroll <= 0 && headerScrollState.bannerHidden === false && '!top-[96px]'}
                ${headerScrollState.directionScroll <= 0 && headerScrollState.bannerHidden === true && '!top-[136px]'}
                ${headerScrollState.directionScroll >= 1 && headerScrollState.bannerHidden === true && '!top-[72px]'} 
                ${headerScrollState.directionScroll >= 1 && headerScrollState.bannerHidden !== true && '!top-[0px]'}   duration-600 transition-all  flex z-[150] gap-[6px] !pl-[16px] overflow-x-auto overflow-visible max-[800px]:w-full min-[800px]:justify-end py-[10px] pr-[15px] max-[800px]:pl-[20px]`}>
                <Select name="name2"  onOpenChange={() => {
                    SelectFiltersModal.onSelectPriceShops()
                    SelectFiltersModal.onToggleMobileOpen();
                    modalState.close();
                    }} open={SelectFiltersModal.selectPrice === true  && width <= 900}>
                    <SelectTrigger data-size={0} className={`shrink-0 w-[71px] max-h-[40px] justify-center items-center rounded-full border-non e bg-[#FFFFFF] shadow-[0px_2px_4px_0px_#0000001A]  z-[100] relative ${SelectFiltersModal.selectPrice && '!bg-[#DBF6F0] !text-[#000000]'} hover:text-[#444952] text-[#78808F] `}>
                        <SelectValue className="font-normal text-[14px] text-[#78808F] leading-[20px]" placeholder="Цена"/>
                                                        {
                                SelectFiltersModal.selectPrice !== true  ?
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.5 1.5L5 4.5L1.5 1.5" stroke="#78808F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>

                                :
                                <svg className="rotate-[180deg]" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path  d="M8.5 1.5L5 4.5L1.5 1.5" stroke="#000000"  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>


                            }
                    </SelectTrigger>
                </Select>
                {
                    !buyClick.isOpen &&
                    <button onClick={() => {
                        setStock(prev => !prev)
                        filterState.setStock();

                        const isMinAmount = filterState.withoutMinAmount;
                        const isPickUpToday = filterState.pickUpToday;
                        const isStock = !filterState.inStock;

                        let  data = filterState.features;

                        data = filteredData(isPickUpToday,isMinAmount,isStock,data);

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
                    }} className={clsx("shrink-0 max-h-[40px] cursor-pointer font-normal text-[14px]  px-[16px]  leading-[20px] max-w-[125px] font-normal text-[14px] justify-center items-center rounded-full border-none  shadow-[0px_2px_4px_0px_#0000001A]  z-[100] relative",
                        {
                            ['bg-[#DBF6F0]']: filterState.inStock,
                            ['bg-[#FFFFFF]']: !filterState.inStock,
                            ['text-[#000000]']: filterState.inStock,
                            ['text-[#78808F]']: !filterState.inStock,
                        }
                    )}>
                        Всё в наличии
                    </button>
                }

                <button onClick={() =>  {
                    setPickUpToday(prev => !prev)
                    filterState.setPickUpToday();

                    const isMinAmount = filterState.withoutMinAmount;
                    const isPickUpToday = !filterState.pickUpToday;
                    const isStock = filterState.inStock;

                    let  data = filterState.features;

                    data = filteredData(isPickUpToday,isMinAmount,isStock,data);

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
                }}   className={clsx("shrink-0 cursor-pointer font-normal text-[14px] px-[16px] py-[14px] max-w-[141px] leading-[20px] w-fit h-[40px] flex  justify-center items-center rounded-full border-none shadow-[0px_2px_4px_0px_#0000001A]  z-[100] relative",
                    {
                        ['bg-[#DBF6F0]']: filterState.pickUpToday,
                        ['bg-[#FFFFFF]']: !filterState.pickUpToday,
                        ['text-[#000000]']: filterState.pickUpToday,
                        ['text-[#78808F]']: !filterState.pickUpToday,
                    }
                )}>
                    Забрать сегодня
                </button>

                <Select  onOpenChange={() => {
                    SelectFiltersModal.onSelectShopsModal()
                    SelectFiltersModal.onToggleMobileOpen();
                    }} open={SelectFiltersModal.selectShopsOpen === true  && SelectFiltersModal.isMobileOpen}>
                    <SelectTrigger data-size={0} className={`${SelectFiltersModal.selectShopsOpen && `!bg-[#DBF6F0] !text-[#000000]'} hover:!text-[#444952] text-[#78808F] bg-[#FFFFFF] shadow-[0px_2px_4px_0px_#0000001A]  z-[100] relative`} shrink-0 w-[83px] max-h-[40px] flex  justify-center items-center rounded-full border-none bg-[#FFFFFF] shadow-[0px_2px_4px_0px_#0000001A]  z-[100] relative`}>
                        <SelectValue className="font-normal text-[14px] text-[#78808F] leading-[20px]" placeholder="Сеть" />
                        {
                                SelectFiltersModal.selectShopsOpen !== true  ?
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.5 1.5L5 4.5L1.5 1.5" stroke="#78808F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>

                                :
                                <svg className="rotate-[180deg]" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path  d="M8.5 1.5L5 4.5L1.5 1.5" stroke="#000000"  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>


                            }
                    </SelectTrigger>
                </Select>

                <button onClick={() =>  {
                    setMinAmount(prev => !prev)
                    filterState.setMinAmount();

                    const isMinAmount = !filterState.withoutMinAmount;
                    const isPickUpToday = filterState.pickUpToday;
                    const isStock = filterState.inStock;

                    let  data = filterState.features;

                    data = filteredData(isPickUpToday,isMinAmount,isStock,data);

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
                }}  className={clsx("shrink-0 cursor-pointer font-normal text-[14px] px-[16px] py-[14px] leading-[20px] w-fit h-[40px] flex  justify-center items-center rounded-full border-none shadow-[0px_2px_4px_0px_#0000001A]  z-[100] relative",
                    {
                        ['bg-[#DBF6F0]']: filterState.withoutMinAmount,
                        ['bg-[#FFFFFF]']: !filterState.withoutMinAmount,
                        ['text-[#000000]']: filterState.withoutMinAmount,
                        ['text-[#78808F]']: !filterState.withoutMinAmount,
                    }
                )}>
                    Без мин. суммы
                </button>
                <button onClick={() =>  {
                    filterState.setAssembleReplace(!filterState.assembleReplace);

                    const isMinAmount = !filterState.withoutMinAmount;
                    const isPickUpToday = filterState.pickUpToday;
                    const isStock = filterState.inStock;

                    let  data = filterState.features;

                    data = filteredData(isPickUpToday,isMinAmount,isStock,data);

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
                }}  className={clsx("shrink-0 cursor-pointer font-normal text-[14px] px-[16px] py-[14px] leading-[20px] w-fit h-[40px] flex  justify-center items-center rounded-full border-none shadow-[0px_2px_4px_0px_#0000001A]  z-[100] relative",
                    {
                        ['bg-[#DBF6F0]']: filterState.assembleReplace,
                        ['bg-[#FFFFFF]']: !filterState.assembleReplace,
                        ['text-[#000000]']: filterState.assembleReplace,
                        ['text-[#78808F]']: !filterState.assembleReplace,
                    }
                )}>
                    Собрать с заменой
                </button>

            </div>
        </>
    );
};

export default FilterTabs;
