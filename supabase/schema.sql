-- =============================================
-- Auténtica Armonía — Schema SQL para Supabase
-- Revisado con Supabase Postgres Best Practices
-- Última actualización: 2026-02-19
-- =============================================

-- ─────────────────────────────────────────────
-- EXTENSIONES
-- ─────────────────────────────────────────────
-- pg_uuidv7 para UUIDs ordenables por tiempo (sin fragmentación)
-- Si no está disponible en tu plan, se usa BIGINT IDENTITY (ver abajo)
-- CREATE EXTENSION IF NOT EXISTS pg_uuidv7;

-- ─────────────────────────────────────────────
-- TABLA: products
--
-- Best practices aplicadas:
--   [schema-primary-keys]  → bigint GENERATED ALWAYS AS IDENTITY
--                            (evita fragmentación de UUID v4)
--   [schema-data-types]    → TEXT sin límite en lugar de VARCHAR(n)
--                            TIMESTAMPTZ en lugar de TIMESTAMP
--   [schema-constraints]   → CHECK constraints en campos críticos
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id              BIGINT       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug            TEXT         UNIQUE NOT NULL,
  name            TEXT         NOT NULL,
  description     TEXT,
  price           INTEGER      NOT NULL CHECK (price > 0),
  technique       TEXT         NOT NULL
                               CHECK (technique IN ('MIYUKI','CROCHET','MIXED','PEYOTE')),
  category        TEXT,
  images          TEXT[]       DEFAULT '{}',
  colors          JSONB        DEFAULT '[]', -- [{id, name, hex}]
  sizes           JSONB        DEFAULT '[]', -- [{id, label, value}]
  rating          NUMERIC(3,1) DEFAULT 5.0 CHECK (rating BETWEEN 0 AND 5),
  review_count    INTEGER      DEFAULT 0,
  is_new          BOOLEAN      DEFAULT FALSE,
  is_customizable BOOLEAN      DEFAULT TRUE,
  in_stock        BOOLEAN      DEFAULT TRUE,
  created_at      TIMESTAMPTZ  DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLA: orders
--
-- Best practices aplicadas:
--   [schema-primary-keys]     → bigint GENERATED ALWAYS AS IDENTITY
--   [schema-foreign-key-indexes] → índice explícito en orders.product_id
--   [query-missing-indexes]   → índice en customer_phone (columna de búsqueda)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id              BIGINT       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_name   TEXT         NOT NULL,
  customer_phone  TEXT         NOT NULL,
  product_id      BIGINT       REFERENCES products(id) ON DELETE SET NULL,
  customization   JSONB        DEFAULT '{}',
  total_amount    INTEGER      NOT NULL CHECK (total_amount >= 0),
  status          TEXT         DEFAULT 'PENDING'
                               CHECK (status IN ('PENDING','CONFIRMED','IN_PROGRESS','SHIPPED','DELIVERED')),
  notes           TEXT,
  created_at      TIMESTAMPTZ  DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- ÍNDICES
--
-- Best practices aplicadas:
--   [query-missing-indexes]      → índices en todas las columnas de filtro WHERE
--   [schema-foreign-key-indexes] → FK siempre indexada (Postgres NO lo hace auto)
-- ─────────────────────────────────────────────

-- Products: columnas de filtro frecuente
CREATE INDEX IF NOT EXISTS idx_products_slug         ON products (slug);
CREATE INDEX IF NOT EXISTS idx_products_technique    ON products (technique);
CREATE INDEX IF NOT EXISTS idx_products_in_stock     ON products (in_stock);
CREATE INDEX IF NOT EXISTS idx_products_category     ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_is_new       ON products (is_new) WHERE is_new = TRUE;

-- Orders: FK + columnas de filtro frecuente
CREATE INDEX IF NOT EXISTS idx_orders_product_id    ON orders (product_id);   -- FK index (requerido)
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders (customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status         ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at     ON orders (created_at DESC);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
--
-- Best practices aplicadas:
--   [security-rls-basics]     → ENABLE + FORCE RLS (owner no bypassa)
--   [security-rls-performance] → usar (select auth.uid()) en lugar de auth.uid()
--                                para evitar evaluación por fila
-- ─────────────────────────────────────────────
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders   ENABLE ROW LEVEL SECURITY;

-- FORCE RLS: impide que el dueño de la tabla bypass las políticas
-- [security-rls-basics]: "Force RLS even for table owners"
ALTER TABLE products FORCE ROW LEVEL SECURITY;
ALTER TABLE orders   FORCE ROW LEVEL SECURITY;

-- ── PRODUCTS: Lectura pública (storefront sin auth) ──────────
-- Cualquiera puede leer productos activos (catálogo público)
CREATE POLICY "products_select_public"
  ON products FOR SELECT
  USING (true);

-- ── PRODUCTS: Escritura solo desde service_role (admin server-side) ──
-- El admin hace las mutaciones a través de API Routes con service_role key,
-- que bypassa RLS por diseño de Supabase. No se necesitan políticas adicionales
-- para INSERT/UPDATE/DELETE ya que service_role tiene acceso completo.
-- Nota: NUNCA exponer la service_role key en el cliente.

-- ── ORDERS: Solo accessible por service_role ─────────────────
-- Los pedidos son datos sensibles; solo el backend admin puede leerlos
-- El storefront no necesita leer orders directamente (WhatsApp es el canal)
-- service_role bypassa RLS por diseño → no se necesitan políticas extra

-- ── POLÍTICA DE RESTRICCIÓN: bloquear anon de hacer mutaciones ──
-- Política explícita para denegar INSERT/UPDATE/DELETE a usuarios no autenticados
CREATE POLICY "products_no_anon_write"
  ON products
  AS RESTRICTIVE
  FOR ALL
  TO anon
  USING (
    current_setting('request.method', true) = 'GET'
  )
  WITH CHECK (false);

-- ─────────────────────────────────────────────
-- TRIGGER: updated_at automático
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────────
-- QUERY DE DIAGNÓSTICO: Detectar FKs sin índice
-- Ejecutar periódicamente para verificar integridad
--
-- [schema-foreign-key-indexes]: find missing FK indexes
-- ─────────────────────────────────────────────
/*
SELECT
  conrelid::regclass  AS table_name,
  a.attname           AS fk_column,
  confrelid::regclass AS referenced_table
FROM pg_constraint c
JOIN pg_attribute a
  ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
WHERE c.contype = 'f'
  AND NOT EXISTS (
    SELECT 1 FROM pg_index i
    WHERE i.indrelid = c.conrelid
      AND a.attnum = ANY(i.indkey)
  );
-- Resultado esperado: 0 filas (todas las FKs indexadas)
*/

-- ─────────────────────────────────────────────────────────────────────────────
-- NOTA SOBRE PKs — Decisión de diseño
-- ─────────────────────────────────────────────────────────────────────────────
-- Se usa BIGINT IDENTITY en lugar de UUID (gen_random_uuid / UUIDv4) porque:
--   - UUIDv4 es aleatorio → fragmentación de B-tree index (hasta 2x más lento)
--   - BIGINT IDENTITY es secuencial → inserciones en orden, índice compacto
--   - Para este proyecto (catálogo pequeño→mediano) BIGINT es suficiente
--   - Si en el futuro se necesita UUID público no-secuencial, migrar a UUIDv7
--     con: CREATE EXTENSION pg_uuidv7; y DEFAULT uuid_generate_v7()
--
-- La capa de aplicación (supabaseRepository.ts) usa el ID como string
-- internamente → compatible con ambos tipos sin cambiar el código TypeScript.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─────────────────────────────────────────────
-- SEED: Productos de ejemplo (solo desarrollo)
-- ─────────────────────────────────────────────
/*
INSERT INTO products
  (slug, name, description, price, technique, category, is_new, is_customizable, in_stock,
   colors, sizes)
VALUES
  ('pulsera-miyuki-estrella', 'Pulsera Miyuki Estrella',
   'Tejida a mano con cuentas japonesas Miyuki Delica. Cada estrella toma más de 5 horas.',
   45000, 'MIYUKI', 'Pulseras', TRUE, TRUE, TRUE,
   '[{"id":"verde-esmeralda","name":"Verde Esmeralda","hex":"#2E7D32"}]'::jsonb,
   '[{"id":"s","label":"S","value":"16cm"},{"id":"m","label":"M","value":"18cm"}]'::jsonb),

  ('collar-crochet-luna', 'Collar Crochet Luna',
   'Tejido en crochet con hilo de algodón orgánico. Diseño de luna creciente.',
   65000, 'CROCHET', 'Collares', TRUE, TRUE, TRUE,
   '[{"id":"azul-oceano","name":"Azul Océano","hex":"#0277BD"}]'::jsonb,
   '[{"id":"corto","label":"Corto","value":"40cm"},{"id":"largo","label":"Largo","value":"50cm"}]'::jsonb),

  ('aretes-miyuki-geometrico', 'Aretes Miyuki Geométrico',
   'Patrones geométricos tejidos con cuentas Miyuki Delica.',
   35000, 'MIYUKI', 'Aretes', FALSE, TRUE, TRUE,
   '[{"id":"dorado-sol","name":"Dorado Sol","hex":"#FBC02D"}]'::jsonb,
   '[]'::jsonb);
*/
