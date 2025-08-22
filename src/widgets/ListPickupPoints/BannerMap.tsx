import { useState } from 'react';
import { Link } from 'react-router-dom';

export const BannerMap = () => {
    const  [isOpenMap, setIsOpenMap] = useState(true);

    return (
        <>
            {
                isOpenMap && <div className="relative w-full mx-[20px] ml-[0px] my-[20px] flex max-[900px]:px-[16px]">
                    <button onClick={() => setIsOpenMap(false)} className="z-[100] cursor-pointer absolute h-[44px] w-[44px] right-0 max-[900px]:right-[16px] max-[900px]:h-[40px] max-[900px]:w-[40px] flex justify-center items-center">
                        <svg className="max-[900px]:w-[16px] max-[900px]:h-[16px] w-[20px] h-[20px] "  width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.667 3.33337L3.33366 16.6667" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3.33301 3.33337L16.6663 16.6667" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>

                    <div className="w-full h-[96px] rounded-[12px] border-[#DBF6F0] relative  border-[1px] overflow-hidden  flex justify-center items-center">
                        <div className="bg-[#FFFFFF3D] w-full h-[96px] absolute z-[10]" />
                        <Link to={'/map'} className="absolute z-[100] bg-[#FFFFFF] border-[#00C293] border-[2px] px-[24px] py-[10px] rounded-[99px] h-[40px] text-[14px] leading-[20px] font-semibold text-[#00C293]">
                            Выбрать аптеку на карте
                        </Link>
                        <div className="w-full min-h-[96px] bg-[url(/map.png)] bg-no-repeat bg-center bg-size-[1000px]  relative z-[1]" />             
                    </div>
                </div>
                
            }
            {
                !isOpenMap && <div className='w-full h-[1px] bg-[#F2F2F5]' />
            }
        </>
    );
};
