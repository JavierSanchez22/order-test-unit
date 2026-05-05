import { Order, OrderId, ProductId, DomainEvent } from './order';

export interface OrderRepository {
  save(order: Order): Promise<void>;
  findById(id: OrderId): Promise<Order | null>;
}

export interface ProductRepository {
  findById(id: ProductId): Promise<any | null>; 
}

export interface EventPublisher {
  publish(events: DomainEvent[]): Promise<void>;
}