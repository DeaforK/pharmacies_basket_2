import { useEffect, useMemo, useState } from "react";
import Button from "../../shared/components/Button/Button";
import { Product } from "../../entities/types/PickupPoint";
import { ProductItem } from "./ProductItem";
import clsx from "clsx";
import { useReplacementState } from "../../entities/store/useReplacement";
import { getPharmacy } from "../../entities/clusters/api";
import { calcDistance } from "../../features/lib/calcDistance";
import { usePosition } from "../../features/hooks/usePosition.tsx";
import { useFilterState } from "../../entities/store/useModalFilter";
import { useQueryClient } from "@tanstack/react-query";
import { scrollStore } from "../../entities/store/useScroll";
import { useMapState } from "../../entities/store/useMapState";
import { useNavigate } from "react-router-dom";

import styles from './ListPickupPointsItem.module.scss'

export const ListPickupPointsItem = ({item,coords, isEnd}: any) => {

    const [isOpen, setOpen] = useState(false);

    const [, setReplacementShow] =  useState(false);

    const [isReplacement,setReplacement] =  useState(false);

    const replacementState = useReplacementState();

    const filterState = useFilterState();

    const [loadingData,setLoadingData] = useState() as any;

    const [tags, setTags ] = useState<string[]>();

    const [isChangesSuccess, setChangesSuccess] = useState(null) as any;

    const [isMinAmount, setMinAmount] = useState(false);

    const [IsHoverAddress, setHoverAddress] = useState(false);

    const [IsHoverProductBlock, setHoverProductBlock] = useState(false);

    const mapState = useMapState();

    const navigate = useNavigate();

    const ScrollStore = scrollStore;

    const queryClient = useQueryClient();
    const {latitude, longitude} = usePosition();

    const position = {
        latitude: latitude,
        longitude: longitude,
    }

    const distance = useMemo(() => {
        if (position !== undefined && position.latitude !== undefined && position.longitude !== undefined) {
            return calcDistance(position.latitude,position.longitude,coords[0],coords[1]).toFixed(1)
        }
    },[position])

    const handleClick = () => {

    }

    useEffect(() => {
        const result = getPharmacy(item.pharmacyId);
        result.then((data:any) => {
            setLoadingData(data)
        })
    },[])

    useEffect(() => {
        if(item.minOrderAmount !== null) {
            setMinAmount(true)
        }
    },[item.minOrderAmount])

    useEffect(() => {
        const result = []

        for (let key in item.tagList) {
            if (item.tagList.hasOwnProperty(key)) {
                result.push(item.tagList[key])
            }
        }

        setTags(result);

        const loadData = loadingData?.items.filter((item: any) => item.availableText === 'Нет в наличии')

        if (loadData !== undefined && loadData !== null) {
            if (loadData.length > 0) {
                setReplacement(true)
            }
        }
    },[item, loadingData])

    const ArrowClick = (() => <>
        {
            <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
                <path d="M1.5 1.5L4.5 5L1.5 8.5" stroke={!IsHoverAddress ? '#78808F' : '#00B88B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        }
    </>)

    //console.log(item)

    return (
        <div className={`border-b-[1px] border-[#F2F2F5] max-[900px]:mx-[16px] max-[900px]:pb-[24px] ${isEnd  && '!border-none'}`}>
            <div className={`max-[900px]:hidden flex w-full pt-[21px]  
                ${(!isReplacement || item.paymentOptions === 'только наличные') && item.assembleReplace !== 1  && 'pb-[25px]'}
                ${item?.rating !== null && item.paymentOptions !== 'только наличные' && tags?.length === 0 && item.bezSklada === 0 && item.assembleReplace === 0 && 'pb-[24px]'} 
                ${item?.rating === null && item.paymentOptions !== 'только наличные' && tags?.length === 0 && item.bezSklada === 0 && item.assembleReplace === 0 && 'pb-[24px]'} 
                ${item?.rating !== null && item.paymentOptions !== 'только наличные' && tags?.length !== 0 && item.bezSklada === 1 &&  item.assembleReplace === 0 &&'pb-[24px]'} 
                ${item?.rating !== null && item.paymentOptions !== 'только наличные' && tags?.length !== 0 && item.bezSklada === 0 && item.assembleReplace === 0 && 'pb-[24px]'} 
                ${item?.rating !== null && item.paymentOptions !== 'только наличные' && tags?.length === 0 && item.bezSklada === 1 && item.assembleReplace === 0 && 'pb-[24px]'} 
                ${item?.rating !== null && item.paymentOptions === 'только наличные' && tags?.length === 0 && item.bezSklada === 1 && item.assembleReplace === 1 && 'pb-[24px]'} 
                ${item?.rating === null && item.paymentOptions !== 'только наличные' && tags?.length === 0 && item.bezSklada === 0 && item.assembleReplace === 1 && 'pb-[0px]'} 
                ${item?.rating === null && item.paymentOptions === 'только наличные' && tags?.length === 0 && item.bezSklada === 0 && item.assembleReplace === 1 && 'pb-[24px]'} 
                ${item?.rating === null && item.paymentOptions !== 'только наличные' && tags?.length === 1 && item.bezSklada === 0 && item.assembleReplace === 0 && 'pb-[24px]'} 

                ${(item.assembleReplace !== 1 && item.paymentOptions === 'только наличные' && tags !== undefined && tags.length > 0) && item.assembleReplace !== 1  && 'pb-[25px]'}
                ${(item.assembleReplace === 1 && item.bezSklada === 0 && item.paymentOptions !== 'только наличные' && tags !== undefined && tags.length === 0) && 'pb-[0px]'}
                `}>
                <div className=" flex gap-[20px] w-full">
                    <div onClick={() => {
                        ScrollStore.getState().setScrollList(document.body.scrollTop)
                        console.log(document.body.scrollHeight - (document.body.scrollTop + document.body.clientHeight))
                        mapState.setSelectBallon(item.pharmacyId)
                        mapState.onCenterMap(coords)
                        navigate('/map', {
                            state: {
                                backToList: true,
                            }
                        })
                    }} className={`cursor-pointer ${styles.click__block} flex gap-[12px]`} onMouseEnter={() => setHoverAddress(true)} onMouseLeave={() => setHoverAddress(false)}>
                        <div className="shrink-0 w-[40px] h-[40px] ">
                            <img src={'/plug.svg'} className="border-[#F2F2F5] border-[1px] rounded-[12px] " alt="logo_shop" />
                        </div>

                        <div className="grow">
                            <h2 className={`font-semibold text-[18px] leading-[24px] max-[900px]:leading-[20px] flex items-center  text-[#000000] ${item.rating === null && '!mt-[8px]'}`}>{item.name}
                                { position.latitude !== 0 && position.longitude !== 0 &&<span className="wide-text text-[#000000] font-medium text-[14px] leading-[22px] h-[20px] px-[6px] ml-[2px] rounded-[99px] bg-[#F2F2F5]">{`${distance} км`}</span> }
                            </h2>
                            {
                                item?.rating && <span className="flex font-normal text-[14px] font-normal wide_text leading-[22px] gap-[2px] items-center mb-[8px]">
                                <img className="w-[18px] h-[18px]" src="/star.svg" alt="stars" />
                                {item?.rating}</span>
                            }

                            <div className={`${item?.rating === null && 'mt-[16px]'} flex gap-[20px] grow 
                            `}>
                                <div>
                                    <div>
                                        <span  className="address flex items-center gap-[5px] text-[14px] font-normal text-[#000000] w-[327px]">
                                            {item.address}
                                            {
                                                IsHoverAddress && ArrowClick()
                                            }
                                        </span>
                                        <span className="block text-[#78808F] font-normal text-[14px] leading-[20px]">{item.workingHours}</span>
                                    </div>
                                    {
                                        item.paymentOptions === 'только наличные' && <span className="mt-[8px]  flex gap-[6px] items-center text-[#78808F] font-normal text-[14px]">
                                            <img src="/price_circle.svg" className="h-[20px] w-[20px] " alt="price_circle" />
                                            Оплата только наличными
                                        </span>
                                    }
                                </div>

                            </div>
                        </div>

                    </div>

                    <div onMouseLeave={() => {
                                setHoverProductBlock(false)
                            }} onMouseOver={() => {
                                setHoverProductBlock(true)
                            }}  onClick={() => setOpen(prev => !prev)}  className="relative grow cursor-pointer">
                        <div onMouseMove={() => {
                                            setHoverProductBlock(false)
                                        }} onClick={() => { setOpen(prev => !prev) }} className="z-[1] relative flex gap-[6px] mb-[10px] w-full cursor-auto ">
                            <div className={`flex cursor-auto flex-wrap gap-[6px] w-full  ${tags !== undefined  && tags?.length > 2 && 'mb-[10px]'}`}>
                                {
                                    tags !== undefined && tags !== null && tags?.includes('Минимальная цена') && <span className="block bg-[#DBF6F0] text-[#00C293] font-medium h-[20px] items-center text-[14px] w-fit px-[6px] rounded-[8px]">Минимальная цена</span>
                                }
                                {
                                    tags !== undefined && tags !== null && tags?.includes('Средняя цена') && <span className="block bg-[#FFF2E0] text-[#F2994A] font-medium h-[20px] items-center text-[14px] w-fit px-[6px] rounded-[8px]">Средняя цена</span>
                                }
                                {
                                    tags !== undefined && tags !== null && tags?.includes('Длительная сборка') && <span className="block bg-[#FFF2E0] text-[#F2994A] font-medium h-[20px] items-center text-[14px] w-fit px-[6px] rounded-[8px]">Длительная сборка</span>
                                }
                                {
                                    tags !== undefined && tags !== null && tags?.includes('Сборка 60 минут') && <span className="block  text-[#867FFF] bg-[#E1EAFF] font-medium h-[20px] items-center text-[14px] w-fit px-[6px] rounded-[8px]">Сборка 60 минут</span>
                                }
                            </div>
                        </div>
                        <div className={`flex gap-[20px] 
                        ${item?.rating !== null && item.paymentOptions !== 'только наличные' && item.assembleReplace !== 0 && tags?.length === 0 && 'mt-[11px]'} 


                        ${item?.rating === null && item.paymentOptions === 'только наличные' && item.assembleReplace === 0 && tags?.length === 0 && 'mt-[24px]'} 
                        ${item?.rating === null && item.paymentOptions !== 'только наличные' && tags?.length === 0 && 'mt-[23px]'} 
                        ${item?.rating !== null && item.paymentOptions !== 'только наличные' && !isReplacement && tags !== undefined && tags?.length <= 2 && 'mt-[21px]'} 
                        ${(item?.rating !== null && item.paymentOptions === 'только наличные' && item.assembleReplace === 0 && tags?.length === 0) && 'mt-[23px]'} 
                        ${(item?.rating !== null && item.paymentOptions === 'только наличные' && item.assembleReplace === 1 && item.bezSklada === 1  && tags !== undefined  && tags?.length >= 2) && 'mt-[5px]'} 
                        ${(item?.rating !== null && item.paymentOptions === 'только наличные' && item.assembleReplace === 0 && item.bezSklada === 0 && tags !== undefined  && tags?.length <= 2) && 'mt-[24px]'} 
                        ${(item?.rating !== null && item.paymentOptions === 'только наличные' && item.assembleReplace === 1 && item.bezSklada === 1  && tags?.length === 0) && 'mt-[24px]'} 
                        ${(item?.rating !== null && item.paymentOptions === 'только наличные' && item.assembleReplace === 1 && item.bezSklada === 0  && tags?.length === 0) && 'mt-[24px]'} 
                        grow 
                        `}
                        >
                            <div  className="justify-between flex w-[343px] cursor-pointer">
                                <div className="">
                                    <button
                                     onClick={
                                        () =>
                                            {
                                                // setOpen(prev => !prev);
                                                // handleClick()
                                                // setReplacementShow(false);

                                            }} className={clsx(`cursor-pointer h-[24px]  font-normal  wide_text leading-[22px] font-semibold text-[20px] flex gap-[5px] items-center`,
                                        {
                                            ['text-[#00C293]']:item.availabilityStatus === 'Всё в наличии',
                                            ['text-[#FF9900]']:item.availabilityStatus !== 'Всё в наличии',

                                        }
                                    )}
                                >
                                    {item.price} ₽
                                        <svg className={`${isOpen && 'rotate-180'} h-[18px] w-[18px] p-[3px] transition-background duration-300 rounded-full ${IsHoverProductBlock && `bg-[#F2F2F5]`}`} xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none">
                                            <path d="M8.5 1.5L5 4.5L1.5 1.5" stroke={`${item.availabilityStatus === 'Всё в наличии' ? '#00C293' : '#FF9900 '}`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>

                                    {
                                        item.availabilityStatus === 'Всё в наличии' &&
                                        <span className={`font-normal text-[14px] leading-[18px] h-[18px]  mb-[7px] block text-[#78808F]`}>Всё в наличии</span>
                                    }
                                    {
                                        item.availabilityStatus !== 'Всё в наличии' &&
                                        <span className={clsx(`font-normal text-[14px] leading-[18px] mb-[7px] block`,
                                            {
                                                ['text-[#00C293]']: item.availabilityStatus === 'Всё в наличии',
                                                ['text-[#FF9900]']: item.availabilityStatus !== 'Всё в наличии'
                                            }
                                        )}>{item?.availableCount} товаров из 25</span>
                                    }

                                    {
                                        item.bezSklada === 0 &&
                                        <span className="text-[#78808F] flex font-normal text-[14px] leading-[18x] gap-[6px]">
                                            <img src="/heart_logo.png" className="h-[20px] w-[20px] object-cover" alt="" />
                                            Со склада {item.network}
                                        </span>

                                    }
                                    {
                                        item.assembleReplace === 1 && <button onMouseMove={() => {
                                            setHoverProductBlock(false)
                                        }} onClick={() => { handleClick(); setReplacementShow(prev => !prev);    }} className={`${!isChangesSuccess && 'cursor-pointer'} relative font-normal mb-[12px] justify-center text-[14px] mt-[12px] cursor-pointer h-[34px] rounded-[99px] px-[12px] py-[7px] flex items-center gap-[6px] 
                                        ${!isChangesSuccess && ' min-w-[149px] hover:bg-[#F2F2F5] bg-[#F7F7FA]'}

                                        ${isChangesSuccess && 'min-w-[161px] hover:bg-[#C9F0E7] bg-[#DBF6F0] '} 
                                        `}>
                                        {
                                            isChangesSuccess && <img className="h-[12px] w-[16px]" src="/checkmark_green.svg" alt="" />
                                        }
                                        {
                                            isChangesSuccess ? 'Выбрана замена' : 'Собрать с заменой'
                                        }
                                        </button>
                                    }
                                </div>
                                <div  className="relative mt-[4px]">
                                    {
                                        item.minOrderAmount !== null ? <>
                                            <Button onMouseMove={() => {
                                            setHoverProductBlock(false)
                                        }}  defaultColor  className="bg-[#F7F7FA] hover:bg-[#F2F2F5] relative z-[10]  !text-[#78808F] text-[14px] min-[900px]:mr-[10px] font-semibold  max-h-[34px]" text={`Мин. заказ ${ item.minOrderAmount} ₽`} type="button"/>
                                        </>
                                        :
                                        <Button onMouseMove={() => {
                                            setHoverProductBlock(false)
                                        }} onClick={() => { setOpen(prev => !prev) }} className="hover:bg-[#00B88B] text-[14px] font-semibold min-[900px]:mr-[10px]"  text={item.deliveryTime} defaultColor type="button"/>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="min-[900px]:hidden flex w-full  pt-[20px] min-[900px]:px-[16px]">
                <div className="flex-col gap-[20px] w-full">
                    <div onClick={() => {
                        ScrollStore.getState().setScrollList(document.body.scrollTop)
                        console.log(document.body.scrollHeight - (document.body.scrollTop + document.body.clientHeight))
                        mapState.setSelectBallon(item.pharmacyId)
                        mapState.onCenterMap(coords)
                        navigate('/map', {
                            state: {
                                backToList: true,
                            }
                        })
                    }}  className="flex flex-col">
                        <div className="flex gap-[8px]">
                            <div className="shrink-0 w-[40px] h-[40px] rounded-[12px] ">
                                <img src={'/plug.svg'}  alt="logo_shop" className="border-[#F2F2F5] border-[1px] rounded-[12px] " />
                            </div>
                            <h2 className={`font-semibold max-[900px]:text-[16px] text-[18px] h-[40px] w-full flex justify-between leading-[24px] text-[#000000] ${item?.rating === null && 'items-center'}`}>
                                <div>
                                    {item.name}
                                    {
                                        item?.rating !== null &&
                                        <span className="flex gap-[2px] font-normal wide_text leading-[22px] text-[14px] items-center mb-[8px]">
                                            <img className="w-[13px] h-[13px]" src="/star.svg" alt="stars" />
                                            {item?.rating}</span>
                                    }
                                </div>
                                { position.latitude !== 0 && position.longitude !== 0 &&<span className="wide-text text-[#000000] font-medium text-[14px] leading-[22px] h-[20px] px-[6px] ml-[2px] rounded-[99px] bg-[#F2F2F5]">{`${distance} км`}</span> }
                            </h2>
                        </div>


                        {

                            tags !== undefined && tags?.length > 0 &&
                            <div onClick={() => {
                                            setOpen(false)
                                        }}  className=" cursor-auto relative z-[100]  flex gap-[6px] mt-[8px] min-h-[20px]">
                                    <div className={` relative z-[1001]  flex flex-wrap gap-[6px] w-full ${tags !== undefined  && tags?.length > 2 && 'mb-[10px]'}`}>
                                        {
                                            tags !== undefined && tags !== null && tags?.includes('Минимальная цена') && <span className="block bg-[#DBF6F0] text-[#00C293] font-medium h-[20px] items-center text-[14px] w-fit px-[6px] rounded-[8px]">Минимальная цена</span>
                                        }
                                        {
                                            tags !== undefined && tags !== null && tags?.includes('Средняя цена') && <span className="block bg-[#FFF2E0] text-[#F2994A] font-medium h-[20px] items-center text-[14px] w-fit px-[6px] rounded-[8px]">Средняя цена</span>
                                        }
                                        {
                                            tags !== undefined && tags !== null && tags?.includes('Длительная сборка') && <span className="block bg-[#FFF2E0] text-[#F2994A] font-medium h-[20px] items-center text-[14px] w-fit px-[6px] rounded-[8px]">Длительная сборка</span>
                                        }
                                        {
                                            tags !== undefined && tags !== null && tags?.includes('Сборка 60 минут') && <span className="block  text-[#867FFF] bg-[#E1EAFF] font-medium h-[20px] items-center text-[14px] w-fit px-[6px] rounded-[8px]">Сборка 60 минут</span>
                                        }
                                    </div>
                            </div>
                        }

                        <div>
                            <div className="flex gap-[20px] grow mt-[8px]">
                                <div>
                                    <div>
                                        <span className="text-[14px] font-normal text-[#000000] gap-[5px] flex items-center  leading-[20px] w-[327px] mb-[4px]">{item.address}
                                            {
                                                ArrowClick()
                                            }
                                        </span>
                                        <span className="block text-[#78808F] font-normal text-[14px] leading-[20px]">{item.workingHours}</span>
                                    </div>
                                    {
                                        item.paymentOptions === 'только наличные' && <span className="mt-[8px]  flex gap-[6px] items-center text-[#78808F] font-normal text-[14px]">
                                            <img src="/price_circle.svg" className="h-[20px] w-[20px] " alt="price_circle" />
                                            Оплата только наличными
                                        </span>
                                    }
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="justify-between flex w-full mt-[16px]">
                        <div>
                            <button className="relative z-[100]  min-w-[170px] flex flex-col items-start" onClick={
                                    () =>
                                        {
                                            setOpen(prev => !prev);
                                            handleClick();
                                            setReplacementShow(false)
                                        }} >
                                 <span
                                     className={clsx(`h-[24px]  font-normal  wide_text leading-[22px] font-semibold text-[20px] flex gap-[5px] items-center`,
                                    {
                                        ['text-[#00C293]']:item.availabilityStatus === 'Всё в наличии',
                                        ['text-[#FF9900]']:item.availabilityStatus !== 'Всё в наличии',

                                    }
                                )}>
                                {item.price} ₽
                                    <svg className="hover:bg-[#F2F2F5] h-[18px] w-[18px] p-[3px] rounded-full" xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none">
                                        <path d="M8.5 1.5L5 4.5L1.5 1.5" stroke={`${item.availabilityStatus === 'Всё в наличии' ? '#00C293' : '#FF9900 '}`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </span>

                                <span className={clsx(`font-normal text-[14px] leading-[18px] mb-[6px] block`,
                                            {
                                                ['text-[#00C293]']: item.availabilityStatus === 'Всё в наличии',
                                                ['text-[#FF9900]']: item.availabilityStatus !== 'Всё в наличии'
                                            }
                                )}>{item?.availableCount} товаров из 25</span>
                            </button>
                            {
                                item.bezSklada === 0 &&
                                <span className="min-[900px]:hidden text-[#78808F] flex font-normal text-[14px] leading-[18x] gap-[6px]">
                                    <img src="/heart_logo.png" className="h-[20px] w-[20px] object-cover" alt="" />
                                    Со склада {item.network}
                                </span>
                            }

                            {
                                item.assembleReplace === 1 && <button onClick={() => { handleClick(); setReplacementShow(prev => !prev); setOpen(prev => !prev)}} className={`relative hover:bg-[#F2F2F5] font-normal text-[14px] mt-[14px] cursor-pointer h-[34px] rounded-[99px] w-[149px] px-[12px] py-[7px] flex items-center 
                                gap-[6px]
                                ${!isChangesSuccess && 'bg-[#F7F7FA] min-w-[161px]'}
                                ${isChangesSuccess && 'bg-[#DBF6F0] min-w-[161px]'}
                                `}>
                                    {
                                        isChangesSuccess && <img src="/checkmark_green.svg" alt="" />
                                    }
                                    {
                                        isChangesSuccess ? 'Выбрана замена' : 'Собрать с заменой'
                                    }
                                </button>
                            }
                        </div>

                        <div>
                            {
                                item.minOrderAmount !== null ? <>
                                    <Button onClick={() => {
                                        handleClick()
                                        setOpen(prev => !prev)
                                    }} defaultColor  className="relative z-[10]  bg-[#F2F2F5] text-[14px] !text-[#78808F] max-h-[34px] font-semibold" text={`Мин. заказ ${ item.minOrderAmount} ₽`} type="button"/>
                                </>
                                :
                                <Button   className="text-[14px] font-semibold" text={item.deliveryTime} defaultColor type="button"/>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className={`w-full flex flex-col pl-[6px] max-[900px]:px-[0px] max-[900px]:mt-[12px] ${!isOpen && 'hidden'} ${!isOpen  && '!px-[20px] !pb-[12px] !pt-[6px]'}`}>
                {
                    isOpen && isReplacement && !isChangesSuccess  && <div className="min-[900px]:ml-[52px] max-[900px]:px-[12px] bg-[#F7F7FA] px-[16px] py-[12px] flex justify-between rounded-[12px] items-center max-[900px]:flex-col  max-[900px]:items-start">
                        <span className="text-[#78808F] font-normal text-[14px] max-w-[311px]">Можно собрать полностью заказ, заменив отсутствующие товары аналогами</span>
                        <button onClick={() => {
                            replacementState.setProducts(loadingData?.items.map((e: any) => {
                                return e.products.map((e1: any,i: number) => {
                                    return {
                                        productId: i,
                                        ...e1
                                    };
                                })
                            }));

                            replacementState.openModalReplacement(false, () => {},() =>  setChangesSuccess(true))
                        }} className="text-[#00C293] font-semibold text-[14px] bg-[#FFFFFF] hover:text-[#00B88B] h-[34px] px-[16px] py-[7px] max-[900px]:mt-[8px] cursor-pointer rounded-[99px]">Подобрать замену</button>
                    </div>
                }
                {
                    isOpen && isChangesSuccess  && <div className="  bg-[#DBF6F0] max-[900px]:px-[12px] px-[16px] min-[900px]:ml-[52px]  py-[12px] flex justify-between rounded-[12px] items-center ">
                        <span className="text-[#78808F] font-normal text-[14px] max-w-[311px] block">
                            <span className="font-semibold">Ура! </span>
                            Вы собрали полностью заказ, заменив отсутствующие товары</span>
                        <button onClick={() => {
                            replacementState.setProducts(loadingData?.items.map((e: any) => {
                                return e.products.map((e1: any,i: number) => {
                                    return {
                                        productId: i,
                                        ...e1
                                    };
                                })
                            }))
                            replacementState.openModalReplacement(false)

                        }} className="text-[#00C293] font-semibold text-[14px] bg-[#FFFFFF] hover:text-[#00B88B] h-[34px] px-[16px] py-[7px] cursor-pointer rounded-[99px]">Подобрать замену</button>
                    </div>
                }
                {
                    isOpen && isMinAmount && <div className="min-[900px]:ml-[52px] mt-[12px] max-[900px]:!px-[12px] bg-[#F7F7FA] px-[16px] py-[12px] flex justify-between rounded-[12px] items-center max-[900px]:flex-col max-[900px]:items-start max-[900px]:gap-[8px] ">
                        <span className="text-[#78808F] font-normal text-[14px] max-w-[311px]">
                            <span className="font-semibold">До заказа еще 51 ₽. </span>
                                Соберите заказ до минимальной суммы для заказа у этого поставщика.
                                <span className="block mt-[6px]">
                                    Или посмотрите аптеки без мин. суммы заказа
                                </span>
                            </span>

                            <button onClick={() => {
                                filterState.setMinAmountSelect(true);

                                const isMinAmount = true;

                                let  data = filterState.features as any;

                                if (isMinAmount) {
                                    data = data.filter((item: any) => item.properties.minOrderAmount === null)
                                }
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
                                setOpen(false)
                                setMinAmount(false);
                        }} className="text-[#00C293] font-semibold text-[14px] hover:text-[#00B88B] bg-[#FFFFFF] w-[114px] h-[34px] px-[16px] py-[7px] cursor-pointer rounded-[99px]">Посмотреть</button>
                    </div>
                }
                {
                    isOpen && <> <ul className="max-[900px]:m-0 ml-[47px]">
                        {
                            loadingData?.items.map((item: Product & { products: any, availableText: string}, e: any) =>
                            {
                                return (
                                    <>
                                        {
                                            item?.products.map((product: Product,i: number) =>
                                            <ProductItem isNotEnd={i + e === item.products.length} callbackSuccess={setChangesSuccess} pharId={i.toString()} key={i} product={{
                                                ...product,
                                                availability:item.availableText
                                            } as any}/>)
                                        }
                                    </>
                                )
                            })
                        }
                        </ul>
                    </>
                }



            </div>

        </div>
    );
};

