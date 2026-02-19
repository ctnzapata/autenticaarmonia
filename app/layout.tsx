import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Auténtica Armonía — Accesorios Artesanales Colombianos',
  description: 'Accesorios artesanales Miyuki y Crochet tejidos con amor desde Medellín, Colombia. Diseños únicos y personalizables.',
  keywords: 'artesanal, miyuki, crochet, joyería, colombia, medellín, personalizable, bisutería',
  openGraph: {
    title: 'Auténtica Armonía',
    description: 'Tejiendo buena energía desde Medellín',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
