import { describe, it, expect } from 'vitest';
import { CustomerId, Order, OrderCreated, OrderStatus, ProductId, Quantity } from '../src/order';


describe('Order', () => {
  describe('create', () => {
    it('creates order with draft status', () => {
      const customerId = CustomerId.from('cust-123');

      const order = Order.create(customerId);

      expect(order.status).toBe(OrderStatus.Draft);
      expect(order.customerId).toEqual(customerId);
      expect(order.items).toHaveLength(0);
      expect(order.total.amount).toBe(0);
    });

    it('emits OrderCreated event', () => {
      const customerId = CustomerId.from('cust-123');

      const order = Order.create(customerId);

      expect(order.domainEvents).toHaveLength(1);
      expect(order.domainEvents[0]).toBeInstanceOf(OrderCreated);
    });
  });

  describe('addItem', () => {
    it('adds item to order', () => {
      const order = createDraftOrder();
      
      order.addItem(ProductId.from('prod-123'), Quantity.create(10, 'USD'));

      expect(order.items).toHaveLength(1);
    });
  });
});

function createDraftOrder(): Order {
  return Order.create(CustomerId.from('cust-123'));
}