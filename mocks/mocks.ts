// test/mocks.ts

import { Order, OrderId, ProductId, DomainEvent } from '../src/order';
import { OrderRepository, ProductRepository, EventPublisher } from '../src/interfaces';

export class MockOrderRepository implements OrderRepository {
  private orders = new Map<string, Order>();

  async save(order: Order): Promise<void> {
    this.orders.set(order.id.value, order);
  }

  async findById(id: OrderId): Promise<Order | null> {
    return this.orders.get(id.value) || null;
  }
}

export class MockProductRepository implements ProductRepository {
  private products = new Map<string, any>();

  addProduct(product: any): void {
    this.products.set(product.id.value, product);
  }

  async findById(id: ProductId): Promise<any | null> {
    return this.products.get(id.value) || null;
  }
}

export class MockEventPublisher implements EventPublisher {
  public publishedEvents: DomainEvent[] = [];

  async publish(events: DomainEvent[]): Promise<void> {
    this.publishedEvents.push(...events);
  }
}