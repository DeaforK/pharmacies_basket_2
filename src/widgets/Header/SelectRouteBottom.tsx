import clsx from 'clsx';
import { Link, useLocation } from 'react-router-dom';

const SelectRouteBottom = () => {
    const location = useLocation();

    return (
        <div className='fixed bottom-[14px] z-[200]'>
                <div className="h-[36px] min-[900px]:hidden relative w-[175px] h-[36px] bg-[#F2F2F5] rounded-full p-[2px] grid grid-cols-2 justify-items-stretch items-center ">
                    <div className={`flex items-center  gap-[6px] rounded-full overflow-hidden max-w-[82px]  h-full relative leading-[20px] text-[#000000] text-[16px] ${location.pathname === '/map' && 'shadow-[0px_2px_4px_0px_#0000001A]'}`}>
                        <Link to={

                            '/map'
                        } className={clsx(" px-[12px] py-[6px] absolute w-full h-full  leading-[20px] text-[#000000] shadow-[0px_2px_4px_0px_#0000001A]  text-[14px] flex justify-center gap-[6px] items-center",{
                            ['bg-[#FFFFFF]  font-medium'] : location.pathname === '/map',                     
                            ['bg-transparent  text-[#78808F] font-normal'] : location.pathname !== '/map'                           
                        })}>
                            <img className="h-[16px] w-[16px]"  src="/MapIcon.svg" alt="List" />
                            Карта   
                        </Link>
                    </div>

                    <div className={`flex items-center gap-[6px] flex items-center rounded-full overflow-hidden  h-full relative leading-[20px] text-[#000000]   text-[16px]  ${location.pathname === '/list' && 'shadow-[0px_2px_4px_0px_#0000001A]'}`}>
                        <Link to={
                            '/list'
                        } className={clsx("py-[6px] flex leading-[20px] w-[91px]  items-center  absolute w-full h-full text-[#000000] text-[14px] flex justify-center items-center gap-[6px]",{
                            ['bg-[#FFFFFF]  font-medium'] : location.pathname === '/list',                      
                            ['bg-transparent  text-[#78808F] font-normal'] : location.pathname !== '/list'                         
                        })}>
                            <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.625 8L12.5 8" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M2.5 8H3.125" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M2.5 4.25H3.125" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M2.5 11.75H3.125" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M5.625 4.25H12.5" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M5.625 11.75H12.5" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round"/>
                            </svg>

                            <span className='block h-[20px]'>Список</span>
                              
                        </Link>
                    </div>
                </div>
        </div>
    );
};

export default SelectRouteBottom;
