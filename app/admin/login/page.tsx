'use client';

import { useState } from 'react';
import { supabase } from '@/lib/infrastructure/supabase';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            router.push('/admin');
        } catch (err: any) {
            setError(err.message || 'Error iniciando sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh', background: 'var(--color-navy)', padding: '1rem'
        }}>
            <div className="card" style={{
                width: '100%', maxWidth: 400, padding: '2.5rem',
                borderRadius: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: 48, height: 48, background: 'var(--color-teal)', borderRadius: '1rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
                    }}>
                        <Lock color="#fff" size={24} />
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                        Admin Panel
                    </h1>
                    <p style={{ color: 'var(--color-stone)', fontSize: '0.9rem' }}>
                        Auténtica Armonía
                    </p>
                </div>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '6px' }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@autenticaarmonia.com"
                            required
                            style={{
                                width: '100%', padding: '10px 14px', borderRadius: '0.5rem',
                                border: '1px solid var(--color-border)', outline: 'none',
                                fontSize: '0.95rem'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '6px' }}>
                            Contraseña
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={{
                                    width: '100%', padding: '10px 14px', borderRadius: '0.5rem',
                                    border: '1px solid var(--color-border)', outline: 'none',
                                    fontSize: '0.95rem', paddingRight: 40
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-stone)'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div style={{
                            padding: '0.75rem', background: '#FEF2F2', border: '1px solid #FECACA',
                            borderRadius: '0.5rem', color: '#DC2626', fontSize: '0.85rem', marginBottom: '1.5rem',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn"
                        style={{
                            width: '100%', background: 'var(--color-teal)', color: '#fff',
                            justifyContent: 'center', opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading && <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />}
                        {loading ? 'Entrando...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--color-stone-light)' }}>
                    Acceso restringido a personal autorizado.
                </p>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
