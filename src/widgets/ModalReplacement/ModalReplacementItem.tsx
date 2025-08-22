import React, { useEffect, useState } from "react";
import ModalReplacementElement from "./ModalReplacementElement";
import clsx from "clsx";
import { useReplacementState } from "../../entities/store/useReplacement";

import styles from './ModalReplacementElement.module.scss'

interface IModalReplacementItem {
    name: string,
    region: string,
    quantity: number,
    type: string,
    price: number,
    products: [],
    setValid: any,
    isSingleOpen?: boolean,
    id?: number,
    productId?: any,
    productId_new?: number,

    isEndElement: boolean,

    reset?: boolean;
}

export const ModalReplacementItem:React.FC<IModalReplacementItem> = ({reset,productId,id,products, name, quantity, setValid,isSingleOpen = true}) => {

    const [ IsShowNew, setShowNew] = useState(false);
    const [ IsShowNewCount, setShowNewCount] = useState(3);

    const replacementState = useReplacementState();

    const [isSelect, setSelect] = useState({
        select: -1,
        id:-1,
        quantityNew: -1,
        quantityOld: -1,
        empty: true,
    });




    useEffect(() => {
        if (isSingleOpen) {
            if (isSelect.empty !== true && isSelect.select !== -1) {
                setValid(true)
                return;
            }
            setValid(false)
        }
        else
        {
            if (isSelect.empty !== true && isSelect.select !== -1) {
                let result =  replacementState.productsReplaceNew;

               // console.log(result)
                if (id !== undefined) {
                    result[id] = {...isSelect, productId: productId,productId_new:isSelect.id}
                }

                setValid(true)

                replacementState.productsReplaceNew.length > 0 && replacementState.productsReplaceNew.forEach((res: any) => {
                    if (res !== null) {
                        if(res.empty === true  && isSelect.select === -1) {
                            setValid(false)
                        }
                    }
                    else setValid(false)
                });

                return;
            }
            setValid(false)

            let result =  replacementState.productsReplaceNew;

            if (id !== undefined) {
                result[id] = {
                    select: -1,
                    id:-1,
                    quantityNew: -1,
                    quantityOld: -1,
                    productId: -1,
                    empty: true,
                }
            }
        }

    },[isSelect,productId])

    useEffect(() => {
        if (isSingleOpen) {
            replacementState.setProductReplaceNew(isSelect);
        }
    },[isSelect,isSingleOpen])

    useEffect(() => {
        setSelect({
        select: -1,
        id:-1,
        quantityNew: -1,
        quantityOld: -1,
        empty: true,
    })
    },[reset])

    return (
        <>
            <div className="bg-[#F7F7FA] px-[16px] py-[8px] h-fit flex gap-[12px]">
                <img src="/item.png" className="h-[48px] w-[48px] object-contain" alt="" />

                <div>
                    <h2 className="font-normal text-[14px] text-[#000000] max-w-[283px]">{name}</h2>
                    <span className="block font-normal text-[14px] text-[#78808F]">{'Фармсандарт, Россия'}</span>
                    <span className="block font-normal text-[14px] text-[#78808F]">{quantity}</span>
                </div>
            </div>

            <div className="w-full flex justify-center relative items-center px-[8px]">
                <button className={clsx("flex gap-[6px] justify-center items-center my-[12px] px-[10px] py-[6px] h-[32px] rounded-full font-normal leading-[20px] min-w-[161px] text-[14px] text-[#000000]",
                    {
                        ['text-[#000000] bg-[#DBF6F0]']:!isSelect.empty,
                        ['text-[#000000] bg-[#F7F7FA]']: isSelect.empty
                    }
                )}>
                    {
                        isSelect.empty && <img className="" src="/Refresh.svg" alt="" />
                    }
                    {
                        !isSelect.empty && <img src="/MarkSelect.svg" className="h-[12px] w-[16px]" alt="" />
                    }

                    {
                        !isSelect.empty ? 'Выбрана замена' : 'Выберите замену'
                    }


                </button>

                {
                    !isSelect.empty && <button onClick={() => setSelect(() => {
                        return {
                            select: -1,
                            id:-1,
                            quantityNew: -1,
                            quantityOld: -1,
                            empty: true,
                        }
                    })} className="absolute right-[8px] hover:text-[#444952] text-[#78808F] text-[14px] cursor-pointer font-normal">
                        Сбросить
                    </button>
                }

            </div>

            <div className="flex flex-col w-full">
                {
                    IsShowNew === false && products !== undefined && products.length > 0 && products.slice(0,IsShowNewCount).map((item: any,i) => <>
                        {
                            <>
                                <ModalReplacementElement isEndElement={i === products.slice(0,IsShowNewCount).length - 1} region="dd" isSelectObj={isSelect} id={i} name={item.title} price={item.price} quantity={item.quantity}   callbackSelect={setSelect} useType={item.type}/>
                            </>
                        }
                    </>)
                }
                {
                    (IsShowNew || IsShowNewCount !== products.length) &&
                    <button onClick={() => {
                        setShowNewCount((prev: any) => {

                            let addCount = products.length - prev;

                            if (addCount > 3) {
                                addCount = 3
                            }
                            return prev + addCount

                        });
                        setShowNew(false)
                    }} className={` ${styles.btn_show} ml-[76px] mb-[38px] font-normal cursor-pointer text-[14px] leading-[20px] w-fit text-[#78808F] hover:text-[#444952] items-center  flex gap-[2px]`} >
                        {
                            <>
                               Показать ещё {products.length - IsShowNewCount > 3   ? 3 : products.length - IsShowNewCount }
                            </>
                        }
                        <svg xmlns="http://www.w3.org/2000/svg" transform="rotate(-180 0 0)" width="10" height="6" viewBox="0 0 10 6" fill="none">
                            <path d="M8.5 4.5L5 1.5L1.5 4.5" stroke="#78808F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                }
                {
                    !IsShowNew && IsShowNewCount === products.length &&
                    <button onClick={() => {setShowNewCount(3)}} className={` ${styles.btn_show} ml-[76px] mb-[38px]  cursor-pointer font-normal text-[14px] leading-[20px] text-[#78808F] hover:text-[#444952] items-center flex gap-[2px]`}>
                        Скрыть
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none">
                            <path d="M8.5 4.5L5 1.5L1.5 4.5" stroke="#78808F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                }
                {/* <button className="text-[#78808F] text-[14px] font-normal mt-[6px] ml-[76px] mb-[38px] flex w-full justify-start">Показать ещё 12</button> */}
            </div>

        </>
    );
};
