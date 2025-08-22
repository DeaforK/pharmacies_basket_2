import { useReplacementState } from "../../entities/store/useReplacement";

const ModalDeleteReplacement = () => {
    const replacement = useReplacementState();

    return (
        // TODO: pointer-events-none
        <div className="h-full w-full fixed flex justify-center items-center z-[202]">

            <div className=" pointer-events-auto flex flex-col rounded-[24px] relative min-h-[192px] py-[28px] px-[24px] max-w-[416px] h-fit  w-[90%] bg-[#FFFFFF] shadow-[0px_4px_28px_0px_#0000000F]">

                <div className="grow">
                    <h2 className="font-semibold text-[20px] leading-[24px]">Удалить замену?</h2>
                    <span className="text-[#78808F] font-normal text-[18px] leading-[24px] block mt-[12px]">Отменить это действие будет невозможно</span>
                </div>

                <div className="shrink-0 flex gap-[8px]">
                    <button onClick={() => {
                        replacement.closeModalDelete();
                        replacement.deleteCallback();
                    }} className="text-[white] bg-[#EB1C4E] cursor-pointer rounded-[99px] h-[48px] w-[180px] px-[28px] py-[8px]
                        font-semibold text-[18px] leading-[32px]
                    ">
                        Удалить
                    </button>

                    <button
                    onClick={() => {
                        replacement.closeModalDelete();
                    }}
                     className="text-[#000000] bg-[#F7F7FA] cursor-pointer rounded-[99px] h-[48px] w-[180px] px-[28px] py-[8px]
                        font-semibold text-[18px] leading-[32px]
                    ">
                        Отменить
                    </button>
                </div>

                <button onClick={() => {
                        replacement.closeModalDelete();
                    }} className="absolute top-[18px] right-[24px] cursor-pointer">
                    <img className="h-[24px] w-[24px]" src="/cross.svg" alt="cross" />
                </button>
            </div>
        </div>
    );
};

export default ModalDeleteReplacement;