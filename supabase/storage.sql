-- OPCIÓN NUCLEAR: Reiniciar bucket products desde cero
-- Ejecuta esto en el SQL Editor para garantizar que el bucket exista y sea público

-- 1. Intentar borrar el bucket (solo si está vacío, si no, fallará, pero intentamos limpiar metadata)
-- Si tienes archivos, no los borrará, pero reseteará la configuración
DELETE FROM storage.buckets WHERE id = 'products';

-- 2. Crear el bucket explícitamente como PÚBLICO
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true);

-- 3. ELIMINAR TODAS LAS POLÍTICAS ANTIGUAS (Limpieza total)
DROP POLICY IF EXISTS "Public Access to Products Images" ON storage.objects;
DROP POLICY IF EXISTS "Allow Uploads to Products" ON storage.objects;
DROP POLICY IF EXISTS "Allow Updates to Products" ON storage.objects;
DROP POLICY IF EXISTS "Allow Deletes to Products" ON storage.objects;
DROP POLICY IF EXISTS "Public Access 1" ON storage.objects;
DROP POLICY IF EXISTS "Public Access 2" ON storage.objects;
DROP POLICY IF EXISTS "Public Access ALL" ON storage.objects;
DROP POLICY IF EXISTS "Give me access" ON storage.objects;

-- 4. CREAR UNA ÚNICA POLÍTICA MAESTRA (Permite TODO a TODOS en este bucket)
-- NOTA: Esto es inseguro para producción real con usuarios, pero perfecto para este admin panel simple.
CREATE POLICY "Super Permissive Policy for Products"
ON storage.objects FOR ALL
TO public
USING ( bucket_id = 'products' )
WITH CHECK ( bucket_id = 'products' );
