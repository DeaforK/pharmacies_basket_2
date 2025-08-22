import React, { KeyboardEvent, useEffect, useState } from 'react';
import styles from './ModalReplacementElement.module.scss';
import { useToastState } from '../../entities/store/useToast';


type Props= {
    useType: 'По действующему веществу' | 'По эффекту применения' | 'По АТХ классификации',
    name: string,
    region: string,
    price: number,
    quantity: string,
    id: number,
    callbackSelect: (select: any) => void;
    isSelectObj: any,

    isEndElement: boolean,
}


const ModalReplacementElement:React.FC<Props> = ({useType,callbackSelect,name,price,quantity, id, isSelectObj, isEndElement}) => {
    const [isSelect, setSelect] = useState(false);

    const [selectCount,setSelectCount] = useState(0);

    const toast = useToastState();

    const [isMaxCount,setMaxCount] = useState(false);

    useEffect(() => {
        if (isSelectObj.id !== id) {
            setSelect(false)
        }
    },[isSelectObj.id])

    const [intervalCount, setIntervalCount] = useState(0);

    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if(event.key === 'Enter'){
            setSelectCount(intervalCount) 
        }
    };

    useEffect(() => {
        setIntervalCount(selectCount)
    },[selectCount])
    
    return (
        <div className={`${styles.element} px-[16px] py-[8px] ${isEndElement && '!pb-[6px]'} h-fit flex gap-[12px] `}>
                    <img src="/item.png" className="h-[48px] w-[48px] object-contain shrink-0" alt="" />

                    <div className={` ${!isEndElement && 'border-b-[1px] border-b-[#F2F2F5]'} pb-[16px] grow `}>
                        <h2 className="font-normal text-[14px] text-[#000000] max-w-[283px]">{name}</h2>
                        
                        <span className="block font-normal text-[14px] leading-[18px] text-[#78808F] max-w-[283px] mb-[8px]">Фармсандарт длинное название производителя, Россия</span>

                        <div className="items-center w-full flex justify-between">
                            <span className="flex text-[#000000] font-semibold text-[14px] wide_text gap-[6px]">
                                {price} 
                                <span className="text-[#78808F] font-normal text-[14px]">{quantity}</span>

                                {
                                    isSelect && <img className='h-[20px] w-[20px]' src="/replace_success.svg" alt="" />
                                }
                            </span>

                            {
                                isSelect && isSelectObj.id === id && <div className='flex bg-[#F7F7FA] w-[104px] h-[34px] rounded-[99px] items-center justify-between py-[5.6px]'>
                                    <button 
                                        onClick={() => setSelectCount((prev) => 
                                        {   
                                            setMaxCount(false);

                                            if (prev > 1) {
                                                return prev - 1
                                            }
                                            if (prev - 1 === 0) {
                                                
                                                setSelect(false)
                                                callbackSelect(() => 
                                                    {   
                                                        return {
                                                            select: id,
                                                            id:id,
                                                            quantityNew: Number(quantity.replace(/[^\d.-]/g, '').replace('.', '')) - selectCount,
                                                            quantityOld: Number(quantity.replace(/[^\d.-]/g, '').replace('.', '')),
                                                            empty: true,
                                                        }
                                                    });
                                            }
                                            return prev
                                        })}                                      className={`cursor-pointer h-[33px] flex  justify-end pr-[4px] items-center w-[34px] ${styles.btn__counter}`}>
                                        <svg width="14" height="2" viewBox="0 0 14 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1.16699 1H12.8337" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>

                                    </button>

                                    <input onKeyPress={handleKeyPress}  onBlur={() => setSelectCount(intervalCount) } value={selectCount} onChange={(e: any) => {
                                            if (!isNaN(e.target.value)) {
                                                setIntervalCount(Number(e.target.value))
                                            }  
                                        }
                                    } className='font-semibold focus-within:outline-0 text-center px-[5px] flex justify-center items-center text-[14px] text-[#000000] w-[40px]' />

                                    <button 
                                        onClick={() => setSelectCount((prev) => 
                                        {   
                                            if (prev + 1 >=  Number(quantity.replace(/[^\d.-]/g, '').replace('.', ''))) {
                                                toast.setOpen(false);
                                                setMaxCount(true);
                                                toast.setContent(<span>Достигнут максимальный остаток  <br />товара в этой аптеке</span>);
                                                toast.setOpen(true);
                                            }
                                            if (prev >= 1 && prev < Number(quantity.replace(/[^\d.-]/g, '').replace('.', ''))) {
                                                setMaxCount(false);
                                                callbackSelect(() => 
                                                    {   
                                                        return {
                                                            select: id,
                                                            id:id,
                                                            quantityNew: Number(quantity.replace(/[^\d.-]/g, '').replace('.', '')) - selectCount,
                                                            quantityOld: Number(quantity.replace(/[^\d.-]/g, '').replace('.', '')),
                                                            empty: false,
                                                    }
                                                });
                                                return prev + 1
                                                
                                            }
                                            return prev
                                        })} 
                                    className={`cursor-pointer h-[33px] flex  justify-start pl-[4px] items-center w-[34px] ${styles.btn__counter}`}>
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.00033 1.16663V12.8333M1.16699 6.99996L12.8337 6.99996" stroke={`${isMaxCount ? '#78808F' :  '#ABB6CC'}`} strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                    </button>
                                </div>
                            }
                            {
                                !isSelect && <button onClick={() => 
                                {
                                    setSelect(true);
                                    setSelectCount(1);
                                    callbackSelect(() => 
                                        {   
                                            return {
                                                select: id,
                                                id:id,
                                                quantityNew: Number(quantity.replace(/[^\d.-]/g, '').replace('.', '')) - selectCount,
                                                quantityOld: Number(quantity.replace(/[^\d.-]/g, '').replace('.', '')),
                                                empty: false,
                                            }
                                        });

                                }} className="text-[#00C293] flex items-center text-[14px] max-w-[104px] cursor-pointer align-middle  font-semibold h-[34px] px-[22px]  border-2 rounded-[99px] border-[#00C293]">
                                    <span>Выбрать</span>
                                </button>
                            }      
                        </div>
                        {
                            useType === 'По АТХ классификации' &&  <div className="w-full text-[#0891B2] bg-[#CFFAFE] px-[6px] mt-[12px] text-[14px] font-normal min-h-[24px] rounded-[6px] flex justify-center items-center ">
                            По действующему веществу
                            </div>
                        }
                        {
                            useType === 'По эффекту применения' &&  <div className="w-full text-[#65A30D] bg-[#ECFCCB] px-[6px] mt-[12px] text-[14px] font-normal min-h-[24px] rounded-[6px] flex justify-center items-center ">
                            По  эффекту от применения
                            </div>
                        }
                        {
                            useType === 'По действующему веществу' &&  <div className="w-full text-[#CA8A04] bg-[#FEF9C3] px-[6px] mt-[12px] text-[14px] font-normal min-h-[24px] rounded-[6px] flex justify-center items-center ">
                            По  АТХ классификации
                            </div>
                        }   
    
                    </div>
                </div>
    );
};

export default ModalReplacementElement;
