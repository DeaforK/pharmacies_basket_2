import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Checkbox } from '../../shared/shadcn/components/ui/checkbox';
import { useFilterState } from '../../entities/store/useModalFilter';
import { Feature } from '../../libs/clusterer';
import { useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '../../features/hooks/useDebounce';

const ModalFilter = () => {
    const [selectData, setSelectDate] = useState('tomorrow');

    const filterModalState = useFilterState() as any;

    const [selectsActions, setSelectsActions ] = useState([]);

    const queryClient = useQueryClient();

    const [isEmptyData, setEmptyData] = useState(false);

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

    const [isLoading,setLoading] = useState(false);

    const [countFilterItems,setCountFilterItems] = useState(0);


    function filteredData(isMinAmount: boolean,isStock: boolean,data: any[],IsSelectToday: boolean): any[] {

        const isOpenNow = filterModalState.isOpenNow;
        const is24Hours = filterModalState.is24Hours;
        const assembleReplace = filterModalState.assembleReplace;
        setLoading(true)

        setEmptyData(false);

        if (isOpenNow) {
            data = data.filter((item: any) => item.properties.isOpenNow === true);
        }
        if (is24Hours) {
            data = data.filter((item: any) => item.properties.is24Hours === true);
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
        if (IsSelectToday) {
            data = data.filter((item: any) => item.properties.deliveryTime !== 'Нет доставки' && item.properties.deliveryTime === 'Забрать сегодня');
        }

                if (data.length === 0) {
            filterModalState.setErrorsFilter(true)
            setEmptyData(true);
        }

        setCountFilterItems(data.length)

        return data;
    }

    let loader: any = null

    useEffect(() => {
        clearTimeout(loader)

        if (isLoading) {
            loader = setTimeout(() => {
                setLoading(false)
            },1000)

            if(loader !==  null) {

                return () => clearTimeout(loader)
            }
            loader = null
        }
    }, [isLoading])


    useEffect(() => {
        const IsSelectToday = filterModalState.IsTodaySelect;

        if(IsSelectToday) {
            setSelectDate('today')
        }
        else {
            setSelectDate('tomorrow')
        }
    },[])

    useEffect(() => {
        const result = [] as any[];

        for (let index = 0; index < filterModalState.features.length; index++) {
            let IsInclude = {} as Feature | undefined

            if (result !== undefined) {
                IsInclude = result.find((item: any) => item.name === filterModalState.features[index].properties.network as any)
            }

            if(IsInclude === undefined || IsInclude === null)
            {
                result.push({
                    name: filterModalState.features[index].properties.network as any,
                    rating: filterModalState.features[index].properties.rating,
                })
            }
        }
    },[filterModalState.features])

    useEffect(() => {
        filterModalState.setTodaySelect(selectData === 'today');

        const isMinAmount = filterModalState.withoutMinAmount;
        const isStock = filterModalState.inStock;
        const IsSelectToday = filterModalState.IsTodaySelect;

        let  data = filterModalState.features as any;
        data = filteredData(isMinAmount,isStock,data,IsSelectToday);
        data = data.filter((item: any) => item.properties.price >= filterModalState.price[0] && item.properties.price < filterModalState.price[1]);
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
        filterModalState.setErrorsFilter(false)
        if (data.length === 0) {
            filterModalState.setErrorsFilter(true)
            setEmptyData(true);
        }
    },[selectData, filterModalState.IsTodaySelect])

    const filterCount = useMemo(() => {
            return Number(filterModalState.IsTodaySelect) + Number(filterModalState.price[0] !== 0) + Number(filterModalState.inStock) + Number(filterModalState.price[1] !== filterModalState.maxPrice)
            + Number(filterModalState.is24Hours) + Number(filterModalState.withoutMinAmount) + Number(filterModalState.isOpenNow)  + filterModalState.assembleReplace
    },[filterModalState.IsTodaySelect, filterModalState.is24Hours, filterModalState.inStock, filterModalState.isOpenNow,filterModalState.isOpenNow, filterModalState.price[0],filterModalState.assembleReplace, filterModalState.price[1], filterModalState.withoutMinAmount])

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
            <div className=' h-[98%] mr-[10px] flex flex-col overflow-hidden  rounded-[24px] z-[500]  right-[0px] bg-[#FFFFFF] fixed w-[375px] max-[425px]:p-[0px] max-[425px]:h-[100%] max-[425px]:w-[100%] max-[425px]:m-[0px] max-[425px]:rounded-none  max-[425px]:ml-[10px]  max-[425px]:w-[98%]'>
                <div className="shrink-0 w-full py-[16px] ml-[24px] h-[56px] max-[425px]:ml-[16px]">
                    <h2 className="font-semibold text-[18px] leading-[24px] flex gap-[8px] items-center">
                        Фильтры
                        {
                            filterCount > 0 && <span className="h-[20px] w-[20px] bg-[#EB1C4E] rounded-[99px] flex justify-center items-center text-[12px] leading-[16px] font-semibold text-[white]">
                            {
                                filterCount
                            }
                            </span>
                        }

                    </h2>

                    <button onClick={() => filterModalState.close()} className="max-[425px]:right-[12px] w-[36px] h-[36px] flex justify-center items-center absolute top-[10px] right-[14px] cursor-pointer">
                        <img src="/cross.svg" alt="cross" />
                    </button>
                </div>

                <div className="scrollbar h-[64px] mt-[8px] grow max-[90%] overflow-y-auto ml-[26px] mr-[4px] max-[425px]:ml-[16px]">
                    <button className="cursor-pointer btn-filter_region mb-[20px] w-full max-w-[327px] flex items-center mr-[6px]">
                            <svg className='marker_icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M6.96927 15.0809L8 15.9995L9.03073 15.0809C12.3221 12.1477 14 9.54211 14 7.10311C14 3.64043 11.3426 1 8 1C4.65737 1 2 3.64043 2 7.10311C2 9.54211 3.67789 12.1477 6.96927 15.0809ZM11 7C11 5.34315 9.65685 4 8 4C6.34315 4 5 5.34315 5 7C5 8.65685 6.34315 10 8 10C9.65685 10 11 8.65685 11 7Z" fill="#DADADA"/>
                            </svg>

                            <span className="font-normal text-[16px]  ml-[10px]">Москва и МО</span>

                            <svg className='arrow_icon ml-[2px]' width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.5 2.5L7.5 6L4.5 9.5" stroke="#78808F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>

                    </button>
                    {
                        selectsActions.length > 0 && <div className='mr-[12px]'>
                            <h1 className="font-semibold text-[16px]  leading-[24px]">Ваш выбор</h1>

                            <ul className='flex flex-wrap gap-[5px] mt-[14px]'>
                                {
                                    selectsActions !== undefined && selectsActions.map((item: any,i: number) =>
                                        <li key={i} className='cursor-pointer hover:bg-[#F2F2F5] bg-[#F7F7FA] h-[32px] pr-[6px] pt-[5px] pl-[8px] pb-[7px] w-fit flex gap-[6px] items-center rounded-[8px]'>
                                            <span className='block'>{item.name}</span>
                                            <button onClick={() => {
                                                setSelectsActions((prev: any) => prev.filter((e: any) => e.name !== item.name))
                                                item.callbackCancel()}} className='cursor-pointer w-[12px] h-[12px] mt-[10px] mb-[10px]  flex items-center justify-center'>
                                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M10 2L2 10" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M2 2L10 10" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                            </button>
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                    }


                    <div className={`mr-[12px] ${selectsActions !== undefined && 'mt-[32px]'}`}>
                        <div className="w-full flex justify-between">
                            <h1 className="font-semibold text-[16px]  leading-[24px]">Цена, ₽</h1>
                            <button onClick={() => {
                                filterModalState.setPrice([
                                    0,
                                    filterModalState.maxPrice,
                                ])
                                setSelectsActions((prev: any) => prev.filter((e: any) => e.name.includes('₽') !== true))
                                setSelectsActions((prev: any) => prev.filter((e: any) => e.name !== 'Без минимальной суммы'))

                                filterModalState.setMinAmountSelect(false);

                                filterModalState.setNotStock();

                                filterModalState.setAssembleReplace(false)

                                const isMinAmount = filterModalState.withoutMinAmount;
                                const isStock = filterModalState.inStock;
                                const IsSelectToday = filterModalState.IsTodaySelect;

                                let  data = filterModalState.features as any;
                                data = filteredData(isMinAmount,isStock,data,IsSelectToday);

                                data = data.filter((item: any) => item.properties.price >= 0 && item.properties.price <  filterModalState.maxPrice);
                                filterModalState.setErrorsFilter(false)
                                setCountFilterItems(data.length)

                                if (data.length === 0) {
                                    filterModalState.setErrorsFilter(true)
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

                            }} className="font-normal text-[14px] leading-[24px] text-[#78808F] cursor-pointer hover:text-[#444952]">Сбросить</button>
                        </div>

                        <div className="mt-[14px]">
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
                                    })} value={filterModalState.price[0]}
                                    onChange={(e: any) => {
                                        filterModalState.setPrice([
                                            e.currentTarget.value,
                                            filterModalState.price[1],
                                        ])

                                        filterModalState.setErrorsFilter(false)
                                        const isMinAmount = filterModalState.withoutMinAmount;
                                        const isStock = filterModalState.inStock;
                                        const IsSelectToday = filterModalState.IsTodaySelect;
                                        let  data = filterModalState.features as any;

                                        data = filteredData(isMinAmount,isStock,data,IsSelectToday);
                                        data = data.filter((item: any) => item.properties.price >= e.currentTarget.value && item.properties.price < filterModalState.price[1]);

                                        setCountFilterItems(data.length)

                                        setLoadingMinPrice(true)

                                        changeHandlerMinPrice(e)

                                        if (data.length === 0) {
                                            filterModalState.setErrorsFilter(true)
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
                                        filterModalState.setErrorsFilter(false)


                                        setSelectsActions((prev: any) => prev.filter((e: any) => e.name.includes('₽') !== true))

                                        if(filterModalState.price[0] !== 0 && filterModalState.price[1] !== filterModalState.maxPrice) {
                                                setSelectsActions((prev) => {
                                                return [...prev,{ name: e.target.value  + '-' + filterModalState.price[1] + '₽',
                                                    callbackCancel: () => filterModalState.setPrice([0,filterModalState.maxPrice])
                                                }] as any
                                            })

                                            return;
                                        }
                                        if (filterModalState.price[0] !== 0 && filterModalState.price[1] === filterModalState.maxPrice) {
                                            setSelectsActions((prev) => {
                                                return [...prev,{ name: 'от ' + e.target.value + '₽',
                                                    callbackCancel: () => filterModalState.setPrice([0,filterModalState.price[1]])
                                                }] as any
                                            })
                                        }
                                        if (filterModalState.price[1] !== filterModalState.maxPrice && filterModalState.price[0] === 0) {
                                            setSelectsActions((prev) => {
                                                return [...prev,{ name: 'до ' + filterModalState.price[1] + '₽',
                                                    callbackCancel: () => filterModalState.setPrice([filterModalState.price[0],filterModalState.maxPrice])
                                                }] as any
                                            })
                                        }
                                    }} min={49} id="range1" className="focus-within:outline-none pl-[25px]  h-full w-[90%] absolute" />
                                    {
                                        ((minPrice.focus || minPrice.hover) && !isLoadingMinPrice ) && <button onClick={() => {
                                                filterModalState.setPrice([
                                                    0,
                                                    filterModalState.price[1],
                                                ])
                                                setSelectsActions((prev: any) => prev.filter((e: any) => e.name.includes('₽') !== true))

                                                const isMinAmount = filterModalState.withoutMinAmount;
                                                const isStock = filterModalState.inStock;
                                                const IsSelectToday = filterModalState.IsTodaySelect;
                                                let  data = filterModalState.features as any;

                                                data = filteredData(isMinAmount,isStock,data,IsSelectToday);
                                                data = data.filter((item: any) => item.properties.price >= filterModalState.price[0] && item.properties.price < filterModalState.price[1]);
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
                                                filterModalState.setErrorsFilter(false)
                                                if (data.length === 0) {
                                                    filterModalState.setErrorsFilter(true)
                                                    setEmptyData(true);
                                                }

                                                setSelectsActions((prev: any) => prev.filter((e: any) => e.name.includes('₽') !== true))

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
                                    value={filterModalState.price[1]}
                                    onChange={(e: any) => {
                                        filterModalState.setPrice([
                                            filterModalState.price[0],
                                            e.currentTarget.value,
                                        ])
                                        setLoadingMaxPrice(true);

                                        changeHandlerMaxPrice(e);

                                        filterModalState.setErrorsFilter(false)
                                        const isMinAmount = filterModalState.withoutMinAmount;
                                        const isStock = filterModalState.inStock;
                                        const IsSelectToday = filterModalState.IsTodaySelect;
                                        let  data = filterModalState.features as any;

                                        data = filteredData(isMinAmount,isStock,data,IsSelectToday);
                                        data = data.filter((item: any) => item.properties.price >= filterModalState.price[0] && item.properties.price < e.currentTarget.value);
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
                                        filterModalState.setErrorsFilter(false)
                                        if (data.length === 0) {
                                            filterModalState.setErrorsFilter(true)
                                            setEmptyData(true);
                                        }

                                        setSelectsActions((prev: any) => prev.filter((e: any) => e.name.includes('₽') !== true))

                                        if(filterModalState.price[0] !== 0 && filterModalState.price[1] !== filterModalState.maxPrice) {
                                                setSelectsActions((prev) => {
                                                return [...prev,{ name: filterModalState.price[0]  + '-' + e.target.value + '₽',
                                                    callbackCancel: () => filterModalState.setPrice([0,filterModalState.maxPrice])
                                                }] as any
                                            })

                                            return;
                                        }
                                        if (filterModalState.price[0] !== 0 && filterModalState.price[1] === filterModalState.maxPrice) {
                                            setSelectsActions((prev) => {
                                                return [...prev,{ name: 'от ' + filterModalState.price[0] + '₽',
                                                    callbackCancel: () => filterModalState.setPrice([0,filterModalState.price[1]])
                                                }] as any
                                            })
                                        }
                                        if (filterModalState.price[1] !== filterModalState.maxPrice && filterModalState.price[0] === 0) {
                                            setSelectsActions((prev) => {
                                                return [...prev,{ name: 'до ' + e.target.value + '₽',
                                                    callbackCancel: () => filterModalState.setPrice([filterModalState.price[0],filterModalState.maxPrice])
                                                }] as any
                                            })
                                        }
                                    }} min={49} id="range1" className="focus-within:outline-none pl-[25px] h-full w-[90%] absolute" />
                                    {
                                        ((maxPrice.focus || maxPrice.hover) && !isLoadingMaxPrice ) && <button onClick={() =>
                                            {
                                                filterModalState.setPrice([
                                                        filterModalState.price[0],
                                                        filterModalState.maxPrice,
                                                ])

                                                setSelectsActions((prev: any) => prev.filter((e: any) => e.name.includes('₽') !== true))

                                                setLoadingMaxPrice(true)

                                                setTimeout(() => {
                                                    setLoadingMaxPrice(false)
                                                },500)


                                                const isMinAmount = filterModalState.withoutMinAmount;
                                                const isStock = filterModalState.inStock;
                                                const IsSelectToday = filterModalState.IsTodaySelect;
                                                let  data = filterModalState.features as any;

                                                data = filteredData(isMinAmount,isStock,data,IsSelectToday);
                                                data = data.filter((item: any) => item.properties.price >= filterModalState.price[0] && item.properties.price < filterModalState.price[1]);
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
                                                filterModalState.setErrorsFilter(false)
                                                if (data.length === 0) {
                                                    filterModalState.setErrorsFilter(true)
                                                    setEmptyData(true);
                                                }

                                                if(filterModalState.price[0] !== 0 && filterModalState.price[1] !== filterModalState.maxPrice) {
                                                        setSelectsActions((prev) => {
                                                        return [...prev,{ name: filterModalState.price[0]  + '-' + filterModalState.price[1] + '₽',
                                                            callbackCancel: () => filterModalState.setPrice([0,filterModalState.maxPrice])
                                                        }] as any
                                                    })

                                                    return;
                                                }
                                                if (filterModalState.price[0] !== 0 && filterModalState.price[1] === filterModalState.maxPrice) {
                                                    setSelectsActions((prev) => {
                                                        return [...prev,{ name: 'от ' + filterModalState.price[0] + '₽',
                                                            callbackCancel: () => filterModalState.setPrice([0,filterModalState.price[1]])
                                                        }] as any
                                                    })
                                                }
                                                if (filterModalState.price[1] !== filterModalState.maxPrice && filterModalState.price[0] === 0) {
                                                    setSelectsActions((prev) => {
                                                        return [...prev,{ name: 'до ' + filterModalState.price[1] + '₽',
                                                            callbackCancel: () => filterModalState.setPrice([filterModalState.price[0],filterModalState.maxPrice])
                                                        }] as any
                                                    })
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

                        <div className='my-[12px]'>
                        <Slider value={[filterModalState.price[0],filterModalState.price[1]]} onChange={useCallback((item: any) => {
                                filterModalState.setPrice(item)

                                const isMinAmount = filterModalState.withoutMinAmount;
                                const isStock = filterModalState.inStock;
                                const IsSelectToday = filterModalState.IsTodaySelect;
                                let  data = filterModalState.features as any;

                                data = filteredData(isMinAmount,isStock,data,IsSelectToday);
                                data = data.filter((item: any) => item.properties.price >= filterModalState.price[0] && item.properties.price < filterModalState.price[1]);

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
                                filterModalState.setErrorsFilter(false)
                                if (data.length === 0) {
                                    filterModalState.setErrorsFilter(true)
                                    setEmptyData(true);
                                }

                                setSelectsActions((prev: any) => prev.filter((e: any) => e.name.includes('₽') !== true))

                                if(filterModalState.price[0] !== 0 && filterModalState.price[1] !== filterModalState.maxPrice) {
                                        setSelectsActions((prev) => {
                                        return [...prev,{ name: filterModalState.price[0]  + '-' + filterModalState.price[1] + '₽',
                                            callbackCancel: () => filterModalState.setPrice([0,filterModalState.maxPrice])
                                        }] as any
                                    })

                                    return;
                                }
                                if (filterModalState.price[0] !== 0 && filterModalState.price[1] === filterModalState.maxPrice) {
                                    setSelectsActions((prev) => {
                                        return [...prev,{ name: 'от ' + item[0] + '₽',
                                            callbackCancel: () => filterModalState.setPrice([0,filterModalState.price[1]])
                                        }] as any
                                    })
                                }
                                if (filterModalState.price[1] !== filterModalState.maxPrice && filterModalState.price[0] === 0) {
                                    setSelectsActions((prev) => {
                                        return [...prev,{ name: 'до ' + item[1] + '₽',
                                            callbackCancel: () => filterModalState.setPrice([filterModalState.price[0],filterModalState.maxPrice])
                                        }] as any
                                    })
                                }
                            },[filterModalState.price[0],filterModalState.price[1]])} range={{
                                maxCount: 4000,
                                minCount: 0,
                            }}  pushable={true}
                                count={1}
                                min={0}
                                max={filterModalState.maxPrice}
                            />
                        </div>

                        <div className='flex gap-[10px] grow w-full'>
                            <Checkbox checked={filterModalState.isBestPrice} defaultChecked={filterModalState.isBestPrice} defaultValue={filterModalState.is24Hours} onCheckedChange={(select:boolean) => {
                                filterModalState.setBestPrice(select);
                            }} className='#FFFFFF' id="terms2" />
                            <label
                                htmlFor="terms2"
                                className="text-[14px] w-full gap-[5px] font-normal leading-[20px] flex"
                            >
                                <span>Лучшая цена
                                    <span className='ml-[10px] font-medium text-[16px] text-[#00B88B]'>499 ₽</span>
                                </span>
                            </label>
                        </div>
                                {/* ${filterModalState.inStock === false && 'text-[#ABB6CC]'} */}

                        <div className='flex w-full justify-between items-center mt-[38px]'>
                            <span className={`font-semibold text-[16px] text-[#000000] leading-[24px] 
                                `}>Все товары в наличии</span>
                            <label className="checkbox-ios">
                                <input checked={filterModalState.inStock === true}  onClick={() => {
                                    const isMinAmount = filterModalState.withoutMinAmount;
                                    const isStock = filterModalState.inStock;
                                    filterModalState.setStock()
                                    const IsSelectToday = filterModalState.IsTodaySelect;

                                    let  data = filterModalState.features as any;
                                    data = data.filter((item: any) => item.properties.price >= filterModalState.price[0] && item.properties.price < filterModalState.price[1]);
                                    data = filteredData(filterModalState.withoutMinAmount,isStock,data,IsSelectToday);

                                    setCountFilterItems(data.length)

                                    if (!isMinAmount) {
                                        setSelectsActions((prev: any) => {
                                            return [...prev,{ name: 'Без минимальной суммы',
                                                callbackCancel: () => filterModalState.setMinAmountSelect(false)
                                            }] as any
                                        })
                                    }
                                    else {
                                        setSelectsActions((prev: any) => prev.filter((e: any) => e.name !== 'Без минимальной суммы'))
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
                                    filterModalState.setErrorsFilter(false)
                                    if (data.length === 0) {
                                        filterModalState.setErrorsFilter(true)
                                        setEmptyData(true);
                                    }
                                }} type="checkbox"  />
                                <span className="checkbox-ios-switch"></span>
                            </label>
                        </div>

                        <div className='flex w-full justify-between items-center mt-[14px]'>
                            <span className='font-semibold text-[16px] text-[#000000] leading-[24px]'>Без минимальной суммы</span>
                            <label className="checkbox-ios">
                                <input checked={filterModalState.withoutMinAmount}  onClick={() => {
                                    const isMinAmount = filterModalState.withoutMinAmount;
                                    filterModalState.setMinAmountSelect(!isMinAmount)
                                    const isStock = filterModalState.inStock;
                                    const IsSelectToday = filterModalState.IsTodaySelect;


                                    let  data = filterModalState.features as any;
                                    data = data.filter((item: any) => item.properties.price >= filterModalState.price[0] && item.properties.price < filterModalState.price[1]);
                                    data = filteredData(filterModalState.withoutMinAmount,isStock,data,IsSelectToday);

                                    setCountFilterItems(data.length)

                                    if (!isMinAmount) {
                                        setSelectsActions((prev: any) => {
                                            return [...prev,{ name: 'Без минимальной суммы',
                                                callbackCancel: () => filterModalState.setMinAmountSelect(false)
                                            }] as any
                                        })
                                    }
                                    else {
                                        setSelectsActions((prev: any) => prev.filter((e: any) => e.name !== 'Без минимальной суммы'))
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
                                    filterModalState.setErrorsFilter(false)
                                    if (data.length === 0) {
                                        filterModalState.setErrorsFilter(true)
                                        setEmptyData(true);
                                    }
                                }} type="checkbox"  />
                                <span className="checkbox-ios-switch"></span>
                            </label>
                        </div>

                        <div className='flex w-full justify-between items-center mt-[14px]'>
                            <span className='font-semibold text-[16px] text-[#000000] leading-[24px]'>Можно собрать с заменой</span>
                            <label className="checkbox-ios">
                                <input checked={filterModalState.assembleReplace === true} onChange={(e: any) => {
                                    const isMinAmount = filterModalState.withoutMinAmount;
                                    const isStock = filterModalState.inStock;
                                    const IsSelectToday = filterModalState.IsTodaySelect;
                                    filterModalState.setAssembleReplace(e.target.checked)

                                    console.log(e)

                                    let  data = filterModalState.features as any;
                                    data = data.filter((item: any) => item.properties.price >= filterModalState.price[0] && item.properties.price < filterModalState.price[1]);
                                    data = data.filter((item: any) => item.properties.price >= filterModalState.price[0] && item.properties.price < filterModalState.price[1]);
                                    data = filteredData(filterModalState.withoutMinAmount,isStock,data,IsSelectToday);

                                    setCountFilterItems(data.length)

                                    if (!isMinAmount) {
                                        setSelectsActions((prev: any) => {
                                            return [...prev,{ name: 'Без минимальной суммы',
                                                callbackCancel: () => filterModalState.setMinAmountSelect(false)
                                            }] as any
                                        })
                                    }
                                    else {
                                        setSelectsActions((prev: any) => prev.filter((e: any) => e.name !== 'Без минимальной суммы'))
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
                                    filterModalState.setErrorsFilter(false)
                                    if (data.length === 0) {
                                        filterModalState.setErrorsFilter(true)
                                        setEmptyData(true);
                                    }
                                }} type="checkbox"  />
                                <span className="checkbox-ios-switch"></span>
                            </label>
                        </div>

                        <div className='mt-[32px]'>
                            <div className='flex justify-between'>
                                <h1 className='flex gap-[5px] font-semibold text-[16px] leading-[24px] items-center'>Будет готов к выдаче
                                    <span className='justify-center items-center rounded-full  w-[16px] h-[16px] flex bg-[#F2F2F5] text-[#444952] text-[12px] leading-[16px] font-semibold'>1</span>
                                </h1>

                                <button onClick={() => setSelectDate('today')} className='text-[#78808F] text-[14px] font-normal cursor-pointer hover:text-[#444952]'>Сбросить</button>
                            </div>

                            <div className='mt-[14px] flex gap-[4px]'>
                                <button onClick={() => {
                                    setSelectDate('today');
                                }} className={clsx('hover:text-[#444952] text-[#000000] cursor-pointer px-[20px] py-[8px] flex justify-center items-center border-[#E1E1E5] border-[1px] rounded-full',
                                    {
                                        ['bg-[#DBF6F0] border-none']: selectData === 'today'
                                    }
                                )}>
                                    Сегодня
                                </button>

                                <button onClick={() => {
                                    setSelectDate('tomorrow');

                                }} className={clsx('hover:text-[#444952] text-[#000000] cursor-pointer px-[20px] py-[8px] flex justify-center  items-center border-[#E1E1E5] border-[1px] rounded-full',
                                    {
                                        ['bg-[#DBF6F0] border-none']: selectData === 'tomorrow'
                                    }
                                )}>
                                    Завтра или позже
                                </button>
                            </div>
                        </div>

                        <div className='mt-[32px]'>
                            <div className='flex justify-between h-[24px]'>
                                <h1 className='flex gap-[5px] font-semibold text-[16px] leading-[24px] items-center'>Время работы
                                    {
                                        (filterModalState.isOpenNow === true || filterModalState.is24Hours === true) &&
                                        <span className='justify-center items-center rounded-full  w-[16px] h-[16px] flex bg-[#F2F2F5] text-[#444952] text-[12px] leading-[16px] font-semibold'>
                                            {Number(filterModalState.isOpenNow) + Number(filterModalState.is24Hours)}
                                        </span>
                                    }
                                </h1>

                                <button onClick={() => {
                                    filterModalState.setIs24Hours(false);
                                    filterModalState.setIsOpenNow(false);
                                    setSelectsActions((prev: any) => prev.filter((e: any) => e.name !== 'Круглосуточно'))
                                    setSelectsActions((prev: any) => prev.filter((e: any) => e.name !== 'Открыто сейчас'))

                                    const isMinAmount = filterModalState.withoutMinAmount;
                                    const isStock = filterModalState.inStock;
                                    const IsSelectToday = filterModalState.IsTodaySelect;
                                    let  data = filterModalState.features as any;

                                    data = filteredData(isMinAmount,isStock,data,IsSelectToday);
                                }}  className='text-[#78808F] text-[14px] font-normal cursor-pointer hover:text-[#444952]'>Сбросить</button>
                            </div>
                            <div className='mt-[18px] flex gap-[10px] items-center'>
                                <Checkbox checked={filterModalState.is24Hours} defaultChecked={filterModalState.is24Hours} defaultValue={filterModalState.is24Hours} onCheckedChange={(select: boolean) => {
                                    filterModalState.setIs24Hours(select);
                                    const isMinAmount = filterModalState.withoutMinAmount;
                                    const isStock = filterModalState.inStock;
                                    const IsSelectToday = filterModalState.IsTodaySelect;

                                    let  data = filterModalState.features as any;
                                    data = filteredData(isMinAmount,isStock,data,IsSelectToday);

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
                                    filterModalState.setErrorsFilter(false)

                                    if (select) filterModalState.setBestPrice(true)

                                    if (data.length === 0) {
                                        filterModalState.setErrorsFilter(true)
                                        setEmptyData(true);
                                    }

                                    if (!filterModalState.is24Hours) {
                                        setSelectsActions((prev: any) => {
                                            return [...prev,{ name: 'Круглосуточно',
                                                callbackCancel: () => filterModalState.setIs24Hours(false)
                                            }] as any
                                        })
                                    }
                                    else {
                                        setSelectsActions((prev: any) => prev.filter((e: any) => e.name !== 'Круглосуточно'))
                                    }

                                }} className='#FFFFFF' name='open24' id="open24" />
                                <label
                                    htmlFor="open24"
                                    className="text-[14px]  w-full font-normal leading-[20px]"
                                >
                                    Круглосуточно
                                </label>
                            </div>

                            <div className='mt-[18px] flex gap-[10px] items-center'>
                                <Checkbox checked={filterModalState.isOpenNow} defaultChecked={filterModalState.isOpenNow}  defaultValue={filterModalState.isOpenNow} onCheckedChange={(select: boolean) => {
                                    filterModalState.setIsOpenNow(select);
                                    const isMinAmount = filterModalState.withoutMinAmount;
                                    const isStock = filterModalState.inStock;
                                    const IsSelectToday = filterModalState.IsTodaySelect;

                                    let  data = filterModalState.features as any;
                                    data = filteredData(isMinAmount,isStock,data,IsSelectToday);

                                    if (!filterModalState.isOpenNow) {
                                        setSelectsActions((prev: any) => {
                                            return [...prev,{ name: 'Открыто сейчас',
                                                callbackCancel: () => {
                                                    filterModalState.setIsOpenNow(false)
                                                }
                                            }] as any
                                        })
                                    }
                                    else {
                                        setSelectsActions((prev: any) => prev.filter((e: any) => e.name !== 'Открыто сейчас'))
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
                                    filterModalState.setErrorsFilter(false)
                                    if (data.length === 0) {
                                        filterModalState.setErrorsFilter(true)
                                        setEmptyData(true);
                                    }
                                }} className='#FFFFFF' id="open" />
                                <label
                                    htmlFor="open"
                                    className="text-[14px]  w-full font-normal leading-[20px]"
                                >
                                    Открыто сейчас
                                </label>
                            </div>
                        </div>


                        <div className='mt-[40px]'>
                            <div className='flex justify-between'>
                                <h1 className='flex gap-[5px] font-semibold text-[16px] leading-[24px] items-center'>Сеть
                                    {/* <span className='justify-center items-center rounded-full  w-[16px] h-[16px] flex bg-[#F2F2F5] text-[#444952] text-[12px] leading-[16px] font-semibold'>1</span>     */}
                                </h1>

                                <button className='text-[#78808F] text-[14px] font-normal cursor-pointer hover:text-[#444952]'>Сбросить</button>
                            </div>

                            <ul className='flex  flex-col gap-[18px]'>
                                <li className='mt-[18px] flex gap-[10px] items-center '>
                                    <div className='flex gap-[10px] grow'>
                                        <Checkbox className='#FFFFFF' id="item1" />
                                        <label
                                            htmlFor="item1"
                                            className="text-[14px] gap-[5px] h-fit  w-full font-normal leading-[20px] flex"
                                        >
                                            <img src="/logo_shop.png"  alt="" className='h-[20px] w-[20px] object-cover' />
                                            <span>Магнит Аптека</span>
                                        </label>
                                    </div>

                                    <div className='shrink-0 font-normal text-[14px] leading-[22px] flex gap-[5px] items-center'>
                                        <img src="/star.svg" alt="star" />
                                        <span>4.8</span>
                                    </div>
                                </li>

                            </ul>

                        </div>

                    </div>
                </div>

                <div className='ml-[24px] flex shrink-0 gap-[6px] bg-[white] py-[12px] max-[425px]:ml-[16px]'>
                    {
                        !isEmptyData ?
                        <button onClick={() => filterModalState.close()} className='w-[189px] flex justify-center items-center  bg-[#00C293] font-semibold leading-[20px] text-[14px]  py-[10px] rounded-[99px] h-[40px] cursor-pointer text-[white]'>
                            {
                                isLoading ?
                                    <svg className='animate-spin' width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M25.5 16C25.5 17.78 24.9722 19.5201 23.9832 21.0001C22.9943 22.4802 21.5887 23.6337 19.9442 24.3149C18.2996 24.9961 16.49 25.1743 14.7442 24.8271C12.9984 24.4798 11.3947 23.6226 10.136 22.364C8.87737 21.1053 8.0202 19.5016 7.67293 17.7558C7.32567 16.01 7.5039 14.2004 8.18508 12.5558C8.86627 10.9113 10.0198 9.50571 11.4999 8.51677C12.9799 7.52784 14.72 7 16.5 7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>

                                :
                                `Показать ${countFilterItems} аптеки`
                            }
                        </button>
                        :
                        <button onClick={() => filterModalState.close()} className='w-[189px] bg-[#E1E1E5] font-semibold leading-[20px] text-[14px] px-[24px] py-[10px] rounded-[99px] h-[40px] cursor-pointer text-[#78808F]'>
                            Аптеки не найдены
                        </button>
                    }

                    <button onClick={() => {
                        filterModalState.resetFilter(false);
                        filterModalState.
                        setSelectsActions([])
                        setSelectDate('tomorrow')
                        filterModalState.setMinAmountSelect(false)
                        queryClient.setQueryData(['pickup_points'],
                            () => {
                                const result =  {
                                    pageParams: [0],
                                    pages: [{
                                        data: filterModalState.features.slice(0, 8),
                                        nextPage: 1,
                                    }]
                                    };
                                return result
                        })
                    }} className='w-[132px] bg-[#F2F2F5] font-semibold leading-[20px] text-[14px] px-[24px] py-[10px] rounded-[99px] h-[40px] cursor-pointer text-[#000000]'>
                        Сбросить
                    </button>
                </div>
            </div>
    );
};

export default ModalFilter;
