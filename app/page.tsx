import Link from 'next/link';
import { ArrowRight, Gem, Heart, Sparkles, Star, MapPin } from 'lucide-react';
import ProductCard from '@/components/feature/ProductCard';
import { supabase } from '@/lib/infrastructure/supabase';

import type { Product } from '@/lib/domain/types';

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    slug: row.slug as string,
    name: row.name as string,
    description: (row.description as string) ?? '',
    price: row.price as number,
    technique: row.technique as Product['technique'],
    category: (row.category as string) ?? '',
    images: (row.images as string[]) ?? [],
    colors: (row.colors as Product['colors']) ?? [],
    sizes: (row.sizes as Product['sizes']) ?? [],
    rating: row.rating as number,
    reviewCount: row.review_count as number,
    isNew: row.is_new as boolean,
    isCustomizable: row.is_customizable as boolean,
    inStock: row.in_stock as boolean,
  };
}

export const dynamic = 'force-dynamic';

export default async function HomePage() {

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)
    .order('created_at', { ascending: false })
    .limit(3);

  const featured: Product[] = error ? [] : (data ?? []).map(r => mapProduct(r as Record<string, unknown>));

  return (
    <>
      {/* ================================================
          HERO SECTION
          ================================================ */}
      <section className="hero-gradient" style={{ paddingTop: '6rem', paddingBottom: '6rem', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        <div className="container-brand" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          {/* Left: Text */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--color-gold)', padding: '4px 14px', borderRadius: '9999px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-navy)', letterSpacing: '0.08em' }}>
                  ✦ HECHO EN MEDELLÍN, COLOMBIA
                </span>
              </div>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 700, color: 'var(--color-navy)', lineHeight: 1.1,
              marginBottom: '1.5rem',
            }}>
              Tejido con Amor,<br />
              <em style={{ color: 'var(--color-teal)' }}>Hecho para Ti</em>
            </h1>

            <p style={{ color: 'var(--color-stone)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '480px' }}>
              Accesorios artesanales <strong>Miyuki</strong> y <strong>Crochet</strong> tejidos con precisión japonesa y calidez colombiana.
              Cada pieza es única, como tú.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/catalogo" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>
                Explorar Colección <ArrowRight size={16} />
              </Link>
              <Link href="/catalogo" className="btn btn-outline" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>
                Personaliza la tuya
              </Link>
            </div>

            {/* Trust signals */}
            <div style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
              {[
                { icon: <Star size={16} fill="var(--color-gold)" color="var(--color-gold)" />, text: '4.9 Calificación' },
                { icon: <Heart size={16} color="var(--color-teal)" />, text: '+500 piezas creadas' },
                { icon: <Sparkles size={16} color="var(--color-gold)" />, text: '100% artesanal' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {icon}
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-stone)', fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '100%', maxWidth: 460, aspectRatio: '4/5',
              background: 'linear-gradient(145deg, var(--color-teal) 0%, var(--color-teal-dark) 100%)',
              borderRadius: '2rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: '1rem',
              boxShadow: '0 24px 80px rgba(0,105,92,0.3)',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Decorative circles */}
              <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, background: 'rgba(219,255,255,0.1)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, background: 'rgba(251,192,45,0.15)', borderRadius: '50%' }} />

              <Gem size={56} color="var(--color-aqua)" style={{ opacity: 0.8 }} />
              <div style={{ textAlign: 'center', padding: '0 2rem' }}>
                <p style={{ color: 'var(--color-aqua)', fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 600, lineHeight: 1.5 }}>
                  Pulseras Miyuki
                </p>
                <p style={{ color: 'rgba(219,255,255,0.7)', fontSize: '0.9rem', marginTop: '4px' }}>
                  Collares Crochet · Diseños Personalizados
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================
          VALUE PROPS
          ================================================ */}
      <section className="section-aqua" style={{ padding: '4rem 0' }}>
        <div className="container-brand">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            {[
              { icon: '⬡', title: 'Técnica Miyuki Delica', desc: 'Cuentas japonesas de alta precisión para diseños geométricos perfectos y durables.' },
              { icon: '♡', title: 'Tejido a Mano', desc: 'Cada pieza tejida con intención, amor y más de 5 horas de dedicación artesanal.' },
              { icon: '✦', title: '100% Personalizable', desc: 'Tu nombre, tus colores, tu historia. Diseñamos la pieza que refleja tu esencia.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem', color: 'var(--color-teal)' }}>{icon}</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                  {title}
                </h3>
                <p style={{ color: 'var(--color-stone)', fontSize: '0.9rem', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================
          FEATURED PRODUCTS
          ================================================ */}
      <section style={{ padding: '6rem 0', background: '#fff' }}>
        <div className="container-brand">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="gold-divider" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'var(--color-navy)' }}>
              Nuestra Colección
            </h2>
            <p style={{ color: 'var(--color-stone)', marginTop: '0.75rem', fontSize: '1rem' }}>
              Piezas seleccionadas, creadas con los más altos estándares artesanales
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.75rem', marginBottom: '3rem' }}>
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/catalogo" className="btn btn-outline" style={{ fontSize: '1rem', padding: '0.85rem 2.5rem' }}>
              Ver Catálogo Completo <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================
          CUSTOMIZATION CTA
          ================================================ */}
      <section className="section-navy" style={{ padding: '6rem 0' }}>
        <div className="container-brand" style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
          <Sparkles size={40} color="var(--color-gold)" style={{ marginBottom: '1.5rem' }} />
          <h2 style={{
            fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700, color: '#fff', marginBottom: '1.25rem',
          }}>
            Crea Tu Pieza Única
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Elige tus colores, agrega tus iniciales, cuéntanos tu historia.
            Nuestras artesanas tejen tu visión con amor y precisión.
          </p>
          <Link href="/catalogo" className="btn btn-gold" style={{ fontSize: '1.05rem', padding: '1rem 2.5rem' }}>
            Empieza tu Diseño →
          </Link>
        </div>
      </section>

      {/* ================================================
          MADE IN MEDELLÍN
          ================================================ */}
      <section className="section-aqua" style={{ padding: '4rem 0' }}>
        <div className="container-brand" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <MapPin size={20} color="var(--color-teal)" />
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-navy)' }}>
            Tejiendo buena energía — desde el corazón de <em style={{ color: 'var(--color-teal)' }}>Medellín, Colombia</em>
          </p>
          <Heart size={16} fill="var(--color-gold)" color="var(--color-gold)" />
        </div>
      </section>
    </>
  );
}
