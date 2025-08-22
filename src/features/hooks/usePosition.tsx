
import { useCallback, useEffect, useRef, useState } from "react"
import { useMapState } from "../../entities/store/useMapState";
import { useSearchModal } from "../../entities/store/useSearchModal";
import { useToastState } from "../../entities/store/useToast";

export interface IPosition {
    latitude: number,
    longitude: number,
}

export const usePosition = () => {
    const [position, setPosition] = useState<IPosition>({
        latitude: 0,
        longitude: 0,
    });

    const geo = useRef<Geolocation>(null);

    const onChange:PositionCallback = useCallback(({coords: {longitude,latitude}} : GeolocationPosition) => {
        setPosition({latitude,longitude})
        mapState.onCenterUserMap([longitude,latitude])
    },[position])

    const mapState = useMapState();

    const searchModalState = useSearchModal();

    const toast = useToastState();


    const initialPosition = () => {
        navigator.geolocation.getCurrentPosition(
            function(data){
                geo.current = navigator.geolocation;
               // console.log(data.coords.latitude)

                mapState.onCenterUserMap([15, data.coords.latitude])
                mapState.closeModal();
            },
            function(error){
                if(error.PERMISSION_DENIED)
                {
                    console.log(error)
                    mapState.onError({
                        code:'PERMISSION_DENIED',
                    })
                    toast.setOpen(true)
                    toast.setContent(<span>Не удалось определить  <br />ваше местоположение</span>);

                    mapState.openModal();
                    searchModalState.close();
                }
            }
        );


        if (!geo.current) {

            return;
        }
    }

    useEffect(() => {
        if (geo.current !== null && geo.current !== undefined) {
            console.log(geo)
            const watcher = geo.current.watchPosition(onChange);

            return  () => geo?.current?.clearWatch(watcher);
        }
    },[geo])

    return { ...position, initialPosition};

}
