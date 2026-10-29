# Capturas y videos de proyectos

## Alcance y límites

- Bucket público: `project-screenshots`. PNG/JPEG/WebP, máximo 2.097.152 bytes por archivo.
- Hasta 6 capturas por proyecto. Recomendada: WebP de menos de 300 KB, sin perder legibilidad.
- El navegador verifica tipo, cabecera, tamaño y decodificación; rechaza imágenes de más de 40 megapíxeles.
- No se usan transformaciones de Supabase ni dependencias nuevas.
- URLs de archivo únicas y caché de un año; nunca se sobrescriben archivos existentes.
- Desvincular y borrar un proyecto no borran sus archivos de Storage. Cancelar una edición o fallar el guardado puede dejar archivos sin referencias: revisar manualmente, sin borrar archivos compartidos.
- Las imágenes del bucket son públicas desde la subida, incluso antes de guardar el proyecto. Subir únicamente capturas que se puedan publicar.
- Texto alternativo editable en inglés y español; inglés requerido, español vacío usa inglés, igual que el resto del contenido.
- El formulario de proyectos solo permite asociar capturas subidas; ya no ofrece una URL manual. Las URLs antiguas se convierten en una captura inicial editable.
- YouTube pertenece a proyectos; las experiencias conservan su presentación anterior. YouTube acepta watch, youtu.be, shorts, embed y live; almacena un enlace HTTPS canónico y nunca carga reproductores.

## Cuotas verificadas el 29 de octubre de 2026

Free incluye 1 GB de archivos, 5 GB de egreso sin caché y otros 5 GB de egreso con caché. El espacio es la suma de los archivos de todos los buckets, no 1 GB por bucket. Revisar Usage para conocer el consumo real; otros servicios también pueden consumir egreso.

Fuentes oficiales:

- https://supabase.com/pricing
- https://supabase.com/docs/guides/storage/pricing
- https://supabase.com/docs/guides/storage/buckets/creating-buckets
- https://supabase.com/docs/guides/storage/security/access-control
- https://supabase.com/docs/reference/cli/supabase-db-push

## Aplicación remota, guiada

1. Bucket creado por el usuario en Dashboard, con los valores indicados arriba.
2. Dry run confirmado por el usuario: solamente las dos migraciones siguientes están pendientes:
   - `20261029150000_project_media.sql`
   - `20261029150100_screenshot_storage.sql`
3. El usuario confirmó que las dos migraciones se aplicaron correctamente.
4. Tras aclarar que YouTube pertenece a proyectos, se preparó `20261029150200_project_video.sql`. Agrega `projects.video_url` y una RPC atómica; no elimina la columna/RPC de experiencias ya aplicada, para evitar borrar datos o alterar historial.
5. Revisar los archivos completos antes de aplicar. No ejecutarlos manualmente en SQL Editor si se usa el historial de migraciones.
6. Desde el proyecto vinculado correcto: `npx supabase db push --linked --dry-run`. Tras las dos primeras aplicadas, solo debe aparecer `20261029150200_project_video.sql`. Si coincide: `npx supabase db push --linked`. No compartir credenciales.
7. Confirmar resultado con `npx supabase migration list --linked`.

El agente no ejecutó migraciones remotas; las dos primeras fueron aplicadas por el usuario. La confirmación de la tercera sigue pendiente. No se modificaron archivos de entorno ni claves.

### Qué hace el SQL

La primera migración agrega `projects.screenshots` (JSONB ordenado, inicialmente null) y `experiences.video_url` (text nullable). Valida cantidad, portada única, IDs distintos, URL HTTP(S) y texto alternativo; valida el enlace canónico de YouTube en DB. Las RPCs nuevas llaman a las existentes y guardan medios dentro de la misma transacción. Los clientes anteriores pueden seguir usando las RPCs originales.

`null` en screenshots significa dato anterior: usa `image`. `[]` significa que se quitaron todas las asociaciones: no vuelve a mostrar una imagen antigua. La columna `image` se conserva y, al guardar desde el admin nuevo, se sincroniza con la portada elegida (o null si no quedan capturas), para los consumidores anteriores.

La tercera migración ubica el video en proyectos, de acuerdo con el alcance corregido. El frontend no usa el video de experiencias.

La segunda migración acepta el bucket existente solo si tiene exactamente los valores revisados; si no existe, lo crea. No modifica silenciosamente un bucket existente. Agrega políticas SELECT, INSERT, UPDATE y DELETE sobre `storage.objects`, todas limitadas a ese bucket y `public.is_admin()`. Esa función consulta `public.admin_users` por `auth.uid()`, igual que el admin actual. No alcanza con estar autenticado. Las descargas públicas del bucket no requieren SELECT; listar objetos queda restringido al admin.

### Comprobación de políticas existentes

Después de aplicar, ejecutar esta consulta de solo lectura en SQL Editor para revisar todas las políticas de Storage; las políticas permisivas se combinan con OR, por lo que una política anterior demasiado amplia podría conceder acceso adicional:

```sql
select policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'storage' and tablename = 'objects'
order by policyname;
```

No borrar políticas existentes automáticamente. Revisarlas antes de cambiar su alcance.

## Verificación real pendiente

- Con el administrador ya autorizado: subir una captura, completar alt EN/ES, guardar y recargar.
- Agregar otra captura; cambiar portada y orden; guardar y comprobar la vista pública en ambos idiomas.
- Desvincular una captura y guardar: desaparece de la galería, pero su archivo sigue en Storage.
- Cancelar una edición y simular desconexión al guardar: la referencia publicada anterior debe conservarse.
- Sin sesión: abrir la URL pública de una captura; la descarga debe funcionar.
- Sin sesión y con un usuario autenticado que NO sea admin: intentar subir, modificar y borrar un archivo de prueba; debe rechazarse. No usar un archivo real ni compartido para esta prueba.
- Revisar las políticas de Storage con la consulta anterior. Una UI protegida no prueba RLS.
- Proyecto: guardar enlace de video válido, rechazar host/ID inválidos, quitar enlace y recargar. Experiencias: confirmar que no hay campo ni enlace de video.
- Revisar teclado (Tab, flechas, Escape y retorno de foco), móvil y reduced motion.

No crear cuentas, compartir contraseñas ni exponer una service_role key para estas comprobaciones. Si no existe un usuario de prueba no administrador, ese caso queda explícitamente pendiente.

## Verificación local

- TypeScript: `./node_modules/.bin/tsc --noEmit`.
- Pruebas de validación: `node --experimental-strip-types --test src/lib/media.test.ts` (Node 22).
- Producción: `npm run build`.
- `npm run lint`, `npm run typecheck` y `npm test` no existen en package.json; no se agregó tooling.
- Playwright externo ya instalado: flujos de galería y admin con TODAS las peticiones a Supabase interceptadas. No verifica permisos remotos ni SQL ejecutado en PostgreSQL.
- Evidencias temporales: `/private/tmp/portfolio-media-verification/`. Incluye screenshots a 375/768/1440, galería EN/ES, error y reintento, reduced motion, admin, timestamps y videos WebM. `reproduce.mjs` conserva el escenario local y `results.json` su resultado.
- El presupuesto de LCP/60 fps en un dispositivo móvil real requiere medición en despliegue y hardware representativo; el navegador local no lo certifica.

## Archivos del cambio

- `src/types/media.ts`: tipos de capturas públicas y bilingües del admin.
- `src/types/index.ts`: campos de capturas y video en proyectos y sus filas de DB.
- `src/mappers/index.ts`: compatibilidad de URLs anteriores y localización de alt.
- `src/lib/media.ts`: límites, validación de archivos/capturas y normalización de YouTube.
- `src/lib/media.test.ts`: cinco pruebas de validación, incluidos archivos con MIME falso.
- `src/services/media.ts`: subidas únicas a Storage, sin sobrescritura ni borrado automático.
- `src/services/admin.ts`: guardado atómico de medios/video y sincronización de la portada antigua.
- `src/pages/admin/ProjectFormDialog.tsx`: capturas y video; elimina la URL manual de imagen y bloquea edición durante subida/guardado.
- `src/pages/admin/ProjectScreenshots.tsx`: previsualización, alt EN/ES, orden, portada, desvinculación y reintento.
- `src/components/shared/ScreenshotImage.tsx`: espacio reservado, imagen completa y estados de carga/error/reintento.
- `src/components/shared/ProjectGallery.tsx`: galería móvil con flechas, Escape y retorno de foco.
- `src/components/sections/Projects.tsx`: portadas y enlace de video, manteniendo tarjetas sin imágenes.
- `src/i18n/en.ts`: textos públicos en inglés.
- `src/i18n/es.ts`: textos públicos en español.
- `src/index.css`: dimensiones estables y reduced motion del diálogo de capturas.
- `supabase/migrations/20261029150000_project_media.sql`: capturas, validaciones y RPCs iniciales; ya aplicada por el usuario.
- `supabase/migrations/20261029150100_screenshot_storage.sql`: bucket y políticas de administrador; ya aplicada por el usuario.
- `supabase/migrations/20261029150200_project_video.sql`: video de proyectos y RPC atómica, según el alcance corregido.
- `supabase/media-setup.md`: configuración, decisiones, comprobaciones y pendientes.

Los archivos de experiencias no tienen cambios locales respecto de su versión anterior. La columna y RPC de video agregadas en la primera migración aplicada quedan sin uso en el frontend; no se borraron datos ni se reescribió el historial aplicado.

Decisiones tomadas: seis capturas, 2 MiB, formatos PNG/JPEG/WebP, recomendación WebP menor de 300 KB, portada con proporción 16:9 y object-contain, ampliación sin recorte, lista JSONB para guardar en una transacción. No se agregó compresión automática para no degradar capturas de interfaces; se valida el peso al subir.

Nivel 0: formato de los componentes editados; sin arreglos ajenos a la funcionalidad. No se registraron hallazgos de nivel 2 o 3 fuera del alcance.

Resultado local final: TypeScript/build y cinco pruebas de validación correctos; Playwright con backend simulado correcto, sin errores de página. Bundle inicial: 246,72 KB JS + 10,47 KB CSS + 1,10 KB HTML = 258,29 KB gzip. Vite advierte que el chunk JS sin comprimir supera 500 KB; el total gzip cumple el presupuesto de 300 KB. No se modificó tooling.

Grabación estable: `/private/tmp/portfolio-media-verification/walkthrough.webm`. Screenshots completos: `page-375.png`, `page-768.png`, `page-1440.png`. Animación: `hero-0ms.png`, `hero-300ms.png`, `hero-600ms.png`, `hero-1200ms.png`; los tiempos reales del driver están en `timestamps.json` (aproximados, no una captura sincronizada con el compositor).
