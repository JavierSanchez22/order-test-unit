export enum OrderStatus {
    Draft = 'Draft',
    Pending = 'Pending',
    Completed = 'Completed'
}

export class CustomerId {
    private constructor(public readonly value: string) {}

    static from(id: string): CustomerId {
        return new CustomerId(id);
    }
}

export class ProductId {
    private constructor(public readonly value: string) {}

    static from(id: string): ProductId {
        return new ProductId(id);
    }
}

export class Quantity {
    private constructor(
        public readonly amount: number, 
        public readonly currency: string
    ) {}

    static create(amount: number, currency: string): Quantity {
        return new Quantity(amount, currency);
    }
}

export class Money {
    private constructor(public readonly amount: number) {}

    static create(amount: number): Money {
        return new Money(amount);
    }
}

export abstract class DomainEvent {
    public readonly occurredOn: Date = new Date();
}

export class OrderCreated extends DomainEvent {
    constructor(public readonly customerId: CustomerId) {
        super();
    }
}

export class OrderItem {
    constructor(
        public readonly productId: ProductId, 
        public readonly quantity: Quantity
    ) {}
}

export class Order {
    public status: OrderStatus;
    public customerId: CustomerId;
    public items: OrderItem[];
    public total: Money;
    public domainEvents: DomainEvent[];

    private constructor(customerId: CustomerId) {
        this.status = OrderStatus.Draft;
        this.customerId = customerId;
        this.items = [];
        this.total = Money.create(0);
        this.domainEvents = [];
    }

    static create(customerId: CustomerId): Order {
        const order = new Order(customerId);
        order.addDomainEvent(new OrderCreated(customerId));
        return order;
    }

    addItem(productId: ProductId, quantity: Quantity): void {
        const item = new OrderItem(productId, quantity);
        this.items.push(item);
    }

    private addDomainEvent(event: DomainEvent): void {
        this.domainEvents.push(event);
    }
}