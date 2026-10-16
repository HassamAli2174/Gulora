// Mirrors backend/src/models.ts

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
  label: string;
  price: number; // 0 = not priced yet
  compareAtPrice?: number;
  stock: number;
  image?: string;
}

export type BenefitIcon = 'leaf' | 'root' | 'sparkle' | 'drop' | 'heart' | 'hand';

export interface ProductBenefit {
  icon: BenefitIcon;
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
  videos: string[];
  badges: string[];
  benefits: ProductBenefit[];
  ingredients: string[];
  howToUse: string;
  featured: boolean;
  active: boolean;
  variants: ProductVariant[];
}

/** A real customer review, with the original WhatsApp screenshot as proof. */
export interface Review {
  id: string;
  productId: string;
  quote: string;
  highlight: string;
  rating?: number;
  screenshot?: string;
  featured: boolean;
}
