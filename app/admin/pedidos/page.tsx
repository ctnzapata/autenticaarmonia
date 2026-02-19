'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageCircle, ChevronDown, Loader2, AlertTriangle } from 'lucide-react';
import { type OrderStatus, formatCOP } from '@/lib/domain/types';

interface DBOrder {
    id: number;
    customer_name: string;
    customer_phone: string;
    product: { id: number; name: string; slug: string; price: number; technique: string } | null;
    customization: Record<string, unknown>;
    total_amount: number;
    status: OrderStatus;
    notes: string | null;
    created_at: string;
}

const STATUSES: { value: OrderStatus; label: string; bg: string; color: string }[] = [
    { value: 'PENDING', label: 'Pendiente', bg: '#FEF3C7', color: '#92400E' },
    { value: 'CONFIRMED', label: 'Confirmado', bg: '#DBEAFE', color: '#1E40AF' },
    { value: 'IN_PROGRESS', label: 'En proceso', bg: '#F3E8FF', color: '#6B21A8' },
    { value: 'SHIPPED', label: 'Enviado', bg: '#E0F2FE', color: '#0369A1' },
    { value: 'DELIVERED', label: 'Entregado', bg: '#DCFCE7', color: '#14532D' },
];
const getStatus = (v: OrderStatus) => STATUSES.find(s => s.value === v)!;

const formatDate = (d: string) =>
    new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(d));

export default function AdminPedidosPage() {
    const [orders, setOrders] = useState<DBOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<OrderStatus | 'ALL'>('ALL');
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    // ─── Fetch orders from API ────────────────────────────
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/orders');
            if (!res.ok) throw new Error('Error cargando pedidos');
            const data: DBOrder[] = await res.json();
            setOrders(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    // ─── Update order status ──────────────────────────────
    const updateStatus = async (id: number, status: OrderStatus) => {
        setOpenDropdown(null);
        setError(null);
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error('Error actualizando estado');
            // Update local state immediately (optimistic)
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error actualizando');
            fetchOrders(); // Revert: reload from server
        }
    };

    const filtered = activeFilter === 'ALL' ? orders : orders.filter(o => o.status === activeFilter);

    const TD: React.CSSProperties = { padding: '0.9rem 1rem', borderBottom: '1px solid #F1F5F9', fontSize: '0.875rem', color: '#334155', verticalAlign: 'middle' };
    const TH: React.CSSProperties = { padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid #E2E8F0' };

    return (
        <>
            {/* Stats / Filter row */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {[{ value: 'ALL' as const, label: 'Todos', bg: '#F1F5F9', color: '#475569' }, ...STATUSES].map(s => {
                    const count = s.value === 'ALL' ? orders.length : orders.filter(o => o.status === s.value).length;
                    return (
                        <button key={s.value} onClick={() => setActiveFilter(s.value)}
                            style={{
                                padding: '6px 16px', borderRadius: '9999px', cursor: 'pointer',
                                border: `2px solid ${activeFilter === s.value ? s.color : 'transparent'}`,
                                background: activeFilter === s.value ? s.bg : '#F8FAFC',
                                color: activeFilter === s.value ? s.color : '#64748B',
                                fontSize: '0.825rem', fontWeight: 600, transition: 'all 0.15s',
                            }}>
                            {s.label} <span style={{ opacity: 0.8 }}>({count})</span>
                        </button>
                    );
                })}
            </div>

            {/* Error */}
            {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FEE2E2', borderRadius: '0.5rem', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#DC2626', fontSize: '0.875rem' }}>
                    <AlertTriangle size={16} /> {error}
                </div>
            )}

            {/* Orders table */}
            <div style={{ background: '#fff', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', position: 'relative' }}>
                {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '3rem', color: '#94A3B8' }}>
                        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Cargando pedidos...
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#F8FAFC' }}>
                                <th style={TH}>#</th>
                                <th style={TH}>Cliente</th>
                                <th style={TH}>Producto</th>
                                <th style={TH}>Total</th>
                                <th style={TH}>Estado</th>
                                <th style={TH}>Fecha</th>
                                <th style={{ ...TH, textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={7} style={{ ...TD, textAlign: 'center', color: '#94A3B8', padding: '3rem' }}>
                                    {orders.length === 0 ? 'Aún no hay pedidos recibidos.' : 'No hay pedidos con este estado.'}
                                </td></tr>
                            ) : filtered.map(order => {
                                const st = getStatus(order.status);
                                const whatsapp = `https://wa.me/${order.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${order.customer_name}, tu pedido de "${order.product?.name ?? 'producto'}" está ${st.label.toLowerCase()}.`)}`;
                                return (
                                    <tr key={order.id}>
                                        <td style={{ ...TD, fontWeight: 700, color: '#94A3B8', fontSize: '0.75rem' }}>#{order.id}</td>
                                        <td style={TD}>
                                            <div style={{ fontWeight: 600, color: '#0F172A' }}>{order.customer_name}</div>
                                            <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{order.customer_phone}</div>
                                        </td>
                                        <td style={TD}>{order.product?.name ?? '—'}</td>
                                        <td style={{ ...TD, fontWeight: 700, color: '#00695C' }}>{formatCOP(order.total_amount)}</td>
                                        <td style={{ ...TD, position: 'relative' }}>
                                            <button onClick={() => setOpenDropdown(openDropdown === order.id ? null : order.id)}
                                                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '9999px', background: st.bg, color: st.color, border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}>
                                                {st.label} <ChevronDown size={12} />
                                            </button>
                                            {openDropdown === order.id && (
                                                <div style={{ position: 'absolute', top: '100%', left: '1rem', zIndex: 20, background: '#fff', borderRadius: '0.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', overflow: 'hidden', minWidth: 160 }}>
                                                    {STATUSES.map(s => (
                                                        <button key={s.value} onClick={() => updateStatus(order.id, s.value)}
                                                            style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 14px', background: s.value === order.status ? s.bg : '#fff', color: s.value === order.status ? s.color : '#334155', fontSize: '0.825rem', fontWeight: s.value === order.status ? 700 : 400, border: 'none', cursor: 'pointer' }}>
                                                            {s.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ ...TD, fontSize: '0.78rem', color: '#94A3B8' }}>{formatDate(order.created_at)}</td>
                                        <td style={{ ...TD, textAlign: 'right' }}>
                                            <a href={whatsapp} target="_blank" rel="noopener noreferrer"
                                                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 12px', background: '#25D366', color: '#fff', borderRadius: '0.4rem', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none' }}>
                                                <MessageCircle size={13} /> Responder
                                            </a>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Total revenue */}
            {!loading && filtered.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <div style={{ background: '#fff', borderRadius: '0.75rem', padding: '0.75rem 1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', fontSize: '0.875rem', color: '#64748B' }}>
                        Total ({filtered.length} pedidos):{' '}
                        <strong style={{ color: '#00695C', fontSize: '1rem' }}>
                            {formatCOP(filtered.reduce((sum, o) => sum + o.total_amount, 0))}
                        </strong>
                    </div>
                </div>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
    );
}
