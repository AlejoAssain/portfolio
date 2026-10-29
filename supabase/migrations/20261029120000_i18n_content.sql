-- Translatable text moves from `text` to `jsonb` keyed by language:
--   {"en": "...", "es": "..."}
-- Existing text becomes the English (default) value. A missing or blank
-- translation falls back to English in the frontend, so English is required.

-- personal_info --------------------------------------------------------------

alter table public.personal_info
  alter column title   type jsonb using jsonb_build_object('en', title),
  alter column tagline type jsonb using jsonb_build_object('en', tagline),
  alter column bio     type jsonb using jsonb_build_object('en', bio),
  alter column location type jsonb using jsonb_build_object('en', location),
  alter column status  type jsonb using jsonb_build_object('en', status);

alter table public.personal_info
  add constraint personal_info_title_has_en    check (coalesce(title ->> 'en', '') <> ''),
  add constraint personal_info_tagline_has_en  check (coalesce(tagline ->> 'en', '') <> ''),
  add constraint personal_info_bio_has_en      check (coalesce(bio ->> 'en', '') <> ''),
  add constraint personal_info_location_has_en check (coalesce(location ->> 'en', '') <> ''),
  add constraint personal_info_status_has_en   check (coalesce(status ->> 'en', '') <> '');

-- projects -------------------------------------------------------------------

alter table public.projects
  alter column title       type jsonb using jsonb_build_object('en', title),
  alter column description type jsonb using jsonb_build_object('en', description);

alter table public.projects
  add constraint projects_title_has_en       check (coalesce(title ->> 'en', '') <> ''),
  add constraint projects_description_has_en check (coalesce(description ->> 'en', '') <> '');

-- experiences ----------------------------------------------------------------

alter table public.experiences
  alter column role        type jsonb using jsonb_build_object('en', role),
  alter column period      type jsonb using jsonb_build_object('en', period),
  alter column location    type jsonb using
    case when location is null then null else jsonb_build_object('en', location) end,
  alter column description type jsonb using jsonb_build_object('en', description);

alter table public.experiences
  add constraint experiences_role_has_en        check (coalesce(role ->> 'en', '') <> ''),
  add constraint experiences_period_has_en      check (coalesce(period ->> 'en', '') <> ''),
  -- Optional: null is fine, but if present it needs English.
  add constraint experiences_location_has_en    check (location is null or coalesce(location ->> 'en', '') <> ''),
  add constraint experiences_description_has_en check (coalesce(description ->> 'en', '') <> '');

-- save functions -------------------------------------------------------------
-- Parameter types change, which CREATE OR REPLACE can't do: drop and recreate.

drop function public.save_project_with_skills(
  text, text, integer, text, text, text, text, text, text, boolean, text[]
);

create function public.save_project_with_skills(
  p_existing_id text,
  p_id text,
  p_display_order integer,
  p_title jsonb,
  p_description jsonb,
  p_github text,
  p_demo text,
  p_landing text,
  p_image text,
  p_featured boolean,
  p_skill_ids text[]
) returns void
language plpgsql
set search_path to ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required'
      using errcode = '42501';
  end if;

  if p_existing_id is null then
    insert into public.projects (
      id, display_order, title, description,
      github, demo, landing, image, featured
    )
    values (
      p_id, p_display_order, p_title, p_description,
      p_github, p_demo, p_landing, p_image, p_featured
    );
  else
    if p_existing_id <> p_id then
      raise exception 'Project ID cannot be changed';
    end if;

    update public.projects
    set
      display_order = p_display_order,
      title = p_title,
      description = p_description,
      github = p_github,
      demo = p_demo,
      landing = p_landing,
      image = p_image,
      featured = p_featured
    where id = p_existing_id;

    if not found then
      raise exception 'Project not found';
    end if;
  end if;

  delete from public.project_skills
  where project_id = p_id;

  insert into public.project_skills (
    project_id,
    skill_id,
    display_order
  )
  select
    p_id,
    selected.skill_id,
    selected.position::integer
  from unnest(
    coalesce(p_skill_ids, array[]::text[])
  ) with ordinality as selected(skill_id, position);
end;
$$;

alter function public.save_project_with_skills(
  text, text, integer, jsonb, jsonb, text, text, text, text, boolean, text[]
) owner to postgres;

revoke all on function public.save_project_with_skills(
  text, text, integer, jsonb, jsonb, text, text, text, text, boolean, text[]
) from public;

grant all on function public.save_project_with_skills(
  text, text, integer, jsonb, jsonb, text, text, text, text, boolean, text[]
) to authenticated;

drop function public.save_experience_with_skills(
  text, text, integer, text, text, text, text, text, text, text[]
);

create function public.save_experience_with_skills(
  p_existing_id text,
  p_id text,
  p_display_order integer,
  p_role jsonb,
  p_company text,
  p_company_url text,
  p_period jsonb,
  p_location jsonb,
  p_description jsonb,
  p_skill_ids text[]
) returns void
language plpgsql
set search_path to ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required'
      using errcode = '42501';
  end if;

  if p_existing_id is null then
    insert into public.experiences (
      id, display_order, role, company,
      company_url, period, location, description
    )
    values (
      p_id, p_display_order, p_role, p_company,
      p_company_url, p_period, p_location, p_description
    );
  else
    if p_existing_id <> p_id then
      raise exception 'Experience ID cannot be changed';
    end if;

    update public.experiences
    set
      display_order = p_display_order,
      role = p_role,
      company = p_company,
      company_url = p_company_url,
      period = p_period,
      location = p_location,
      description = p_description
    where id = p_existing_id;

    if not found then
      raise exception 'Experience not found';
    end if;
  end if;

  delete from public.experience_skills
  where experience_id = p_id;

  insert into public.experience_skills (
    experience_id,
    skill_id,
    display_order
  )
  select
    p_id,
    selected.skill_id,
    selected.position::integer
  from unnest(
    coalesce(p_skill_ids, array[]::text[])
  ) with ordinality as selected(skill_id, position);
end;
$$;

alter function public.save_experience_with_skills(
  text, text, integer, jsonb, text, text, jsonb, jsonb, jsonb, text[]
) owner to postgres;

revoke all on function public.save_experience_with_skills(
  text, text, integer, jsonb, text, text, jsonb, jsonb, jsonb, text[]
) from public;

grant all on function public.save_experience_with_skills(
  text, text, integer, jsonb, text, text, jsonb, jsonb, jsonb, text[]
) to authenticated;
