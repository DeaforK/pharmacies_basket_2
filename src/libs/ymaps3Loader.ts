declare global {
    interface Window {
        ymaps3?: any;
        __ymaps3Loading?: Promise<void>;
    }
}

export function loadYmaps3(apiKey: string, lang = "ru_RU"): Promise<void> {
    // Уже загружено → ждём готовности
    if (window.ymaps3?.ready) return window.ymaps3.ready;

    // Уже идёт загрузка → используем ту же промис-цепочку
    if (window.__ymaps3Loading) return window.__ymaps3Loading;

    window.__ymaps3Loading = new Promise<void>((resolve, reject) => {
        // Если скрипт уже есть в <head> — подпишемся на load/error
        const existing = document.querySelector<HTMLScriptElement>('script[data-ymaps3="true"]');
        if (existing) {
            existing.addEventListener("load", () => resolve());
            existing.addEventListener("error", () => reject(new Error("ymaps3 script error")));
            return;
        }

        const s = document.createElement("script");
        s.dataset.ymaps3 = "true";
        s.async = true;
        s.src = `https://api-maps.yandex.ru/v3/?apikey=${apiKey}&lang=${lang}`;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("ymaps3 script error"));
        document.head.appendChild(s);
    }).then(() => window.ymaps3.ready);

    return window.__ymaps3Loading;
}
