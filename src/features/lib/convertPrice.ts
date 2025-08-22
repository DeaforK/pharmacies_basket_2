export const convertPrice = (price: number): string => {
    if (price >= 1000) {
        return `${price.toString()[0]} ${price.toString()[1]}${price.toString()[2]}${price.toString()[3]}`
    }
    if (price >= 10000) {
        return `${price.toString()[0]}${price.toString()[1]} ${price.toString()[2]}${price.toString()[3]}${price.toString()[4]}`
    }    

    return price.toString();
}