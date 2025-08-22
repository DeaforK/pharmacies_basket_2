import clsx from 'clsx';
import React from 'react';

type Props = {
    text: string,
    type: "button" | "reset" | "submit" | undefined,
    defaultColor?: boolean,
    color?: string,   
    onClick?: () => void,
    onMouseMove?: () => void,
    className?: string,
    disable?: boolean,
}

const Button: React.FC<Props> = ({color, defaultColor, text, type,className, onClick,disable,onMouseMove }: Props) => {
    return (
        <button onMouseMove={onMouseMove} className={clsx(
            `text-[white] px-[12px] relative py-[7px] rounded-[99px] max-[900px]:w-[159px] max-[900px]:text-[14px] max-[900px]:!font-semibold max-[360px]:w-[129px] max-[360px]:px-0 max-[360px]:h-[34px] cursor-pointer max-[360px]:text-[14px] max-h-[34px] ${className}`,
            {
                ['bg-[#00C293] cursor-pointer']: defaultColor,
                [`bg-[${color}]`]: !defaultColor,
                [`bg-[#F2F2F5] !text-[#78808F] font-semibold`]: disable,
            }   
        )} type={type} disabled={disable === undefined ? false : true } onClick={onClick}>
            {
                text
            }
        </button>
    );
};

export default Button;