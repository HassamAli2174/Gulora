// Shared domain models. Keep in sync with frontend/src/app/core/models.

export interface Category {
  id: string;
  name: string;
  description: string;
  image?: string;
  comingSoon?: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  label: string; // e.g. "500 ml", "20 ml Tester"
  price: number; // in whole currency units; 0 = not priced yet
  compareAtPrice?: number;
  stock: number; // used once the store is enabled
  image?: string;
}

export interface ProductBenefit {
  icon: 'leaf' | 'root' | 'sparkle' | 'drop' | 'heart' | 'hand';
  label: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  images: string[];
  badges: string[];
  benefits: ProductBenefit[];
  ingredients: string[];
  howToUse: string;
  featured: boolean;
  active: boolean;
  variants: ProductVariant[];
}

export interface OrderItemInput {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface OrderInput {
  customer: { name: string; phone: string; address?: string; city?: string; notes?: string };
  items: OrderItemInput[];
}

export interface OrderLine extends OrderItemInput {
  name: string;
  variantLabel: string;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  customer: OrderInput['customer'];
  lines: OrderLine[];
  subtotal: number;
  currency: string;
}
