-- skills.name moves from `text` to `jsonb` keyed by language, like the rest
-- of the translatable content in 20261029120000_i18n_content.sql.
-- Proper nouns and acronyms (Python, Docker, SaaS, QA, CI/CD) get no Spanish
-- entry: the frontend falls back to English for them.

alter table public.skills
  alter column name type jsonb using jsonb_build_object('en', name);

alter table public.skills
  add constraint skills_name_has_en check (coalesce(name ->> 'en', '') <> '');

update public.skills as s
set name = s.name || jsonb_build_object('es', t.es)
from (values
  ('rest-apis', 'APIs REST'),
  ('authentication-permissions', 'Autenticación y permisos'),
  ('database-design', 'Diseño de bases de datos'),
  ('access-control-systems', 'Sistemas de control de acceso'),
  ('hardware-integration', 'Integración de hardware'),
  ('process-automation', 'Automatización de procesos'),
  ('test-automation', 'Automatización de tests'),
  ('product-development', 'Desarrollo de producto'),
  ('fitness-management', 'Gestión de gimnasios'),
  ('fitness-operations', 'Operación de gimnasios'),
  ('business-operations', 'Operaciones de negocio'),
  ('workflow-optimization', 'Optimización de flujos de trabajo'),
  ('workflow-automation', 'Automatización de flujos de trabajo'),
  ('business-systems', 'Sistemas de negocio'),
  ('operations', 'Operaciones'),
  ('process-design', 'Diseño de procesos'),
  ('team-training', 'Capacitación de equipos'),
  ('sales-systems', 'Sistemas de ventas'),
  ('business-automation', 'Automatización de negocios'),
  ('workflow-design', 'Diseño de flujos de trabajo'),
  ('customer-support', 'Atención al cliente'),
  ('software-adoption', 'Adopción de software'),
  ('ai', 'IA'),
  ('task-planning', 'Planificación de tareas'),
  ('productivity', 'Productividad')
) as t(id, es)
where s.id = t.id;
