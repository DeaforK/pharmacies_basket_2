import React from 'react';
import styles from './ModalHint.module.scss'
import clsx from 'clsx';

type Props =  {
    className?: string,
    isVisible: boolean,
    positionArrow?: 'left' | 'bottom',
    children: React.ReactNode;
}

const ModalHint:React.FC<Props> = ({className,isVisible,positionArrow, children}) => {
    return (
        <div className={clsx(`rounded-[8px] absolute w-fit flex justify-center py-[5px] transition-[1s] bg-[#30312f]  font-normal text-[16px] leading-[22px] px-[12px] ${className} ${styles.modal_hint} text-[white]`,
            {
                ['visible opacity-100 ']: isVisible,
                ['invisible opacity-0 ']: !isVisible
            }
        )}>
            {children}
            {
                positionArrow === 'bottom' && <svg className='bottom-[-6px] absolute' width="13" height="6" viewBox="0 0 13 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.8" d="M7.91422 4.58579C7.13317 5.36683 5.86684 5.36684 5.08579 4.58579L0.5 6.05683e-07L12.5 0L7.91422 4.58579Z" fill="black"/>
                </svg>

            }
            {
                positionArrow !== 'bottom' && <svg className='left-[-5.5px] absolute' width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.8" d="M1.41421 7.41422C0.633165 6.63317 0.633165 5.36684 1.41421 4.58579L6 0L6 12L1.41421 7.41422Z" fill="black"/>
                </svg>

            }
        </div>
    );
};

export default ModalHint;