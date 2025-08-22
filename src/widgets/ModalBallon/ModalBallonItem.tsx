import { useEffect, useMemo, useState } from "react";
import Button from "../../shared/components/Button/Button";
import styles from './ModalBallonItem.module.scss';
import { useReplacementState } from "../../entities/store/useReplacement";
import { ModalBallonProductItem } from "./ModalBallonProductItem";
import { getPharmacy } from "../../entities/clusters/api";
import clsx from "clsx";
import { useFilterState } from "../../entities/store/useModalFilter";
import { useQueryClient } from "@tanstack/react-query";
import { useModalState } from "../../entities/store/useModalState";
import { convertPrice } from "../../features/lib/convertPrice";

interface Product {
    image: string;
    title: string;
    price: number;
    quantity: number;
    pharmacyId: any,
}

interface ModalBallonItemProps {
    price: number;
    availableText: string;
    tags?: string[];
    products: Product[];
    pharmacyId: any,
    isMinAmount: boolean,
    loadingProducts: any,
    deliveryTime: string,
    logoUrl: string
}


export const ModalBallonItem = ({deliveryTime, loadingProducts,price, availableText, tags = [], products, pharmacyId,isMinAmount }: ModalBallonItemProps) => {
    const [isOpen, setOpen] = useState(false);

    const [, setReplacementShow] =  useState(false);

    const [isChangesSuccess,setChangesSuccess] = useState(null) as any;

    const replacementState = useReplacementState();

    const [,setLoadingData] = useState() as any;

    const [isReplacement, setReplacement] = useState(false);

    const [, setMinAmount] = useState(false);

    const filterState = useFilterState();

    const modalState = useModalState();

    const queryClient = useQueryClient();

    const [isLoading,setLoading] = useState(false);

    const [isHoverBallon, setHoverBallon] = useState(false);

    const new_price = useMemo(() => {
        return convertPrice(price)
    },[price])
    
    useEffect(() => {
        const result = getPharmacy({id: pharmacyId});
        result.then((data:any) => {
            setLoadingData(data)
        })
        console.log( products.filter((item: any) => item.availableCount > 2))
        const isReplaceItems = products.filter((item: any) => item.availableCount === 0).length > 0;
        setReplacement(isReplaceItems);

        
    },[products])

    useEffect(() => {
        if (modalState.pharmacyId) {
            setOpen(false)
        }
    },[modalState.pharmacyId])

    useEffect(() => {
        if (isLoading) {
            const timeout = setTimeout(() => {
                setLoading(false)
            },1000)

            return () => clearTimeout(timeout)
        }
    }, [isLoading])

    return (
        <li onMouseOver={() => setHoverBallon(true)} onMouseLeave={() => setHoverBallon(false)} onClick={() => {
                            setOpen(prev => !prev); 
                            setReplacementShow(false); 
                            setMinAmount(false);
                            modalState.setMobileModalOpen();

                            }}  className="cursor-pointer min-[900px]:mr-[16px] relative border-b-[1px] border-b-[#F2F2F5] last:border-none py-[12px] flex justify-center flex-col">
            <div className="bg-[#00C293] h-[80%] left-[-16px] absolute w-[4px] rounded-[99px]" />

            <div onMouseMove={() => setHoverBallon(false)} onClick={() => {
                            setOpen(prev => !prev); 
                            setReplacementShow(false); 
                            setMinAmount(false);
                            modalState.setMobileModalOpen();

                            }} className=" flex gap-[6px]">
                {tags.map((tag, i) => (
                    <span  key={i} className="cursor-auto block font-medium h-[20px] items-center text-[14px] w-fit px-[6px] rounded-[8px]"
                          style={{
                              backgroundColor: tag === "Минимальная цена" ? "#DBF6F0" : "#FFF2E0",
                              color: tag === "Минимальная цена" ? "#00C293" : "#F2994A",
                          }}>
                        {tag}
                    </span>
                ))}
            </div>

            <div   className="flex w-full mt-[16px]">
                <div  className="flex w-full justify-between items-center">
                    <div  className="flex flex-col">
                        <button className={`cursor-pointer text-[#00C293] flex gap-[5px] items-center ${styles.price}`}>
                            {new_price} ₽
                            <div className={`h-[18px] w-[18px] transition-background duration-300 ${isOpen && 'rotate-z-180'} ${isHoverBallon && 'bg-[#F2F2F5]'} justify-center flex items-center rounded-full`}>
                                <img src="/arrow_list_item.svg" alt="arrow_list_item" className={`h-[12px]   w-[12px]`} />
                            </div>
                        </button>
                        <span className="text-[#78808F] font-normal text-[14px] leading-[18px]">{availableText}</span>
                    </div>
                    {
                        isMinAmount !== null ? <>
                        <Button onMouseMove={() => setHoverBallon(false)} defaultColor  onClick={() => {
                            setOpen(prev => !prev); 
                            setReplacementShow(false); 
                            setMinAmount(false);
                            modalState.setMobileModalOpen();

                            }} className="bg-[#F7F7FA] hover:bg-[#F2F2F5] h-[40px] min-[900px]:leading-[20px] text-[14px] !text-[#78808F]  max-h-[34px] font-semibold" text={`Мин. заказ ${ isMinAmount} ₽`} type="button"/>
                        </> 
                        :
                        <button onMouseMove={() => setHoverBallon(false)} onClick={() => {
                            setOpen(prev => !prev); 
                            setReplacementShow(false); 
                            setMinAmount(false);
                            modalState.setMobileModalOpen();
                                setLoading((prev: boolean) => !prev)
                            }} className={clsx(
                            `text-[white] px-[12px] py-[7px] min-w-[138px] justify-center items-center flex hover:bg-[#00B88B] bg-[#00C293] rounded-[99px] cursor-pointer max-[360px]:text-[14px] min-h-[34px] text-[14px] font-semibold`,  
                        )} type={'button'}>
                            {
                                isLoading ? <>
                                    <svg  className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13 7C13 8.18669 12.6481 9.34673 11.9888 10.3334C11.3295 11.3201 10.3925 12.0892 9.2961 12.5433C8.19974 12.9974 6.99334 13.1162 5.82946 12.8847C4.66557 12.6532 3.59647 12.0818 2.75736 11.2426C1.91824 10.4035 1.3468 9.33443 1.11529 8.17054C0.883777 7.00666 1.0026 5.80026 1.45672 4.7039C1.91085 3.60754 2.67988 2.67047 3.66658 2.01118C4.65327 1.35189 5.81331 1 7 1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                </> : deliveryTime
                            }
                        </button>

                    }
                </div>
            </div>


            {
                isReplacement && <button  onMouseMove={() => setHoverBallon(false)} className={clsx(" flex gap-[6px] justify-center items-center my-[12px] px-[10px] py-[6px] h-[32px] cursor-pointer rounded-full font-normal text-[14px] text-[#000000]",
                    {
                        ['text-[#000000] bg-[#DBF6F0] max-w-[161px] hover:bg-[#C9F0E7]']:isChangesSuccess,
                        ['text-[#000000] bg-[#F7F7FA] max-w-[149px] hover:bg-[#F2F2F5]']: !isChangesSuccess
                    }
                )}>
                    {
                        isChangesSuccess && <img src="/MarkSelect.svg" className="h-[16px] w-[12px]" alt="" />
                    }
                    
                    { isChangesSuccess ? 'Выбрана замена' : 'Собрать с заменой'}
                </button>
            }  

                        {
                isOpen && isReplacement && !isChangesSuccess && <div className="w-full bg-[#F7F7FA] px-[16px] max-[900px]:px-[12px] py-[12px] flex-col  flex  rounded-[12px] items-start ">
                    <span className="text-[#78808F] font-normal text-[14px]">Можно собрать полностью заказ, заменив отсутствующие товары аналогами</span>
                    <button onClick={() => {
                            replacementState.setProducts([
                                loadingProducts.products?.map((e: any, i: number) => {
                                    return {
                                        productId: i,
                                        ...e,
                                    };
                                }
                                
                            )] as any);
                        replacementState.openModalReplacement(false,() => {}, () => setChangesSuccess(true))
                        replacementState.openMobileOpen(true)
                    }} className="text-[#00C293] font-semibold text-[14px] hover:text-[#00B88B] mt-[8px] w-[158px] bg-[#FFFFFF] h-[34px] px-[16px] py-[7px] cursor-pointer rounded-[99px]">Подобрать замену</button>
                </div>
            }   
            {
                isOpen && isChangesSuccess   && <div className="w-full bg-[#DBF6F0] px-[16px] mt-[12px] max-[900px]:px-[12px]  py-[12px] flex-col flex justify-between rounded-[12px]  max-[900px]:m-0">
                    <span className="text-[#78808F] font-normal text-[14px] max-w-[311px] block">
                        <span className="font-semibold">Ура! </span> 
                        Вы собрали полностью заказ, заменив отсутствующие товары</span>
                    <button onClick={() => { replacementState.openModalReplacement(false); replacementState.openMobileOpen(true)}} className="text-[#00C293] font-semibold text-[14px] bg-[#FFFFFF] hover:text-[#00B88B] mt-[12px] h-[34px] max-w-[158px] px-[16px] py-[7px] cursor-pointer rounded-[99px]">Подобрать замену</button>
                </div>
            }     

            {
                isOpen && isMinAmount && <div className="w-full flex-col  bg-[#F7F7FA] px-[16px] max-[900px]:!px-[12px]   py-[12px] !mt-[12px] flex justify-between rounded-[12px] max-[900px]:flex-col max-[900px]:items-start max-[900px]:gap-[8px]  max-[900px]:m-0">
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
                            setMinAmount(false);
                            modalState.close();

                    }} className="text-[#00C293] font-semibold hover:text-[#00B88B] text-[14px] bg-[#FFFFFF] h-[34px] px-[16px] py-[7px] w-fit    min-w-[114px] cursor-pointer rounded-[99px]">Посмотреть</button>
                </div>
            }        

            {isOpen && (
                <ul className="w-full">
                    {products.map((product, idx) => (
                        <ModalBallonProductItem isNotEnd={idx !== products.length - 1} callbackSuccess={() => {}} product={product as any} pharId={idx.toString()}  key={idx}  />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default ModalBallonItem;
