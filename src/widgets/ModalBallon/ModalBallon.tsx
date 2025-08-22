import clsx from "clsx";
import { useModalState } from "../../entities/store/useModalState.ts";
import ModalBallonItem from "./ModalBallonItem";
import { SyntheticEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ModalHint from "../../shared/components/ModalHint/ModalHint.tsx";
import style from './ModalBallon.module.scss'
import { getPharmacy } from "../../entities/clusters/api.ts";
import { useFoldingModal } from "../../features/hooks/useFoldingModal.ts";
import { useHeaderScrollState } from "../../entities/store/useHeaderScroll.ts";

interface Feature {
  id: string;
  name: string;
  price: number;
  totalPrice: string,
  products: any,
}

interface PharmacyItem {
  id: string;
  name: string;
  address: string;
  rating: number;
}

export const ModalBallon = () => {
  const modalState = useModalState();
  const [pharmacyInfo, setPharmacyInfo] = useState<PharmacyItem | any>(null);
  const [items, setItems] = useState<Feature[]>([]);

  const [, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isShowTop, setShowTop] = useState(false);

  const [isShowHint, setShowHint] = useState(false);

  const location = useLocation();

  const [isShowHint_2, setShowHint_2] = useState(false);

  const navigate = useNavigate();

  const { state } = useLocation();

  const refFoldingModal = useRef<HTMLDivElement | null>(null); // grabber/header area
  const refFoldingContent = useRef<HTMLDivElement | null>(null); // sheet wrapper

  const { closeModal } = useFoldingModal(refFoldingContent, refFoldingModal, items.length);


  // ======= NEW: instant drag state =======

  const [, setOpen] = useState(false);
  const [, setDragging] = useState(false);

  const [offsetY, setOffsetY] = useState<number>(() => (typeof window !== 'undefined' ? window.innerHeight : 1000)); // px from fully open (0) downwards
  const sheetHRef = useRef(0);
  const startYRef = useRef(0);
  const draggingRef = useRef(false);

  // measure sheet height for correct bounds
  useLayoutEffect(() => {
    const measure = () => {
      const el = refFoldingContent.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      sheetHRef.current = rect.height; // max translate down (full hide)
      // if modal closed, keep it hidden; if open, snap open
      setOffsetY(modalState.isOpen ? 0 : sheetHRef.current);
    };
    // wait a tick to ensure layout is ready on first open
    requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [modalState.isOpen]);

  // apply transform directly for absolute smoothness
  useEffect(() => {
    const el = refFoldingContent.current;
    if (!el) return;
    el.style.transform = `translate3d(0, ${offsetY}px, 0)`;
  }, [offsetY]);

  // handle opening/closing with animation (not during drag)
  useEffect(() => {
    const el = refFoldingContent.current;
    if (!el) return;
    el.style.willChange = 'transform';
    el.style.transition = 'transform 300ms ease';
    setOffsetY(modalState.isOpen ? 0 : sheetHRef.current || offsetY);
  }, [modalState.isOpen]);

  // Pointer-driven drag on the header/grabber area
  useEffect(() => {
    const grab = refFoldingModal.current;
    const sheet = refFoldingContent.current;
    if (!grab || !sheet) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!modalState.isOpen) return; // drag only when open
      draggingRef.current = true;
      setDragging(true);
      sheet.style.transition = 'none'; // instant follow finger
      startYRef.current = e.clientY - offsetY; // remember finger-to-sheet offset
      (grab as any).setPointerCapture?.((e as any).pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      // clamp between 0 (open) and sheet height (closed)
      const next = Math.min(Math.max(0, e.clientY - startYRef.current), sheetHRef.current || 0);
      // update instantly
      setOffsetY(next);
      // prevent page scroll while dragging
      e.preventDefault();
    };

    const onPointerUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setDragging(false);

      // snap logic
      const shouldClose = offsetY > (sheetHRef.current * 0.25); // 25% downward -> close
      sheet.style.transition = 'transform 250ms ease';
      const target = shouldClose ? (sheetHRef.current || 0) : 0;
      setOffsetY(target);

      if (shouldClose) {
        const onEnd = () => {
          sheet.removeEventListener('transitionend', onEnd);
          closeModal();
        };
        sheet.addEventListener('transitionend', onEnd);
      }
    };

    // make grabber actually grab on touch devices
    grab.style.touchAction = 'none'; // Tailwind: touch-none

    grab.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      grab.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [closeModal, modalState.isOpen, offsetY]);
  // ======= END: instant drag state =======

  useEffect(() => {
    const fetchData = async () => {
      if (!modalState.pharmacyId) return;

      setLoading(true);
      setError(null);

      try {
        const res1: any = await getPharmacy({ id: modalState.pharmacyId });
        setPharmacyInfo(res1);
        setItems(res1.items || []);
        modalState.setItems(res1.items);
      } catch (err: any) {
        setError(err.message || 'Ошибка при загрузке данных');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [modalState.pharmacyId]);

  function onScrollHandler(e: SyntheticEvent) {
    const target = e.target as HTMLTextAreaElement;
    setShowTop(target.scrollTop <= 0);
  }

  useEffect(() => {
    if (modalState.isMobileOpen === false) {
      setShowTop(true);
    }
  }, [modalState.isMobileOpen]);

  const renderHeader = () => (
    <>
      <div className={`shrink-0 w-[40px] h-[40px] absolute  ${!isShowTop && '!w-[32px] !h-[32px]'} rounded-[8px]`}>
        {
          pharmacyInfo !== undefined && pharmacyInfo?.logoUrl !== undefined ? <img className={`${!isShowTop && 'w-[32px] h-[32px]'}`} src="/plug.svg" alt="" />
            :
            <img src={'/plug.svg'} alt="logo_shop" />
        }
      </div>
      <div className={`ml-[52px] ${!isShowTop && '!ml-[44px] flex items-center'} `}>
        <h2 className="text-[#000000] font-semibold text-[18px] max-[900px]:text-[16px] leading-[20px]">{pharmacyInfo?.name || 'Аптека'}</h2>

        {
          <div className={`transition-opacity ease-linear duration-500   ${!isShowTop && ' items-center invisible'}`}>
            <span className="flex gap-[2px] font-normal text-[14px] wide_text  items-center">
              <img src="/star.svg" alt="star" /> {pharmacyInfo?.rating || '—'}
            </span>
            <span
              className="font-normal text-[14px] leading-[20px] text-[#000000]">{pharmacyInfo?.address || 'Адрес неизвестен'}
            </span>
            <span
              className="mt-[2px] mb-[6px] block font-normal text-[14px] leading-[20px] text-[#78808F]">{pharmacyInfo?.workingHours}
            </span>
            <div onMouseEnter={() => setShowHint_2(true)} onMouseLeave={() => setShowHint_2(false)} className="mt-[6px] cursor-pointer  w-[213px] h-[23px] bg-[#DBF6F0]  flex items-center rounded-[99px] gap-[4px] px-[6px] py-[4px]">
              <span className="font-semibold text-[14px]  text-[#00C293]">Можно собрать с заменой</span>
              <img className="bg-[#DBF6F0] mix-blend-multiply rounded-full" src="/info_circle.svg" alt="" />
            </div>
            {
              <div className="absolute w-full flex justify-center">
                <ModalHint positionArrow="bottom" isVisible={isShowHint_2} className="w-[242px] text-center top-[-88px] left-[-14px]" >
                  <span>Соберите полный заказ <br /> в этой аптеке, выбрав замену</span>
                </ModalHint>
              </div>
            }
          </div>
        }
      </div>

    </>
  );

  const renderItems = useCallback(() => (
    items.map((item: any, index) => (
      <ModalBallonItem
        deliveryTime={item.deliveryTime}
        key={index}
        price={parseInt(item.totalPrice.replace(/[^\d]/g, ''))}
        isMinAmount={item.minOrderAmount}
        availableText={item.availableText}
        tags={["Минимальная цена", "Длительная сборка"]}
        pharmacyId={modalState.pharmacyId}
        loadingProducts={item}
        logoUrl={item.logoUrl}
        products={item.products.map((p: any) => ({
          image: p.logoUrl,
          title: p.title,
          price: p.price !== null ? parseInt(p.price.replace(/[^\d]/g, '')) : null,
          quantity: parseInt(p.quantity.replace(/[^\d]/g, '')),
          availableCount: p.availableCount,

        }))}
      />
    ))
  ), [items, modalState.isOpen]);

  const headerScroll = useHeaderScrollState();

  useEffect(() => {
    setOpen(true)
  }, [modalState.isOpen])

  if (error) {
    return <h2>Error</h2>
  }

  return (
    <>
      {/* Desktop */}
      <div className={`scrollbar max-[900px]:hidden flex gap-[8px] flex-col absolute h-[100%] p-[12px] z-[200] ${headerScroll.bannerHidden !== false && 'pt-[58px]'}`}>
        {
          location.pathname === '/map' && state !== null && state !== undefined && state.backToList !== undefined && state.backToList !== null && state.backToList !== false && modalState.isOpen && (
            <div className="z-[100] flex items-center gap-[10px]">
              <button
                onMouseEnter={() => setShowHint(true)}
                onClick={() => {
                  setShowHint(false);
                  navigate('/list', {
                    state: {
                      backToList: false,
                    }
                  })
                }}
                onMouseLeave={() => setShowHint(false)}
                className={`cursor-pointer relative shrink-0 z-[100] h-[48px] w-[48px] bg-[#FFFFFF] shadow-[0px_4px_28px_0px_#0000000F] rounded-full flex justify-center items-center ${style.button}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14"
                  fill="none">
                  <path d="M17 7H1M1 7L7 1M1 7L7 13" stroke="#ABB6CC" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <ModalHint isVisible={isShowHint} className="!w-[132px] left-[75px]">
                <span>К списку аптек</span>
              </ModalHint>
            </div>
          )}
        <div
          onBlur={() => modalState.close}
          className={clsx('min-w-[375px] relative flex flex-col z-[100] max-h-[928px] h-[100%] overflow-hidden rounded-[24px] shadow-[0px_4px_28px_0px_#0000000F]', {
            ['translate-x-[0px]']: modalState.isOpen,
            ['translate-x-[-500px] hidden']: !modalState.isOpen,
            ['bg-[#F2F2F5]']: !isShowTop,
            ['bg-[#F7F7FA] ']: isShowTop,
          })}>
          <div className={`shrink-0  flex flex-col relative transition-all   w-full ${!isShowTop && 'max-h-[56px]'}`}>
            <div className="w-full transition-all   min-[900px]:hidden flex justify-center" onClick={() => modalState.openMobile()}>
              <div className="h-[4px] rounded-[99px] w-[48px] bg-[#E1E1E5]"></div>
            </div>
            <div className={`flex transition-all     gap-[10px] px-[16px] py-[16px] max-[900px]:py-[12px] relative ${!isShowTop && 'h-full items-center flex'}`}>
              {renderHeader()}
            </div>
            <button onClick={() => modalState.close()}
              className={`w-[36px] h-[36px] absolute top-[12px] right-[12px] ${!isShowTop && '!top-[10px]'} flex items-center justify-center ${style.cross} transition-all   absolute top-[12px] right-[12px] cursor-pointer`}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.667 3.33325L3.33366 16.6666" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3.33301 3.33325L16.6663 16.6666" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

            </button>
          </div>
          <ul onScroll={onScrollHandler} className="bg-[#FFFFFF] scrollbar pl-[16px] grow overflow-auto max-h-[90%] pb-[80px]">
            {renderItems()}
          </ul>
        </div>
      </div>

      {/* Mobile */}
      <div className={`scrollbar min-[900px]:hidden w-full h-full`}>
        <div
          ref={refFoldingContent}
          // NOTE: transform is updated via effect for best FPS
          className={clsx(
            `w-full fixed top-auto bottom-0 max-h-[calc(100%-50px)] flex flex-col z-[300] bg-[#F7F7FA] rounded-[24px] shadow-[0px_-8px_16px_0px_#0000000F] transform-gpu will-change-transform`,
            {
              // no global transition classes here; we switch via JS to avoid lag during drag
            }
          )}
        >
          {
            location.pathname === '/map' && state !== null && state !== undefined && state.backToList !== undefined && state.backToList !== null && state.backToList !== false && modalState.isOpen && <Link to={'/list'}
              className={`shadow-[0px_2px_4px_0px_#0000001A] absolute top-[-60px] left-[15px] shrink-0 z-[100] h-[48px] w-[48px] bg-[#FFFFFF] shadow-[0px_4px_28px_0px_#0000000F] rounded-full flex justify-center items-center ${style.button}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
                <path d="M17 7H1M1 7L7 1M1 7L7 13" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round" />
              </svg>
            </Link>
          }
          <div
            ref={refFoldingModal}
            className={`shrink-0 flex flex-col relative w-full max-h-[200px] ${!isShowTop && 'h-[56px]'} select-none cursor-grab active:cursor-grabbing`}
          >
            <div className={`w-full flex h-[20px] items-center ${!isShowTop && 'absolute'} justify-center`}>
              <div className="h-[4px] rounded-[99px] w-[48px] bg-[#E1E1E5]"></div>
            </div>
            <div className={`flex !pt-[0px] gap-[10px] px-[16px] py-[16px] max-[900px]:py-[12px] relative ${!isShowTop && '!pt-[12px] h-full items-center flex'}`}>
              {renderHeader()}
            </div>
            <button onClick={() => closeModal()}
              className={`w-[34px] h-[34px]  absolute top-[12px] right-[12px] flex justify-center items-center cursor-pointer`}>
              <img src="/cross.svg" alt="cross" />
            </button>
          </div>

          <ul onScroll={onScrollHandler} className="scrollbar grow bg-[#FFFFFF] p-[16px] py-[0px] overflow-auto">
            {renderItems()}
          </ul>
        </div>
      </div>
    </>
  );
};
