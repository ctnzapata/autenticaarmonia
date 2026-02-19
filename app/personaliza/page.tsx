import Link from 'next/link';
import { Palette, PenTool, Sparkles, MessageCircle, Ruler, Shapes } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

export const metadata = {
    title: 'Personaliza tu Joya | Auténtica Armonía',
    description: 'Crea una pieza única. Elige colores, diseño y talla para tus accesorios de Miyuki y Crochet.',
};

export default function PersonalizaPage() {
    return (
        <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingBottom: '6rem' }}>
            {/* Hero */}
            <section style={{
                background: 'var(--color-navy)', color: '#fff',
                padding: '6rem 0 4rem', textAlign: 'center',
                borderBottomLeftRadius: '2rem', borderBottomRightRadius: '2rem',
            }}>
                <div className="container-brand">
                    <FadeIn direction="down">
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '6px 16px', borderRadius: '9999px', marginBottom: '1.5rem' }}>
                            <Sparkles size={16} color="var(--color-gold)" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>DISEÑO EXCLUSIVO</span>
                        </div>
                        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, marginBottom: '1rem' }}>
                            Tu Visión, <em style={{ color: 'var(--color-teal)' }}>Nuestras Manos</em>
                        </h1>
                        <p style={{ fontSize: '1.1rem', color: '#94A3B8', maxWidth: 600, margin: '0 auto' }}>
                            Convierte tus ideas en una joya única. Personaliza colores, patrones y medidas para crear algo verdaderamente tuyo.
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* Steps */}
            <section style={{ marginTop: '-3rem' }}>
                <div className="container-brand">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {[
                            {
                                icon: <Shapes size={32} color="var(--color-teal)" />,
                                title: '1. Elige tu Base',
                                desc: 'Selecciona entre pulseras, collares o aretes en técnica Miyuki (cuentas) o Crochet (hilo).',
                                delay: 0
                            },
                            {
                                icon: <Palette size={32} color="var(--color-gold)" />,
                                title: '2. Define tus Colores',
                                desc: 'Combina tus tonos favoritos o envíanos una foto de referencia para inspirarnos.',
                                delay: 0.1
                            },
                            {
                                icon: <Ruler size={32} color="var(--color-navy)" />,
                                title: '3. A tu Medida',
                                desc: 'Indícanos el tamaño ideal para que tu accesorio te quede perfecto.',
                                delay: 0.2
                            }
                        ].map((step, idx) => (
                            <FadeIn key={step.title} delay={step.delay} direction="up">
                                <div className="card" style={{ padding: '2rem', textAlign: 'center', height: '100%' }}>
                                    <div style={{
                                        width: 64, height: 64, background: '#F0FDFA', borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        margin: '0 auto 1.5rem'
                                    }}>
                                        {step.icon}
                                    </div>
                                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
                                        {step.title}
                                    </h3>
                                    <p style={{ color: 'var(--color-stone)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                        {step.desc}
                                    </p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Inspiration / CTA */}
            <section style={{ marginTop: '6rem' }}>
                <div className="container-brand" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                    <FadeIn direction="right">
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '1.5rem' }}>
                            ¿Listo para crear?
                        </h2>
                        <p style={{ color: 'var(--color-stone)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                            El proceso es muy sencillo. Escríbenos por WhatsApp y una de nuestras diseñadoras te guiará personalmente para materializar tu idea.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <a
                                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hola,%20quisiera%20personalizar%20un%20accesorio.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-green"
                                style={{ justifyContent: 'center', padding: '1rem' }}
                            >
                                <MessageCircle size={20} /> Iniciar Diseño en WhatsApp
                            </a>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-stone-light)', textAlign: 'center' }}>
                                * Tiempos de entrega: 3-5 días hábiles según complejidad.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn direction="left" delay={0.2}>
                        <div style={{
                            background: '#fff', padding: '2rem', borderRadius: '1.5rem',
                            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                            border: '1px solid var(--color-border)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ width: 48, height: 48, background: 'var(--color-teal)', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>AA</div>
                                <div>
                                    <p style={{ fontWeight: 700, color: 'var(--color-navy)' }}>Auténtica Armonía</p>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--color-teal)' }}>Asesora de Diseño</p>
                                </div>
                            </div>
                            <div style={{ background: '#F0FDFA', padding: '1rem', borderRadius: '1rem', borderTopLeftRadius: 0, marginBottom: '1rem', fontSize: '0.95rem', color: 'var(--color-navy)' }}>
                                ¡Hola! 👋 Me encantaría ayudarte a diseñar una pieza única. ¿Tienes alguna combinación de colores en mente?
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ display: 'inline-block', background: 'var(--color-navy)', color: '#fff', padding: '1rem', borderRadius: '1rem', borderTopRightRadius: 0, fontSize: '0.95rem' }}>
                                    Si, quiero una pulsera Miyuki con tonos dorados y azules. ✨
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>
        </div>
    );
}
