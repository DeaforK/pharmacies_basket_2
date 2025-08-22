import { RefObject, useEffect, useRef, useState } from "react";
import { useModalState } from "../../entities/store/useModalState";

export function useFoldingModal(refCurrentElement : RefObject<any>, refRight : RefObject<any>, height: number) {
    const timer = useRef(null) as any;
    const timeHoldMouse = 100; ;    

    const [isOpenTab] = useState(true);
    const [isOpen,setisOpen] = useState(false);

    const modalState = useModalState();

    let startY = null as any
    let endY = null as any

    function closeModal() {
        const resizeableElement = refCurrentElement?.current;

        resizeableElement.style.top = 'auto';
        resizeableElement.style.bottom = '0';
        resizeableElement.style.transform = 'translateY(100%)';
        setTimeout(() => {
            modalState.close();
            setisOpen(true);
            
            resizeableElement.style.top = 'auto';
            resizeableElement.style.bottom = '0';
            resizeableElement.style.transform = 'none';
        }, 300);
    }

    useEffect(() => {
        const resizeableElement = refCurrentElement?.current;
        
        resizeableElement!.style.transition = 'all 0.4s'

        if (modalState.isMobileOpen && modalState.isOpen) {
            resizeableElement!.style.transform = `translateY(${55}px)`;
            resizeableElement!.style.top = `${55}px`;
            resizeableElement!.style.bottom = `0px`;
        }
        if (modalState.isOpen && modalState.isMobileOpen) {
            resizeableElement!.style.transform = `translateY(${0}px)`;
        }
        if (!modalState.isOpen) {
            resizeableElement!.style.bottom = `${1000}px`;
            
        }
        if (isOpen) {
            setTimeout(() => {
                resizeableElement.style.top = 'auto';
                resizeableElement.style.bottom = '-100px';
                resizeableElement.style.transform = 'translateY(100%)';
            }, 300);
        }
    },[modalState.isOpen,modalState.isMobileOpen, height, isOpen])

    useEffect(() => {
        setisOpen(false)

        const resizeableElement = refCurrentElement?.current;


        const onTouchMoveRightResize = (event:any) => {

            event.stopPropagation();
            event.preventDefault(); 
            let top = event.changedTouches[0].clientY;

            if (top < 55) {
                top = 55
            }
            
            resizeableElement!.style.top = `${top}px`;
        };

        const onTouchUpRightResize = (event:any) => {
            endY = event.changedTouches[0].clientY

            clearTimeout(timer?.current);

            const direction = Math.abs(endY) - Math.abs(startY);

            if (direction > 0 && modalState.isMobileOpen && !isOpen) 
            {
                resizeableElement.style.transform = 'translateY(25%)';
                    modalState.setMobileModalState(false);

                setTimeout(() => {
                    resizeableElement.style.top = 'auto';
                    resizeableElement.style.bottom = '0';
                }, 250);

                
                setTimeout(() => {
                    resizeableElement.style.transform = 'translateY(0%)';
                }, 800);
            }
            if (direction > 0 && !modalState.isMobileOpen) {
                resizeableElement.style.transform = 'translateY(100%)';
                // После завершения анимации
                setTimeout(() => {
                    modalState.close();
                    setisOpen(true);
                    resizeableElement.style.transform = 'none';
                }, 300);
            }
            if (direction < 0 && startY > 80 && !modalState.isMobileOpen) {
                modalState.openMobile();
            }

            startY = null;
        };
    
        const onTouchDownRightResize = (event:any) => {
            startY = event.touches[0].clientY;
            event.stopPropagation();
            if(timer.current)
            {
                clearTimeout(timer.current);
            }
            timer.current = setTimeout(() => {
                if(!isOpenTab)
                {
                    console.log('isOpenTab');
                    return;
                }
        },timeHoldMouse)
            
    };

        const resizerRight = refRight?.current;
       
        resizerRight.addEventListener("touchend", onTouchUpRightResize);
        resizerRight?.addEventListener("touchstart", onTouchDownRightResize);
        resizerRight?.addEventListener("touchmove", onTouchMoveRightResize);

        return () => {
            resizerRight?.removeEventListener("touchmove", onTouchMoveRightResize);
            resizerRight.removeEventListener("touchstart", onTouchDownRightResize);
            resizerRight.removeEventListener("touchend", onTouchUpRightResize);
        }
        
    },[modalState, isOpenTab])

    return { closeModal };
}

