'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, Package, MessageCircle, Palette,
    Users, Settings, Sparkles, LogOut,
} from 'lucide-react';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Package, label: 'Productos', href: '/admin/productos' },
    { icon: MessageCircle, label: 'Pedidos WhatsApp', href: '/admin/pedidos' },
    { icon: Palette, label: 'Personalizaciones', href: '/admin/personalizaciones' },
    { icon: Users, label: 'Clientes', href: '/admin/clientes' },
    { icon: Settings, label: 'Configuración', href: '/admin/config' },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside style={{
            width: 240, background: 'var(--color-navy)', color: '#fff',
            display: 'flex', flexDirection: 'column', flexShrink: 0,
            position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
        }}>
            {/* Logo */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <Link href="/" style={{ textDecoration: 'none' }}>
                    <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-aqua)', marginBottom: '4px' }}>
                        Auténtica Armonía
                    </p>
                </Link>
                <span style={{
                    fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
                    background: 'var(--color-gold)', color: 'var(--color-navy)',
                    padding: '2px 8px', borderRadius: '9999px',
                }}>
                    ADMIN PANEL
                </span>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '1rem 0' }}>
                {navItems.map(({ icon: Icon, label, href }) => {
                    const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
                    return (
                        <Link key={href} href={href} style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '0.75rem 1.5rem',
                            background: active ? 'rgba(0,105,92,0.3)' : 'transparent',
                            borderLeft: active ? '3px solid var(--color-teal)' : '3px solid transparent',
                            color: active ? 'var(--color-aqua)' : '#94A3B8',
                            textDecoration: 'none', fontSize: '0.875rem', fontWeight: active ? 600 : 400,
                            transition: 'all 0.2s',
                        }}>
                            <Icon size={18} />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* User footer */}
            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 32, height: 32, background: 'var(--color-teal)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                        CZ
                    </div>
                    <div>
                        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>Cristian Z.</p>
                        <p style={{ fontSize: '0.7rem', color: '#64748B' }}>Admin</p>
                    </div>
                </div>
                <LogOut size={16} color="#64748B" style={{ cursor: 'pointer' }} />
            </div>
        </aside>
    );
}
