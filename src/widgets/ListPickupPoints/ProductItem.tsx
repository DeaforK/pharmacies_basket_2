import React, { useState } from 'react';
import { Product } from '../../entities/types/PickupPoint';
import { useReplacementState } from '../../entities/store/useReplacement';
import useWindowDimensions from '../../features/hooks/useWindowDimensions';
import ModalHint from '../../shared/components/ModalHint/ModalHint';

type Props = {
    key: number,
    product: Product & { title: string, availableCount: number },
    pharId: string,
    callbackSuccess: (select: boolean) => void;
    isNotEnd: boolean,
}

export const ProductItem:React.FC<Props> = ({isNotEnd,key, product,pharId, callbackSuccess}) => {
    const [IsReplaced, setReplaced] = useState(false);

    const replacementState = useReplacementState();
    const { width } = useWindowDimensions();

    const [IsHoverHint, setHoverHint] = useState(false);

    return (
        <li key={key} className={` ${isNotEnd && 'pb-[12px]'} flex gap-[12px] pt-[12px] min-[900px]:px-[0px]`}>
                <img src="/item.png" alt="item" className={`mt-[8px] h-[48px] w-[48px] object-contain ${product.availableCount === 0 && product.availableCount > 2 && product.availableCount <= 2 && 'mt-0'}`} />

                <div className={`flex flex-col ${!isNotEnd && 'border-b-[1px]  border-b-[#F2F2F5]'}  grow pb-[12px]`}>
                    <div className="flex gap-[28px] max-[900px]:gap-[12px] relative">                        
                        <div className="relative   w-[267px] text-[14px] max-[900px]:w-[203px] leading-[18px]  max-[425px]:w-[180px] flex flex-col">
                            {
                                product.availableCount === 0 && <span className="mb-[2px] text-[#EB1C4E] block font-normal text-[14px] leading-[18px]">Нет в наличии</span>
                            }
                            {
                                product.availableCount > 2 && <span className="mb-[2px] text-[#FF9900] block font-normal text-[14px] leading-[18px]">Доступно {product.availableCount} из 10</span>
                            }
                            {
                                product.availableCount <= 2 && product.availableCount > 0 && <span onMouseEnter={ () => setHoverHint(true)} onMouseLeave={() => setHoverHint(false)}  className="flex  mb-[2px] items-center w-fit gap-[6px] text-[#78808F]  font-normal text-[14px] leading-[18px]">Заканчивается
                                <svg className='cursor-pointer' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_886_11746)">
                                    <circle cx="8" cy="8" r="8" fill="#F2F2F5"/>
                                    <path d="M8 11.2L8 7.99995" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round"/>
                                    <circle cx="1.25" cy="1.25" r="1.25" transform="matrix(1 0 0 -1 6.75 5.5)" fill="#ABB6CC"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_886_11746">
                                    <rect width="16" height="16" fill="white"/>
                                    </clipPath>
                                    </defs>
                                    </svg>
                                </span>
                            }
                            <p className='text-ellipsis flex relative  whitespace-normal overflow-hidden overflow-ellipsis '>
                                {product.title}
                            </p>
                        </div>
                        <ModalHint isVisible={IsHoverHint} positionArrow='bottom' className='absolute top-[-50px] left-[20px] z-[1000]'>
                            <span className='leading-[14px] font-normal text-[14px]'>Остаток в аптеке 1-2 шт, <br />
                            успейте оформить заказ</span>
                        </ModalHint>

                        <div className="flex flex-col mt-[21px]">
                            <span className="font-semibold text-[14px] leading-[18px] text-[#000000] wide_text">{product.price}</span>
                            <span className="text-[#78808F] text-[14px] font-normal leading-[18px]">× 3 шт.</span>
                        </div>
                    </div>
                    {
                        !IsReplaced &&  product.availableCount === 0 && <button onClick={() => 
                        {
                        
                            replacementState.setProductId(pharId);
                            replacementState.setProductReplace(product);
                            replacementState.openModalReplacement(true,(select) => {
                                
                                if (width <= 426) {
                                    replacementState.openMobileOpen(true);
                                }
                                setReplaced(select);
                            }, () => {});
                        }} className='mt-[8px] btn-replace w-fit cursor-pointer h-[20px] gap-[6px] flex items-center'>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.06683 9.44444H2.06683H3.06683ZM3.06684 10.8333L2.36251 11.5432C2.75239 11.93 3.38128 11.93 3.77116 11.5432L3.06684 10.8333ZM5.171 10.1543C5.56306 9.76534 5.56554 9.13218 5.17656 8.74012C4.78757 8.34807 4.15441 8.34558 3.76235 8.73457L5.171 10.1543ZM2.37132 8.73457C1.97926 8.34558 1.3461 8.34807 0.957113 8.74012C0.568126 9.13218 0.570613 9.76534 0.962668 10.1543L2.37132 8.73457ZM15.1938 6.35705C15.4831 6.82754 16.099 6.97447 16.5694 6.68522C17.0399 6.39598 17.1869 5.7801 16.8976 5.30961L15.1938 6.35705ZM10.066 1.5C5.65563 1.5 2.06683 5.04946 2.06683 9.44444H4.06683C4.06683 6.16881 6.74535 3.5 10.066 3.5V1.5ZM2.06683 9.44444L2.06684 10.8333H4.06684L4.06683 9.44444L2.06683 9.44444ZM3.77116 11.5432L5.171 10.1543L3.76235 8.73457L2.36251 10.1235L3.77116 11.5432ZM3.77116 10.1235L2.37132 8.73457L0.962668 10.1543L2.36251 11.5432L3.77116 10.1235ZM16.8976 5.30961C15.4931 3.02502 12.9578 1.5 10.066 1.5V3.5C12.2393 3.5 14.1406 4.64392 15.1938 6.35705L16.8976 5.30961Z" fill="#00C293"/>
                                <path d="M16.9279 9.16667L17.6309 8.45545C17.2413 8.07041 16.6145 8.07041 16.225 8.45545L16.9279 9.16667ZM14.8198 9.84434C14.427 10.2326 14.4233 10.8657 14.8115 11.2585C15.1997 11.6513 15.8329 11.655 16.2257 11.2668L14.8198 9.84434ZM17.6301 11.2668C18.0229 11.655 18.6561 11.6513 19.0443 11.2585C19.4326 10.8657 19.4289 10.2326 19.0361 9.84433L17.6301 11.2668ZM4.75041 13.6415C4.46037 13.1715 3.84424 13.0256 3.37424 13.3157C2.90425 13.6057 2.75837 14.2218 3.04842 14.6918L4.75041 13.6415ZM9.90195 18.5C14.3235 18.5 17.9279 14.9541 17.9279 10.5556H15.9279C15.9279 13.8276 13.241 16.5 9.90195 16.5V18.5ZM17.9279 10.5556V9.16667H15.9279V10.5556H17.9279ZM16.225 8.45545L14.8198 9.84434L16.2257 11.2668L17.6309 9.87789L16.225 8.45545ZM16.225 9.87789L17.6301 11.2668L19.0361 9.84433L17.6309 8.45545L16.225 9.87789ZM3.04842 14.6918C4.45844 16.9767 7.00232 18.5 9.90195 18.5V16.5C7.71725 16.5 5.80749 15.3544 4.75041 13.6415L3.04842 14.6918Z" fill="#00C293"/>
                            </svg>

                            <span className='text-[#00C293] text-[14px] font-semibold leading-[20px]'>Выбрать замену</span>
                        </button>
                        
                    }
                    {
                        IsReplaced &&
                        <div className={`${product.availability  === 'Нет в наличии'} mt-[12px] flex w-fit gap-[12px] cursor-pointer bg-[#F7F7FA] rounded-[8px] h-[28px] pl-[12px] py-[2px] items-center`}>
                            <span className="font-normal text-[14px] leading-[18px]">Вы выбрали замену </span>
                            <div className='flex gap-[2px]'>

                                <button  className='flex justify-center items-center w-[28px] h-[28px]' onClick={() => 
                                {
                                
                                    replacementState.setProductId(pharId);
                                    replacementState.setProductReplace(product);
                                    replacementState.openModalReplacement(true,(select) => {
                                        
                                        if (width <= 426) {
                                            replacementState.openMobileOpen(true);
                                        }
                                        setReplaced(select);
                                    }, (select) =>  callbackSuccess(select as any));
                                }}>
                                    <img  className="h-[16px] w-[16px] cursor-pointer" src="/edit.svg" alt="edit" />
                                </button>
                                                                <button className='flex justify-center items-center w-[28px] h-[28px] cursor-pointer' onClick={() => replacementState.openModalDelete(() => setReplaced(false))}>
                                    <img className="h-[16px] w-[16px] " src="/trash.svg" alt="trash" />
                                </button>
                            </div>
                        </div>
                    }
                </div>
            </li>  
    );
};
