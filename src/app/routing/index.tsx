import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "../../shared/ui/main-layout";
import { ListPharmacies, Map } from "../../pages";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/map" replace />
    },
    {
        path: '/*',
        element: <MainLayout />,
        children : [
            {
                path:'map',
                element: <Map />
            },  
            {
                path:'list',
                element: <ListPharmacies />
            },      
        ]
    },
])