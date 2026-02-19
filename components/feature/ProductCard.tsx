'use client';

import Link from 'next/link';
import { Star, Heart } from 'lucide-react';
import { Product, formatCOP } from '@/lib/domain/types';

interface ProductCardProps {
    product: Product;
}

const TECHNIQUE_COLORS: Record<string, { bg: string; color: string }> = {
    MIYUKI: { bg: 'var(--color-teal)', color: '#fff' },
    CROCHET: { bg: 'var(--color-gold)', color: 'var(--color-navy)' },
    MIXED: { bg: 'var(--color-navy)', color: '#fff' },
    PEYOTE: { bg: '#7B1FA2', color: '#fff' },
};

// Aqua-toned placeholder backgrounds per product index
const PLACEHOLDER_BG = [
    'linear-gradient(135deg, #DBFFFF 0%, #B2F5F5 100%)',
    'linear-gradient(135deg, #B2F5F5 0%, #80DEEA 100%)',
    'linear-gradient(135deg, #E0F7FA 0%, #DBFFFF 100%)',
    'linear-gradient(135deg, #FAFAF9 0%, #DBFFFF 100%)',
];

export default function ProductCard({ product }: ProductCardProps) {
    const tech = TECHNIQUE_COLORS[product.technique] ?? TECHNIQUE_COLORS.MIYUKI;
    const bgIndex = parseInt(product.id) % PLACEHOLDER_BG.length;

    return (
        <Link href={`/producto/${product.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
            <div className="card" style={{ cursor: 'pointer', position: 'relative' }}>
                {/* Image area */}
                <div style={{
                    position: 'relative',
                    aspectRatio: '3/4',
                    background: PLACEHOLDER_BG[bgIndex],
                    overflow: 'hidden',
                }}>
                    {/* Decorative pattern in placeholder */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexDirection: 'column', gap: '0.5rem',
                    }}>
                        <div style={{ fontSize: '2.5rem', opacity: 0.3 }}>✦</div>
                        <span style={{
                            fontFamily: 'var(--font-serif)', fontSize: '0.85rem',
                            color: 'var(--color-teal-dark)', opacity: 0.6,
                            textAlign: 'center', padding: '0 1rem',
                        }}>
                            {product.name}
                        </span>
                    </div>

                    {/* Technique badge */}
                    <div style={{
                        position: 'absolute', top: '0.75rem', left: '0.75rem',
                        ...tech,
                        padding: '3px 10px', borderRadius: '9999px',
                        fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em',
                    }}>
                        {product.technique}
                    </div>

                    {/* New badge */}
                    {product.isNew && (
                        <div style={{
                            position: 'absolute', top: '0.75rem', right: '2.5rem',
                            background: '#E53935', color: '#fff',
                            padding: '3px 8px', borderRadius: '9999px',
                            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em',
                        }}>
                            NUEVO
                        </div>
                    )}

                    {/* Wishlist icon */}
                    <button style={{
                        position: 'absolute', top: '0.65rem', right: '0.65rem',
                        background: 'rgba(255,255,255,0.85)', border: 'none',
                        borderRadius: '50%', width: 30, height: 30,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                        onClick={e => e.preventDefault()}
                    >
                        <Heart size={14} color="var(--color-stone)" />
                    </button>
                </div>

                {/* Info */}
                <div style={{ padding: '1rem' }}>
                    <h3 style={{
                        fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 600,
                        color: 'var(--color-navy)', marginBottom: '0.35rem', lineHeight: 1.3,
                    }}>
                        {product.name}
                    </h3>

                    {/* Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.5rem' }}>
                        <Star size={12} fill="var(--color-gold)" color="var(--color-gold)" />
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-stone)', fontWeight: 500 }}>
                            {product.rating} ({product.reviewCount})
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-teal)' }}>
                            {formatCOP(product.price)}
                        </span>
                        <span style={{
                            fontSize: '0.75rem', color: 'var(--color-teal)',
                            fontWeight: 600, border: '1px solid var(--color-teal)',
                            padding: '2px 10px', borderRadius: '9999px',
                        }}>
                            Ver más →
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
