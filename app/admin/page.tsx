// Dashboard page — solo contenido (sidebar + topbar vienen del layout)
import { mockOrders, getProducts } from '@/lib/infrastructure/mockRepository';
import { formatCOP } from '@/lib/domain/types';
import Link from 'next/link';
import { TrendingUp, Package, AlertCircle } from 'lucide-react';

const STATUS_CONFIG = {
    PENDING: { label: 'Pendiente', bg: '#FFF3CD', color: '#856404' },
    CONFIRMED: { label: 'Confirmado', bg: '#D4EDDA', color: '#155724' },
    IN_PROGRESS: { label: 'En proceso', bg: '#CCE5FF', color: '#004085' },
    SHIPPED: { label: 'Enviado', bg: '#D1ECF1', color: '#0C5460' },
    DELIVERED: { label: 'Entregado', bg: '#D4EDDA', color: '#155724' },
};

export default function AdminDashboardPage() {
    const products = getProducts();
    const orders = mockOrders;
    const pendingOrders = orders.filter(o => o.status === 'PENDING').length;

    const kpis = [
        { label: 'Pedidos Hoy', value: '12', sub: '↑ +3 vs ayer', color: 'var(--color-teal)', icon: TrendingUp },
        { label: 'Ingresos del Mes', value: formatCOP(1245000), sub: '↑ +18%', color: 'var(--color-gold)', icon: TrendingUp },
        { label: 'Productos Activos', value: `${products.length}`, sub: 'en catálogo', color: 'var(--color-teal)', icon: Package },
        { label: 'Personalizaciones Pendientes', value: `${pendingOrders}`, sub: '⚠ atención', color: '#E65100', icon: AlertCircle },
    ];

    return (
        <>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                {kpis.map(({ label, value, sub, color, icon: Icon }) => (
                    <div key={label} style={{ background: '#fff', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 8px rgba(15,23,42,0.06)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-stone)', fontWeight: 500 }}>{label}</p>
                            <div style={{ background: `${color}18`, padding: '6px', borderRadius: '0.5rem' }}>
                                <Icon size={16} color={color} />
                            </div>
                        </div>
                        <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '4px' }}>{value}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-stone)' }}>{sub}</p>
                    </div>
                ))}
            </div>

            {/* Row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                {/* Chart */}
                <div style={{ background: '#fff', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 8px rgba(15,23,42,0.06)' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '1.25rem' }}>Pedidos por Día</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: 120 }}>
                        {[
                            { day: 'Lun', val: 40 }, { day: 'Mar', val: 65 }, { day: 'Mié', val: 50 },
                            { day: 'Jue', val: 80 }, { day: 'Vie', val: 70 }, { day: 'Sáb', val: 100 }, { day: 'Dom', val: 60 },
                        ].map(({ day, val }) => (
                            <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                <div style={{ width: '100%', height: `${val}%`, background: 'var(--color-teal)', borderRadius: '4px 4px 0 0', opacity: 0.85 }} />
                                <span style={{ fontSize: '0.7rem', color: 'var(--color-stone)' }}>{day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Orders */}
                <div style={{ background: '#fff', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 8px rgba(15,23,42,0.06)' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '1.25rem' }}>Pedidos Recientes</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {orders.map(o => {
                            const st = STATUS_CONFIG[o.status];
                            return (
                                <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--color-border)' }}>
                                    <div>
                                        <p style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--color-navy)' }}>{o.customerName}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-stone)' }}>{o.product.name} · {formatCOP(o.totalAmount)}</p>
                                    </div>
                                    <span style={{ background: st.bg, color: st.color, padding: '2px 10px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700 }}>
                                        {st.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <Link href="/admin/pedidos" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--color-teal)', textDecoration: 'none', fontWeight: 600 }}>
                        Ver todos los pedidos →
                    </Link>
                </div>
            </div>

            {/* Top Products */}
            <div style={{ background: '#fff', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 8px rgba(15,23,42,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-navy)' }}>Productos más Vendidos</h3>
                    <Link href="/admin/productos" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.78rem' }}>
                        Gestionar Productos
                    </Link>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                            {['#', 'Producto', 'Técnica', 'Precio', 'Popularidad'].map(h => (
                                <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontSize: '0.75rem', color: 'var(--color-stone)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {products.slice(0, 5).map((p, i) => {
                            const techColor = p.technique === 'MIYUKI' ? 'var(--color-teal)' : p.technique === 'CROCHET' ? 'var(--color-gold)' : 'var(--color-navy)';
                            return (
                                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '0.75rem', fontSize: '0.825rem', color: 'var(--color-stone)', fontWeight: 700 }}>{i + 1}</td>
                                    <td style={{ padding: '0.75rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy)' }}>{p.name}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <span style={{ background: techColor, color: p.technique === 'CROCHET' ? 'var(--color-navy)' : '#fff', padding: '2px 10px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>
                                            {p.technique}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: 'var(--color-teal)', fontWeight: 700 }}>{formatCOP(p.price)}</td>
                                    <td style={{ padding: '0.75rem', minWidth: 120 }}>
                                        <div style={{ height: 8, background: 'var(--color-border)', borderRadius: 4 }}>
                                            <div style={{ height: '100%', background: 'var(--color-teal)', borderRadius: 4, width: `${(p.rating / 5) * 100}%` }} />
                                        </div>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--color-stone)' }}>★ {p.rating}</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
}
