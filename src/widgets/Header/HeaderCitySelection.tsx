import styles from './HeaderCitySelection.module.scss'

const HeaderCitySelection = () => {
    return (
        <div className="flex gap-[6px] min-[900px]:ml-[26px]  max-[900px]:h-[32px] min-[900px]:mr-[57px] text-ellipsis h-full items-center">
            <div className={`relative cursor-pointer  text-ellipsis items-center flex  gap-[4px] ${styles.arrow}`}>
                <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 6.10352C12 2.64084 9.34263 0 6 0C2.65737 0 0 2.64084 0 6.10352C0.000187188 8.5424 1.67853 11.148 4.96973 14.0811L6 14.999L7.03027 14.0811C10.3215 11.148 11.9998 8.5424 12 6.10352ZM9 6C9 4.34315 7.65685 3 6 3C4.34315 3 3 4.34315 3 6C3 7.65685 4.34315 9 6 9C7.65685 9 9 7.65685 9 6Z" fill="#ABB6CC"/>
                </svg>

                <span className= "max-[900px]:text-[12px] font-normal max-[900px]:w-[208px] overflow-hidden block w-[165px]  text-ellipsis whitespace-nowrap">
                    Респ. Северная Осетия - Алания</span>

            </div>
        </div>
    );
};

export default HeaderCitySelection;
