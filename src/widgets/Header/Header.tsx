import { Link } from "react-router-dom";
import HeaderCitySelection from "./HeaderCitySelection";
import { HeaderSearch } from "./HeaderSearch/HeaderSearch";
import HeaderSelectRoute from "./HeaderSelectRoute";
import { useFilterState } from "../../entities/store/useModalFilter";
import { useModalState } from "../../entities/store/useModalState";

import styles from './Header.module.scss';
import { useMemo } from "react";
import { useHeaderScrollState } from "../../entities/store/useHeaderScroll";
import { TopPanel } from "../../shared/components/TopPanel/TopPanel";
import { useBuyClick } from "../../entities/store/useBuyClick";


export const Header = () => {
    const filterModalState = useFilterState();
    const modalState = useModalState();
    const buyClick = useBuyClick();


    const headerScroll = useHeaderScrollState();

    const filterCount = useMemo(() => {
                return Number(filterModalState.IsTodaySelect) + Number(filterModalState.price[0] !== 0) + Number(filterModalState.inStock) + Number(filterModalState.price[1] !== filterModalState.maxPrice)
                + Number(filterModalState.is24Hours) + Number(filterModalState.withoutMinAmount)
    },[filterModalState.IsTodaySelect, filterModalState.is24Hours, filterModalState.inStock, filterModalState.isOpenNow, filterModalState.price[0], filterModalState.price[1], filterModalState.withoutMinAmount])

    return (
        <div className={`shrink-0 flex sticky top-0 flex-col  ${headerScroll.directionScroll === 1 && 'max-[900px]:top-[-96px] top-[-72px]'} duration-600 transition-all z-[201] justify-center items-center w-full max-[900px]:min-h-[96px] min-h-[72px] bg-[#FFFFFF]`}>
            <header className={`shrink-0 flex sticky top-0   duration-600 transition-all z-[201] justify-center items-center w-full max-[900px]:min-h-[96px] min-h-[72px] bg-[#FFFFFF]`}>
                <div className="max-[900px]:hidden relative w-full max-w-[1440px] grid grid-cols-[1fr_1fr_minmax(100px,250px)_211px] p-[5px]  pl-[31.5px] pr-[24px]">
                    <div className="h-full flex items-center gap-[5px]">
                        <Link to={'/basket'} className={`text-[#78808F] font-normal text-[16px] flex gap-[6px] items-center w-fit ${styles.arrow}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M12.5 4.16667L7.5 10L12.5 15.8333" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            В корзину
                        </Link>

                        <button className="cursor-pointer" onClick={() => buyClick.setOpen(true)}>Купить в  один клик</button>
                    </div>
                    <HeaderSearch />
                    <HeaderCitySelection />
                    <HeaderSelectRoute />
                </div>

                <div className="min-[900px]:hidden w-full max-w-[1440px] min-[900px]:p-[5px] shadow-[0px_2px_4px_0px_#0000000A]">
                    <div className="w-full grid grid-cols-[24px_1fr] px-[16px] py-[8px]">
                        <div className="max-[900px]:hidden h-full flex items-center">
                            <Link to={'/basket'} className="text-[#78808F] font-normal text-[16px] flex gap-[6px] items-center w-fit">
                                <img className="h-[11px] w-[11px]" src="/back.svg" alt="back" />
                            </Link>
                        </div>

                        <div className="min-[900px]:hidden h-full flex items-center">
                            <Link to={'/basket'} className="text-[#78808F] font-normal text-[16px] flex gap-[6px] h-[24px] w-[24px] items-center">
                                <img className="h-[12px] w-[16px]" src="/arrow_back.svg" alt="back" />
                            </Link>
                        </div>
                        <HeaderSearch />
                    </div>
                    <div className="w-full grid grid-cols-[1fr_80px] max-[900px]:pl-[16px] px-[16px] max-[900px]:pb-[6px]">
                        <HeaderCitySelection />

                        <button onClick={() => {filterModalState.open(); modalState.close()}} className="flex items-center gap-[8px]">
                            <div className="h-[20px] w-[20px] relative">
                                <img className="h-[20px] w-[20px]" src="/filter.svg" alt="filter"/>

                                {
                                    filterCount > 0 &&
                                    <span className="bg-[#EB1C4E] w-[12px] h-[12px] rounded-full absolute top-0 text-[9px] font-semibold text-[#FFFFFF]">
                                        {filterCount}
                                    </span>
                                }
                            </div>

                            <span className="font-normal text-[12px] text-[#78808F]">Фильтры</span>
                        </button>
                    </div>
                </div>

            </header>
            <TopPanel />

        </div>
    );
};
