'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, AlertTriangle, X, Save, CheckCircle } from 'lucide-react';
import { mockProducts } from '@/lib/infrastructure/mockRepository';
import { type Product, type Technique, formatCOP } from '@/lib/domain/types';

// ─── Tipos para el formulario ────────────────────────────────
type FormData = {
    name: string;
    description: string;
    technique: Technique;
    category: string;
    price: string;
    inStock: boolean;
    isNew: boolean;
    isCustomizable: boolean;
};

const EMPTY_FORM: FormData = {
    name: '', description: '', technique: 'MIYUKI', category: '',
    price: '', inStock: true, isNew: false, isCustomizable: true,
};

const TECHNIQUE_COLORS: Record<Technique, { bg: string; color: string }> = {
    MIYUKI: { bg: 'var(--color-teal)', color: '#fff' },
    CROCHET: { bg: 'var(--color-gold)', color: 'var(--color-navy)' },
    MIXED: { bg: 'var(--color-navy)', color: '#fff' },
    PEYOTE: { bg: '#7B1FA2', color: '#fff' },
};

// ─── Componente Principal ────────────────────────────────────
export default function AdminProductosPage() {
    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [form, setForm] = useState<FormData>(EMPTY_FORM);
    const [saved, setSaved] = useState(false);

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.technique.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

    // ── Abrir modal crear ──
    const openCreate = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setShowModal(true);
    };

    // ── Abrir modal editar ──
    const openEdit = (p: Product) => {
        setEditingId(p.id);
        setForm({
            name: p.name, description: p.description,
            technique: p.technique, category: p.category,
            price: String(p.price), inStock: p.inStock,
            isNew: p.isNew ?? false, isCustomizable: p.isCustomizable,
        });
        setShowModal(true);
    };

    // ── Guardar (crear o editar) ──
    const handleSave = () => {
        if (!form.name || !form.price) return;

        if (editingId) {
            setProducts(prev => prev.map(p => p.id === editingId ? {
                ...p, name: form.name, description: form.description,
                technique: form.technique, category: form.category,
                price: Number(form.price), inStock: form.inStock,
                isNew: form.isNew, isCustomizable: form.isCustomizable,
            } : p));
        } else {
            const newProduct: Product = {
                id: `${Date.now()}`,
                slug: form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                name: form.name, description: form.description,
                technique: form.technique, category: form.category,
                price: Number(form.price), images: [],
                colors: [], sizes: [], rating: 5.0, reviewCount: 0,
                isNew: form.isNew, isCustomizable: form.isCustomizable, inStock: form.inStock,
            };
            setProducts(prev => [newProduct, ...prev]);
        }
        setShowModal(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    // ── Eliminar ──
    const handleDelete = () => {
        if (!deleteId) return;
        setProducts(prev => prev.filter(p => p.id !== deleteId));
        setDeleteId(null);
    };

    return (
        <>
            {/* ── Barra de acciones ── */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Búsqueda */}
                <div style={{ position: 'relative', flex: 1, minWidth: 220, maxWidth: 360 }}>
                    <Search size={15} color="var(--color-stone)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar producto..."
                        style={{
                            width: '100%', paddingLeft: 34, paddingRight: 12, paddingTop: 9, paddingBottom: 9,
                            border: '1px solid var(--color-border)', borderRadius: '9999px',
                            fontFamily: 'var(--font-sans)', fontSize: '0.875rem', outline: 'none',
                            background: '#fff',
                        }}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {saved && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#155724', background: '#D4EDDA', padding: '6px 14px', borderRadius: '9999px', fontSize: '0.82rem', fontWeight: 600 }}>
                            <CheckCircle size={14} /> Guardado correctamente
                        </div>
                    )}
                    <button onClick={openCreate} className="btn btn-primary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.875rem' }}>
                        <Plus size={16} /> Agregar Producto
                    </button>
                </div>
            </div>

            {/* ── Tabla ── */}
            <div style={{ background: '#fff', borderRadius: '0.75rem', boxShadow: '0 1px 8px rgba(15,23,42,0.06)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '2px solid var(--color-border)' }}>
                            {['Producto', 'Técnica', 'Categoría', 'Precio', 'Stock', 'Personalizable', 'Acciones'].map(h => (
                                <th key={h} style={{ textAlign: 'left', padding: '0.85rem 1rem', fontSize: '0.75rem', color: 'var(--color-stone)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-stone)', fontSize: '0.9rem' }}>
                                    No se encontraron productos
                                </td>
                            </tr>
                        ) : filtered.map(p => {
                            const tech = TECHNIQUE_COLORS[p.technique];
                            return (
                                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.15s' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                >
                                    {/* Producto */}
                                    <td style={{ padding: '0.85rem 1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: 42, height: 42, borderRadius: '0.5rem',
                                                background: 'linear-gradient(135deg, var(--color-aqua), var(--color-aqua-mid))',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '1rem', color: 'var(--color-teal-dark)', flexShrink: 0,
                                            }}>✦</div>
                                            <div>
                                                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '2px' }}>{p.name}</p>
                                                {p.isNew && <span style={{ fontSize: '0.65rem', background: '#E53935', color: '#fff', padding: '1px 6px', borderRadius: '9999px', fontWeight: 700 }}>NUEVO</span>}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Técnica */}
                                    <td style={{ padding: '0.85rem 1rem' }}>
                                        <span style={{ background: tech.bg, color: tech.color, padding: '3px 10px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700 }}>
                                            {p.technique}
                                        </span>
                                    </td>

                                    {/* Categoría */}
                                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: 'var(--color-stone)' }}>
                                        {p.category || '—'}
                                    </td>

                                    {/* Precio */}
                                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-teal)' }}>
                                        {formatCOP(p.price)}
                                    </td>

                                    {/* Stock */}
                                    <td style={{ padding: '0.85rem 1rem' }}>
                                        <span style={{
                                            background: p.inStock ? '#D4EDDA' : '#F8D7DA',
                                            color: p.inStock ? '#155724' : '#721C24',
                                            padding: '3px 10px', borderRadius: '9999px',
                                            fontSize: '0.72rem', fontWeight: 700,
                                        }}>
                                            {p.inStock ? 'Disponible' : 'Agotado'}
                                        </span>
                                    </td>

                                    {/* Personalizable */}
                                    <td style={{ padding: '0.85rem 1rem' }}>
                                        <span style={{
                                            background: p.isCustomizable ? 'rgba(0,105,92,0.1)' : 'transparent',
                                            color: p.isCustomizable ? 'var(--color-teal)' : 'var(--color-stone)',
                                            padding: '3px 10px', borderRadius: '9999px',
                                            fontSize: '0.72rem', fontWeight: 700,
                                        }}>
                                            {p.isCustomizable ? '✓ Sí' : '✗ No'}
                                        </span>
                                    </td>

                                    {/* Acciones */}
                                    <td style={{ padding: '0.85rem 1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                                            <button onClick={() => openEdit(p)}
                                                title="Editar"
                                                style={{ background: 'rgba(0,105,92,0.08)', border: 'none', borderRadius: '0.4rem', padding: '6px 10px', cursor: 'pointer', color: 'var(--color-teal)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                                                <Pencil size={13} /> Editar
                                            </button>
                                            <button onClick={() => setDeleteId(p.id)}
                                                title="Eliminar"
                                                style={{ background: 'rgba(229,57,53,0.08)', border: 'none', borderRadius: '0.4rem', padding: '6px 10px', cursor: 'pointer', color: '#E53935', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                                                <Trash2 size={13} /> Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Footer de la tabla */}
                <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--color-border)', background: '#F8FAFC' }}>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-stone)' }}>
                        Mostrando <strong>{filtered.length}</strong> de <strong>{products.length}</strong> productos
                    </p>
                </div>
            </div>

            {/* ═══════════════════════════════════
          MODAL CREAR / EDITAR
          ═══════════════════════════════════ */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ background: '#fff', borderRadius: '1rem', width: '100%', maxWidth: 560, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.25)' }}>
                        {/* Header modal */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-navy)' }}>
                                {editingId ? 'Editar Producto' : 'Agregar Producto'}
                            </h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-stone)' }}>
                                <X size={22} />
                            </button>
                        </div>

                        {/* Form */}
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                            {/* Nombre */}
                            <div>
                                <label style={labelStyle}>Nombre del producto *</label>
                                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Ej: Pulsera Miyuki Mandala" style={inputStyle} />
                            </div>

                            {/* Descripción */}
                            <div>
                                <label style={labelStyle}>Descripción</label>
                                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    placeholder="Describe el producto y su historia..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                            </div>

                            {/* Técnica + Categoría */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={labelStyle}>Técnica *</label>
                                    <select value={form.technique} onChange={e => setForm(f => ({ ...f, technique: e.target.value as Technique }))} style={inputStyle}>
                                        <option value="MIYUKI">Miyuki Delica</option>
                                        <option value="CROCHET">Crochet</option>
                                        <option value="MIXED">Técnica Mixta</option>
                                        <option value="PEYOTE">Peyote</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Categoría</label>
                                    <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                        placeholder="Ej: Pulseras" style={inputStyle} />
                                </div>
                            </div>

                            {/* Precio */}
                            <div>
                                <label style={labelStyle}>Precio (COP) *</label>
                                <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                                    placeholder="45000" min={0} style={inputStyle} />
                            </div>

                            {/* Toggles */}
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', padding: '0.5rem 0' }}>
                                {[
                                    { key: 'inStock', label: '✓ En stock', checked: form.inStock },
                                    { key: 'isCustomizable', label: '✦ Personalizable', checked: form.isCustomizable },
                                    { key: 'isNew', label: '🆕 Producto nuevo', checked: form.isNew },
                                ].map(({ key, label, checked }) => (
                                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-navy)' }}>
                                        <input type="checkbox" checked={checked}
                                            onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                                            style={{ width: 16, height: 16, accentColor: 'var(--color-teal)' }} />
                                        {label}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Footer modal */}
                        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowModal(false)} className="btn btn-outline" style={{ padding: '0.55rem 1.25rem', fontSize: '0.875rem' }}>
                                Cancelar
                            </button>
                            <button onClick={handleSave} className="btn btn-primary" style={{ padding: '0.55rem 1.5rem', fontSize: '0.875rem' }}>
                                <Save size={15} /> {editingId ? 'Guardar cambios' : 'Crear producto'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════
          MODAL CONFIRMAR ELIMINACIÓN
          ═══════════════════════════════════ */}
            {deleteId && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ background: '#fff', borderRadius: '1rem', width: '100%', maxWidth: 420, padding: '2rem', boxShadow: '0 24px 80px rgba(0,0,0,0.25)', textAlign: 'center' }}>
                        <div style={{ width: 56, height: 56, background: '#FFF0F0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                            <AlertTriangle size={26} color="#E53935" />
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                            ¿Eliminar producto?
                        </h2>
                        <p style={{ color: 'var(--color-stone)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
                            Esta acción no se puede deshacer. El producto será eliminado permanentemente del catálogo.
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                            <button onClick={() => setDeleteId(null)} className="btn btn-outline" style={{ padding: '0.6rem 1.5rem' }}>
                                Cancelar
                            </button>
                            <button onClick={handleDelete} style={{
                                padding: '0.6rem 1.5rem', borderRadius: '9999px',
                                background: '#E53935', color: '#fff',
                                border: 'none', fontWeight: 600, cursor: 'pointer',
                                fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px',
                            }}>
                                <Trash2 size={15} /> Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// ─── Estilos compartidos del formulario ──────────────────────
const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.825rem', fontWeight: 600,
    color: 'var(--color-navy)', marginBottom: '6px',
};

const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px',
    border: '1px solid var(--color-border)', borderRadius: '0.5rem',
    fontFamily: 'var(--font-sans)', fontSize: '0.875rem',
    color: 'var(--color-navy)', outline: 'none', background: '#fff',
    boxSizing: 'border-box',
};
