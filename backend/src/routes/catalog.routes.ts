import { Router } from 'express';
import { catalogRepository } from '../repositories/catalog.repository.js';

export const catalogRouter = Router();

catalogRouter.get('/categories', async (_req, res, next) => {
  try {
    res.json(await catalogRepository.getCategories());
  } catch (err) {
    next(err);
  }
});

catalogRouter.get('/products', async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    res.json(
      await catalogRepository.getProducts({
        categoryId: typeof category === 'string' && category ? category : undefined,
        featured: featured === undefined ? undefined : featured === 'true',
      }),
    );
  } catch (err) {
    next(err);
  }
});

catalogRouter.get('/products/:slug', async (req, res, next) => {
  try {
    const product = await catalogRepository.getProductBySlug(req.params.slug);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});
