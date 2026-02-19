// Server Component: Catálogo
// Fetcha productos de Supabase y pasa al CatalogoClient (filtros interactivos)

import { supabase } from '@/lib/infrastructure/supabase';

import CatalogoClient from '@/components/feature/CatalogoClient';
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

// export const revalidate = 60; // ISR conflictivo con force-dynamic si no hay credenciales en build

export const dynamic = 'force-dynamic';

export default async function CatalogoPage() {

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    const products: Product[] = error
        ? []
        : (data ?? []).map(r => mapProduct(r as Record<string, unknown>));

    return (
        <>
            {/* Hero Header */}
            <section style={{
                background: 'linear-gradient(135deg, var(--color-aqua) 0%, #f0fffe 60%, var(--color-white-warm) 100%)',
                padding: '4rem 0 3rem',
                textAlign: 'center',
            }}>
                <div className="container-brand">
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-stone)', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                        Inicio › <strong style={{ color: 'var(--color-teal)' }}>Catálogo</strong>
                    </p>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
                        Nuestra Colección
                    </h1>
                    <p style={{ color: 'var(--color-stone)', fontSize: '1rem', maxWidth: 500, margin: '0 auto' }}>
                        {products.length > 0
                            ? `${products.length} piezas únicas tejidas con amor y precisión artesanal`
                            : 'Piezas únicas tejidas con amor y precisión artesanal'}
                    </p>
                </div>
            </section>

            {/* Filters + Grid (Client) */}
            <CatalogoClient initialProducts={products} />

            {/* Personalization Banner */}
            <section className="section-teal" style={{ padding: '2rem 0' }}>
                <div className="container-brand" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', textAlign: 'center' }}>
                    <p style={{ color: '#fff', fontSize: '1rem', fontWeight: 500 }}>
                        ¿No encuentras lo que buscas?{' '}
                        <strong>✦ Personaliza tu pieza ideal</strong>
                    </p>
                    <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '573001234567'}`}
                        target="_blank" rel="noopener noreferrer"
                        className="btn btn-gold" style={{ padding: '0.6rem 1.5rem', fontSize: '0.875rem' }}>
                        Escríbenos →
                    </a>
                </div>
            </section>
        </>
    );
}
