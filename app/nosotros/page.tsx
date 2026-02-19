import Link from 'next/link';
import { Heart, Globe, Users, Award } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

export const metadata = {
    title: 'Nuestra Historia | Auténtica Armonía',
    description: 'Conoce la historia detrás de Auténtica Armonía, nuestra misión artesanal y el amor por el tejido en Medellín.',
};

export default function NosotrosPage() {
    return (
        <div style={{ background: '#fff', paddingBottom: '6rem' }}>
            {/* Hero Image */}
            <div style={{ height: '60vh', minHeight: 400, position: 'relative', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(rgba(15,23,42,0.4), rgba(15,23,42,0.7))',
                    zIndex: 10
                }} />
                <FadeIn style={{ width: '100%', height: '100%' }}>
                    {/* Placeholder for workshop image - using a gradient for now */}
                    <div style={{
                        width: '100%', height: '100%',
                        background: 'linear-gradient(135deg, var(--color-teal) 0%, var(--color-navy) 100%)',
                    }} />
                </FadeIn>
                <div className="container-brand" style={{
                    position: 'absolute', inset: 0, zIndex: 20,
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center',
                    color: '#fff'
                }}>
                    <FadeIn direction="up" delay={0.2}>
                        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 700, marginBottom: '1rem' }}>
                            Nuestra Esencia
                        </h1>
                        <p style={{ fontSize: '1.25rem', maxWidth: 600, margin: '0 auto', opacity: 0.9 }}>
                            Más que accesorios, tejemos historias, intenciones y buena energía.
                        </p>
                    </FadeIn>
                </div>
            </div>

            {/* Story */}
            <section style={{ padding: '6rem 0' }}>
                <div className="container-brand" style={{ maxWidth: 800, margin: '0 auto' }}>
                    <FadeIn>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '2rem', textAlign: 'center' }}>
                            El Origen
                        </h2>
                        <div style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--color-stone)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <p>
                                <strong>Auténtica Armonía</strong> nació en Medellín de una pasión profunda por lo hecho a mano. Lo que comenzó como un pasatiempo terapéutico entre hilos y cuentas, se transformó en una forma de expresión artística.
                            </p>
                            <p>
                                Creemos que en un mundo de producción masiva, el verdadero lujo está en el <strong>tiempo, la dedicación y el detalle</strong>. Cada pulsera Miyuki y cada accesorio en crochet cuenta una historia diferente: la tuya.
                            </p>
                            <div style={{ borderLeft: '4px solid var(--color-gold)', paddingLeft: '1.5rem', fontStyle: 'italic', color: 'var(--color-navy)', margin: '1rem 0' }}>
                                "No vendemos solo accesorios; entregamos piezas cargadas de intención, paciencia y amor por el oficio."
                            </div>
                            <p>
                                Hoy, somos un pequeño taller artesanal comprometido con mantener vivas las técnicas ancestrales, fusionándolas con diseños contemporáneos para la mujer moderna que valora la autenticidad.
                            </p>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* Values */}
            <section style={{ background: '#F8FAFC', padding: '6rem 0' }}>
                <div className="container-brand">
                    <FadeIn>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '3rem', textAlign: 'center' }}>
                            Lo Que Nos Mueve
                        </h2>
                    </FadeIn>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
                        {[
                            {
                                icon: <Heart size={32} color="#E11D48" />,
                                title: 'Amor en cada nudo',
                                desc: 'Cada pieza se realiza a mano, dedicando horas de trabajo minucioso para asegurar la perfección.'
                            },
                            {
                                icon: <Globe size={32} color="var(--color-teal)" />,
                                title: 'Talento Local',
                                desc: 'Orgullosamente hecho en Medellín, apoyando el arte y la creatividad de nuestra región.'
                            },
                            {
                                icon: <Award size={32} color="var(--color-gold)" />,
                                title: 'Calidad Premium',
                                desc: 'Usamos cristales Miyuki originales y hilos de alta resistencia para que tus joyas duren años.'
                            }
                        ].map((val, idx) => (
                            <FadeIn key={val.title} delay={idx * 0.1}>
                                <div style={{ background: '#fff', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', textAlign: 'center', height: '100%' }}>
                                    <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>{val.icon}</div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '0.75rem' }}>{val.title}</h3>
                                    <p style={{ color: 'var(--color-stone)', lineHeight: 1.6 }}>{val.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
