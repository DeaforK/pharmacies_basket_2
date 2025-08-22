import { useEffect, useState } from 'react';
import styles from './HeaderSearch.module.scss'
import { useDebounce } from '../../../features/hooks/useDebounce';
import { useSearchModal } from '../../../entities/store/useSearchModal';
import { useMapState } from '../../../entities/store/useMapState';
import { usePosition } from '../../../features/hooks/usePosition.tsx';

export const HeaderSearch = () => {
    const [value, setValue] = useState('');

    const [isLoading, setLoading] = useState(false);

    const changeHandler = useDebounce((e: any) =>{
        searchModalState.open()

        if(e.target.value === undefined || e.target.value === '') {
            searchModalState.close();
            setLoading(false)

        }
        else {
            searchModalState.open();
            setLoading(false)

        }
    },500)

    const mapState = useMapState();

    const {  latitude, longitude ,  initialPosition } = usePosition();

    const onChangeValue = (e:any) => {
        setLoading(true)
        setValue(e.target.value);
        changeHandler(e)
    }
    
    const searchModalState = useSearchModal();

    useEffect(() => {



    },[mapState.error.code])

    return (
        <div className='relative max-[900px]:pl-[12px]'>
            <div  className={`bg-[#F7F7FA]  max-[900px]:h-[40px] h-[48px] max-[900px]:max-w-[307px] hover:bg-[#F2F2F5] w-full relative flex items-center relative rounded-[100px] max-[900px]:pl-[16px] pl-[16px] ${styles.input_container}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className='' width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <g clipPath="url(#clip0_147_1178)">
                    <circle cx="7.91667" cy="7.91667" r="7.91667" transform="matrix(-1 0 0 1 18.333 1.66675)" stroke="#ABB6CC" strokeWidth="2"/>
                    <path d="M4.58301 15.4167L1.66634 18.3334" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_147_1178">
                    <rect width="20" height="20" fill="white" transform="matrix(-1 0 0 1 20 0)"/>
                    </clipPath>
                    </defs>
                </svg>
                
                <div className='relative grow flex justify-center  truncate  items-center'>
                    <input  value={value} onFocus={() => searchModalState.open()} onChange={onChangeValue} className={`grow max-[900px]:h-[40px] placeholder:text-[#78808F] placeholder:text-[14px] flex-shrink-0 h-full p-[10px] pr-[45px] max-w-[434px] truncate w-full focus-within:outline-none form-input ${styles.input}`} placeholder="Адрес или метро" type='text' />
                       {
                        isLoading &&
                        <div className='h-full flex justify-center items-center aspect-square absolute right-[0px] '>
                            <svg className="animate-spin w-[16px] h-[16px] flex justify-center items-center"  xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
                                <path d="M19 10C19 11.78 18.4722 13.5201 17.4832 15.0001C16.4943 16.4802 15.0887 17.6337 13.4442 18.3149C11.7996 18.9961 9.99002 19.1743 8.24419 18.8271C6.49836 18.4798 4.89471 17.6226 3.63604 16.364C2.37737 15.1053 1.5202 13.5016 1.17293 11.7558C0.825665 10.01 1.0039 8.20038 1.68508 6.55585C2.36627 4.91131 3.51983 3.50571 4.99987 2.51677C6.47991 1.52784 8.21997 1 10 1" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>
                       }
                </div>

                {
                    !isLoading && value !== ''  && <button onClick={() => {setValue(''); searchModalState.close()}} className={`${styles.cross} h-full cursor-pointer flex justify-center items-center aspect-square absolute right-[0px]`}>
                        <svg className='flex justify-center items-center' width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.667 3.33325L3.33366 16.6666" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3.33301 3.33325L16.6663 16.6666" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                }

                {
                    searchModalState.isOpen && 
                    <div className='shadow-[0px_4px_28px_0px_#0000000F] min-[900px]:rounded-[24px] w-full max-[900px]:max-w-[343px] max-[900px]:my-[10px] max-[900px]:mx-[16px] max-[900px]:min-w-[343px] flex-col flexmax-[900px]:mt-[8px] max-[900px]:fixed max-[900px]:left-0 left-0 absolute top-[48px] max-[900px]:top-[52px] z-[1000] bg-[white]  py-[10px] rounded-[9px]'>
                        
                        
                        {
                            value !== 'Проверка пусто' &&
                            <>
                                <button onClick={() => { 
                                    initialPosition()
                                    
                                    mapState.onCenterUserMap([longitude, latitude])
                                    console.log(mapState)
                                }} className='cursor-pointer  px-[16px] w-fit flex gap-[6px] py-[6px]'>
                                    <img src="/markSearch.svg" alt="" />
        
                                    <span className='text-[#00C293] font-semibold text-[14px] leading-[20px] '>Показать рядом со мной</span>
                                </button>
        
                                {/* <div className='mx-[16px] mt-[6px] mb-[12px] block border-0 none bg-[#F2F2F5] relative    !h-[1px]'/> */}
                        
                            </>
                        }

                        {
                            value === 'Проверка пусто'   && <div className='text-nowrap px-[16px] whitespace-nowrap overflow-ellipsis text-[#78808F] overflow-hidden flex items-center my-[12px]'>
                                По запросу «
                                <p className=' inline-block font-normal whitespace-nowrap text-nowrap text-[16px] leading-[20px] max-[900px]:text-[14px]  max-[900px]:leading-[18px] overflow-hidden overflow-ellipsis text-[#78808F]  max-w-[200px]'> 
                                    {value} 
                                </p>» ничего не найдено
                            </div>
                        }

                         {
                            value !== 'Проверка пусто' &&   searchModalState.history.length > 0 && 
                        <div className='mx-[16px] my-[6px] mb-[12px]  block border-0 none bg-[#F2F2F5] relative    !h-[1px]'/>
                        }
                    

                        {
                             value !== 'Проверка пусто' &&  <div className='px-[8px] '>
                                {

                                    searchModalState.history.map((item, index) => 
                                        <div className='w-full flex flex-col gap-[10px] items-center justify-center '>
                                            <button 
                                            
                                            className='w-full justify-between items-center flex rounded-[15px] min-h-[47px] relative cursor-pointer hover:bg-[#F7F7FA]  pt-[4px] pb-[6px] px-[8px] '>
                                                <div onClick={() => searchModalState.setHistory({
                                                address: item.address,
                                                region: item.region
                                                })}  
                                                className='flex justify-start cursor-pointer items-start gap-[8px]'>
                                                    <img className='w-[20px] h-[20px]' src="/History.svg" alt="" />
                                                    <div>
                                                        <h2 className='font-semibold text-[14px] leading-[18px] text-[#000000] text-start'>{item.address}</h2>
                                                        <span className='font-normal text-[14px] leading-[18px] text-[#78808F] text-start block'>{item.region}</span>
                                                    </div>
                                                </div>

                                                <button onClick={() => searchModalState.deleteObjectHistory(index)} className={`cursor-pointer flex justify-center items-center w-[28px] h-[28px] z-50  ${styles.cross_item_history}`}>
                                                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M16.667 3.33325L3.33366 16.6666" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M3.33301 3.33325L16.6663 16.6666" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </button>
                                            </button>
                                        </div>
                                    )
                                }
                            </div>
                        }

                        {
                            value !== 'Проверка пусто' && 
                        <div className='mx-[16px] my-[8px]  block border-0 none bg-[#F2F2F5] relative    !h-[1px]'/>
                        }

                        {
                            value !== 'Проверка пусто' &&
                            <div className='w-full flex px-[8px] flex-col gap-[4px] items-center justify-center '>
                                <button onClick={() => searchModalState.setHistory({
                                    address: 'ул. Никольская, д.17',
                                    region: 'Астраханская область'
                                })} className='w-full cursor-pointer justify-start rounded-[15px] hover:bg-[#F7F7FA]  pt-[4px] pb-[6px] px-[8px]'>
                                    <h2 className='font-semibold text-[14px] leading-[18px] text-[#000000] text-start'>ул. Никольская, д.17</h2>
                                    <span className='font-normal text-[14px] leading-[18px] text-[#78808F] text-start block'>Астраханская область</span>
                                </button>
                                <button onClick={() => searchModalState.setHistory({
                                    address: 'ул. Никопольская',
                                    region: 'Пермский край'
                                })} className='w-full cursor-pointer justify-start rounded-[15px] hover:bg-[#F7F7FA] px-[8px] pt-[4px] pb-[6px]'>
                                    <h2 className='font-semibold text-[14px] leading-[18px] text-[#000000] text-start'>ул. Никопольская</h2>
                                    <span className='font-normal text-[14px] leading-[18px] text-[#78808F] text-start block'>Пермский край</span>
                                </button>
                            </div>
                        }



                    </div>
                }
            </div>

        </div>

        
    );
};
