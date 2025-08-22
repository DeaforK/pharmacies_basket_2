import { useState } from "react";
import { useHeaderScrollState } from "../../../entities/store/useHeaderScroll";

export const TopPanel = () => {
    const [isShow, setShow] = useState(true);

    const headerState = useHeaderScrollState();

    if (isShow) {
        return (
            <>
                <div className={` absolute z-[200] duration-800 transition-all w-full max-[900px]:pl-[16px]  max-[900px]:py-[6px] max-[900px]:pr-[50px] bg-[#867FFF] max-[900px]:h-[40px]  justify-center items-center top-[72px] max-[900px]:top-[96px] z-[200]  py-[12px] flex gap-[8px] `}>
                    <img className="z-[1]" src="/price_circle_2.svg" alt="" />
                    <span className="text-[16px] font-semibold max-[900px]:!text-[12px] max-[900px]:w-[277px]  max-[900px]:leading-[14px] z-[1] text-[#E1EAFF]">Цены действительны только при оформлении заказа на сайте Фармси</span>
        
                    <button  onClick={() => 
                    {
                        setShow(false); 
                        headerState.onBannerHidden(false)
                        console.log(headerState.bannerHidden)
                    }} 
                    className="absolute z-[1] top-[8px] h-[32px] w-[32px] cursor-pointer max-[900px]:w-[34px] max-[900px]:h-[32px] max-[900px]:top-[4px] max-[900px]:right-[8px] flex justify-center items-center right-[16px]">
                        <img className="h-[16px] w-[16px]" src="/cross_1.svg" alt="" />
                    </button>
                </div>
            </>
        );
    }
    
};
