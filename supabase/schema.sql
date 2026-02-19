-- =============================================
-- Auténtica Armonía — Schema SQL para Supabase
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- Fecha: 2026-02-19
-- =============================================

-- Extensión UUID (ya disponible en Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────
-- TABLA: products
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT        UNIQUE NOT NULL,
  name            TEXT        NOT NULL,
  description     TEXT,
  price           INTEGER     NOT NULL CHECK (price > 0),
  technique       TEXT        NOT NULL CHECK (technique IN ('MIYUKI','CROCHET','MIXED','PEYOTE')),
  category        TEXT,
  images          TEXT[]      DEFAULT '{}',
  colors          JSONB       DEFAULT '[]',  -- [{id, name, hex}]
  sizes           JSONB       DEFAULT '[]',  -- [{id, label, value}]
  rating          NUMERIC(3,1) DEFAULT 5.0  CHECK (rating BETWEEN 0 AND 5),
  review_count    INTEGER     DEFAULT 0,
  is_new          BOOLEAN     DEFAULT FALSE,
  is_customizable BOOLEAN     DEFAULT TRUE,
  in_stock        BOOLEAN     DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLA: orders
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name   TEXT        NOT NULL,
  customer_phone  TEXT        NOT NULL,
  product_id      UUID        REFERENCES products(id) ON DELETE SET NULL,
  customization   JSONB       DEFAULT '{}',
  total_amount    INTEGER     NOT NULL CHECK (total_amount >= 0),
  status          TEXT        DEFAULT 'PENDING'
                              CHECK (status IN ('PENDING','CONFIRMED','IN_PROGRESS','SHIPPED','DELIVERED')),
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- ÍNDICES
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_slug      ON products (slug);
CREATE INDEX IF NOT EXISTS idx_products_technique ON products (technique);
CREATE INDEX IF NOT EXISTS idx_products_in_stock  ON products (in_stock);
CREATE INDEX IF NOT EXISTS idx_orders_status      ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_product     ON orders (product_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at  ON orders (created_at DESC);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders   ENABLE ROW LEVEL SECURITY;

-- Productos: lectura pública (storefront)
CREATE POLICY "products_select_public"
  ON products FOR SELECT
  USING (true);

-- Productos: escritura solo con service_role (admin server-side)
CREATE POLICY "products_insert_service"
  ON products FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "products_update_service"
  ON products FOR UPDATE
  TO service_role
  USING (true);

CREATE POLICY "products_delete_service"
  ON products FOR DELETE
  TO service_role
  USING (true);

-- Órdenes: solo service_role puede leer/escribir
CREATE POLICY "orders_all_service"
  ON orders
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ─────────────────────────────────────────────
-- TRIGGER: updated_at automático
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────────
-- SEED: Productos de ejemplo
-- (Opcional — ejecutar solo en desarrollo)
-- ─────────────────────────────────────────────
/*
INSERT INTO products (slug, name, description, price, technique, category, is_new, is_customizable, in_stock) VALUES
  ('pulsera-miyuki-estrella',  'Pulsera Miyuki Estrella',    'Pulsera tejida con cuentas Miyuki Delica, diseño de estrella.', 45000, 'MIYUKI',  'Pulseras',  true,  true,  true),
  ('pulsera-crochet-luna',     'Pulsera Crochet Luna',       'Tejida a mano en crochet con hilo de seda..',                  38000, 'CROCHET', 'Pulseras',  false, true,  true),
  ('collar-miyuki-mandala',    'Collar Miyuki Mandala',      'Collar largo con diseño de mandala en Miyuki Delica.',         75000, 'MIYUKI',  'Collares',  true,  true,  true),
  ('aretes-miyuki-geometricos','Aretes Miyuki Geométricos',  'Aretes asimétricos con patrones geométricos modernos.',        52000, 'MIYUKI',  'Aretes',    false, false, true);
*/
