import { describe, it, expect } from 'vitest';
import { CustomerId, Order, OrderCreated, OrderStatus, ProductId, Quantity, Money, InvalidOrderStateError, InvalidQuantityError } from '../src/order';
import { OrderMother } from '../src/order-mother';

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
      const order = OrderMother.draft();
      const productId = ProductId.from('prod-123');
      const quantity = Quantity.create(2);
      const price = Money.create(10.00, 'USD');

      order.addItem(productId, quantity, price);

      expect(order.items).toHaveLength(1);
      expect(order.items[0].productId).toEqual(productId);
      expect(order.items[0].quantity).toEqual(quantity);
    });

    it('increases quantity for existing product', () => {
      const order = OrderMother.draft();
      const productId = ProductId.from('prod-123');
      const price = Money.create(10.00, 'USD');
      
      order.addItem(productId, Quantity.create(2), price);
      order.addItem(productId, Quantity.create(3), price);

      expect(order.items).toHaveLength(1);
      expect(order.items[0].quantity.value).toBe(5);
    });

    it('throws when order is cancelled', () => {
      const order = OrderMother.cancelled();

      expect(() => {
        order.addItem(ProductId.from('prod-123'), Quantity.create(1), Money.create(10, 'USD'));
      }).toThrow(InvalidOrderStateError);
    });

    it('throws when quantity is zero', () => {
      const order = OrderMother.draft();

      expect(() => {
        order.addItem(ProductId.from('prod-123'), Quantity.create(0), Money.create(10, 'USD'));
      }).toThrow(InvalidQuantityError);
    });
  });
});