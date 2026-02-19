'use client';

import AdminSidebar from '@/components/admin/AdminSidebar';
import { Bell } from 'lucide-react';
import { usePathname } from 'next/navigation';

const PAGE_TITLES: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/productos': 'Gestión de Productos',
    '/admin/pedidos': 'Pedidos WhatsApp',
    '/admin/personalizaciones': 'Personalizaciones',
    '/admin/clientes': 'Clientes',
    '/admin/config': 'Configuración',
};

function AdminHeader() {
    const pathname = usePathname();
    const title = PAGE_TITLES[pathname] ?? 'Admin';

    return (
        <header style={{
            background: '#fff', borderBottom: '1px solid var(--color-border)',
            padding: '0 2rem', height: 64,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            position: 'sticky', top: 0, zIndex: 10,
        }}>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-navy)' }}>{title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ position: 'relative' }}>
                    <Bell size={20} color="var(--color-stone)" />
                    <span style={{
                        position: 'absolute', top: -6, right: -6,
                        background: '#E53935', color: '#fff',
                        width: 16, height: 16, borderRadius: '50%',
                        fontSize: '0.6rem', fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>3</span>
                </div>
                <div style={{ width: 34, height: 34, background: 'var(--color-teal)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
                    CZ
                </div>
            </div>
        </header>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: 'var(--font-sans)' }}>
            <AdminSidebar />
            <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                <AdminHeader />
                <div style={{ flex: 1, padding: '2rem' }}>
                    {children}
                </div>
            </div>
        </div>
    );
}
