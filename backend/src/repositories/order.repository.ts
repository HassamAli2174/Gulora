import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { config } from '../config.js';
import type { Order } from '../models.js';

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | undefined>;
}

/** Simple file-backed order store. Replace with a database before going live at scale. */
export class JsonOrderRepository implements OrderRepository {
  private readonly file = path.join(config.paths.data, 'orders.json');
  private queue: Promise<unknown> = Promise.resolve();

  private async readAll(): Promise<Order[]> {
    try {
      return JSON.parse(await readFile(this.file, 'utf8')) as Order[];
    } catch {
      return [];
    }
  }

  create(order: Order) {
    // Serialise writes so concurrent orders don't overwrite each other.
    const task = this.queue.then(async () => {
      const orders = await this.readAll();
      orders.push(order);
      await writeFile(this.file, JSON.stringify(orders, null, 2));
      return order;
    });
    this.queue = task.catch(() => undefined);
    return task;
  }

  async findById(id: string) {
    return (await this.readAll()).find((o) => o.id === id);
  }
}

export const orderRepository: OrderRepository = new JsonOrderRepository();
