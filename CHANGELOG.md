# Changelog — Auténtica Armonía

Todos los cambios notables de este proyecto se documentan aquí.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).

---

## [0.1.0] — 2026-02-19

### ✨ Añadido (Primera entrega)

#### Infraestructura del Proyecto
- Inicializado proyecto **Next.js 16.1.6** con App Router, TypeScript y Tailwind CSS v4
- Instaladas dependencias: `framer-motion`, `lucide-react`
- Configurado `.gitignore` estándar de Next.js

#### Design System "Organic Luxury"
- `app/globals.css` — Sistema de tokens CSS completo:
  - **Colores:** Harmonia Teal `#00695C`, Deep Navy `#0F172A`, Golden Aura `#FBC02D`, Aqua Glow `#DBFFFF`, Spirit White `#FAFAF9`
  - **Tipografía:** Cormorant Garamond (serif) + Outfit (sans-serif) vía Google Fonts
  - **Componentes CSS:** `.btn`, `.card`, `.badge`, `.glass`, `.hero-gradient`, `.gold-divider`, `.nav-link`

#### Arquitectura Clean (Capas)
- `lib/domain/types.ts` — Tipos TypeScript: `Product`, `Customization`, `Order`, `CartItem`, `formatCOP()`
- `lib/infrastructure/mockRepository.ts` — 8 productos mock (Miyuki, Crochet, Mixed) + 3 órdenes de ejemplo
- `lib/application/generateWhatsAppLink.ts` — Generador de links WhatsApp con mensaje pre-llenado

#### Componentes de Layout
- `components/layout/Navbar.tsx` — Barra de navegación sticky con logo, links, CTA y hamburger mobile
- `components/layout/Footer.tsx` — Footer navy con redes sociales, links e íconos
- `app/layout.tsx` — Root layout con SEO metadata, Google Fonts y estructura global

#### Componente Reutilizable
- `components/feature/ProductCard.tsx` — Tarjeta de producto con badge de técnica, rating, precio, wishlist y placeholders Aqua

#### Páginas del Storefront
- `app/page.tsx` — **Landing Page:** Hero Aqua gradient, Value Props, Featured Products, CTA personalización, banner Medellín
- `app/catalogo/page.tsx` — **Catálogo:** Búsqueda en tiempo real, filtros pill por técnica, grilla responsive, banner WhatsApp
- `app/producto/[slug]/page.tsx` — **Detalle + Personalizador:** Galería, info del producto, personalizador completo (color, talla, iniciales, nota especial), resumen de precio dinámico, botón WhatsApp funcional

#### Panel Administrativo (`/admin`)
- `app/admin/layout.tsx` — Layout admin aislado del Navbar/Footer del sitio público
- `app/admin/page.tsx` — **Dashboard:** Sidebar Navy con navegación (6 secciones), Topbar, 4 KPI Cards, gráfico de barras "Pedidos por Día", tabla de pedidos recientes con estados, tabla de Top 5 Productos

---

### 🔧 Corregido

- `Event handlers cannot be passed to Client Component props` — Añadido `'use client'` en `ProductCard.tsx` y `Footer.tsx`
- Hover inline (`onMouseEnter/Leave`) en Navbar eliminado, reemplazado por clase CSS `.nav-link:hover`
- Orden de `@import` en `globals.css` para compatibilidad con Tailwind CSS v4

---

### 📦 Stack Técnico

| Herramienta | Versión |
|---|---|
| Next.js | 16.1.6 |
| React | 19 |
| TypeScript | 5 |
| Tailwind CSS | 4 |
| Framer Motion | latest |
| Lucide React | latest |

---

## [Próximas versiones]

- `[0.2.0]` Admin: CRUD de Productos, Bandeja de Pedidos WhatsApp, página de Personalizaciones
- `[0.3.0]` Integración Supabase (datos reales), autenticación admin
- `[0.4.0]` Animaciones Framer Motion, optimización de imágenes, SEO dinámico

---

## [0.3.0] — 2026-02-19

### ✨ Añadido (Integración Supabase)

#### Backend & Base de Datos
- **Supabase Integration:** Configuración completa del cliente (`lib/infrastructure/supabase.ts`) y `supabaseAdmin` para operaciones privilegiadas
- **Database Schema:** Tablas `products` y `orders` con políticas RLS y triggers de `updated_at`
- **Storage:** Bucket `products` configurado públicamente para alojar imágenes de productos

#### Admin Panel (Productos)
- **CRUD Completo:** Crear, Leer, Actualizar y Eliminar productos conectados a Supabase
- **Image Upload:** Subida de imágenes drag & drop o selección de archvo, con visualización inmediata
- **Feedback UI:** Notificaciones de éxito/error, estados de carga y confirmaciones de eliminación

#### API Routes
- `GET /api/products`: Filtrado por técnica y búsqueda por nombre
- `POST /api/products`: Creación de productos con slug automático y soporte para arrays de imágenes
- `PUT/DELETE /api/products/[id]`: Edición y eliminación segura de productos

### 🔧 Corregido
- Solucionado bug crítico donde el backend (POST/PUT) ignoraba el campo `images` y no guardaba las URLs
- Corregido `ProductCard` y `ProductoClient` para renderizar imágenes reales (`<img>`) en lugar de placeholders estáticos

