'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Star, MessageCircle, Sparkles, ChevronLeft, Package } from 'lucide-react';
import { getProductBySlug, getFeaturedProducts } from '@/lib/infrastructure/mockRepository';
import { generateWhatsAppLink } from '@/lib/application/generateWhatsAppLink';
import { type ProductColor, type ProductSize, formatCOP } from '@/lib/domain/types';
import ProductCard from '@/components/feature/ProductCard';

const TECHNIQUE_LABEL: Record<string, string> = {
    MIYUKI: 'Miyuki Delica',
    CROCHET: 'Crochet Artesanal',
    MIXED: 'Técnica Mixta',
    PEYOTE: 'Tejido Peyote',
};

interface Props {
    params: { slug: string };
}

export default function ProductoPage({ params }: Props) {
    const product = getProductBySlug(params.slug);
    if (!product) notFound();

    const [selectedColor, setSelectedColor] = useState<ProductColor | undefined>(product.colors[0]);
    const [selectedSize, setSelectedSize] = useState<ProductSize | undefined>(product.sizes[0]);
    const [initials, setInitials] = useState('');
    const [specialNote, setSpecialNote] = useState('');

    const customizationCost = initials ? 5000 : 0;
    const total = product.price + customizationCost;

    const whatsappUrl = generateWhatsAppLink(product, { productId: product.id, selectedColor, selectedSize, initials, specialNote });

    const related = getFeaturedProducts(3).filter(p => p.id !== product.id).slice(0, 3);

    return (
        <>
            {/* Breadcrumb */}
            <div style={{ background: 'var(--color-aqua)', padding: '0.75rem 0' }}>
                <div className="container-brand">
                    <Link href="/catalogo" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-teal-dark)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}>
                        <ChevronLeft size={14} /> Volver al Catálogo
                    </Link>
                    <span style={{ color: 'var(--color-stone)', fontSize: '0.85rem', marginLeft: '0.5rem' }}>
                        › <strong style={{ color: 'var(--color-navy)' }}>{product.name}</strong>
                    </span>
                </div>
            </div>

            {/* Main Product Section */}
            <section style={{ padding: '3rem 0', background: 'var(--color-white-warm)' }}>
                <div className="container-brand" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
                    {/* LEFT: Gallery */}
                    <div>
                        <div style={{
                            aspectRatio: '3/4',
                            background: 'linear-gradient(145deg, var(--color-aqua) 0%, var(--color-aqua-mid) 100%)',
                            borderRadius: '1.5rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexDirection: 'column', gap: '1rem',
                            position: 'relative', overflow: 'hidden',
                            boxShadow: '0 20px 60px rgba(0,105,92,0.2)',
                        }}>
                            <div style={{ fontSize: '4rem', opacity: 0.25 }}>✦</div>
                            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--color-teal-dark)', opacity: 0.7, textAlign: 'center', padding: '0 2rem' }}>
                                {product.name}
                            </p>
                            {/* Technique badge on image */}
                            <div style={{
                                position: 'absolute', top: '1rem', left: '1rem',
                                background: 'var(--color-teal)', color: '#fff',
                                padding: '4px 14px', borderRadius: '9999px',
                                fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em',
                            }}>
                                ✦ {TECHNIQUE_LABEL[product.technique]}
                            </div>
                        </div>

                        {/* Thumbnails */}
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{
                                    flex: 1, aspectRatio: '1', borderRadius: '0.75rem',
                                    background: `linear-gradient(135deg, var(--color-aqua-mid), var(--color-aqua))`,
                                    border: i === 1 ? '2px solid var(--color-teal)' : '2px solid transparent',
                                    cursor: 'pointer',
                                }} />
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Info + Customizer */}
                    <div>
                        {/* Technique badge */}
                        <div className="badge badge-teal" style={{ marginBottom: '1rem' }}>
                            ✦ {TECHNIQUE_LABEL[product.technique]}
                        </div>

                        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, color: 'var(--color-navy)', lineHeight: 1.15, marginBottom: '0.75rem' }}>
                            {product.name}
                        </h1>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-teal)' }}>
                                {formatCOP(product.price)}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} size={14} fill={i < Math.round(product.rating) ? 'var(--color-gold)' : 'none'} color="var(--color-gold)" />
                                ))}
                                <span style={{ fontSize: '0.85rem', color: 'var(--color-stone)', marginLeft: '4px' }}>
                                    {product.rating} ({product.reviewCount} reseñas)
                                </span>
                            </div>
                        </div>

                        <p style={{ color: 'var(--color-stone)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                            {product.description}
                        </p>

                        <div className="gold-divider" style={{ marginBottom: '1.75rem' }} />

                        {/* CUSTOMIZER */}
                        <div style={{
                            background: 'var(--color-aqua)', borderRadius: '1.25rem',
                            padding: '1.75rem', border: '1px solid var(--color-aqua-mid)',
                        }}>
                            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Sparkles size={20} color="var(--color-teal)" /> Personaliza tu Pieza
                            </h2>

                            {/* Color Selection */}
                            {product.colors.length > 0 && (
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '0.6rem' }}>
                                        Color principal {selectedColor && <span style={{ color: 'var(--color-teal)' }}>— {selectedColor.name}</span>}
                                    </label>
                                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                                        {product.colors.map(c => (
                                            <button key={c.id} onClick={() => setSelectedColor(c)} title={c.name} style={{
                                                width: 32, height: 32, borderRadius: '50%',
                                                background: c.hex, border: 'none', cursor: 'pointer',
                                                outline: selectedColor?.id === c.id ? '3px solid var(--color-teal)' : '2px solid var(--color-border)',
                                                outlineOffset: 2, transition: 'outline 0.15s',
                                            }} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Size Selection */}
                            {product.sizes.length > 0 && (
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '0.6rem' }}>
                                        Talla
                                    </label>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {product.sizes.map(s => (
                                            <button key={s.id} onClick={() => setSelectedSize(s)} style={{
                                                padding: '6px 14px', borderRadius: '9999px',
                                                border: `2px solid ${selectedSize?.id === s.id ? 'var(--color-teal)' : 'var(--color-border)'}`,
                                                background: selectedSize?.id === s.id ? 'var(--color-teal)' : '#fff',
                                                color: selectedSize?.id === s.id ? '#fff' : 'var(--color-navy)',
                                                fontSize: '0.825rem', fontWeight: 600, cursor: 'pointer',
                                                fontFamily: 'var(--font-sans)', transition: 'all 0.15s',
                                            }}>
                                                {s.label} <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>({s.value})</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Initials */}
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '0.6rem' }}>
                                    Tus iniciales <span style={{ color: 'var(--color-stone)', fontWeight: 400 }}>(opcional · +{formatCOP(5000)})</span>
                                </label>
                                <input
                                    value={initials}
                                    onChange={e => setInitials(e.target.value.slice(0, 3).toUpperCase())}
                                    placeholder="Ej: A.M."
                                    maxLength={3}
                                    style={{
                                        width: '100%', padding: '10px 14px',
                                        border: '1px solid var(--color-border)', borderRadius: '0.5rem',
                                        fontFamily: 'var(--font-sans)', fontSize: '0.9rem',
                                        background: '#fff', outline: 'none',
                                    }}
                                />
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-stone)', marginTop: '4px' }}>Se tejerán con cuentas de contraste</p>
                            </div>

                            {/* Special note */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '0.6rem' }}>
                                    Nota especial <span style={{ color: 'var(--color-stone)', fontWeight: 400 }}>(opcional)</span>
                                </label>
                                <textarea
                                    value={specialNote}
                                    onChange={e => setSpecialNote(e.target.value)}
                                    placeholder="Ej: Es un regalo, incluir empaque especial."
                                    rows={2}
                                    style={{
                                        width: '100%', padding: '10px 14px',
                                        border: '1px solid var(--color-border)', borderRadius: '0.5rem',
                                        fontFamily: 'var(--font-sans)', fontSize: '0.9rem',
                                        background: '#fff', outline: 'none', resize: 'vertical',
                                    }}
                                />
                            </div>

                            {/* Price Summary */}
                            <div style={{ background: '#fff', borderRadius: '0.75rem', padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.875rem', color: 'var(--color-stone)' }}>
                                    <span>Precio base</span>
                                    <span>{formatCOP(product.price)}</span>
                                </div>
                                {initials && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.875rem', color: 'var(--color-stone)' }}>
                                        <span>Personalización (iniciales)</span>
                                        <span>+{formatCOP(5000)}</span>
                                    </div>
                                )}
                                <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-navy)' }}>Total estimado</span>
                                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-teal)' }}>{formatCOP(total)}</span>
                                </div>
                            </div>

                            {/* CTA */}
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp" style={{ width: '100%', justifyContent: 'center' }}>
                                <MessageCircle size={20} />
                                Pedir por WhatsApp
                            </a>
                            <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--color-stone)', marginTop: '0.6rem' }}>
                                Respondemos en menos de 2 horas 💚
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Products */}
            {related.length > 0 && (
                <section style={{ padding: '4rem 0', background: '#fff' }}>
                    <div className="container-brand">
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '2rem' }}>
                            También te puede gustar
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.75rem' }}>
                            {related.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
