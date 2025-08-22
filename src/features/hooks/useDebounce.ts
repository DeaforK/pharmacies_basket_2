import { useCallback, useRef } from "react";

export function useDebounce(callback:any, delay: any,) {
    const timer = useRef(null) as any

    const debouncedCallback = useCallback((...args:any) => {
        if (timer.current){
            clearTimeout(timer.current);
        }

        timer.current = setTimeout(() => {
            callback(...args)
        },delay)

    },[callback, delay])

    return debouncedCallback;
}