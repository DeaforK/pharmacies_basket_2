export const getChange = async (data: { id: string }) => {
    const session = '432dsfsfdsfsdf';
    try {
        const response = await fetch('https://dmcg-production.ru/fapi/get_change/index.php', {
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
        
        return result.data;
    } catch (error) {
        console.error('Ошибка при получении данных аптеки:', error);
        return null;
    }
};

export const createChangeProduct = async (data: { 
    product_id_old: number, 
    product_id_new: number, 
    quanitity_old: number,
    quanitity_new: number,
    list_changes: [], 
} | []) => {
    const session = '432dsfsfdsfsdf';
    try {
        const response = await fetch('https://dmcg-production.ru/fapi/make_change/index.php', {
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
        
        return result.data;
    } catch (error) {
        console.error('Ошибка при получении данных аптеки:', error);
        return null;
    }
};