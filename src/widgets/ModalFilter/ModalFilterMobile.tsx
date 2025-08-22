import React from 'react';
import clsx from 'clsx';

type Props = {
    isActive: boolean,
    onClose?: () => void,
    children?: React.ReactNode;
    className: string,
    offsetOpen: string,
}

const ModalFilterMobile:React.FC<Props> = ({isActive, children, className,offsetOpen}) => {
    return (
        // <div className={`w-full h-full z-[300] fixed `}>

            <div className={clsx(`min-[900px]:hidden ${className} overflow-hidden fixed w-full transition-[1s] z-[300] flex flex-col  ] bg-[#F7F7FA]   rounded-t-[24px] shadow-[0px_-8px_16px_0px_#0000000F]`,
                {
                    ['translate-y-[800px] z-[200] hidden'] : !isActive,
                    [`${offsetOpen} z-[200]`] : isActive,
                }   
            )}>
                <div className="shrink-0 flex flex-col relative w-full pt-[8px] pb-[8px] bg-[white]">
                    <div className="w-full flex  justify-center">
                        <div className="h-[4px] rounded-[99px] w-[48px] bg-[#E1E1E5]"></div>
                    </div>
                    
                </div>

                {
                    children
                }
                
                
            </div>

    );
};

export default ModalFilterMobile;