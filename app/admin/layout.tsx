'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/infrastructure/supabase';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Bell, Loader2, LogOut } from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/productos': 'Gestión de Productos',
    '/admin/pedidos': 'Pedidos WhatsApp',
    '/admin/personalizaciones': 'Personalizaciones',
};

function AdminHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const title = PAGE_TITLES[pathname] ?? 'Admin';

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    return (
        <header style={{
            background: '#fff', borderBottom: '1px solid var(--color-border)',
            padding: '0 2rem', height: 64,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            position: 'sticky', top: 0, zIndex: 10,
        }}>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-navy)' }}>{title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={handleLogout} title="Cerrar sesión" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-stone)' }}>
                    <LogOut size={18} />
                </button>
                <div style={{ width: 1, height: 24, background: 'var(--color-border)' }} />
                <div style={{ width: 34, height: 34, background: 'var(--color-teal)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
                    A
                </div>
            </div>
        </header>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        // Permitir acceso libre a la página de login
        if (pathname === '/admin/login') {
            setLoading(false);
            return;
        }

        // Verificar sesión
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.replace('/admin/login');
            } else {
                setAuthenticated(true);
            }
            setLoading(false);
        };

        checkAuth();
    }, [pathname, router]);

    // Si es la página de login, renderizar sin layout
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    // Mostrar loading mientras se verifica autenticación
    if (loading) {
        return (
            <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', color: 'var(--color-teal)' }}>
                <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    // Si no está autenticado (y no es loading), no mostrar nada (el redirect se encarga)
    if (!authenticated) return null;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: 'var(--font-sans)' }}>
            <AdminSidebar />
            <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                <AdminHeader />
                <div style={{ flex: 1, padding: '2rem' }}>
                    {children}
                </div>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
