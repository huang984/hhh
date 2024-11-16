export class ShopItem {
    constructor(id, name, description, price, currency, type) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.currency = currency; // 'gold' 或 'diamond'
        this.type = type;
    }
} 