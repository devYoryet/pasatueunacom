-- Hacer admin a yoryet.danoun@gmail.com
-- Ejecutar en Supabase → SQL Editor

UPDATE public.profiles
SET
  role = 'admin',
  subscription_status = 'active'
WHERE email = 'yoryet.danoun@gmail.com';

-- Verificar (debe mostrar role = admin)
SELECT id, full_name, email, role, subscription_status
FROM public.profiles
WHERE email = 'yoryet.danoun@gmail.com';
