import { useLocation } from "react-router-dom";
import { ListPickupPointsItem } from "./ListPickupPointsItem";
import { Fragment, useCallback, useEffect } from "react";
import { useModalState } from "../../entities/store/useModalState";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { scrollStore } from "../../entities/store/useScroll";
import { postPointsClusters } from "../../entities/clusters/api";
import { useFilterState } from "../../entities/store/useModalFilter";
import { useMapState } from "../../entities/store/useMapState";
import { BannerMap } from "./BannerMap";
import { useBuyClick } from "../../entities/store/useBuyClick";

export const ListPickupPoints = () => {
    const modalState = useModalState();

    const queryClient = useQueryClient();

    const mapState = useMapState();

    const handleMapChange = () => {
        const requestData = {
            view: { zoomLevel: 10, region: 77 },
            filters: { inViewOnly: true, pickupOnly: false, fullCartOnly: false, pickupTomorrowOnly: false, favoritesOnly: false },
        };

        waitUntilComplete(requestData).then((items) => {
            filterState.loadingFeatures(items);
        }).catch(console.error);
    };

    const filterState = useFilterState();

    const waitUntilComplete = async (params: any, maxWait = 5000, pollInterval = 300) => {
        const start = Date.now();
        return new Promise<any>((resolve, reject) => {
            const check = async () => {
                try {
                    const res = await postPointsClusters(params);

                    if (!res || !Array.isArray(res.map.items)) {
                        return reject(new Error('Некорректный ответ сервера'));
                    }

                    if (res.map.items.length >= res.count) {
                        return resolve(res.map.items);
                    }

                    if (Date.now() - start > maxWait) {
                        return reject(new Error(`Истекло время ожидания: получено ${res.map.items.length} из ${res.count}`));
                    }

                    setTimeout(check, pollInterval);
                } catch (err) {
                    reject(err);
                }
            };

            check();
        });
    };

    const fetchItems = useCallback(({ pageParam = 0 }) => {
        const pageSize = 8;
        const startIndex = pageParam * pageSize;
        const endIndex = startIndex + pageSize;

        if(pageParam > 1 )
        {
            mapState.setScrollPos(pageParam);
        }


        const isPickUpToday = filterState.pickUpToday;
        const isMinAmount = filterState.withoutMinAmount;
        const inStock = filterState.inStock;
        const assembleReplace = filterState.assembleReplace;

        let  data = filterState.features as any;

        var maxItem = data.reduce(function(max: any, obj: any) {
            const result = obj.properties.price > max.properties.price? obj : max
            return result;
        }).properties.price;

        filterState.setMaxPrice(maxItem);

        if (isPickUpToday) {
            data = data.filter((item: any) => item.properties.deliveryTime === 'Забрать сегодня')
        }
        if (isMinAmount) {
            data = data.filter((item: any) => item.properties.minOrderAmount === null)
        }
        if (inStock) {
            data = data.filter((item: any) => item.properties.availabilityStatus === 'Всё в наличии')
        }
        if (assembleReplace) {
            data = data.filter((item: any) => item.properties.assembleReplace === 1);
        }

        data = data.filter((item: any) => item.properties.price >= filterState.price[0] && item.properties.price < filterState.price[1]);

        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              data: data.slice(startIndex, endIndex),
              nextPage: endIndex < data.length ? pageParam + 1 : undefined,
            });
          });
        })  

        
    },[filterState.features, filterState.price, filterState.withoutMinAmount, filterState.inStock, filterState.pickUpToday,filterState.assembleReplace])

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
        
      } = useInfiniteQuery({
        queryKey: ['pickup_points'],
        queryFn: fetchItems,
        getNextPageParam: (lastPage: any) => lastPage.nextPage,
        
        initialPageParam: 0,
    })  as any;

    useEffect(() => {
        handleMapChange();

        ScrollStore.subscribe((state) => state.scrollY, () => {
            if (window.innerHeight + ScrollStore.getState().scrollY >= document.body.offsetHeight - 500) {
                onLoaderData();
            }
        })
        modalState.close();    
        return () => onLoaderData();  

    },[]);

    const location = useLocation();



    useEffect(() => {
        if (filterState.features?.length > 0) {
            queryClient.setQueryData(['pickup_points'],
            () => {
                let data = filterState.features as any;

                const isPickUpToday = filterState.pickUpToday;
                const isMinAmount = filterState.withoutMinAmount;
                const inStock = filterState.inStock;
                const assembleReplace = filterState.assembleReplace;

                var maxItem = data.reduce(function(max: any, obj: any) {
                    const result = obj.properties.price > max.properties.price? obj : max
                    return result;
                }).properties.price as any;
                filterState.setMaxPrice(maxItem);
                filterState.setPrice([0,maxItem]);

                if (isPickUpToday) {
                    data = data.filter((item: any) => item.properties.deliveryTime === 'Забрать сегодня')
                }

                if (isMinAmount) {
                    data = data.filter((item: any) => item.properties.minOrderAmount === null)
                }
                if (assembleReplace) {
                    data = data.filter((item: any) => item.properties.assembleReplace === 1);
                }
         
                if (inStock) {
                    data = data.filter((item: any) => item.properties.availabilityStatus === 'Всё в наличии')
                }

                data = data.filter((item: any) => item.properties.price >= filterState.price[0] && item.properties.price <= filterState.price[1]);


                const result =  {
                    pageParams: [mapState.scrollPos],
                    pages: [{
                      data: data.slice(0, mapState.scrollPos * 8),
                      nextPage: mapState.scrollPos,
                    }]
                  };
                return result
            }
        )
    } 
    },[filterState.features,location.pathname, mapState.scrollPos, filterState.pickUpToday,
                filterState.withoutMinAmount,
                filterState.inStock,
                filterState.assembleReplace])

    function onLoaderData() {
        setTimeout(fetchNextPage,0)
    } 

    const ScrollStore = scrollStore;

    let index = 0;

    const buyClick = useBuyClick();

    return (
        <div  className='flex max-w-[742px] w-full flex-col mt-[125px]'>
                    <button className="cursor-pointer" onClick={() => buyClick.setOpen(true)}>Купить в  один клик</button>

            {
                data && data?.pages.length > 0 &&  data?.pages.map((item: any,i: number) =>
                <div key={i}>
                    {
                        item?.data !== undefined && item?.data.map((element: any, i: number) => 
                          {
                                index += 1;
                                if(index > 0 && index % 8 === 0) {
                                    return (
                                        <Fragment key={i}>
                                            <ListPickupPointsItem isEnd={true} key={i} coords={element.geometry.coordinates} item={element.properties} />
                                            <BannerMap />

                                        </Fragment>)
                                    }
                                else {
                                    return (
                                        <ListPickupPointsItem coords={element.geometry.coordinates}   key={i} item={element.properties} />
                                    )
                                }

                            }) 
                    }
                </div>                   
            )}
            {
                

                !isFetchingNextPage && data?.pages[0]?.data.length !== 0 && hasNextPage && 
                <div className="w-full my-[19px] justify-center flex">
                    <svg className="animate-spin"  xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M19 10C19 11.78 18.4722 13.5201 17.4832 15.0001C16.4943 16.4802 15.0887 17.6337 13.4442 18.3149C11.7996 18.9961 9.99002 19.1743 8.24419 18.8271C6.49836 18.4798 4.89471 17.6226 3.63604 16.364C2.37737 15.1053 1.5202 13.5016 1.17293 11.7558C0.825665 10.01 1.0039 8.20038 1.68508 6.55585C2.36627 4.91131 3.51983 3.50571 4.99987 2.51677C6.47991 1.52784 8.21997 1 10 1" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </div>
            }
            {
                isLoading && data?.pages[0]?.data.length !== 0 && 
                <div className="w-full my-[19px] justify-center flex">
                    <svg className="animate-spin"  xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M19 10C19 11.78 18.4722 13.5201 17.4832 15.0001C16.4943 16.4802 15.0887 17.6337 13.4442 18.3149C11.7996 18.9961 9.99002 19.1743 8.24419 18.8271C6.49836 18.4798 4.89471 17.6226 3.63604 16.364C2.37737 15.1053 1.5202 13.5016 1.17293 11.7558C0.825665 10.01 1.0039 8.20038 1.68508 6.55585C2.36627 4.91131 3.51983 3.50571 4.99987 2.51677C6.47991 1.52784 8.21997 1 10 1" stroke="#ABB6CC" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </div>
            }
        </div>     
    );
};