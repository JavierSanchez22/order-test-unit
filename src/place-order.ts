import { CustomerId, Order, ProductId, Quantity } from './order';
import { OrderRepository, ProductRepository, EventPublisher } from './interfaces';

export type PlaceOrderCommand = {
  customerId: string;
  items: Array<{ productId: string; quantity: number }>;
};

export class PlaceOrderHandler {
  constructor(
    private orderRepo: OrderRepository,
    private productRepo: ProductRepository,
    private eventPublisher: EventPublisher
  ) {}

  async handle(command: PlaceOrderCommand): Promise<string> {
    const customerId = CustomerId.from(command.customerId);
    const order = Order.create(customerId);

    for (const item of command.items) {
      const productId = ProductId.from(item.productId);
      
      const product = await this.productRepo.findById(productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      order.addItem(productId, Quantity.create(item.quantity), product.price);
    }

    await this.orderRepo.save(order);
    await this.eventPublisher.publish(order.domainEvents);

    return order.id.value;
  }
}