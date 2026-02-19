-- Semilla de datos para Auténtica Armonía
-- Ejecuta este script en el SQL Editor de Supabase para poblar la base de datos con productos de ejemplo

-- Limpiar tabla products (opcional - descomentar para borrar datos existentes)
-- TRUNCATE TABLE products RESTART IDENTITY CASCADE;

INSERT INTO products (slug, name, description, price, technique, category, rating, review_count, in_stock, is_new, is_customizable, images, colors, sizes)
VALUES
(
  'pulsera-miyuki-atardecer',
  'Pulsera Miyuki Atardecer',
  'Inspirada en los colores cálidos del atardecer paisa, esta pulsera tejida a mano con cuentas Miyuki Delica captura la esencia de la luz dorada.',
  85000,
  'MIYUKI',
  'Pulseras',
  4.8,
  12,
  true,
  true,
  true,
  ARRAY['/images/miyuki-sunset.jpg'],
  '[{"id":"c1","name":"Dorado","hex":"#FFD700"},{"id":"c2","name":"Naranja","hex":"#FFA500"}]'::jsonb,
  '[{"id":"s1","label":"S","value":"14cm"},{"id":"s2","label":"M","value":"16cm"},{"id":"s3","label":"L","value":"18cm"}]'::jsonb
),
(
  'collar-crochet-luna',
  'Collar Crochet Luna',
  'Delicado tejido en crochet con hilo de alta calidad y detalles en plata. Un diseño etéreo que evoca la suavidad de la luz lunar.',
  120000,
  'CROCHET',
  'Collares',
  4.9,
  8,
  true,
  false,
  true,
  ARRAY['/images/crochet-moon.jpg'],
  '[{"id":"c1","name":"Blanco","hex":"#FFFFFF"},{"id":"c2","name":"Plata","hex":"#C0C0C0"}]'::jsonb,
  '[]'::jsonb
),
(
  'aretes-estrella-fugaz',
  'Aretes Estrella Fugaz',
  'Pequeños pero impactantes, estos aretes Miyuki en forma de estrella añaden un toque de brillo sutil a cualquier outfit.',
  45000,
  'MIYUKI',
  'Aretes',
  4.7,
  24,
  true,
  true,
  false,
  ARRAY['/images/earrings-star.jpg'],
  '[{"id":"c1","name":"Azul Noche","hex":"#191970"},{"id":"c2","name":"Dorado","hex":"#FFD700"}]'::jsonb,
  '[]'::jsonb
),
(
  'pulsera-ojo-turco',
  'Pulsera Ojo Turco (Peyote)',
  'Protección y estilo se unen en esta pulsera tejida con la técnica Peyote. El símbolo del ojo turco para alejar las malas energías.',
  65000,
  'PEYOTE',
  'Pulseras',
  5.0,
  5,
  true,
  false,
  true,
  ARRAY['/images/peyote-eye.jpg'],
  '[{"id":"c1","name":"Azul","hex":"#0000FF"},{"id":"c2","name":"Blanco","hex":"#FFFFFF"}]'::jsonb,
  '[{"id":"s1","label":"Ajustable","value":"14-20cm"}]'::jsonb
),
(
  'set-armonia',
  'Set Armonía (Mixto)',
  'La combinación perfecta de técnicas: gargantilla en crochet y pulsera Miyuki a juego. Equilibrio y belleza en un solo set.',
  150000,
  'MIXED',
  'Sets',
  4.9,
  3,
  true,
  true,
  true,
  ARRAY['/images/set-harmony.jpg'],
  '[{"id":"c1","name":"Verde Esmeralda","hex":"#50C878"},{"id":"c2","name":"Beige","hex":"#F5F5DC"}]'::jsonb,
  '[{"id":"s1","label":"Única","value":"Estándar"}]'::jsonb
);
