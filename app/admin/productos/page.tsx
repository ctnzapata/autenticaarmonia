'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, AlertTriangle, X, Save, CheckCircle, Loader2, Image as ImageIcon, Upload } from 'lucide-react';
import { type Product, type Technique, formatCOP } from '@/lib/domain/types';
import { supabase } from '@/lib/infrastructure/supabase';

type FormData = {
    name: string;
    description: string;
    price: string;
    technique: Technique | '';
    category: string;
    images: string[];
    isCustomizable: boolean;
    isNew: boolean;
    inStock: boolean;
};

const EMPTY_FORM: FormData = {
    name: '', description: '', price: '', technique: '',
    category: '', images: [], isCustomizable: true, isNew: false, inStock: true,
};

const TECHNIQUE_COLORS: Record<Technique, { bg: string; color: string }> = {
    MIYUKI: { bg: '#E8F5E9', color: '#2E7D32' },
    CROCHET: { bg: '#E3F2FD', color: '#1565C0' },
    MIXED: { bg: '#FFF3E0', color: '#E65100' },
    PEYOTE: { bg: '#F3E5F5', color: '#7B1FA2' },
};

export default function AdminProductosPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [form, setForm] = useState<FormData>(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    // ─── Fetch products from API ─────────────────────────
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/products');
            if (!res.ok) throw new Error('Error cargando productos');
            const data: Product[] = await res.json();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setProducts(data.map((r: any) => ({
                id: String(r.id),
                slug: r.slug,
                name: r.name,
                description: r.description ?? '',
                price: r.price,
                technique: r.technique,
                category: r.category ?? '',
                images: r.images ?? [],
                colors: r.colors ?? [],
                sizes: r.sizes ?? [],
                rating: r.rating,
                reviewCount: r.review_count,
                isNew: r.is_new,
                isCustomizable: r.is_customizable,
                inStock: r.in_stock,
            })));
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    // ─── Modals ──────────────────────────────────────────
    const openCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setShowModal(true); };
    const openEdit = (p: Product) => {
        setForm({
            name: p.name, description: p.description, price: String(p.price),
            technique: p.technique, category: p.category, images: p.images,
            isCustomizable: p.isCustomizable, isNew: p.isNew ?? false, inStock: p.inStock,
        });
        setEditingId(p.id);
        setShowModal(true);
    };

    // ─── Upload Image ────────────────────────────────────
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setUploading(true);
        setError(null);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            console.log('Iniciando subida:', filePath);

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error('Error de Supabase Storage:', uploadError);
                throw new Error(`Storage Error: ${uploadError.message}`);
            }

            const { data } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            console.log('Imagen subida exitosamente, URL:', data.publicUrl);
            setForm(prev => ({ ...prev, images: [data.publicUrl, ...prev.images] }));
        } catch (error: any) {
            console.error('Error catch upload:', error);
            const msg = error.message || 'Error desconocido';
            alert(`FALLÓ LA SUBIDA: ${msg}\n\nAsegúrate de haber ejecutado el script SQL de storage.`);
            setError(`Error subiendo imagen: ${msg}`);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (indexToRemove: number) => {
        setForm(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
    };

    // ─── Save (Create / Update) ──────────────────────────
    const handleSave = async () => {
        if (!form.name || !form.price || !form.technique) return;
        setSaving(true);
        setError(null);
        try {
            const body = {
                name: form.name,
                description: form.description,
                price: Number(form.price),
                technique: form.technique,
                category: form.category,
                // Si no hay imágenes, usar un placeholder por defecto
                images: form.images.length > 0 ? form.images : [],
                isCustomizable: form.isCustomizable,
                isNew: form.isNew,
                inStock: form.inStock,
            };

            const res = editingId
                ? await fetch(`/api/products/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
                : await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error ?? 'Error guardando producto');
            }

            setSaved(true);
            setShowModal(false);
            await fetchProducts();
            setTimeout(() => setSaved(false), 2000);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error desconocido');
        } finally {
            setSaving(false);
        }
    };

    // ─── Delete ──────────────────────────────────────────
    const handleDelete = async () => {
        if (!deleteId) return;
        setSaving(true);
        setError(null);
        try {
            const res = await fetch(`/api/products/${deleteId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Error eliminando producto');
            setDeleteId(null);
            await fetchProducts();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error desconocido');
        } finally {
            setSaving(false);
        }
    };

    const TD: React.CSSProperties = { padding: '0.9rem 1rem', borderBottom: '1px solid #F1F5F9', fontSize: '0.875rem', color: '#334155', verticalAlign: 'middle' };
    const TH: React.CSSProperties = { padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid #E2E8F0' };

    return (
        <>
            {/* Action bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
                    <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar producto..."
                        style={{ width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, border: '1px solid #E2E8F0', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#0F172A', background: '#fff', outline: 'none' }} />
                </div>
                <button onClick={openCreate}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#00695C', color: '#fff', border: 'none', borderRadius: '0.5rem', padding: '0.6rem 1.25rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                    <Plus size={16} /> Nuevo Producto
                </button>
            </div>

            {/* Success feedback */}
            {saved && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: '0.5rem', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#166534', fontSize: '0.875rem', fontWeight: 600 }}>
                    <CheckCircle size={16} /> Guardado correctamente
                </div>
            )}

            {/* Error feedback */}
            {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '0.5rem', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#DC2626', fontSize: '0.875rem' }}>
                    <AlertTriangle size={16} /> {error}
                    <button onClick={() => setError(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626' }}><X size={14} /></button>
                </div>
            )}

            {/* Products table */}
            <div style={{ background: '#fff', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '3rem', color: '#94A3B8' }}>
                        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Cargando productos...
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#F8FAFC' }}>
                                <th style={TH}>Producto</th>
                                <th style={TH}>Técnica</th>
                                <th style={TH}>Categoría</th>
                                <th style={TH}>Precio</th>
                                <th style={TH}>Stock</th>
                                <th style={{ ...TH, textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={6} style={{ ...TD, textAlign: 'center', color: '#94A3B8', padding: '2.5rem' }}>
                                    {products.length === 0 ? 'Aún no hay productos. ¡Crea el primero!' : 'No hay resultados.'}
                                </td></tr>
                            ) : filtered.map(p => {
                                const tc = TECHNIQUE_COLORS[p.technique as Technique];
                                return (
                                    <tr key={p.id} style={{ transition: 'background 0.1s' }}
                                        onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                                        onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                                        <td style={TD}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                {p.images && p.images.length > 0 ? (
                                                    <img src={p.images[0]} alt="" style={{ width: 40, height: 40, borderRadius: '6px', objectFit: 'cover', background: '#f1f5f9' }} />
                                                ) : (
                                                    <div style={{ width: 40, height: 40, borderRadius: '6px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <ImageIcon size={16} color="#cbd5e1" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div style={{ fontWeight: 600, color: '#0F172A', marginBottom: '2px' }}>{p.name}</div>
                                                    <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{p.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={TD}>
                                            <span style={{ padding: '3px 10px', borderRadius: '9999px', background: tc.bg, color: tc.color, fontSize: '0.75rem', fontWeight: 700 }}>
                                                {p.technique}
                                            </span>
                                        </td>
                                        <td style={TD}>{p.category || '—'}</td>
                                        <td style={{ ...TD, fontWeight: 700, color: '#00695C' }}>{formatCOP(p.price)}</td>
                                        <td style={TD}>
                                            <span style={{ padding: '3px 10px', borderRadius: '9999px', background: p.inStock ? '#DCFCE7' : '#FEE2E2', color: p.inStock ? '#166534' : '#DC2626', fontSize: '0.75rem', fontWeight: 700 }}>
                                                {p.inStock ? 'En stock' : 'Sin stock'}
                                            </span>
                                        </td>
                                        <td style={{ ...TD, textAlign: 'right' }}>
                                            <button onClick={() => openEdit(p)} style={{ background: '#EFF6FF', border: 'none', borderRadius: '0.4rem', padding: '6px 10px', cursor: 'pointer', color: '#1D4ED8', marginRight: '6px' }}>
                                                <Pencil size={14} />
                                            </button>
                                            <button onClick={() => setDeleteId(p.id)} style={{ background: '#FEF2F2', border: 'none', borderRadius: '0.4rem', padding: '6px 10px', cursor: 'pointer', color: '#DC2626' }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Create / Edit Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ background: '#fff', borderRadius: '1.25rem', width: '100%', maxWidth: 520, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', borderBottom: '1px solid #F1F5F9' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={20} /></button>
                        </div>

                        <div style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
                            {/* Imágenes Upload */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Imágenes</label>

                                {/* Lista de imágenes subidas */}
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                                    {form.images.map((img, idx) => (
                                        <div key={idx} style={{ position: 'relative', width: 64, height: 64 }}>
                                            <img src={img} alt={`img-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
                                            <button onClick={() => removeImage(idx)} style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff', borderRadius: '50%', width: 18, height: 18, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Botón de subida */}
                                    <label style={{
                                        width: 64, height: 64, borderRadius: '6px', border: '2px dashed #cbd5e1',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: uploading ? 'not-allowed' : 'pointer',
                                        color: '#cbd5e1', background: uploading ? '#f8fafc' : 'transparent'
                                    }}>
                                        {uploading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={20} />}
                                        <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} style={{ display: 'none' }} />
                                    </label>
                                </div>

                                {/* Mensajes de estado explícitos */}
                                {uploading && <p style={{ fontSize: '0.75rem', color: '#3b82f6' }}>Subiendo imagen... por favor espera.</p>}
                                {error && error.includes('subiendo imagen') && (
                                    <div style={{ padding: '8px', background: '#fee2e2', borderRadius: '4px', marginTop: '4px' }}>
                                        <p style={{ fontSize: '0.8rem', color: '#dc2626', fontWeight: 600 }}>Error de subida:</p>
                                        <p style={{ fontSize: '0.75rem', color: '#b91c1c' }}>{error}</p>
                                        <p style={{ fontSize: '0.7rem', color: '#7f1d1d', marginTop: '4px' }}>Revisa la consola (F12) para más detalles.</p>
                                    </div>
                                )}
                                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Sube imágenes JPG o PNG.</p>
                            </div>

                            {/* Otros campos */}
                            {([
                                { label: 'Nombre *', key: 'name', placeholder: 'Ej: Pulsera Miyuki Estrella', type: 'text' },
                                { label: 'Precio (COP) *', key: 'price', placeholder: 'Ej: 45000', type: 'number' },
                                { label: 'Categoría', key: 'category', placeholder: 'Ej: Pulseras', type: 'text' },
                            ] as { label: string; key: keyof FormData; placeholder: string; type: string }[]).map(f => (
                                <div key={f.key}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>{f.label}</label>
                                    <input type={f.type} value={form[f.key] as string}
                                        onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                                        placeholder={f.placeholder}
                                        style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none' }} />
                                </div>
                            ))}

                            {/* Técnica */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Técnica *</label>
                                <select value={form.technique}
                                    onChange={e => setForm(prev => ({ ...prev, technique: e.target.value as Technique }))}
                                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none', background: '#fff' }}>
                                    <option value="">Seleccionar...</option>
                                    {(['MIYUKI', 'CROCHET', 'MIXED', 'PEYOTE'] as Technique[]).map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            {/* Descripción */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Descripción</label>
                                <textarea value={form.description}
                                    onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                                    rows={3} placeholder="Describe el producto..."
                                    style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none', resize: 'vertical' }} />
                            </div>

                            {/* Toggles */}
                            {(['inStock', 'isCustomizable', 'isNew'] as (keyof FormData)[]).map(key => {
                                const labels: Record<string, string> = { inStock: '✅ En stock', isCustomizable: '⬡ Personalizable', isNew: '✦ Nuevo' };
                                return (
                                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', color: '#334155' }}>
                                        <input type="checkbox" checked={form[key] as boolean}
                                            onChange={e => setForm(prev => ({ ...prev, [key]: e.target.checked }))} />
                                        {labels[key]}
                                    </label>
                                );
                            })}

                            {error && <p style={{ color: '#DC2626', fontSize: '0.8rem' }}>{error}</p>}
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', padding: '1rem 1.5rem', borderTop: '1px solid #F1F5F9', justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowModal(false)}
                                style={{ padding: '8px 20px', border: '1px solid #E2E8F0', borderRadius: '0.5rem', background: '#fff', color: '#64748B', fontSize: '0.875rem', cursor: 'pointer' }}>
                                Cancelar
                            </button>
                            <button onClick={handleSave} disabled={saving || uploading || !form.name || !form.price || !form.technique}
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 20px', border: 'none', borderRadius: '0.5rem', background: '#00695C', color: '#fff', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', opacity: (saving || uploading) ? 0.7 : 1 }}>
                                {saving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={15} />}
                                {uploading ? 'Subiendo...' : (editingId ? 'Actualizar' : 'Crear Producto')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ background: '#fff', borderRadius: '1rem', padding: '2rem', maxWidth: 400, width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.2)', textAlign: 'center' }}>
                        <AlertTriangle size={40} color="#DC2626" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>¿Eliminar producto?</h3>
                        <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '1.5rem' }}>Esta acción no se puede deshacer.</p>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                            <button onClick={() => setDeleteId(null)}
                                style={{ padding: '8px 20px', border: '1px solid #E2E8F0', borderRadius: '0.5rem', background: '#fff', color: '#64748B', fontSize: '0.875rem', cursor: 'pointer' }}>
                                Cancelar
                            </button>
                            <button onClick={handleDelete} disabled={saving}
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 20px', border: 'none', borderRadius: '0.5rem', background: '#DC2626', color: '#fff', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                                {saving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={15} />}
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
    );
}
