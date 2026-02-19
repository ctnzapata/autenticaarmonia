'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/feature/ProductCard';
import { getProducts } from '@/lib/infrastructure/mockRepository';
import type { Technique } from '@/lib/domain/types';

const FILTERS: { label: string; value: string }[] = [
    { label: 'Todos', value: 'ALL' },
    { label: 'Miyuki', value: 'MIYUKI' },
    { label: 'Crochet', value: 'CROCHET' },
    { label: 'Mixto', value: 'MIXED' },
    { label: 'Personalizable', value: 'CUSTOM' },
];

export default function CatalogoPage() {
    const allProducts = getProducts();
    const [active, setActive] = useState('ALL');
    const [search, setSearch] = useState('');

    const filtered = allProducts.filter(p => {
        const matchTech = active === 'ALL'
            ? true
            : active === 'CUSTOM'
                ? p.isCustomizable
                : p.technique === (active as Technique);
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        return matchTech && matchSearch;
    });

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
                        Piezas únicas tejidas con amor y precisión artesanal
                    </p>
                </div>
            </section>

            {/* Controls bar */}
            <section style={{ background: '#fff', borderBottom: '1px solid var(--color-border)', padding: '1rem 0', position: 'sticky', top: 72, zIndex: 30 }}>
                <div className="container-brand" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    {/* Search */}
                    <div style={{ position: 'relative', flex: '1', minWidth: 200, maxWidth: 320 }}>
                        <Search size={16} color="var(--color-stone)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Buscar accesorios..."
                            style={{
                                width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
                                border: '1px solid var(--color-border)', borderRadius: '9999px',
                                fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--color-navy)',
                                outline: 'none', background: 'var(--color-white-warm)',
                            }}
                        />
                    </div>

                    {/* Filter pills */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <SlidersHorizontal size={16} color="var(--color-stone)" />
                        {FILTERS.map(f => (
                            <button
                                key={f.value}
                                onClick={() => setActive(f.value)}
                                style={{
                                    padding: '6px 16px',
                                    borderRadius: '9999px',
                                    border: `2px solid ${active === f.value ? 'var(--color-teal)' : 'var(--color-border)'}`,
                                    background: active === f.value ? 'var(--color-teal)' : 'transparent',
                                    color: active === f.value ? '#fff' : 'var(--color-stone)',
                                    fontSize: '0.825rem', fontWeight: 600, cursor: 'pointer',
                                    fontFamily: 'var(--font-sans)',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* Count */}
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-stone)', fontWeight: 500 }}>
                        {filtered.length} productos
                    </span>
                </div>
            </section>

            {/* Product Grid */}
            <section style={{ padding: '3rem 0 5rem', background: 'var(--color-white-warm)' }}>
                <div className="container-brand">
                    {filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-stone)' }}>
                            <p style={{ fontSize: '1.1rem' }}>No encontramos productos con esos filtros.</p>
                            <button onClick={() => { setActive('ALL'); setSearch(''); }} className="btn btn-outline" style={{ marginTop: '1rem' }}>
                                Ver todos
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.75rem' }}>
                            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    )}
                </div>
            </section>

            {/* Personalization Banner */}
            <section className="section-teal" style={{ padding: '2rem 0' }}>
                <div className="container-brand" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', textAlign: 'center' }}>
                    <p style={{ color: '#fff', fontSize: '1rem', fontWeight: 500 }}>
                        ¿No encuentras lo que buscas?{' '}
                        <strong>✦ Personaliza tu pieza ideal</strong>
                    </p>
                    <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer"
                        className="btn btn-gold" style={{ padding: '0.6rem 1.5rem', fontSize: '0.875rem' }}>
                        Escríbenos →
                    </a>
                </div>
            </section>
        </>
    );
}
