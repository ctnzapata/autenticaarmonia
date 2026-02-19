'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'Inicio' },
        { href: '/catalogo', label: 'Catálogo' },
        { href: '/personaliza', label: 'Personaliza' },
        { href: '/nosotros', label: 'Nosotros' },
    ];

    return (
        <nav style={{
            background: '#ffffff',
            boxShadow: '0 1px 12px rgba(15,23,42,0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
        }}>
            <div className="container-brand" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
                {/* Logo */}
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <div style={{
                        width: 36, height: 36, background: 'var(--color-teal)',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Sparkles size={18} color="#DBFFFF" />
                    </div>
                    <div>
                        <span style={{
                            fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.15rem',
                            color: 'var(--color-navy)', letterSpacing: '-0.01em',
                        }}>
                            Auténtica Armonía
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
                    {navLinks.map(({ href, label }) => (
                        <Link key={href} href={href} className="nav-link">
                            {label}
                        </Link>
                    ))}
                    <Link href="/catalogo" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                        Ver Colección
                    </Link>
                    <Link href="/admin" style={{
                        fontSize: '0.75rem', color: 'var(--color-stone-light)',
                        textDecoration: 'none', transition: 'color 0.2s',
                    }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-teal)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-stone-light)')}
                    >
                        Admin
                    </Link>
                </div>

                {/* Mobile Hamburger */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-navy)', display: 'none' }}
                    className="mobile-menu-btn"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div style={{
                    background: '#fff', borderTop: '1px solid var(--color-border)',
                    padding: '1rem 1.5rem 1.5rem',
                }}>
                    {navLinks.map(({ href, label }) => (
                        <Link key={href} href={href} onClick={() => setIsOpen(false)} style={{
                            display: 'block', padding: '0.75rem 0',
                            fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 500,
                            color: 'var(--color-navy)', textDecoration: 'none',
                            borderBottom: '1px solid var(--color-border)',
                        }}>
                            {label}
                        </Link>
                    ))}
                    <Link href="/catalogo" onClick={() => setIsOpen(false)} className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
                        Ver Colección
                    </Link>
                </div>
            )}

            <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
        </nav>
    );
}
