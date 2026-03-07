# Supabase – PasaTuEunacom

## Conexión y creación de usuarios

La app usa **Supabase Auth** para registro y **PostgreSQL** para perfiles. Al registrarse:

1. **Auth**: `auth.signUp()` crea el usuario en `auth.users`.
2. **Perfil**: Un trigger en la base de datos inserta una fila en `profiles` con el mismo `id`, `full_name` y `email`.

### Si la creación de usuario “no funciona”

1. **Revisar el error real**  
   En la consola del navegador (F12 → Console) y en el toast de la app ahora se muestra el mensaje que devuelve Supabase. Ejemplos:
   - `Invalid API key` → Revisa `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` en `.env.local`.
   - `already registered` → El email ya existe; usar “Iniciar sesión”.
   - Errores de red → Comprobar que `NEXT_PUBLIC_SUPABASE_URL` sea la URL correcta del proyecto.

2. **Asegurar que el trigger esté creado en Supabase**  
   Si el usuario se crea en Auth pero no aparece en la app (ni perfil en dashboard), suele ser que el trigger que crea el perfil no está en la base de datos.

   - Entra en [Supabase Dashboard](https://supabase.com/dashboard) → tu proyecto.
   - **SQL Editor** → New query.
   - Copia y ejecuta el contenido de `schema.sql` (o al menos la parte de **handle_new_user** y el trigger **on_auth_user_created**).

   El trigger necesario es:

   ```sql
   CREATE OR REPLACE FUNCTION handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO profiles (id, full_name, email, role, subscription_status)
     VALUES (
       NEW.id,
       COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
       NEW.email,
       COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'),
       'inactive'
     );
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION handle_new_user();
   ```

   (Solo tiene sentido si la tabla `profiles` y el tipo `user_role` ya existen; si no, ejecuta todo `schema.sql`.)

3. **Confirmación de email**  
   En **Authentication → Providers → Email** del dashboard puedes dejar “Confirm email” activado o no. Si está activado, el usuario debe confirmar el correo antes de poder iniciar sesión; el perfil se crea igual al hacer signup (el trigger se dispara al insertar en `auth.users`).

## Archivos

- `schema.sql`: esquema completo (tablas, trigger de perfiles, RLS, seed de áreas).
- `seed_diabetes_1_1.sql`: datos de ejemplo (opcional).
