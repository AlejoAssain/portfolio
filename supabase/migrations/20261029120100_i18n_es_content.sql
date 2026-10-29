-- Spanish translations for the content that exists today. Runs after
-- 20261029120000_i18n_content.sql. Fields whose Spanish text would be
-- identical to English (names, places, "Jun 2023 - Feb 2024") are left out:
-- the frontend falls back to English for them.

update public.personal_info
set
  title = title || jsonb_build_object('es', 'Desarrollo de software'),
  tagline = tagline || jsonb_build_object('es', 'Construyo soluciones reales y automatizo el trabajo repetitivo'),
  bio = bio || jsonb_build_object('es', 'Desarrollo sistemas prácticos para operaciones del mundo real.
Combinando experiencia directa en negocios con ingeniería de software, convierto desafíos operativos en soluciones escalables. Mi trabajo abarca desarrollo backend, aplicaciones frontend, automatización, infraestructura e integración de hardware.
Hoy estoy desarrollando Lymbo, que cofundé: una plataforma de gestión y control de acceso para gimnasios, diseñada a partir de mi experiencia directa gestionando centros de fitness.'),
  status = status || jsonb_build_object('es', 'Disponible para trabajar')
where id = 'main';

update public.projects
set description = description || jsonb_build_object('es', 'Cofundé y desarrollé una plataforma de gestión y control de acceso para gimnasios, diseñada para agilizar la operación diaria de los centros de fitness.
Lideré la arquitectura y el desarrollo de las funcionalidades centrales: alta de socios, membresías, pagos, control de asistencia, gestión de ventas y administración basada en roles. Construida con React, TypeScript, Django, PostgreSQL, Docker y APIs REST.
Diseñé una solución de control de acceso integrada con dispositivos Raspberry Pi, que valida membresías en tiempo real, automatiza la apertura de puertas y conecta hardware con software.
Trabajé en todo el ciclo de vida del producto, desde el análisis de negocio y el diseño de la base de datos hasta el frontend, las APIs backend, la infraestructura, el despliegue y la integración de hardware.
Actualmente estoy preparando la plataforma para ponerla en producción en gimnasios reales.')
where id = 'lymbo';

update public.projects
set description = description || jsonb_build_object('es', 'Una app de planificación de tareas: el usuario agrega una tarea y la IA genera pasos claros y concretos para completarla.')
where id = 'ia-todos';

update public.experiences
set
  role = role || jsonb_build_object('es', 'Cofundación y desarrollo de producto'),
  period = period || jsonb_build_object('es', 'Marzo 2026 - Actualidad'),
  description = description || jsonb_build_object('es', 'Cocreé junto a Mauricio Molina una plataforma de gestión para gimnasios, enfocada en convertir problemas operativos reales de estos negocios en flujos de trabajo de software.
La plataforma está pensada para gestionar socios, ventas, coordinación del personal y procesos administrativos desde un solo sistema.
Lymbo está casi lista para producción, y WALD Gym Zone y Fox Ladies Gym la van a adoptar como sus primeras implementaciones reales.')
where id = 'lymbo';

update public.experiences
set
  role = role || jsonb_build_object('es', 'Cofundación y gestión de operaciones'),
  period = period || jsonb_build_object('es', 'Mar 2025 - Actualidad'),
  description = description || jsonb_build_object('es', 'Definí e implementé los procesos operativos de contratación, capacitación del equipo, ventas, atención al cliente y gestión diaria del gimnasio.
Conecté los flujos del negocio con herramientas de software externas para mantener la operación ordenada y medible. Sigo participando activamente en las decisiones operativas y en la mejora continua de procesos.')
where id = 'fox-ladies-gym';

update public.experiences
set
  role = role || jsonb_build_object('es', 'Cofundación y liderazgo de operaciones'),
  period = period || jsonb_build_object('es', 'Feb 2024 - Actualidad'),
  description = description || jsonb_build_object('es', 'Construí la marca y el modelo operativo del gimnasio desde cero: contratación, onboarding, procesos de venta, flujos de atención al cliente y capacitación interna.
Lideré la implementación de un software de gestión de terceros y capacité al equipo para usarlo en la operación diaria. Hoy me enfoco en decisiones estratégicas, mejora de procesos y en usar sistemas para que el negocio funcione con menos fricción.')
where id = 'wald-gym-zone';

update public.experiences
set
  role = role || jsonb_build_object('es', 'Ingeniería de automatización QA'),
  description = description || jsonb_build_object('es', 'Trabajé en la transición de casos de prueba manuales a suites de tests automatizados, convirtiendo flujos de QA repetitivos en verificaciones automáticas confiables.
Desarrollé y mantuve tests end-to-end, mejoré la cobertura de regresión y colaboré con el equipo para que el testing fuera más rápido, claro y fácil de repetir.')
where id = 'vates';
