// test/place-order.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { PlaceOrderHandler, PlaceOrderCommand } from '../src/place-order';
import { MockOrderRepository, MockProductRepository, MockEventPublisher } from '../mocks/mocks';
import { OrderId, ProductId, Money } from '../src/order';

function createTestProduct(id: string, amount: number) {
  return {
    id: ProductId.from(id),
    price: Money.create(amount, 'USD')
  };
}

describe('PlaceOrderHandler', () => {
  let handler: PlaceOrderHandler;
  let orderRepo: MockOrderRepository;
  let productRepo: MockProductRepository;
  let eventPublisher: MockEventPublisher;

  beforeEach(() => {
    orderRepo = new MockOrderRepository();
    productRepo = new MockProductRepository();
    eventPublisher = new MockEventPublisher();

    handler = new PlaceOrderHandler(orderRepo, productRepo, eventPublisher);
  });

  it('creates order with items and saves', async () => {
    productRepo.addProduct(createTestProduct('prod-1', 10.00));
    productRepo.addProduct(createTestProduct('prod-2', 20.00));

    const command: PlaceOrderCommand = {
      customerId: 'cust-123',
      items: [
        { productId: 'prod-1', quantity: 2 },
        { productId: 'prod-2', quantity: 1 },
      ],
    };

    const orderId = await handler.handle(command);

    expect(orderId).toBeDefined();

    const savedOrder = await orderRepo.findById(OrderId.from(orderId));
    expect(savedOrder).not.toBeNull();
  });
});