import { useState } from "react";
import { useMapState } from "../../entities/store/useMapState";
import { UAParser } from 'ua-parser-js'; 
import { usePosition } from "../../features/hooks/usePosition.tsx";
const ModalPermissionGeo = () => {
    const mapState = useMapState();

    const { name } = new UAParser().getBrowser();
    
    const [isShowInstruction, setShowInstruction] = useState(false);

    const { initialPosition } = usePosition();

    return (
        <div className={`pointer-events-none h-full w-full absolute flex justify-center items-center z-[203] ${isShowInstruction && 'items-start pt-[38px] justify-end right-[16px]'}`}>
            {
                isShowInstruction && <div className="pointer-events-auto w-[343px] flex flex-col rounded-[16px] relative bg-[white] p-[16px]">
                    <svg className="absolute top-[-30px] right-[13px]" xmlns="http://www.w3.org/2000/svg" width="44" height="31" viewBox="0 0 44 31" fill="none">
                    <path d="M43.9611 0.211889C44.0907 8.06095 44.0824 27.8082 40.8247 31H0C33.1234 31 41.3875 8.61785 43.3268 0.173334C43.3829 -0.0709555 43.9569 -0.0387254 43.9611 0.211889Z" fill="white"/>
                    </svg>

                    <h1 className="font-semibold text-[22px] leading-[28px] wild-text">Как разрешить доступ к геолокации</h1>

                    <ul className="flex flex-col gap-[16px] mt-[24px] grow relative">
                        <div className="absolute h-full w-[1px] bg-[#E1E1E5] left-[20px] z-[1]"></div>

                        <li className="relative z-[10] text-[14px] font-normal text-[#444952] flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" className="mr-[12px]" fill="none">
                                <rect width="40" height="40" rx="20" fill="#F2F2F5"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M20 25C21.1046 25 22 25.8954 22 27C22 28.1046 21.1046 29 20 29C18.8954 29 18 28.1046 18 27C18 25.8954 18.8954 25 20 25ZM20 18C21.1046 18 22 18.8954 22 20C22 21.1046 21.1046 22 20 22C18.8954 22 18 21.1046 18 20C18 18.8954 18.8954 18 20 18ZM20 11C21.1046 11 22 11.8954 22 13C22 14.1046 21.1046 15 20 15C18.8954 15 18 14.1046 18 13C18 11.8954 18.8954 11 20 11Z" fill="#78808F"/>
                            </svg>
                            

                            Нажмите <span className="text-[#000000] font-semibold "> &nbsp; «Три точки»</span>
                        </li>

                        <li className="relative z-[10] text-[14px] font-normal text-[#444952] flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" className="mr-[12px]" fill="none">
                            <rect width="40" height="40" rx="20" fill="#F2F2F5"/>
                            <circle cx="20" cy="20" r="3" stroke="#78808F" strokeWidth="2"/>
                            <path d="M21.7658 10.1522C21.3983 10 20.9324 10 20.0005 10C19.0686 10 18.6027 10 18.2351 10.1522C17.7451 10.3552 17.3557 10.7446 17.1527 11.2346C17.0601 11.4583 17.0238 11.7185 17.0096 12.098C16.9887 12.6557 16.7027 13.1719 16.2194 13.4509C15.7361 13.73 15.1461 13.7195 14.6527 13.4588C14.3169 13.2813 14.0735 13.1826 13.8334 13.151C13.3075 13.0818 12.7757 13.2243 12.3548 13.5472C12.0392 13.7894 11.8063 14.1929 11.3403 14.9999C10.8744 15.807 10.6414 16.2105 10.5895 16.6049C10.5202 17.1308 10.6628 17.6627 10.9857 18.0835C11.1331 18.2756 11.3402 18.437 11.6617 18.639C12.1343 18.936 12.4384 19.4419 12.4383 20C12.4383 20.5581 12.1342 21.0639 11.6617 21.3608C11.3401 21.5629 11.133 21.7244 10.9856 21.9165C10.6627 22.3373 10.5201 22.8691 10.5894 23.395C10.6413 23.7894 10.8743 24.193 11.3402 25C11.8062 25.807 12.0391 26.2106 12.3548 26.4527C12.7756 26.7756 13.3074 26.9181 13.8333 26.8489C14.0734 26.8173 14.3168 26.7186 14.6525 26.5412C15.146 26.2804 15.736 26.27 16.2194 26.549C16.7027 26.8281 16.9887 27.3443 17.0096 27.9021C17.0238 28.2815 17.0601 28.5417 17.1527 28.7654C17.3557 29.2554 17.7451 29.6448 18.2351 29.8478C18.6027 30 19.0686 30 20.0005 30C20.9324 30 21.3983 30 21.7658 29.8478C22.2559 29.6448 22.6452 29.2554 22.8482 28.7654C22.9409 28.5417 22.9772 28.2815 22.9914 27.902C23.0122 27.3443 23.2982 26.8281 23.7815 26.549C24.2648 26.2699 24.8549 26.2804 25.3484 26.5412C25.6841 26.7186 25.9275 26.8172 26.1675 26.8488C26.6934 26.9181 27.2253 26.7756 27.6461 26.4527C27.9617 26.2105 28.1947 25.807 28.6606 24.9999C29.1266 24.1929 29.3595 23.7894 29.4115 23.395C29.4807 22.8691 29.3382 22.3372 29.0153 21.9164C28.8679 21.7243 28.6607 21.5628 28.3392 21.3608C27.8666 21.0639 27.5626 20.558 27.5626 19.9999C27.5626 19.4418 27.8667 18.9361 28.3392 18.6392C28.6608 18.4371 28.868 18.2757 29.0154 18.0835C29.3383 17.6627 29.4808 17.1309 29.4116 16.605C29.3596 16.2106 29.1267 15.807 28.6607 15C28.1948 14.193 27.9618 13.7894 27.6462 13.5473C27.2254 13.2244 26.6935 13.0818 26.1676 13.1511C25.9276 13.1827 25.6841 13.2814 25.3484 13.4588C24.855 13.7196 24.2649 13.73 23.7816 13.451C23.2982 13.1719 23.0122 12.6557 22.9914 12.0979C22.9772 11.7185 22.9409 11.4583 22.8482 11.2346C22.6452 10.7446 22.2559 10.3552 21.7658 10.1522Z" stroke="#78808F" strokeWidth="2"/>
                            </svg>

                            Перейдите в  <span className="text-[#000000] font-semibold "> &nbsp;«Настройки»</span>
                        </li>

                        <li className="relative z-[10] text-[14px] font-normal text-[#444952] flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" className="mr-[12px]" fill="none">
                                <rect width="40" height="40" rx="20" fill="#F2F2F5"/>
                                <path d="M12 20H28M28 20L22 14M28 20L22 26" stroke="#78808F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>

                            Перейдите в <span className="text-[#000000] font-semibold "> &nbsp;«Настройки сайтов» </span>
                        </li>

                        <li className="relative z-[10] text-[14px] font-normal text-[#444952] flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" className="mr-[12px]" fill="none">
                                <rect width="40" height="40" rx="20" fill="#F2F2F5"/>
                                <path d="M17 20L28 20" stroke="#78808F" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M12 20H13" stroke="#78808F" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M12 14H13" stroke="#78808F" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M12 26H13" stroke="#78808F" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M17 14H28" stroke="#78808F" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M17 26H28" stroke="#78808F" strokeWidth="2" strokeLinecap="round"/>
                            </svg>

                            Перейдите во  <span className="text-[#000000] font-semibold "> &nbsp;«Все сайты»</span>
                        </li>

                        <li className="relative z-[10] text-[14px] font-normal text-[#444952] flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" className="mr-[12px]" fill="none">
                                <rect width="40" height="40" rx="20" fill="#F2F2F5"/>
                                <g clip-path="url(#clip0_1_4863)">
                                <circle cx="19.5827" cy="19.5834" r="7.91667" stroke="#78808F" strokeWidth="2"/>
                                <path d="M25.416 25.4167L28.3327 28.3334" stroke="#78808F" strokeWidth="2" strokeLinecap="round"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_1_4863">
                                <rect width="20" height="20" fill="white" transform="translate(10 10)"/>
                                </clipPath>
                                </defs>
                            </svg>

                            Найдите сайт  <span className="text-[#000000] font-semibold "> &nbsp;«farmsi.ru»</span>
                        </li>

                        <li className="relative z-[10] text-[14px] font-normal text-[#444952] flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" className="mr-[12px]" fill="none">
                                <rect width="40" height="40" rx="20" fill="#00C293"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M11.75 17.0667C11.75 12.6116 15.4443 9 20 9C24.5557 9 28.25 12.6116 28.25 17.0667C28.25 20.0178 26.6373 21.9553 24.7638 24.2059L24.7637 24.2061C23.8086 25.3531 22.7861 26.5814 21.875 28.0667C21.4253 28.8 21.2144 29.416 21.0532 29.8912L21.0529 29.8923C20.8099 30.6044 20.675 31 20 31C19.325 31 19.1901 30.6044 18.9471 29.8923L18.9468 29.8912C18.7856 29.416 18.5747 28.8 18.125 28.0667C17.2139 26.5814 16.1914 25.3531 15.2363 24.2061L15.2362 24.2059C13.3627 21.9553 11.75 20.0178 11.75 17.0667ZM20 20C21.5188 20 22.75 18.7688 22.75 17.25C22.75 15.7312 21.5188 14.5 20 14.5C18.4812 14.5 17.25 15.7312 17.25 17.25C17.25 18.7688 18.4812 20 20 20Z" fill="white"/>
                            </svg>

                            Нажмите   <span className="text-[#000000] font-semibold "> &nbsp;«Разрешить»</span>&nbsp; геоданные
                        </li>
                    </ul>

                    <button
                        onClick={() => {
                            mapState.closeModal();
                        }}
                        className="text-[#000000] mt-[24px] shrink-0 bg-[#F7F7FA] rounded-[99px] h-[48px] w-full px-[28px] py-[8px]
                            font-medium text-[14px] leading-[32px] cursor-pointer
                        ">
                            Закрыть
                        </button>
                </div>
            }
            {
                
                !isShowInstruction && <div className=" max-[900px]:p-[16px] pointer-events-auto flex flex-col rounded-[24px] relative min-h-[192px] py-[28px] px-[24px] max-w-[416px] h-fit  w-[90%] bg-[#FFFFFF] shadow-[0px_4px_28px_0px_#0000000F]">
                    <div className="grow">
                        <h2 className="font-semibold text-[20px] max-[900px]:text-[16px] leading-[24px]">Снимите запрет на определение местоположения</h2>
                        <span className="text-[#000000] max-[900px]:text-[14px] max-[900px]:mt-[8px] font-normal text-[18px] leading-[24px] block mt-[12px]">У вас установлен запрет в настройках браузера. Измените настройку браузера и повторите попытку</span>

                        {
                            (name === 'Chrome' || name === 'Chrome Mobile' || name === 'ChromeMobile') && <div className="flex w-full items-center justify-between h-[24px] mt-[22px]">
                                <img className="h-[24px]  " src="/GeoIcon.svg" alt="GeoIcon" />
                                <button onClick={() => setShowInstruction(true)} className="text-[#00C293] font-semibold text-[14px] cursor-pointer">Инструкция</button>
                            </div>
                        }
                    </div>

                    <div className="shrink-0 flex gap-[8px] mt-[28px]">
                        <button onClick={() => {
                            initialPosition();
                            
                            // mapState.onCenterUserMap([longitude, latitude])
                        }} className="text-[white] bg-[#00C293] rounded-[99px] h-[48px] w-[180px] px-[28px] py-[8px]
                            font-semibold text-[14px] leading-[32px] cursor-pointer

                             max-[900px]:max-h-[40px]
                             max-[900px]:max-w-fit
                             max-[900px]:leading-[20px]
                             max-[900px]:px-[24px]
                             max-[900px]:py-[10px]
                        ">
                            Разрешить
                        </button>

                        <button
                        onClick={() => {
                            mapState.closeModal();
                        }}
                        className="text-[#000000] bg-[#F7F7FA] rounded-[99px] h-[48px] w-[180px] px-[28px] py-[8px]
                            font-semibold text-[14px] leading-[32px] cursor-pointer

                             max-[900px]:max-h-[40px]
                             max-[900px]:max-w-fit
                             max-[900px]:leading-[20px]

                             max-[900px]:px-[24px]
                             max-[900px]:py-[10px]
                        ">
                            Нет, спасибо
                        </button>
                    </div>

                    <button onClick={() => {
                            mapState.closeModal();
                        }}  className="absolute top-[18px] right-[24px] cursor-pointer">
                        <img className="h-[24px] w-[24px]" src="/cross.svg" alt="cross" />
                    </button>
                </div>
            }
            
        </div>
    );
};

export default ModalPermissionGeo;
