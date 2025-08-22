export type Feature = {
    id: string;
    geometry: {
        type: 'Point';
        coordinates: [number, number];
    };
    properties: Record<string, any>;
};
