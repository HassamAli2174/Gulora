import categoriesData from '../data/categories.json' with { type: 'json' };
import productsData from '../data/products.json' with { type: 'json' };
import type { Category, Product } from '../models.js';

/**
 * Storage abstraction for the catalogue. Today it serves the JSON files in
 * src/data (bundled at build time, so it also runs as a serverless function);
 * later swap in a database-backed implementation (MongoDB, PostgreSQL, a
 * headless CMS...) without touching routes.
 */
export interface CatalogRepository {
  getCategories(): Promise<Category[]>;
  getProducts(filter?: { categoryId?: string; featured?: boolean }): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductById(id: string): Promise<Product | undefined>;
}

export class JsonCatalogRepository implements CatalogRepository {
  private readonly categories = categoriesData as Category[];
  private readonly products = productsData as Product[];

  async getCategories() {
    return [...this.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getProducts(filter: { categoryId?: string; featured?: boolean } = {}) {
    return this.products.filter(
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
