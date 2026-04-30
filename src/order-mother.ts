import { CustomerId, Order, ProductId, Quantity, Money } from '../src/order';

export class OrderMother {
  static draft(): Order {
    return Order.create(CustomerId.from('cust-123'));
  }

  static create(): Order {
    return OrderMother.draft();
  }

  static withItems(n: number = 1): Order {
    const order = OrderMother.draft();
    
    for (let i = 0; i < n; i++) {
      order.addItem(
        ProductId.from(`prod-${i + 1}`), 
        Quantity.create(1),
        Money.create(10, 'USD')
      );
    }
    
    return order;
  }

  static cancelled(): Order {
    const order = OrderMother.draft();
    order.cancel(); 
    return order;
  }
}