import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { config } from '../config.js';
import type { Order, OrderInput, OrderLine } from '../models.js';
import { catalogRepository } from '../repositories/catalog.repository.js';
import { orderRepository } from '../repositories/order.repository.js';

export const orderRouter = Router();

// Orders only exist in store mode.
orderRouter.use((_req, res, next) => {
  if (!config.site.storeEnabled) {
    res.status(403).json({ message: 'Online ordering is not enabled yet. Please order via WhatsApp.' });
    return;
  }
  next();
});

orderRouter.post('/', async (req, res, next) => {
  try {
    const input = req.body as Partial<OrderInput>;
    const name = input.customer?.name?.trim();
    const phone = input.customer?.phone?.trim();

    if (!name || !phone) {
      res.status(400).json({ message: 'Name and phone are required.' });
      return;
    }
    if (!Array.isArray(input.items) || input.items.length === 0) {
      res.status(400).json({ message: 'Your cart is empty.' });
      return;
    }

    // Prices always come from the catalogue, never from the client.
    const lines: OrderLine[] = [];
    for (const item of input.items) {
      const quantity = Math.floor(Number(item.quantity));
      const product = await catalogRepository.getProductById(item.productId);
      const variant = product?.variants.find((v) => v.id === item.variantId);
      if (!product || !variant || !(quantity > 0)) {
        res.status(400).json({ message: 'One of the items in your cart is no longer available.' });
        return;
      }
      lines.push({
        productId: product.id,
        variantId: variant.id,
        quantity,
        name: product.name,
        variantLabel: variant.label,
        unitPrice: variant.price,
        lineTotal: variant.price * quantity,
      });
    }

    const order: Order = {
      id: `GUL-${randomUUID().slice(0, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      customer: { ...input.customer!, name, phone },
      lines,
      subtotal: lines.reduce((sum, l) => sum + l.lineTotal, 0),
      currency: config.site.currency,
    };

    res.status(201).json(await orderRepository.create(order));
  } catch (err) {
    next(err);
  }
});
