import clsx from "clsx";
import { useToastState } from "../../../entities/store/useToast.ts";
import { useEffect } from "react";

type ToastProps = {
    position: 'bottom',
    offsetBottom: string,
}

const Toast:React.FC<ToastProps> = ({offsetBottom = 'bottom-[10px] right-[10px]'}) => {
    const toast = useToastState();

    const handleVisible = () => {
        toast.setOpen(false);
    }

    useEffect(() => {
        const timeout = setTimeout(handleVisible, 4000);

        if (toast.IsOpen === true) {
            () => timeout;
        }

        return () => clearTimeout(timeout);
    },[toast.IsOpen])

    return (
        <div
         className={clsx(`fixed font-normal max-[425px]:w-[90%]  max-w-[377px] justify-between rounded-[20px] items-center text-[14px] leading-[18px] text-[white] z-[1000] bg-[#000000] opacity-[80%] w-full flex right-0 px-[12px] py-[17px]`,{
            [`${offsetBottom} max-[425px]:left-[15px] max-[425px]:right-0`]: toast.IsOpen,
            ['top-[-100px]']: !toast.IsOpen,
        })}>
            <div className="flex gap-[12px] z-[1000] relative">
                <img src="/ToastIcon.svg" alt="" />
                <span className="text-[white]">{toast.content}</span>
            </div>

            <button className="hover:bg-[#4F4F4F] w-[34px] h-[34px] rounded-full flex justify-center items-center  cursor-pointer" onClick={() => toast.setOpen(false)}>
                <img src="/ToastCancel.svg" alt="" />
            </button>
        </div>
    );
};

export default Toast;