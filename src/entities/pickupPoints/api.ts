import { axiosInstance } from '../../shared/axios';

export const getPickupPoints = async () => {
    const session = '432dsfsfdsfsdf';

    try {
        const response = await axiosInstance.get(
            "/pickupPoints.json",
            {
                withCredentials: true,
                headers: {

                  'Cookie': `PHPSESSID=${session}`
                }
            }
        );

        return response.data;

    } catch (error) {
        console.error('Something went wrong...');
        return null;
    }
};