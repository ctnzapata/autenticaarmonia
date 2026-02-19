// =============================================
// INFRASTRUCTURE LAYER — Supabase Repository
// Reemplaza el mockRepository cuando se conecte la BD
// =============================================

import { supabase } from './supabase';
import { Product, Order, Technique } from '../domain/types';

// ─── Helpers: mapeo DB → Dominio ──────────────────────────────

function mapDbProduct(row: Record<string, unknown>): Product {
    return {
        id: row.id as string,
        slug: row.slug as string,
        name: row.name as string,
        description: (row.description as string) ?? '',
        price: row.price as number,
        technique: row.technique as Technique,
        category: (row.category as string) ?? '',
        images: (row.images as string[]) ?? [],
        colors: (row.colors as Product['colors']) ?? [],
        sizes: (row.sizes as Product['sizes']) ?? [],
        rating: Number(row.rating ?? 5),
        reviewCount: Number(row.review_count ?? 0),
        isNew: Boolean(row.is_new),
        isCustomizable: Boolean(row.is_customizable),
        inStock: Boolean(row.in_stock),
    };
}

// ─── PRODUCTS ──────────────────────────────────────────────────

export async function getProductsFromDB(): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw new Error(`Error fetching products: ${error.message}`);
    return (data ?? []).map(mapDbProduct);
}

export async function getProductBySlugFromDB(slug: string): Promise<Product | null> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) return null;
    return mapDbProduct(data);
}

export async function createProductInDB(
    product: Omit<Product, 'id' | 'rating' | 'reviewCount'>
): Promise<Product> {
    const { data, error } = await supabase
        .from('products')
        .insert({
            slug: product.slug,
            name: product.name,
            description: product.description,
            price: product.price,
            technique: product.technique,
            category: product.category,
            images: product.images,
            colors: product.colors,
            sizes: product.sizes,
            is_new: product.isNew,
            is_customizable: product.isCustomizable,
            in_stock: product.inStock,
        })
        .select()
        .single();

    if (error) throw new Error(`Error creating product: ${error.message}`);
    return mapDbProduct(data);
}

export async function updateProductInDB(
    id: string,
    updates: Partial<Omit<Product, 'id'>>
): Promise<Product> {
    const { data, error } = await supabase
        .from('products')
        .update({
            ...(updates.name !== undefined && { name: updates.name }),
            ...(updates.description !== undefined && { description: updates.description }),
            ...(updates.price !== undefined && { price: updates.price }),
            ...(updates.technique !== undefined && { technique: updates.technique }),
            ...(updates.category !== undefined && { category: updates.category }),
            ...(updates.isNew !== undefined && { is_new: updates.isNew }),
            ...(updates.isCustomizable !== undefined && { is_customizable: updates.isCustomizable }),
            ...(updates.inStock !== undefined && { in_stock: updates.inStock }),
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(`Error updating product: ${error.message}`);
    return mapDbProduct(data);
}

export async function deleteProductFromDB(id: string): Promise<void> {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) throw new Error(`Error deleting product: ${error.message}`);
}

// ─── ORDERS ───────────────────────────────────────────────────

export async function getOrdersFromDB(): Promise<Order[]> {
    const { data, error } = await supabase
        .from('orders')
        .select('*, product:products(*)')
        .order('created_at', { ascending: false });

    if (error) throw new Error(`Error fetching orders: ${error.message}`);
    return (data ?? []).map(row => ({
        id: row.id as string,
        customerName: row.customer_name as string,
        customerPhone: row.customer_phone as string,
        product: mapDbProduct(row.product as Record<string, unknown>),
        customization: row.customization as Order['customization'],
        totalAmount: row.total_amount as number,
        status: row.status as Order['status'],
        createdAt: new Date(row.created_at as string),
        notes: row.notes as string | undefined,
    }));
}

export async function updateOrderStatusInDB(
    id: string,
    status: Order['status']
): Promise<void> {
    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

    if (error) throw new Error(`Error updating order: ${error.message}`);
}
