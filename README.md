# CIBERSEGURIDAD.pe Digital Cards

Aplicacion Angular para identidad profesional digital vinculada a URL publica, codigo QR y tarjeta fisica NFC.

## Estado del proyecto

- Angular 22 con componentes standalone y rutas lazy.
- La prueba de campo muestra la tarjeta publica de Ricardo Lanatta Forger en `/p/ricardo-lanatta-forger`.
- Por ahora cualquier otra ruta redirige a esa tarjeta. El panel y la administracion permanecen en el codigo, pero no estan habilitados ni conectados a autenticacion real.
- Los datos de la tarjeta viven en `src/app/features/public-profile/data/ricardo-card.data.ts`; cambiar el contenido no requiere cambiar su URL publica.
- Supabase Auth, PostgreSQL, RLS, Storage y RPC son la arquitectura prevista, no servicios activos de esta tarjeta estatica.

## Ejecucion

```bash
npm ci
npm start
```

Build y pruebas:

```bash
npm run build
npm run test
```

## Variables

`.env.example` documenta las variables previstas para la futura integracion. La tarjeta estatica actual no necesita copiarlas ni configurarlas.

```text
SUPABASE_URL=
SUPABASE_ANON_KEY=
PUBLIC_BASE_URL=https://ciberseguridad.com.pe
```

El archivo `.env.example` es una plantilla para la futura integracion; la compilacion actual no lee `.env` automaticamente. No subas credenciales ni uses `service_role` en Angular.

## Ruta publica

- `/p/ricardo-lanatta-forger`: destino permanente del QR y la tarjeta NFC de prueba.
- `**`: redireccion a la ruta publica anterior.

El numero, correo, web, PDF y video publicados en `public/assets/ricardo/` son accesibles a cualquier visitante. No coloques recursos privados en `public/`.

## Despliegue estatico

Ejecuta `npm run build` y publica `dist/TarjetaPersonal/browser`. Configura el hosting para servir `index.html` en las rutas de la SPA, sin reemplazar las respuestas de los archivos de `assets/`. Asi se puede abrir directamente la URL publica y funciona el enlace del QR.

## Arquitectura

La aplicacion usa DDD pragmatico por bounded context:

```text
src/app/
  core/
  shared/
  features/
    digital-card/
      domain/
      application/
      infrastructure/
    dashboard/
    identity/
    profile/
    contacts/
    social-links/
    custom-links/
    appearance/
    nfc-cards/
    leads/
    administration/
    public-profile/
```

`digital-card/domain` no depende de Angular ni Supabase. Ahi viven reglas como `toPublicProfile` y `buildVCard`.

## Supabase

La migracion inicial esta en `supabase/migrations/202609140001_initial_identity_cards.sql`. No se aplica al publicar la tarjeta estatica.

Incluye tablas de perfiles, redes, enlaces, tarjetas NFC, contactos recibidos, roles, auditoria, constraints, indices, RLS, bucket privado y la RPC `get_public_profile(public_code)`.

La RPC publica devuelve solo campos permitidos por flags de visibilidad y solo enlaces visibles. El frontend publico no debe hacer `select *` sobre `profiles`.

## Seguridad

- Guards de autenticacion y rol preparados para el panel futuro; no protegen una API desplegada en este MVP.
- Validacion de esquemas de URL en frontend.
- vCard construida desde `PublicProfile`, no desde `Profile` privado.
- `.env`, `.env.local` y variantes locales ignoradas por Git.
- RLS para lectura/escritura por propietario y administracion por rol.
- Constraints de formato para email, colores y URLs.

Pendiente antes de habilitar el panel en produccion: conectar Supabase Auth real, sustituir el adapter demo, mover operaciones privilegiadas a Edge Functions, generar `public_code` no enumerable y servir imagenes desde Storage con signed URLs o estrategia equivalente.
