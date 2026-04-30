export class InvalidOrderStateError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = 'InvalidOrderStateError';
    }
}

export class InvalidQuantityError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = 'InvalidQuantityError';
    }
}

export enum OrderStatus {
    Draft = 'Draft',
    Pending = 'Pending',
    Completed = 'Completed',
    Cancelled = 'Cancelled'
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
    private constructor(public readonly value: number) {}

    static create(value: number): Quantity {
        if (value <= 0) {
            throw new InvalidQuantityError();
        }
        return new Quantity(value);
    }
}

export class Money {
    private constructor(
        public readonly amount: number,
        public readonly currency: string
    ) {}

    static create(amount: number, currency: string): Money {
        return new Money(amount, currency);
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
        public readonly quantity: Quantity,
        public readonly price: Money
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
        this.total = Money.create(0, 'USD');
        this.domainEvents = [];
    }

    static create(customerId: CustomerId): Order {
        const order = new Order(customerId);
        order.addDomainEvent(new OrderCreated(customerId));
        return order;
    }

    cancel(): void {
        this.status = OrderStatus.Cancelled;
    }

    addItem(productId: ProductId, quantity: Quantity, price: Money): void {
        if (this.status === OrderStatus.Cancelled) {
            throw new InvalidOrderStateError();
        }

        const existingItemIndex = this.items.findIndex(
            item => item.productId.value === productId.value
        );

        if (existingItemIndex >= 0) {
            const existingItem = this.items[existingItemIndex];
            const newValue = existingItem.quantity.value + quantity.value;
            
            this.items[existingItemIndex] = new OrderItem(
                productId, 
                Quantity.create(newValue),
                price
            );
        } else {
            const item = new OrderItem(productId, quantity, price);
            this.items.push(item);
        }
    }

    private addDomainEvent(event: DomainEvent): void {
        this.domainEvents.push(event);
    }
}