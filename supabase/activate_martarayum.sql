-- ============================================================
-- Activar suscripción para martarayum08@gmail.com
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

UPDATE public.profiles
SET subscription_status = 'active'
WHERE email = 'martarayum08@gmail.com';

-- Verificar (debe mostrar 1 fila con subscription_status = active)
SELECT id, full_name, email, role, subscription_status
FROM public.profiles
WHERE email = 'martarayum08@gmail.com';
