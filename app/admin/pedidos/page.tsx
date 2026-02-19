'use client';

import { useState } from 'react';
import { MessageCircle, ChevronDown } from 'lucide-react';
import { mockOrders } from '@/lib/infrastructure/mockRepository';
import { type Order, type OrderStatus, formatCOP } from '@/lib/domain/types';
import { generateWhatsAppLink } from '@/lib/application/generateWhatsAppLink';

const STATUSES: { value: OrderStatus; label: string; bg: string; color: string }[] = [
    { value: 'PENDING', label: 'Pendiente', bg: '#FFF3CD', color: '#856404' },
    { value: 'CONFIRMED', label: 'Confirmado', bg: '#D4EDDA', color: '#155724' },
    { value: 'IN_PROGRESS', label: 'En proceso', bg: '#CCE5FF', color: '#004085' },
    { value: 'SHIPPED', label: 'Enviado', bg: '#D1ECF1', color: '#0C5460' },
    { value: 'DELIVERED', label: 'Entregado', bg: '#D4EDDA', color: '#155724' },
];

const getStatus = (v: OrderStatus) => STATUSES.find(s => s.value === v)!;

export default function AdminPedidosPage() {
    const [orders, setOrders] = useState<Order[]>(mockOrders);
    const [activeFilter, setActiveFilter] = useState<OrderStatus | 'ALL'>('ALL');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const filtered = activeFilter === 'ALL'
        ? orders
        : orders.filter(o => o.status === activeFilter);

    const updateStatus = (id: string, status: OrderStatus) => {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        setOpenDropdown(null);
    };

    const formatDate = (d: Date) =>
        new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(d);

    return (
        <>
            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {[{ value: 'ALL', label: 'Todos', count: orders.length, bg: 'var(--color-navy)', color: '#fff' },
                ...STATUSES.map(s => ({ ...s, count: orders.filter(o => o.status === s.value).length }))
                ].map(s => (
                    <button key={s.value} onClick={() => setActiveFilter(s.value as OrderStatus | 'ALL')}
                        style={{
                            padding: '0.75rem 0.5rem', borderRadius: '0.6rem', border: 'none', cursor: 'pointer',
                            background: activeFilter === s.value ? s.bg : '#fff',
                            color: activeFilter === s.value ? s.color : 'var(--color-stone)',
                            boxShadow: '0 1px 6px rgba(15,23,42,0.07)',
                            transition: 'all 0.15s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                        }}>
                        <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>{s.count}</span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>{s.label}</span>
                    </button>
                ))}
            </div>

            {/* Tabla de pedidos */}
            <div style={{ background: '#fff', borderRadius: '0.75rem', boxShadow: '0 1px 8px rgba(15,23,42,0.06)', overflow: 'visible' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '2px solid var(--color-border)' }}>
                            {['ID', 'Cliente', 'Producto', 'Total', 'Estado', 'Fecha', 'Acción'].map(h => (
                                <th key={h} style={{ textAlign: 'left', padding: '0.85rem 1rem', fontSize: '0.75rem', color: 'var(--color-stone)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-stone)' }}>No hay pedidos en esta categoría</td></tr>
                        ) : filtered.map(order => {
                            const st = getStatus(order.status);
                            const waLink = generateWhatsAppLink(order.product, order.customization);
                            return (
                                <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    {/* ID */}
                                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--color-stone)', fontFamily: 'monospace' }}>
                                        {order.id}
                                    </td>

                                    {/* Cliente */}
                                    <td style={{ padding: '0.85rem 1rem' }}>
                                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '2px' }}>{order.customerName}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-stone)' }}>{order.customerPhone}</p>
                                    </td>

                                    {/* Producto */}
                                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: 'var(--color-navy)' }}>
                                        <p style={{ fontWeight: 500 }}>{order.product.name}</p>
                                        {order.customization.initials && (
                                            <p style={{ fontSize: '0.75rem', color: 'var(--color-stone)' }}>✦ Iniciales: {order.customization.initials}</p>
                                        )}
                                    </td>

                                    {/* Total */}
                                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--color-teal)', fontSize: '0.875rem' }}>
                                        {formatCOP(order.totalAmount)}
                                    </td>

                                    {/* Estado (dropdown) */}
                                    <td style={{ padding: '0.85rem 1rem', position: 'relative' }}>
                                        <button onClick={() => setOpenDropdown(openDropdown === order.id ? null : order.id)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '6px',
                                                background: st.bg, color: st.color,
                                                padding: '4px 12px', borderRadius: '9999px',
                                                border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700,
                                            }}>
                                            {st.label} <ChevronDown size={12} />
                                        </button>

                                        {openDropdown === order.id && (
                                            <div style={{
                                                position: 'absolute', top: '100%', left: 0, zIndex: 50,
                                                background: '#fff', borderRadius: '0.6rem',
                                                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                                                border: '1px solid var(--color-border)', minWidth: 160, overflow: 'hidden',
                                            }}>
                                                {STATUSES.map(s => (
                                                    <button key={s.value} onClick={() => updateStatus(order.id, s.value)}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', gap: '8px',
                                                            width: '100%', padding: '0.6rem 1rem', border: 'none',
                                                            background: order.status === s.value ? s.bg : 'transparent',
                                                            color: order.status === s.value ? s.color : 'var(--color-navy)',
                                                            cursor: 'pointer', fontSize: '0.825rem', fontWeight: order.status === s.value ? 700 : 400,
                                                            textAlign: 'left', transition: 'background 0.1s',
                                                        }}
                                                        onMouseEnter={e => !order.status.includes(s.value) && (e.currentTarget.style.background = '#F8FAFC')}
                                                        onMouseLeave={e => !order.status.includes(s.value) && (e.currentTarget.style.background = 'transparent')}
                                                    >
                                                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
                                                        {s.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </td>

                                    {/* Fecha */}
                                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--color-stone)', whiteSpace: 'nowrap' }}>
                                        {formatDate(order.createdAt)}
                                    </td>

                                    {/* WhatsApp */}
                                    <td style={{ padding: '0.85rem 1rem' }}>
                                        <a href={waLink} target="_blank" rel="noopener noreferrer"
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                background: 'var(--color-whatsapp)', color: '#fff',
                                                padding: '6px 12px', borderRadius: '9999px',
                                                fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none',
                                            }}>
                                            <MessageCircle size={13} /> Responder
                                        </a>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--color-border)', background: '#F8FAFC' }}>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-stone)' }}>
                        <strong>{filtered.length}</strong> pedidos · Total: <strong>{formatCOP(filtered.reduce((s, o) => s + o.totalAmount, 0))}</strong>
                    </p>
                </div>
            </div>
        </>
    );
}
