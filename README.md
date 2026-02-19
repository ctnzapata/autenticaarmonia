<div align="center">

# 🌿 Auténtica Armonía

**Accesorios artesanales Miyuki & Crochet — Tejiendo buena energía desde Medellín, Colombia**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

</div>

---

## ✨ Sobre el Proyecto

**Auténtica Armonía** es una tienda e-commerce de accesorios artesanales únicos — pulseras, collares, aretes y tobilleras tejidos a mano con técnicas **Miyuki Delica** y **Crochet**. Cada pieza es una creación personalizable con amor y buena energía desde el corazón de Medellín.

### 🖥️ Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Landing page con hero, productos destacados y CTA |
| `/catalogo` | Catálogo completo con búsqueda y filtros por técnica |
| `/producto/[slug]` | Detalle del producto + personalizador interactivo |
| `/admin` | Panel administrativo con dashboard de métricas |

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- npm 9+

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/ctnzapata/autenticaarmonia.git
cd autenticaarmonia

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo (Turbopack)
npm run build    # Build de producción
npm run start    # Inicia el servidor de producción
npm run lint     # Ejecuta el linter
```

---

## 🏗️ Arquitectura

El proyecto sigue principios de **Clean Architecture** adaptados a Next.js App Router:

```
autenticaaromina/
├── app/                        # Rutas y páginas (Next.js App Router)
│   ├── globals.css             # Design System: tokens, componentes CSS
│   ├── layout.tsx              # Root layout (Navbar, Footer, SEO)
│   ├── page.tsx                # Landing Page
│   ├── catalogo/page.tsx       # Catálogo con filtros
│   ├── producto/[slug]/        # Detalle + Personalizador
│   └── admin/                  # Panel Administrativo
│       ├── layout.tsx          # Layout aislado (sin nav pública)
│       └── page.tsx            # Dashboard con KPIs y métricas
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Barra de navegación responsive
│   │   └── Footer.tsx          # Footer con redes sociales
│   └── feature/
│       └── ProductCard.tsx     # Tarjeta de producto reutilizable
│
└── lib/
    ├── domain/types.ts         # Entidades: Product, Order, Customization
    ├── infrastructure/         # Repositorio de datos (mock → Supabase)
    │   └── mockRepository.ts
    └── application/            # Casos de uso
        └── generateWhatsAppLink.ts
```

---

## 🎨 Design System — "Organic Luxury"

| Token | Color | Uso |
|-------|-------|-----|
| `--color-teal` | `#00695C` | Color primario, botones, badges |
| `--color-navy` | `#0F172A` | Texto principal, sidebar admin |
| `--color-gold` | `#FBC02D` | Acentos, estrellas, dividers |
| `--color-aqua` | `#DBFFFF` | Hero, personalizador, breadcrumbs |
| `--color-whatsapp` | `#25D366` | Botón de compra |

**Tipografía:** `Cormorant Garamond` (headings) · `Outfit` (UI / body)

---

## 💚 Checkout por WhatsApp

El flujo de compra genera automáticamente un mensaje de WhatsApp pre-llenado con:
- Producto seleccionado y precio
- Color, talla e iniciales elegidas
- Nota especial del cliente
- Total estimado en COP

```ts
// lib/application/generateWhatsAppLink.ts
const link = generateWhatsAppLink(product, customization);
// → https://wa.me/573001234567?text=...
```

---

## 🛠️ Tech Stack

| Tecnología | Versión | Rol |
|---|---|---|
| [Next.js](https://nextjs.org) | 16.1 | Framework principal (App Router) |
| [TypeScript](https://typescriptlang.org) | 5 | Tipado estático |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Estilado + Design Tokens |
| [Framer Motion](https://framer.com/motion) | latest | Animaciones (próximamente) |
| [Lucide React](https://lucide.dev) | latest | Iconografía |

---

## 🗺️ Roadmap

- [x] **v0.1.0** — Storefront completo + Admin Dashboard
- [ ] **v0.2.0** — Admin CRUD de Productos, Bandeja de Pedidos, Personalizaciones
- [ ] **v0.3.0** — Integración Supabase (datos reales), autenticación admin
- [ ] **v0.4.0** — Animaciones Framer Motion, SEO dinámico, optimización de imágenes

---

## 📝 Licencia

MIT © 2025 Auténtica Armonía — Medellín, Colombia 🇨🇴
