export const postPointsClusters = async(data: any) => {
    const session = '432dsfsfdsfsdf';

    try {
        const response = await fetch('https://dmcg-production.ru/fapi/cart2/index.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sess: session, data: data }),
        });

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error(error);
        console.error('Something went wrong...');
    }
}

export const getPharmacy = async (data: { id: string }) => {
    const session = '432dsfsfdsfsdf';
    try {
        const response = await fetch('https://dmcg-production.ru/fapi/get_by_id/index.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sess: session, data }),
        });


        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return null;
        }

        const result = await response.json();
        //console.log(result)

        return result.data;
    } catch (error) {
        console.error('Ошибка при получении данных аптеки:', error);
        return null;
    }
};
