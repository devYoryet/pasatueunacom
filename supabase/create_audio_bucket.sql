-- Crear bucket de Storage para audio de cápsulas
-- Ejecutar en Supabase SQL editor ANTES de generar audios

-- 1. Crear el bucket público "audio"
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'audio',
  'audio',
  true,           -- público: cualquiera puede leer
  52428800,       -- 50 MB por archivo
  ARRAY['audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/wav']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/wav'];

-- 2. Política: lectura pública (sin autenticación)
CREATE POLICY "Audio público lectura" ON storage.objects
  FOR SELECT USING (bucket_id = 'audio');

-- 3. Política: solo service_role puede subir/eliminar
CREATE POLICY "Audio solo service role escribe" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'audio'
    AND auth.role() = 'service_role'
  );

CREATE POLICY "Audio solo service role elimina" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'audio'
    AND auth.role() = 'service_role'
  );
