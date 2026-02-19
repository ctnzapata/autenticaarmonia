'use client';

import Link from 'next/link';
import { Instagram, MessageCircle, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer style={{ background: 'var(--color-navy)', color: '#fff', paddingTop: '4rem', paddingBottom: '2rem' }}>
            <div className="container-brand">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
                    {/* Brand */}
                    <div>
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-aqua)' }}>
                            Auténtica Armonía
                        </h3>
                        <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                            Accesorios artesanales tejidos con amor y buena energía desde Medellín, Colombia.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <a href="https://www.instagram.com/autenticaarmonia?utm_source=qr&igsh=MTJwZTZiMHU1dWN4eA%3D%3D" target="_blank" rel="noopener noreferrer" style={iconStyle}>
                                    <Instagram size={18} />
                                </a>
                                <a href="https://wa.me/573004926135" target="_blank" rel="noopener noreferrer" style={{ ...iconStyle, background: 'var(--color-whatsapp)' }}>
                                    <MessageCircle size={18} />
                                </a>
                            </div>
                            <img src="/images/badge.svg" alt="Hecho en Medellín" style={{ width: 60, height: 60, opacity: 0.9 }} />
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '1rem' }}>
                            Tienda
                        </h4>
                        {[
                            { href: '/catalogo', label: 'Catálogo completo' },
                            { href: '/catalogo?tecnica=MIYUKI', label: 'Miyuki Delica' },
                            { href: '/catalogo?tecnica=CROCHET', label: 'Crochet' },
                            { href: '/personaliza', label: 'Personaliza tu pieza' },
                        ].map(({ href, label }) => (
                            <Link key={href} href={href} style={linkStyle}>{label}</Link>
                        ))}
                    </div>

                    {/* Info */}
                    <div>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '1rem' }}>
                            Información
                        </h4>
                        {[
                            { href: '/nosotros', label: 'Nuestra historia' },
                            { href: '/nosotros#proceso', label: 'Nuestro proceso' },
                            { href: '/nosotros#faq', label: 'Preguntas frecuentes' },
                        ].map(({ href, label }) => (
                            <Link key={href} href={href} style={linkStyle}>{label}</Link>
                        ))}
                    </div>
                </div>

                {/* Bottom bar */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    paddingTop: '1.5rem',
                    display: 'flex', flexWrap: 'wrap', gap: '0.5rem',
                    alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <p style={{ color: '#64748B', fontSize: '0.8rem' }}>
                        © 2025 Auténtica Armonía. Hecho en Colombia.
                    </p>
                    <p style={{ color: '#64748B', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Tejiendo buena energía <Heart size={12} fill="var(--color-gold)" color="var(--color-gold)" /> desde Medellín
                    </p>
                </div>
            </div>
        </footer>
    );
}

const iconStyle: React.CSSProperties = {
    width: 36, height: 36,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', textDecoration: 'none',
    transition: 'background 0.2s',
};

const linkStyle: React.CSSProperties = {
    display: 'block',
    color: '#94A3B8',
    textDecoration: 'none',
    fontSize: '0.9rem',
    marginBottom: '0.6rem',
    transition: 'color 0.2s',
};
