export interface CartItem {
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  variantLabel: string;
  image: string;
  unitPrice: number;
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  address?: string;
  city?: string;
  notes?: string;
}

export interface OrderRequest {
  customer: CustomerDetails;
  items: { productId: string; variantId: string; quantity: number }[];
}

export interface Order {
  id: string;
  createdAt: string;
  status: string;
  customer: CustomerDetails;
  lines: {
    productId: string;
    variantId: string;
    quantity: number;
    name: string;
    variantLabel: string;
    unitPrice: number;
    lineTotal: number;
  }[];
  subtotal: number;
  currency: string;
}
