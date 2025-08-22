export type PickupPoint = {
    id: number
    name: string
    logo: string
    distance_km: number
    rating: number
    address: string
    work_time: string
    min_price: number,
    is_min_price: boolean,
    total_items: number
    available_items: number
    delivery_time: string
    min_price_tag: boolean
    long_term_assembly_tag: boolean
    middle_price_tag: boolean
    not_available: boolean
    from_warehouse: boolean,
    paymentCash : boolean,
    one_hour_assembly_tag: boolean,
    products: Product[]
}

export type Product = {
    name: string
    price: number
    quantity: number
    availability: string
}