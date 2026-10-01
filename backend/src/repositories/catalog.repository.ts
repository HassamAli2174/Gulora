import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { config } from '../config.js';
import type { Category, Product } from '../models.js';

/**
 * Storage abstraction for the catalogue. Today it reads JSON files so the
 * catalogue can be edited by hand; later swap in a database-backed
 * implementation (MongoDB, PostgreSQL, a headless CMS...) without touching routes.
 */
export interface CatalogRepository {
  getCategories(): Promise<Category[]>;
  getProducts(filter?: { categoryId?: string; featured?: boolean }): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductById(id: string): Promise<Product | undefined>;
}

async function readJson<T>(file: string): Promise<T> {
  // Read on every call so edits to the JSON show up without a restart.
  const raw = await readFile(path.join(config.paths.data, file), 'utf8');
  return JSON.parse(raw) as T;
}

export class JsonCatalogRepository implements CatalogRepository {
  async getCategories() {
    const categories = await readJson<Category[]>('categories.json');
    return categories.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getProducts(filter: { categoryId?: string; featured?: boolean } = {}) {
    const products = await readJson<Product[]>('products.json');
    return products.filter(
      (p) =>
        p.active &&
        (!filter.categoryId || p.categoryId === filter.categoryId) &&
        (filter.featured === undefined || p.featured === filter.featured),
    );
  }

  async getProductBySlug(slug: string) {
    return (await this.getProducts()).find((p) => p.slug === slug);
  }

  async getProductById(id: string) {
    return (await this.getProducts()).find((p) => p.id === id);
  }
}

export const catalogRepository: CatalogRepository = new JsonCatalogRepository();
