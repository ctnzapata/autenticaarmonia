// =============================================
// DOMAIN LAYER — Tipos y Entidades
// Auténtica Armonía
// =============================================

export type Technique = 'MIYUKI' | 'CROCHET' | 'MIXED' | 'PEYOTE';

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;                // en COP
  technique: Technique;
  images: string[];             // URLs o rutas de imágenes
  colors: ProductColor[];
  sizes: ProductSize[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isCustomizable: boolean;
  inStock: boolean;
  category: string;
}

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
}

export interface ProductSize {
  id: string;
  label: string;      // e.g. "S", "M"
  value: string;      // e.g. "16cm", "18cm"
}

export interface Customization {
  productId: string;
  selectedColor?: ProductColor;
  initials?: string;             // máx 3 caracteres
  selectedSize?: ProductSize;
  specialNote?: string;
}

export interface CartItem {
  product: Product;
  customization: Customization;
  quantity: number;
  totalPrice: number;
}

// Admin types
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'SHIPPED' | 'DELIVERED';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  product: Product;
  customization: Customization;
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  notes?: string;
}

// Formatting utility
export const formatCOP = (amount: number): string =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
