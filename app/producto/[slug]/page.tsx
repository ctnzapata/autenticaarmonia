// Server Component: Detalle de Producto
// Fetcha el producto y productos relacionados de Supabase

import { notFound } from 'next/navigation';
import { supabase } from '@/lib/infrastructure/supabase';

import ProductoClient from '@/components/feature/ProductoClient';
import type { Product } from '@/lib/domain/types';

function mapProduct(row: Record<string, unknown>): Product {
    return {
        id: String(row.id),
        slug: row.slug as string,
        name: row.name as string,
        description: (row.description as string) ?? '',
        price: row.price as number,
        technique: row.technique as Product['technique'],
        category: (row.category as string) ?? '',
        images: (row.images as string[]) ?? [],
        colors: (row.colors as Product['colors']) ?? [],
        sizes: (row.sizes as Product['sizes']) ?? [],
        rating: row.rating as number,
        reviewCount: row.review_count as number,
        isNew: row.is_new as boolean,
        isCustomizable: row.is_customizable as boolean,
        inStock: row.in_stock as boolean,
    };
}

// export const revalidate = 60;

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function ProductoPage({ params }: Props) {
    const { slug } = await params;

    // Fetch producto principal
    const { data: productData } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!productData) notFound();

    const product = mapProduct(productData as Record<string, unknown>);

    // Fetch productos relacionados (misma técnica, excluyendo el actual)
    const { data: relatedData } = await supabase
        .from('products')
        .select('*')
        .eq('technique', product.technique)
        .neq('slug', slug)
        .eq('in_stock', true)
        .limit(3);

    const related: Product[] = (relatedData ?? []).map(r => mapProduct(r as Record<string, unknown>));

    return <ProductoClient product={product} related={related} />;
}
