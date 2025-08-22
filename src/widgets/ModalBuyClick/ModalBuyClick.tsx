import clsx from "clsx";
import { useBuyClick } from "../../entities/store/useBuyClick";
import { KeyboardEvent, useEffect, useState } from "react";


const ModalBuyClick = () => {
    const buyClick = useBuyClick();

    const [selectCount, setSelectCount] = useState(0);

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
        <>
            <div className={`overflow-hidden  p-[12px] max-[900px]:hidden flex flex-col rounded-[24px] z-[500] absolute left-[0px] justify-start`}>
                <div onBlur={() => setSelectCount(intervalCount)} className="overflow-hidden w-[375px] rounded-[24px] h-[188px] shadow-[0px_4px_28px_0px_#0000000F] bg-[#FFFFFF] rounded-[24px]">
                    <div className="h-[56px] bg-[#F2F2F5] w-full py-[12px] px-[16px] flex items-center">
                        <img className="h-[32px] w-[32px] mr-[12px]" src="/Danger_Circle.png" alt="" />
                        <h2 className="font-semibold text-[18px] leading-[20px]">Выберите аптеку</h2>
                    </div>

                    <div className="flex py-[12px] px-[16px] gap-[12px]">
                        <img className="h-[104px] w-[104px]" src="/product1.png" alt="" />

                        <div className="mt-[13px]">
                            <p className="line-clamp-2 hover:text-[#444952] cursor-pointer font-normal leading-[18px] text-[14px] mb-[8px]">
                                Супрастин (для инъекций), 20 мг/мл, раствор для инъекций, длинное название
                            </p>
                            <div className='flex bg-[#F7F7FA] w-[104px] h-[34px] rounded-[99px] items-center'>
                                    <button 
                                        onClick={() => {
                                            setSelectCount((prev: number) => {
                                                if (prev > 0) {
                                                    return prev - 1
                                                }
                                                return prev;
                                            })  
                                        }}                                      
                                        className='w-[22px] h-[22px] cursor-pointer ml-[8px] flex justify-center items-center'>
                                        <img src="/minus.svg" alt="" />
                                    </button>

                                    <input onKeyPress={handleKeyPress}  onBlur={() => setSelectCount(intervalCount) } value={selectCount} onChange={(e: any) => {
                                            if (!isNaN(e.target.value)) {
                                                setIntervalCount(Number(e.target.value))
                                            }  
                                        }
                                    } className='font-semibold focus-within:outline-0 text-center px-[5px] flex justify-center items-center text-[14px] text-[#000000] w-[40px]' />
                                    
                                    <button 
                                        onClick={() => {
                                            setSelectCount((prev: number) => {
                                                return prev + 1
                                            })  
                                    }} 

                                    className='w-[22px] h-[22px] cursor-pointer mr-[8px] justify-center items-center'>
                                        <img src="/plus.svg" alt="" />
                                    </button>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={clsx(`fixed min-[900px]:hidden w-full transition-[1s] overflow-hidden flex flex-col  z-[600] bg-[#FFFFFF]     rounded-[24px] ${!buyClick.isMobileOpen && 'shadow-[0px_-8px_16px_0px_#0000000F]'}`,
                    {
                        ['bottom-[0px] z-[600]'] : buyClick.isOpen && !buyClick.isMobileOpen,
                        ['bottom-[0px] z-[600] '] : buyClick.isMobileOpen && buyClick.isOpen,
                        ['bottom-[0px] z-[600] hidden'] : !buyClick.isOpen,
                    }   
                )}>
                    <div className="shrink-0 flex flex-col relative w-full " >
                        <div className="w-full flex  justify-center" onClick={() => {
                            buyClick.setMobileOpen()
                        }}>
                            {
                                buyClick.isMobileOpen && <div className=" w-full flex p-[16px] items-center flex-col pt-[10px] bg-[#F2F2F5]">
                                    <div className="h-[4px] rounded-[99px] w-[48px] bg-[#E1E1E5]"></div>
                                    <div className="flex mt-[8px]  items-center gap-[12px] w-full">
                                        <img src="/yellow_icon.svg" alt="" />
                                        <h2 className="font-semibold text-[18px] leading-[20px] w-full">Выберите аптеку</h2>
                                    </div>                            
                                </div>
                            }
                            {
                                !buyClick.isMobileOpen && <div className=" w-full flex justify-center h-[20px]  pt-[10px] ">
                                    <div className="h-[4px] rounded-[99px] w-[48px] bg-[#E1E1E5]"></div>
                                </div>
                            }
                        </div>

                        {
                            !buyClick.isMobileOpen && <div className="flex items-center px-[16px] pb-[12px] gap-[12px]">
                                <img className="h-[48px] w-[48px]" src="/product1.png" alt="" />
                                <p className="w-[253px]  line-clamp-2  cursor-pointer font-normal leading-[18px] text-[14px] mb-[8px]">
                                    Супрастин (для инъекций), 20 мг/мл, раствор для инъекций, длинное название
                                </p>
                            </div>
                        }

                        {
                            buyClick.isMobileOpen && <div className="flex items-center mb-[12px]  px-[16px] gap-[12px]">
                            <img className="h-[78px] w-[78px]" src="/product1.png" alt="" />
    
                            <div className="mt-[13px] flex flex-col">
                                <p className="w-[253px] line-clamp-2 cursor-pointer font-normal leading-[18px] text-[14px] mb-[8px]">
                                    Супрастин (для инъекций), 20 мг/мл, раствор для инъекций, длинное название
                                </p>
                                    <div className='flex bg-[#F7F7FA] w-[104px] h-[34px] rounded-[99px] items-center'>
                                        <button 
                                            onClick={() => {
                                                setSelectCount((prev: number) => {
                                                    if (prev > 0) {
                                                        return prev - 1
                                                    }
                                                    return prev;
                                                })  
                                            }}                                      
                                            className='w-[22px] h-[22px] cursor-pointer ml-[8px] flex justify-center items-center'>
                                            <img src="/minus.svg" alt="" />
                                        </button>
    
                                        <input onKeyPress={handleKeyPress} onBlur={() => setSelectCount(intervalCount) } value={selectCount} onChange={(e: any) => {
                                                if (!isNaN(e.target.value)) {
                                                    setIntervalCount(Number(e.target.value))
                                                }  
                                            }
                                        } className='font-semibold focus-within:outline-0 text-center px-[5px] flex justify-center items-center text-[14px] text-[#000000] w-[40px]' />
    
                                        <button 
                                            onClick={() => {
                                                setSelectCount((prev: number) => {
                                                    return prev + 1
                                                })  
                                            }} 
                                        className='w-[22px] h-[22px] cursor-pointer mr-[8px] flex justify-center items-center'>
                                            <img src="/plus.svg" alt="" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        }   
                    </div>
            </div>
        </>
    );
};

export default ModalBuyClick;