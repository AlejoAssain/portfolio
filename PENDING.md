# Pendientes

Cosas conocidas que quedaron afuera a propósito. No están en la UI.

## Producto

- **CV descargable.** Subida a Supabase Storage desde el admin + link
  público de descarga en el portfolio. Ver PRODUCT.md.
- **Página 404 real.** Hoy cualquier ruta desconocida redirige a `/`
  (`src/App.tsx`), y Vercel responde 200 para todo. Para SEO conviene una
  404 con status real.
- **Error boundary.** Si un componente tira un error en render, la página
  queda en blanco. Falta un boundary con un fallback mínimo.

## SEO / indexación

- **Prerender / SSG.** El contenido llega desde Supabase en el cliente;
  el HTML inicial solo tiene meta tags y JSON-LD. Decidido: se deja así
  hasta el paso de indexación.
- Dar de alta `https://portfolio.alejoassain.com/` en Google Search
  Console y Bing Webmaster Tools, y enviar `sitemap.xml`.
- `public/og-image.png` es una captura del hero a 1200×630. Regenerarla si
  cambia el hero.

## Seguridad / operación

- **Versionar el esquema de Supabase.** No hay migraciones en el repo, así
  que las políticas RLS (y `is_admin`, `reorder_admin_entities`,
  `delete_admin_entity`, `save_*_with_skills`) no se pueden auditar desde
  el código. Correr:

  ```sh
  npx supabase login
  npx supabase link --project-ref <ref>
  npx supabase db pull
  ```

  Eso crea `supabase/migrations/` sin tocar la base remota.
- **Monitoreo de Supabase.** Si Supabase falla, el sitio muestra los mocks
  y loguea `[portfolio] ...` en la consola del visitante, que nadie ve. Para
  enterarse, un uptime monitor (p. ej. UptimeRobot o Better Stack, plan
  gratis) contra `https://<ref>.supabase.co/rest/v1/personal_info?select=id`
  con el header `apikey: <anon key>`.
- **Redeploy de la edge function** `submit-contact-message` después de
  cada cambio: `npx supabase functions deploy submit-contact-message`.
- **Restringir CORS de la edge function** (opcional): hoy responde
  `Access-Control-Allow-Origin: *`.
