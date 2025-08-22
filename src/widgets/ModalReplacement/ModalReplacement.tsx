import { useEffect, useState } from "react";
import { useReplacementState } from "../../entities/store/useReplacement";
import clsx from "clsx";
import { createChangeProduct, getChange } from "../../entities/replacement/api";
import { ModalReplacementItem } from "./ModalReplacementItem";

const ModalReplacement = () => {
    const [isShowHint, setShowHint] = useState(true);

    const replacementState = useReplacementState();

    const [isShowModal, setShowModal] = useState(true);

    const [products, setProducts] = useState([]) as any;

    const [productsMany, setProductsMany] = useState([]) as any;

    const [productsReplace, setProductsReplace] = useState([]) as any;

    const [productReplace, setProductReplace] = useState() as any;

    const [, setValid] = useState(false);

    const [isUpdateState, updateState] = useState(false);
    const forceUpdate = () => {
        // setProducts([])

        // setProductsMany([])

        updateState(prev => !prev)
    };


    useEffect(() => {
        let result = [] as any

        replacementState.products.forEach((element: any) => {
            if (element.length > 0) {
                result.push(...element);
                return;
            }
            result.push(element);
        })

        setProductsReplace(result);

        replacementState.products.forEach((element: any) => {
            if (element.length >= 2) {
                element.forEach((e: any) => {
                    const data = {
                        id: e.productId,
                    }

                    const change = getChange(data);

                    change.then((result) => {
                        setProductsMany(() => [...result.items.products.map((el1: any) => {
                            return {
                                ...el1,
                                productId: e.productId,
                            }
                        })])
                    });
                })
                return;
            }
            else {
                const data = {
                    id: element[0].productId,
                }
                const change = getChange(data);

                change.then((result) => {
                    setProductsMany(() => [...result.items.products.map((el1: any) => {
                        return {
                            ...el1,
                            productId: element[0].productId,
                        }
                    })])
                });
            }
        });
    }, [replacementState.products])

    useEffect(() => {
        let productsReplaceNew = [] as any;

        productsReplace.map(() => {
            productsReplaceNew.push(null);
        })

        replacementState.setProductsReplaceNew(productsReplaceNew)
    }, [replacementState.isSingleOpen, productsMany])

    useEffect(() => {
        setProductReplace(replacementState.productReplace);
        const data = {
            id: replacementState.productId,
        }
        const change = getChange(data);

        change.then((data) => {
            setProducts(data.items.products)
        });
    }, [replacementState.productId])

    function reset() {
        forceUpdate();
    }

    const handleSubmit = () => {
        if (replacementState.isSingleOpen === true) {
            const res = createChangeProduct({
                list_changes: products as any,
                product_id_old: productReplace.id,
                product_id_new: replacementState.productReplaceNew.id,
                quanitity_new: replacementState.productReplaceNew.quantityNew,
                quanitity_old: replacementState.productReplaceNew.quantityOld,
            });

            res.then(() => {
                replacementState.closeModalReplacement();
                if (replacementState.selectCallback !== undefined && replacementState.selectCallback !== null) {
                    replacementState.selectCallback(true);
                    replacementState.setSuccessProductReplace(true);
                }
            })
        }
        else {

            let result = [] as any

            replacementState.productsReplaceNew.forEach((el: any) => {
                let data = {
                    list_changes: productsMany as any,
                    product_id_old: el.productId,
                    product_id_new: el.productId_new,
                    quanitity_new: el.quantityNew,
                    quanitity_old: el.quantityOld,
                }

                result.push(data);
            });

            const res = createChangeProduct(result as any);

            res.then(() => {
                replacementState.closeModalReplacement();
                if (replacementState.selectCallback !== undefined && replacementState.selectCallback !== null) {
                    replacementState.selectCallback(true);
                    replacementState.setSuccessProductReplace(true);
                }
            })
        }
    }


    return (
        <div className={`h-full w-full fixed flex justify-center items-center z-[600] py-[12px]`}>
            <div className={`pr-[4px] relative pointer-events-auto max-[900px]:hidden flex flex-col rounded-[24px]  h-[100%] py-[12px]  max-w-[375px] max-h-[1000px] z-[1000] w-[90%] bg-[#FFFFFF] shadow-[0px_4px_28px_0px_#0000000F]`}>

                <div className="shrink-0 mt-[4px] px-[16px] pr-[14px]">
                    <h2 className="font-semibold text-[20px] leading-[24px] mb-[6px]">Замена товара</h2>
                    <span className="font-normal text-[14px] text-[#000000] ">Серпуховский Вал ул, 21 к 4, Москва</span>

                    {
                        isShowHint && <div className="border-[#FF99001F] bg-[#FF990008] mt-[16px] h-[44px] justify-between p-[8px] flex items-center w-full rounded-[10px] border-[1px]">
                            <div className="flex gap-[8px] items-center">
                                <img src="/Danger_Circle.svg" alt="" />
                                <span className="text-[#78808F] text-[12px] font-normal ">Вы всегда можете отменить
                                    <br />
                                    или изменить замену</span>
                            </div>

                            <button className="cursor-pointer absolute h-[44px] flex justify-center items-center aspect-square right-[16px]" onClick={() => setShowHint(false)}>
                                <img src="/cross.svg" className="h-[12px] w-[12px]" alt="" />
                            </button>
                        </div>
                    }
                </div>

                {
                    <div className={`scrollbar grow mt-[16px] overflow-y-auto overflow-hidden`}>

                        {
                            replacementState.isSingleOpen && products.length > 0 &&
                            <ModalReplacementItem isEndElement={false} setValid={setValid} products={products} price={productReplace.price} type={productReplace.type} quantity={productReplace.quantity} name={productReplace.title} region={'Фармсандарт, Россия'} />
                        }
                        {
                            replacementState.isSingleOpen === false && productsMany !== undefined && productsMany !== null && productsMany.map((element: any, i: number) =>
                                <>
                                    {
                                        productsReplace !== undefined && productsReplace !== null && productsReplace.length > 0 && productsReplace[i] !== null && productsReplace[i] !== undefined && <ModalReplacementItem reset={isUpdateState} isEndElement={i === productsMany.length - 1} productId_new={i} productId={element.productId} isSingleOpen={false} id={i} setValid={setValid} products={productsMany} price={productsReplace[i].price} type={productsReplace[i].type} quantity={productsReplace[i].quantity} name={productsReplace[i].title} region={productsReplace[i].region} />
                                    }
                                </>
                            )
                        }

                    </div>

                }


                <div className="shrink-0 flex gap-[8px] px-[16px] pt-[16px]  max-[900px]:shadow-[0px_-4px_6px_0px_#00000005]">
                    <button onClick={() => {
                        handleSubmit();
                    }} className="text-[white] bg-[#00C293]  hover:bg-[#00B88B] rounded-[99px] cursor-pointer disabled:bg-[#27846d] disabled:text-[#ffffff9a] text-[14px]  h-[40px] w-[180px] px-[28px] py-[8px]
                        font-semibold leading-[20px]
                    ">
                        Готово
                    </button>

                    <button
                        onClick={() => {
                            replacementState.closeModalReplacement();
                        }}
                        className="text-[#000000] bg-[#F7F7FA] hover:bg-[#F2F2F5] cursor-pointer rounded-[99px] h-[40px] w-[180px] px-[28px] py-[8px] text-[14px]
                        font-semibold leading-[20px]
                    ">
                        Отмена
                    </button>
                </div>

                <div className="absolute right-[12px] flex items-center gap-[15px]">
                    <button onClick={() => reset()} className="font-normal hover:text-[#444952]  text-[14px] cursor-pointer text-[#78808F]">
                        Сбросить все
                    </button>
                    <button onClick={() => replacementState.closeModalReplacement()} className="top-[18px] flex justify-center items-center  right-[12px] h-[34px] w-[34px] cursor-pointer">
                        <img className="h-[16px] w-[16px]" src="/cross.svg" alt="cross" />
                    </button>
                </div>
            </div>


            <div className={clsx('min-[900px]:hidden w-full transition-[1s] relative flex flex-col h-full z-[600] bg-[#FFFFFF]     rounded-[24px] shadow-[0px_-8px_16px_0px_#0000000F]',
                {
                    'translate-y-full': !replacementState.isReplacementModalOpen, // скрыта
                    'translate-y-0': replacementState.isReplacementModalOpen,     // открыта
                }
            )}>
                <div className="shrink-0 flex flex-col relative w-full items px-[0px]" >
                    <div className="w-full flex h-[20px] items-center  justify-center" onClick={() => {
                        setShowModal(prev => !prev)
                        replacementState.openMobileOpen(isShowModal)
                    }}>
                        <div className="h-[4px] rounded-[99px] w-[48px] bg-[#E1E1E5]"></div>
                    </div>
                    <div className="shrink-0 px-[16px] mt-[4px]">
                        <h2 className="font-semibold text-[16px] leading-[24px]">Замена товара</h2>
                        <span className="font-normal text-[14px] text-[#000000]">Серпуховский Вал ул, 21 к 4, Москва</span>

                        {
                            isShowHint && <div className="border-[#FF99001F] bg-[#FF990008] mt-[16px] h-[44px] justify-between p-[8px] flex items-center w-full rounded-[10px] border-[1px]">
                                <div className="flex gap-[8px] items-center">
                                    <img src="/Danger_Circle.svg" alt="" />
                                    <span className="text-[#78808F] text-[12px] font-normal ">Вы всегда можете отменить
                                        или изменить замену</span>
                                </div>

                                <button className="cursor-pointer h-[44px] aspect-square" onClick={() => setShowHint(false)}>
                                    <img src="/cross.svg" className="h-[12px] w-[12px]" alt="" />
                                </button>
                            </div>
                        }
                    </div>

                    <button onClick={() => replacementState.closeModalReplacement()} className="w-[34px] h-[34px] flex justify-center items-center absolute top-[20px] right-[12px] cursor-pointer">
                        <img src="/cross.svg" alt="cross" />
                    </button>
                </div>

                <ul className="grow bg-[#FFFFFF] overflow-auto  pb-[50px]">
                    {
                        replacementState.isSingleOpen && products.length > 0 &&
                        <ModalReplacementItem isEndElement={false} setValid={setValid} products={products} price={productReplace.price} type={productReplace.type} quantity={productReplace.quantity} name={productReplace.title} region={'Фармсандарт, Россия'} />
                    }
                    {
                        replacementState.isSingleOpen === false && productsMany !== undefined && productsMany !== null && productsMany.map((element: any, i: number) =>
                            <>
                                {
                                    productsReplace !== undefined && productsReplace !== null && productsReplace.length > 0 && productsReplace[i] !== null && productsReplace[i] !== undefined && <ModalReplacementItem reset={isUpdateState} isEndElement={i === productsMany.length - 1} productId_new={i} productId={element.productId} isSingleOpen={false} id={i} setValid={setValid} products={productsMany} price={productsReplace[i].price} type={productsReplace[i].type} quantity={productsReplace[i].quantity} name={productsReplace[i].title} region={productsReplace[i].region} />
                                }
                            </>
                        )
                    }
                </ul>

                <div className="shrink-0  mb-[50px] w-full flex gap-[6px] px-[16px] pt-[16px]  shadow-[0px_-4px_6px_0px_#00000005]">
                    <button onClick={() => {
                        handleSubmit();
                    }} className="text-[white] bg-[#00C293] hover:bg-[#00B88B]  
 h-[40px]
 leading-[20px] rounded-[99px] cursor-pointer disabled:bg-[#27846d] disabled:text-[#ffffff9a] w-[168px] px-[28px] py-[8px]
                            font-semibold 
                        ">
                        Готово
                    </button>

                    <button
                        onClick={() => {
                            replacementState.closeModalReplacement();
                        }}
                        className="text-[#000000] bg-[#F7F7FA]  cursor-pointer rounded-[99px] w-[168px] px-[28px] py-[8px] hover:text-[#444952]
h-[40px]
text-[14px]
                            font-semibold  leading-[20px]
                        ">
                        Отмена
                    </button>
                </div>
            </div>
        </div>


    );
};

export default ModalReplacement;