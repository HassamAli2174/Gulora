import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Order } from '../models.js';

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | undefined>;
}

/**
 * Simple file-backed order store for local development. Serverless hosts
 * (Netlify) have a read-only filesystem, so use a database before enabling
 * store mode in production.
 */
export class JsonOrderRepository implements OrderRepository {
  private readonly file = process.env.ORDERS_FILE ?? path.resolve('src', 'data', 'orders.json');
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
