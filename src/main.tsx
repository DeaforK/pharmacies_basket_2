import "./shared/styles/main.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { YMapComponentsProvider } from "ymap3-components";
import { router } from "./app/routing/index.tsx";
import { loadYmaps3 } from "./libs/ymaps3Loader";

const queryClient = new QueryClient();

async function bootstrap() {
    const apiKey = import.meta.env.VITE_YMAPS_API_KEY;
    if (!apiKey) throw new Error("VITE_YMAPS_API_KEY не задан");

    // Грузим SDK ОДИН раз
    await loadYmaps3(apiKey, "ru_RU");

    const rootEl = document.getElementById("root");
    if (!rootEl) throw new Error("Root element #root не найден");

    const App = () => (
        <QueryClientProvider client={queryClient}>
            {/* С apiKey — провайдер сам подтянет SDK */}
            <YMapComponentsProvider apiKey={import.meta.env.VITE_YMAPS_API_KEY} lang="ru_RU">
                <RouterProvider router={router} />
            </YMapComponentsProvider>
        </QueryClientProvider>
    );

    const node = import.meta.env.DEV ? <App /> : <StrictMode><App /></StrictMode>;
    createRoot(rootEl).render(node);


}

bootstrap().catch((e) => {
    console.error(e);
    const rootEl = document.getElementById("root");
    if (rootEl) rootEl.innerHTML = `<pre style="padding:16px">${String(e)}</pre>`;
});
