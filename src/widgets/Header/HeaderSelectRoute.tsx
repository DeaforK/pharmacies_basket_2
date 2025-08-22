import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";

const HeaderSelectRoute = () => {

    const location = useLocation();

    return (
        <>
            <div className={`max-[900px]:hidden w-[211px] h-[48px] bg-[#F2F2F5]   rounded-full p-[2px] grid grid-cols-2 justify-items-stretch items-center `}>
                <div className={`rounded-full overflow-hidden  h-full relative ${location.pathname === '/map' && 'shadow-[0px_2px_4px_0px_#0000001A]'} font-medium text-[16px]`}>
                    <Link to={

                        '/map'
                    } state={location.state} className={clsx(" position absolute  w-full h-full hover:text-[#000000]   font-medium text-[16px] flex justify-center gap-[10px] items-center",{
                        ['bg-[#FFFFFF]  text-[#000000]'] : location.pathname === '/map',                     
                        ['bg-transparent  text-[#78808F] '] : location.pathname !== '/map'                           
                    })}>
                        <img className="h-[15px] w-[15px]"  src="/MapIcon.svg" alt="List" />
                        Карта   
                    </Link>
                </div>

                <div className={`rounded-full overflow-hidden h-full ${location.pathname === '/list' && 'shadow-[0px_2px_4px_0px_#0000001A]'} relative   font-medium text-[16px]`}>
                    <Link to={
                        '/list'
                    } state={location.state} className={clsx(" position  absolute w-full h-full hover:text-[#000000] font-medium text-[16px] flex justify-center items-center gap-[10px]",{
                        ['bg-[#FFFFFF]  text-[#000000]'] : location.pathname === '/list',                      
                        ['bg-transparent  text-[#78808F] '] : location.pathname !== '/list'                         
                    })}>
                        <img className="h-[15px] w-[15px]" src="/List.svg" alt="List" />
                        Список  
                    </Link>
                </div>
                
            </div>
        
        </>
    );
};

export default HeaderSelectRoute;