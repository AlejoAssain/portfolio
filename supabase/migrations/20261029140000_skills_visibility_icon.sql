-- show_in_skills: hide a skill from the Skills section while keeping it
-- linked to projects and experiences.
-- icon: file name (without .svg) in public/skill-icons/, from simpleicons.org.

alter table public.skills
  add column show_in_skills boolean not null default true,
  add column icon text;

update public.skills as s
set icon = t.icon
from (values
  ('python', 'python'),
  ('django', 'django'),
  ('postgresql', 'postgresql'),
  ('react', 'react'),
  ('typescript', 'typescript'),
  ('tailwind-css', 'tailwindcss'),
  ('vite', 'vite'),
  ('docker', 'docker'),
  ('linux', 'linux'),
  ('bash', 'gnubash'),
  ('git', 'git'),
  ('tailscale', 'tailscale'),
  ('raspberry-pi', 'raspberrypi'),
  ('pytest', 'pytest'),
  ('selenium', 'selenium'),
  ('nestjs', 'nestjs')
) as t(id, icon)
where s.id = t.id;
